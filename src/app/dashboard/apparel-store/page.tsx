"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import {
  SocksStoreProduct,
  Order,
  OrderStatus,
  OrderItem,
} from "@/utils/types";
import { SocksProductCard } from "@/components/socks-product-card";
import { Loader } from "@/components/loader";
import { getCartItemCount } from "@/utils/cart-storage";
import { useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/contexts/auth-context";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  ShoppingCartIcon,
  Cog6ToothIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { ConfirmModal } from "@/components/confirm-modal";

export default function SocksStorePage() {
  const [products, setProducts] = useState<SocksStoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { isAdmin } = useAdmin();
  const { user } = useAuth();
  const [storeOpen, setStoreOpen] = useState<boolean | null>(null);
  const [closingDate, setClosingDate] = useState<string | null>(null);
  const [orders, setOrders] = useState<(Order & { items: OrderItem[] })[]>([]);
  const [allOrdersForSummary, setAllOrdersForSummary] = useState<
    (Order & { items: OrderItem[] })[]
  >([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    checkStoreStatus();
    updateCartCount();

    // Listen for storage changes to update cart count
    const handleStorageChange = () => {
      updateCartCount();
    };
    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events (for same-tab updates)
    window.addEventListener("cartUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, [isAdmin]);

  useEffect(() => {
    if (user) {
      fetchOrders();
      if (isAdmin) {
        fetchAllOrdersForSummary();
      }

      const handleOrderUpdate = () => {
        fetchOrders();
        if (isAdmin) {
          fetchAllOrdersForSummary();
        }
      };

      window.addEventListener("orderSubmitted", handleOrderUpdate);

      return () => {
        window.removeEventListener("orderSubmitted", handleOrderUpdate);
      };
    }
  }, [isAdmin, user]);

  useEffect(() => {
    if (!closingDate || !storeOpen) {
      setTimeRemaining(null);
      return;
    }

    const interval = setInterval(() => {
      updateTimeRemaining();
    }, 1000);
    updateTimeRemaining();

    return () => clearInterval(interval);
  }, [closingDate, storeOpen]);

  const checkStoreStatus = async () => {
    try {
      console.log("Checking store status for socks_store...");
      const { data, error } = await supabase
        .from("store_management")
        .select("is_open, closing_date")
        .eq("store_name", "socks_store")
        .single();

      console.log("Store status result:", { data, error });

      if (error) {
        console.error("Error checking store status:", error);
        setStoreOpen(true);
        fetchProducts();
        return;
      }

      if (data) {
        console.log("Store data found:", data);
        let isOpen = data.is_open === true;

        if (isOpen && data.closing_date) {
          const nextClosingDate = new Date(data.closing_date);
          const now = new Date();

          if (nextClosingDate <= now) {
            isOpen = false;
            setClosingDate(null);
          } else {
            setClosingDate(data.closing_date);
          }
        } else {
          setClosingDate(null);
        }

        setStoreOpen(isOpen);

        if (isOpen || isAdmin) {
          fetchProducts();
        }
      } else {
        console.log("No store data found");
        setStoreOpen(true);
        fetchProducts();
      }
    } catch (err) {
      console.error("Error in checkStoreStatus:", err);
      setStoreOpen(true);
      fetchProducts();
    }
  };

  const updateCartCount = () => {
    const count = getCartItemCount();
    setCartItemCount(count);
  };

  const getApparelVariantIds = async () => {
    const { data, error } = await supabase
      .from("socks_store")
      .select("variant_id")
      .not("variant_id", "is", null);

    if (error) {
      throw error;
    }

    return new Set(
      (data || [])
        .map((item) => Number(item.variant_id))
        .filter((variantId) => !Number.isNaN(variantId))
    );
  };

  const updateTimeRemaining = () => {
    if (!closingDate) return;

    const now = new Date().getTime();
    const closing = new Date(closingDate).getTime();
    const diff = closing - now;

    if (diff <= 0) {
      setTimeRemaining(null);
      setClosingDate(null);
      setStoreOpen(false);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeRemaining({ days, hours, minutes, seconds });
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products with all required fields
      const { data, error: queryError } = await supabase
        .from("socks_store")
        .select(
          "name, price, currency, available_bool, img_reference, product_url, product_id, variant_id, sku, product_item_info"
        )
        .order("available_bool", { ascending: false, nullsFirst: false })
        .order("name", { ascending: true });

      console.log("Query result:", { data, error: queryError });

      if (queryError) {
        // Log detailed error for debugging
        console.error("Supabase query error:", {
          message: queryError.message,
          code: queryError.code,
          details: queryError.details,
          hint: queryError.hint,
        });

        // If the error is about the table name, try an alternative approach
        if (
          queryError.message?.includes("relation") ||
          queryError.code === "PGRST204"
        ) {
          setError(
            `Table 'socks_store' not found or not accessible. ` +
              `Please ensure the table exists and you have the correct permissions.`
          );
        } else {
          setError(`Failed to load products: ${queryError.message}`);
        }
        return;
      }

      setProducts((data || []) as SocksStoreProduct[]);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOrdersForSummary = async () => {
    if (!isAdmin) return;

    try {
      setSummaryLoading(true);
      const apparelVariantIds = await getApparelVariantIds();

      // Fetch all orders for revenue calculation
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("id, total_price")
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Error fetching orders for summary:", ordersError);
        return;
      }

      if (!ordersData || ordersData.length === 0) {
        setAllOrdersForSummary([]);
        return;
      }

      // Fetch order items for all orders
      const orderIds = ordersData.map((order) => order.id);
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds)
        .order("id", { ascending: true });

      if (itemsError) {
        console.error("Error fetching order items for summary:", itemsError);
        // Continue without items if there's an error
      }

      // Group items by order_id
      const itemsMap = new Map<number, OrderItem[]>();
      (itemsData || []).forEach((item) => {
        if (!itemsMap.has(item.order_id)) {
          itemsMap.set(item.order_id, []);
        }
        itemsMap.get(item.order_id)!.push(item as OrderItem);
      });

      const apparelOrders = ordersData
        .map((order) => ({
          ...order,
          items: itemsMap.get(order.id) || [],
        }))
        .filter(
          (order) =>
            order.items.length > 0 &&
            order.items.every(
              (item) =>
                item.variant_id !== null &&
                apparelVariantIds.has(Number(item.variant_id))
            )
        );

      setAllOrdersForSummary(
        apparelOrders as (Order & { items: OrderItem[] })[]
      );
    } catch (err) {
      console.error("Error fetching all orders for summary:", err);
    } finally {
      setSummaryLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setOrdersLoading(true);
      const apparelVariantIds = await getApparelVariantIds();
      let ordersData;
      let ordersError;

      if (isAdmin) {
        // Admins see all orders
        const result = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10); // Show last 10 orders
        ordersData = result.data;
        ordersError = result.error;

        // Fetch total revenue from all orders for admins
        const { data: allOrdersData, error: totalError } = await supabase
          .from("orders")
          .select("total_price");
      } else {
        // Users see only their own orders
        const result = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        ordersData = result.data;
        ordersError = result.error;
      }

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        return;
      }

      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        return;
      }

      // Fetch order items for all orders
      const orderIds = ordersData.map((order) => order.id);
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds)
        .order("id", { ascending: true });

      if (itemsError) {
        console.error("Error fetching order items:", itemsError);
        // Continue without items if there's an error
      }

      // Group items by order_id
      const itemsMap = new Map<number, OrderItem[]>();
      (itemsData || []).forEach((item) => {
        if (!itemsMap.has(item.order_id)) {
          itemsMap.set(item.order_id, []);
        }
        itemsMap.get(item.order_id)!.push(item as OrderItem);
      });

      const filteredOrdersData = ordersData.filter((order) => {
        const orderItems = itemsMap.get(order.id) || [];

        return (
          orderItems.length > 0 &&
          orderItems.every(
            (item) =>
              item.variant_id !== null &&
              apparelVariantIds.has(Number(item.variant_id))
          )
        );
      });

      if (isAdmin) {
        const total = filteredOrdersData.reduce(
          (sum, order) => sum + Number(order.total_price),
          0
        );
        setTotalRevenue(total);
      }

      // Get unique user IDs (only needed for admin view)
      if (isAdmin) {
        const userIds = Array.from(
          new Set(filteredOrdersData.map((o) => o.user_id))
        );

        // Fetch rider data for all users
        const { data: ridersData, error: ridersError } = await supabase
          .from("riders")
          .select("uuid, email, firstName, lastName")
          .in("uuid", userIds);

        if (ridersError) {
          console.error("Error fetching riders:", ridersError);
          // Continue without rider data
        }

        // Create a map of user_id to rider data
        const ridersMap = new Map(
          (ridersData || []).map((rider) => [rider.uuid, rider])
        );

        // Combine orders with rider data and items
        const ordersWithUser = filteredOrdersData.map((order) => {
          const rider = ridersMap.get(order.user_id);
          return {
            ...order,
            user_email: rider?.email || null,
            user_first_name: rider?.firstName || null,
            user_last_name: rider?.lastName || null,
            items: itemsMap.get(order.id) || [],
          };
        });

        setOrders(ordersWithUser as (Order & { items: OrderItem[] })[]);
      } else {
        // For regular users, combine orders with items
        const ordersWithItems = filteredOrdersData.map((order) => ({
          ...order,
          items: itemsMap.get(order.id) || [],
        }));

        setOrders(ordersWithItems as (Order & { items: OrderItem[] })[]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleStatusUpdate = async (
    orderId: number,
    newStatus: OrderStatus
  ) => {
    if (!isAdmin) {
      toast.error("You don't have permission to update order status");
      return;
    }

    setUpdatingStatus(orderId);
    try {
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (updateError) {
        console.error("Error updating order status:", updateError);
        toast.error(`Failed to update order status: ${updateError.message}`);
        return;
      }

      toast.success("Order status updated successfully");
      // Refresh orders
      fetchOrders();
    } catch (err: any) {
      console.error("Error updating order status:", err);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteClick = (order: Order) => {
    if (!isAdmin) {
      toast.error("You don't have permission to delete orders");
      return;
    }
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete || !isAdmin) return;

    setDeleting(true);
    try {
      // Delete order (order_items will be deleted automatically via CASCADE)
      const { error: deleteError } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderToDelete.id);

      if (deleteError) {
        console.error("Error deleting order:", deleteError);
        toast.error(
          deleteError.message || "Failed to delete order. Please try again."
        );
        return;
      }

      // Remove from local state
      setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id));

      // Update total revenue
      if (totalRevenue !== null) {
        setTotalRevenue(totalRevenue - Number(orderToDelete.total_price));
      }

      // Refresh summary if admin
      if (isAdmin) {
        fetchAllOrdersForSummary();
      }

      toast.success("Order deleted successfully");
      setShowDeleteModal(false);
      setOrderToDelete(null);
    } catch (err: any) {
      console.error("Error deleting order:", err);
      toast.error("Failed to delete order. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  if (loading || storeOpen === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (storeOpen === false && !isAdmin) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="mb-6">
            <ShoppingCartIcon className="mx-auto h-16 w-16 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Apparel Store is Currently Closed
          </h1>
          <p className="text-gray-600 mb-6">
            The apparel store is not available at the moment. Please check back
            later.
          </p>
          {closingDate && timeRemaining && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 max-w-md mx-auto">
              <h2 className="text-lg font-semibold text-purple-800 mb-2">
                Store Reopens In:
              </h2>
              <div className="text-2xl font-bold text-purple-700">
                {timeRemaining.days}d {timeRemaining.hours}h{" "}
                {timeRemaining.minutes}m {timeRemaining.seconds}s
              </div>
            </div>
          )}
          <div className="mt-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-purple-600 hover:text-purple-700"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Apparel Store</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link
                href="/dashboard/apparel-store/admin"
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Cog6ToothIcon className="h-5 w-5" />
                <span>Admin</span>
              </Link>
            )}
            <Link
              href="/dashboard/apparel-store/checkout"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors relative"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
        <p className="text-gray-600">
          Browse and purchase high-quality socks for your cycling adventures.
        </p>
        {closingDate && timeRemaining && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
            <p className="text-yellow-800 font-medium">
              Store closes in: {timeRemaining.days}d {timeRemaining.hours}h{" "}
              {timeRemaining.minutes}m {timeRemaining.seconds}s
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Available Products
          </h2>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Refresh Products
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No products available at the moment.
            </p>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <SocksProductCard key={product.name} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Admin Orders Section */}
      {isAdmin && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Recent Orders
          </h2>
          {ordersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No orders found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.user_email || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          €{Number(order.total_price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusUpdate(
                                order.id,
                                e.target.value as OrderStatus
                              )
                            }
                            disabled={updatingStatus === order.id}
                            className="text-sm border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteClick(order)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Order"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Total Orders
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                {allOrdersForSummary.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Total Revenue
              </h3>
              <p className="text-3xl font-bold text-green-600">
                €{totalRevenue?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Pending Orders
              </h3>
              <p className="text-3xl font-bold text-orange-600">
                {orders.filter((o) => o.status === "pending").length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Orders Section */}
      {!isAdmin && orders.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        €{Number(order.total_price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "confirmed"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "processing"
                                  ? "bg-purple-100 text-purple-800"
                                  : order.status === "shipped"
                                    ? "bg-indigo-100 text-indigo-800"
                                    : order.status === "delivered"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Order"
        message={`Are you sure you want to delete order #${orderToDelete?.id}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
        loading={deleting}
      />
    </div>
  );
}
