"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { FourEnduranceStoreProduct, Order, OrderStatus } from "@/utils/types";
import { FourEnduranceProductCard } from "@/components/four-endurance-product-card";
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

export default function FourEnduranceStorePage() {
  const [products, setProducts] = useState<FourEnduranceStoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { isAdmin } = useAdmin();
  const { user } = useAuth();
  const [storeOpen, setStoreOpen] = useState<boolean | null>(null);
  const [closingDate, setClosingDate] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
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

      // Listen for order updates (e.g., when a new order is submitted)
      const handleOrderUpdate = () => {
        fetchOrders();
      };
      window.addEventListener("orderSubmitted", handleOrderUpdate);

      return () => {
        window.removeEventListener("orderSubmitted", handleOrderUpdate);
      };
    }
  }, [isAdmin, user]);

  // Countdown timer effect
  useEffect(() => {
    if (!closingDate || !storeOpen) {
      setTimeRemaining(null);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const closing = new Date(closingDate);
      const diff = closing.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining(null);
        setClosingDate(null);
        // Store has closed, refresh status
        setStoreOpen(false);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [closingDate, storeOpen]);

  const checkStoreStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("store_management")
        .select("is_open, closing_date")
        .eq("store_name", "endurance_store")
        .single();

      if (error) {
        console.error("Error checking store status:", error);
        // If table doesn't exist yet, assume store is open (backward compatibility)
        setStoreOpen(true);
        fetchProducts();
        return;
      }

      // Check if store is closed by date
      let isOpen = data?.is_open === true;
      if (isOpen && data?.closing_date) {
        const closingDate = new Date(data.closing_date);
        const now = new Date();
        if (closingDate <= now) {
          isOpen = false;
        } else {
          // Store is open and has a closing date - set it for countdown
          setClosingDate(data.closing_date);
        }
      } else {
        setClosingDate(null);
      }

      setStoreOpen(isOpen);

      // Always fetch products if store is open OR if user is admin
      if (isOpen || isAdmin) {
        fetchProducts();
      }
    } catch (err) {
      console.error("Error checking store status:", err);
      // On error, assume store is open (backward compatibility)
      setStoreOpen(true);
      fetchProducts();
    }
  };

  const updateCartCount = () => {
    setCartItemCount(getCartItemCount());
  };

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setOrdersLoading(true);
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

        if (!totalError && allOrdersData) {
          const total = allOrdersData.reduce(
            (sum, order) => sum + Number(order.total_price),
            0
          );
          setTotalRevenue(total);
        }
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

      // Get unique user IDs (only needed for admin view)
      if (isAdmin) {
        const userIds = Array.from(new Set(ordersData.map((o) => o.user_id)));

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

        // Combine orders with rider data
        const ordersWithUser = ordersData.map((order) => {
          const rider = ridersMap.get(order.user_id);
          return {
            ...order,
            user_email: rider?.email || null,
            user_first_name: rider?.firstName || null,
            user_last_name: rider?.lastName || null,
          };
        });

        setOrders(ordersWithUser as Order[]);
      } else {
        // For regular users, just set the orders directly
        setOrders(ordersData as Order[]);
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products with all required fields
      const { data, error: queryError } = await supabase
        .from("endurance_store")
        .select(
          "name, price, currency, available_bool, img_reference, product_url, product_id, variant_id, sku, product_item_info"
        )
        .order("available_bool", { ascending: false, nullsFirst: false })
        .order("name", { ascending: true });

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
          console.warn(
            "Table name issue detected. Trying alternative query method..."
          );
          throw new Error(
            `Table 'endurance_store' not found or not accessible. ` +
              `Error: ${queryError.message}. ` +
              `Please verify the table name and RLS policies.`
          );
        }

        throw queryError;
      }

      const fetchedProducts = (data || []) as FourEnduranceStoreProduct[];
      console.log(`Total products fetched: ${fetchedProducts.length}`);

      // Always show all products including unavailable ones
      setProducts(fetchedProducts);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(
        err.message ||
          err.details ||
          "Failed to load products. Please check the console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  // Group products by product_id for variant dropdown
  // Only group if product_id exists, otherwise treat each variant as separate product
  const groupedProducts = products.reduce(
    (acc, product) => {
      // Only group by product_id if it exists and is not null
      const productId = product.product_id?.toString();

      if (productId) {
        // Group by product_id
        if (!acc[productId]) {
          acc[productId] = [];
        }
        acc[productId].push(product);
      } else {
        // No product_id - treat as individual product (use variant_id or name as key)
        const individualKey = product.variant_id?.toString() || product.name;
        if (!acc[individualKey]) {
          acc[individualKey] = [];
        }
        acc[individualKey].push(product);
      }
      return acc;
    },
    {} as Record<string, FourEnduranceStoreProduct[]>
  );

  // Create display products - one per product_id group, with all variants
  const displayProducts = Object.values(groupedProducts).map((variants) => {
    // Use the first available variant as default, or first variant if none available
    const defaultVariant =
      variants.find((v) => v.available_bool === true) || variants[0];
    return {
      ...defaultVariant,
      variants: variants.sort((a, b) => {
        // Sort variants: available first, then by name
        if (a.available_bool === b.available_bool) {
          return (a.name || "").localeCompare(b.name || "");
        }
        return a.available_bool === true ? -1 : 1;
      }),
    };
  });

  if (loading || storeOpen === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  // Show closed message only if store is closed AND user is not admin
  if (storeOpen === false && !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            4Endurance Store
          </h1>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-2">
              Store is currently closed
            </p>
            <p className="text-gray-500">
              Please check back later or contact an administrator
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        {/* Admin notice when store is closed */}
        {isAdmin && storeOpen === false && (
          <div className="mb-4 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-xs sm:text-sm font-medium">
              ⚠️ Admin View: This store is currently closed to regular users.
              You can still access and manage products.
            </p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            4Endurance Store
          </h1>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isAdmin && (
              <Link
                href="/dashboard/4endurance-store/admin"
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
              >
                <Cog6ToothIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}
            <Link
              href="/dashboard/4endurance-store/checkout"
              className="relative flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
            >
              <ShoppingCartIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Checkout</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center text-[10px] sm:text-xs">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Browse nutrition from our partner 4Endurance
        </p>
      </div>

      {/* Countdown Timer */}
      {storeOpen && closingDate && timeRemaining && (
        <div className="mb-6 sm:mb-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow-lg p-6 sm:p-8 text-white">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Store Closing Soon!
            </h2>
            <p className="text-sm sm:text-base text-purple-100 mb-4 sm:mb-6">
              Place your order before the store closes
            </p>
            <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                <div className="text-2xl sm:text-4xl font-bold">
                  {timeRemaining.days}
                </div>
                <div className="text-xs sm:text-sm text-purple-100 mt-1">
                  Days
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                <div className="text-2xl sm:text-4xl font-bold">
                  {timeRemaining.hours.toString().padStart(2, "0")}
                </div>
                <div className="text-xs sm:text-sm text-purple-100 mt-1">
                  Hours
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                <div className="text-2xl sm:text-4xl font-bold">
                  {timeRemaining.minutes.toString().padStart(2, "0")}
                </div>
                <div className="text-xs sm:text-sm text-purple-100 mt-1">
                  Minutes
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                <div className="text-2xl sm:text-4xl font-bold">
                  {timeRemaining.seconds.toString().padStart(2, "0")}
                </div>
                <div className="text-xs sm:text-sm text-purple-100 mt-1">
                  Seconds
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table - Admin sees all orders, Users see their own */}
      {user && (
        <div className="mb-6 sm:mb-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {isAdmin ? "Recent Orders" : "My Orders"}
              </h2>
              {isAdmin && totalRevenue !== null && (
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Total Revenue (All Orders):{" "}
                  <span className="font-bold text-purple-700 text-base sm:text-lg">
                    {totalRevenue.toFixed(2)} EUR
                  </span>
                </p>
              )}
            </div>
            <button
              onClick={fetchOrders}
              className="text-xs sm:text-sm text-purple-600 hover:text-purple-700 font-medium self-start sm:self-auto"
            >
              Refresh
            </button>
          </div>
          {ordersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader />
            </div>
          ) : orders.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    {isAdmin && (
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Customer
                      </th>
                    )}
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Date
                    </th>
                    {isAdmin && (
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => {
                    const customerName =
                      order.user_first_name || order.user_last_name
                        ? `${order.user_first_name || ""} ${order.user_last_name || ""}`.trim()
                        : order.user_email || "Unknown";
                    const statusColors: Record<string, string> = {
                      pending: "bg-yellow-100 text-yellow-800",
                      confirmed: "bg-blue-100 text-blue-800",
                      processing: "bg-purple-100 text-purple-800",
                      shipped: "bg-indigo-100 text-indigo-800",
                      delivered: "bg-green-100 text-green-800",
                      cancelled: "bg-red-100 text-red-800",
                    };
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                          #{order.id}
                        </td>
                        {isAdmin && (
                          <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
                            {customerName}
                            {order.user_email && (
                              <div className="text-xs text-gray-500">
                                {order.user_email}
                              </div>
                            )}
                          </td>
                        )}
                        <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-semibold text-gray-900">
                          {order.total_price.toFixed(2)} {order.currency}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                          {isAdmin ? (
                            updatingStatus === order.id ? (
                              <span className="text-sm text-gray-500">
                                Updating...
                              </span>
                            ) : (
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  handleStatusUpdate(
                                    order.id,
                                    e.target.value as OrderStatus
                                  )
                                }
                                className="px-2 py-1 text-xs font-medium rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer bg-white"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            )
                          ) : (
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                statusColors[order.status] ||
                                "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          )}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-600 hidden md:table-cell">
                          {new Date(order.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </td>
                        {isAdmin && (
                          <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm">
                            <button
                              onClick={() => handleDeleteClick(order)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 sm:p-2 rounded-lg transition-colors"
                              title="Delete order"
                            >
                              <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Order"
        message={
          orderToDelete
            ? `Are you sure you want to delete order #${orderToDelete.id}? This action cannot be undone and all associated order items will be permanently removed.`
            : "Are you sure you want to delete this order? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
        loading={deleting}
      />

      {/* Products Grid */}
      {displayProducts.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-sm sm:text-base text-gray-600">
            No products available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {displayProducts.map((product) => (
            <FourEnduranceProductCard
              key={product.product_id || product.variant_id || product.name}
              product={product}
              variants={product.variants || [product]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
