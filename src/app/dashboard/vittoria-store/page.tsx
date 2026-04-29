"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ShoppingBagIcon,
  ShoppingCartIcon,
  TrashIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { Loader } from "@/components/loader";
import { ConfirmModal } from "@/components/confirm-modal";
import { useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/utils/supabase";
import {
  VittoriaStoreProduct,
  Order,
  OrderItem,
  OrderStatus,
  VittoriaStoreOrderRow,
} from "@/utils/types";
import { VittoriaProductCard } from "@/components/vittoria-product-card";
import { getCartItemCount } from "@/utils/cart-storage";

type VittoriaOrderRow = VittoriaStoreOrderRow & {
  orders?: {
    id: number;
    user_id: string;
    total_price: number;
    currency: string;
    status: OrderStatus;
    created_at: string;
    updated_at: string;
  } | null;
  order_items?: {
    id: number;
    order_id: number;
    variant_id: number | null;
    product_name: string;
    quantity: number;
    price_at_time: number;
    currency: string;
    created_at: string;
    size?: string;
    gender?: string;
  } | null;
};

type VittoriaOrder = Order & { items: OrderItem[] };
type DisplayVittoriaProduct = VittoriaStoreProduct & {
  variants: VittoriaStoreProduct[];
};

function buildOrderItem(row: VittoriaOrderRow): OrderItem | null {
  const rowOrderId = row.order_id ?? row.orders?.id ?? null;
  const rowItemId = row.order_item_id ?? row.order_items?.id ?? null;

  if (rowOrderId === null || rowItemId === null) {
    return null;
  }

  return {
    id: rowItemId,
    order_id: rowOrderId,
    variant_id: row.order_items?.variant_id ?? null,
    product_name: row.name || row.order_items?.product_name || "Unnamed item",
    quantity: row.quantity ?? row.order_items?.quantity ?? 0,
    price_at_time: Number(row.price ?? row.order_items?.price_at_time ?? 0),
    currency: row.order_items?.currency || row.orders?.currency || "EUR",
    created_at: row.created_at,
    size: row.order_items?.size,
    gender: row.order_items?.gender,
  };
}

function buildOrders(rows: VittoriaOrderRow[]): VittoriaOrder[] {
  const ordersMap = new Map<number, VittoriaOrder>();

  rows.forEach((row) => {
    const orderData = row.orders;
    const orderId = row.order_id ?? orderData?.id;

    if (orderId === null || orderId === undefined || !orderData) {
      return;
    }

    if (!ordersMap.has(orderId)) {
      ordersMap.set(orderId, {
        id: orderId,
        user_id: orderData.user_id,
        total_price: Number(orderData.total_price ?? 0),
        currency: orderData.currency || "EUR",
        status: orderData.status,
        created_at: orderData.created_at,
        updated_at: orderData.updated_at,
        items: [],
      });
    }

    const item = buildOrderItem(row);
    if (item) {
      ordersMap.get(orderId)!.items.push(item);
    }
  });

  return Array.from(ordersMap.values()).sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export default function VittoriaStorePage() {
  const { isAdmin } = useAdmin();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [docsLoading, setDocsLoading] = useState(true);
  const [storeOpen, setStoreOpen] = useState<boolean | null>(null);
  const [closingDate, setClosingDate] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [hasSubmittedDocs, setHasSubmittedDocs] = useState<boolean | null>(
    null
  );
  const [orders, setOrders] = useState<VittoriaOrder[]>([]);
  const [products, setProducts] = useState<VittoriaStoreProduct[]>([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [allOrdersForSummary, setAllOrdersForSummary] = useState<
    VittoriaOrder[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [productError, setProductError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalRevenue = useMemo(
    () =>
      allOrdersForSummary.reduce(
        (sum, order) => sum + Number(order.total_price || 0),
        0
      ),
    [allOrdersForSummary]
  );

  useEffect(() => {
    checkStoreStatus();
    updateCartCount();

    const handleStorageChange = () => {
      updateCartCount();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, [isAdmin]);

  useEffect(() => {
    if (!user) {
      setHasSubmittedDocs(false);
      setDocsLoading(false);
      return;
    }

    const checkDocs = async () => {
      try {
        const { data, error: docsError } = await supabase
          .schema("private")
          .from("riders")
          .select("registrationFormUrl")
          .eq("uuid", user.id)
          .single();

        if (docsError) {
          console.error("Error checking documents:", docsError);
          setHasSubmittedDocs(false);
        } else {
          setHasSubmittedDocs(data?.registrationFormUrl != null);
        }
      } catch (err) {
        console.error("Unexpected error checking documents:", err);
        setHasSubmittedDocs(false);
      } finally {
        setDocsLoading(false);
      }
    };

    checkDocs();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchOrders();
    fetchProducts();
    if (isAdmin) {
      fetchAllOrdersForSummary();
    }

    const handleOrderUpdate = () => {
      fetchOrders();
      fetchProducts();
      if (isAdmin) {
        fetchAllOrdersForSummary();
      }
    };

    window.addEventListener("orderSubmitted", handleOrderUpdate);

    return () => {
      window.removeEventListener("orderSubmitted", handleOrderUpdate);
    };
  }, [isAdmin, user]);

  useEffect(() => {
    if (!closingDate || !storeOpen) {
      setTimeRemaining(null);
      return;
    }

    const updateCountdown = () => {
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
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [closingDate, storeOpen]);

  const checkStoreStatus = async () => {
    try {
      const { data, error: storeError } = await supabase
        .from("store_management")
        .select("is_open, closing_date")
        .eq("store_name", "vittoria_store")
        .single();

      if (storeError) {
        console.error("Error checking store status:", storeError);
        setStoreOpen(true);
        return;
      }

      let isOpen = data?.is_open === true;
      if (isOpen && data?.closing_date) {
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
    } catch (err) {
      console.error("Error in checkStoreStatus:", err);
      setStoreOpen(true);
    }
  };

  const updateCartCount = () => {
    setCartItemCount(getCartItemCount());
  };

  const fetchVittoriaRows = async (filterUserId?: string) => {
    let query = supabase
      .from("vittoria_store")
      .select(
        "id, store_id, order_id, order_item_id, created_at, updated_at, price, quantity, name, orders!inner(id, user_id, total_price, currency, status, created_at, updated_at), order_items(id, order_id, variant_id, product_name, quantity, price_at_time, currency, created_at, size, gender)"
      )
      .order("created_at", { ascending: false });

    if (filterUserId) {
      query = query.eq("orders.user_id", filterUserId);
    }

    const { data, error: queryError } = await query;

    if (queryError) {
      throw queryError;
    }

    return (data || []) as unknown as VittoriaOrderRow[];
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      setProductError(null);

      const { data, error: queryError } = await supabase
        .from("vittoria_store")
        .select(
          "id, store_id, order_id, order_item_id, created_at, updated_at, price, quantity, name, currency, available_bool, img_reference, product_url, product_id, variant_id, sku, product_item_info"
        )
        .is("order_id", null)
        .is("order_item_id", null)
        .order("available_bool", { ascending: false, nullsFirst: false })
        .order("name", { ascending: true });

      if (queryError) {
        throw queryError;
      }

      setProducts((data || []) as VittoriaStoreProduct[]);
    } catch (err: any) {
      console.error("Error fetching Vittoria products:", err);
      setProductError(err.message || "Failed to load Vittoria products");
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setOrdersLoading(true);
      setError(null);
      const rows = await fetchVittoriaRows(isAdmin ? undefined : user.id);
      setOrders(buildOrders(rows));
    } catch (err: any) {
      console.error("Error fetching Vittoria orders:", err);
      setError(err.message || "Failed to load Vittoria store orders");
      setOrders([]);
    } finally {
      setOrdersLoading(false);
      setLoading(false);
    }
  };

  const fetchAllOrdersForSummary = async () => {
    if (!isAdmin) return;

    try {
      setSummaryLoading(true);
      const rows = await fetchVittoriaRows();
      setAllOrdersForSummary(buildOrders(rows));
    } catch (err) {
      console.error("Error fetching all Vittoria orders:", err);
    } finally {
      setSummaryLoading(false);
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
        toast.error(updateError.message || "Failed to update order status");
        return;
      }

      toast.success("Order status updated successfully");
      fetchOrders();
      fetchAllOrdersForSummary();
    } catch (err) {
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
      const { error: deleteError } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderToDelete.id);

      if (deleteError) {
        toast.error(deleteError.message || "Failed to delete order");
        return;
      }

      setOrders((prev) =>
        prev.filter((order) => order.id !== orderToDelete.id)
      );
      setAllOrdersForSummary((prev) =>
        prev.filter((order) => order.id !== orderToDelete.id)
      );
      toast.success("Order deleted successfully");
      setShowDeleteModal(false);
      setOrderToDelete(null);
    } catch (err) {
      console.error("Error deleting order:", err);
      toast.error("Failed to delete order");
    } finally {
      setDeleting(false);
    }
  };

  const productSummary = useMemo(() => {
    const summaryMap = new Map<
      string,
      { name: string; quantity: number; revenue: number; orderCount: number }
    >();

    allOrdersForSummary.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.product_name || `item-${item.id}`;
        const existing = summaryMap.get(key);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += Number(item.price_at_time) * item.quantity;
          existing.orderCount += 1;
        } else {
          summaryMap.set(key, {
            name: item.product_name,
            quantity: item.quantity,
            revenue: Number(item.price_at_time) * item.quantity,
            orderCount: 1,
          });
        }
      });
    });

    return Array.from(summaryMap.values()).sort(
      (a, b) => b.revenue - a.revenue
    );
  }, [allOrdersForSummary]);

  const displayProducts = useMemo<DisplayVittoriaProduct[]>(() => {
    const groupedProducts = products.reduce(
      (accumulator, product) => {
        const productId = product.product_id?.toString();
        const key =
          productId ||
          product.variant_id?.toString() ||
          product.name ||
          product.id.toString();

        if (!accumulator[key]) {
          accumulator[key] = [];
        }

        accumulator[key].push(product);
        return accumulator;
      },
      {} as Record<string, VittoriaStoreProduct[]>
    );

    return Object.values(groupedProducts).map((variants) => {
      const defaultVariant =
        variants.find((variant) => variant.available_bool === true) ||
        variants[0];

      return {
        ...defaultVariant,
        variants: variants.sort((left, right) => {
          if (left.available_bool === right.available_bool) {
            return (left.name || "").localeCompare(right.name || "");
          }
          return left.available_bool === true ? -1 : 1;
        }),
      };
    });
  }, [products]);

  if (loading || storeOpen === null || docsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (!isAdmin && !hasSubmittedDocs) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Vittoria Store
          </h1>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <p className="text-xl text-gray-700 mb-3 font-semibold">
              Registration Documents Required
            </p>
            <p className="text-gray-500 mb-6">
              You need to submit your registration documents before you can
              access the store. Please upload your signed Mitgliedsantrag in
              your profile.
            </p>
            <a
              href="/dashboard/profile"
              className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go to Profile
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (storeOpen === false && !isAdmin) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="mb-6">
            <ShoppingBagIcon className="mx-auto h-16 w-16 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Vittoria Store is Currently Closed
          </h1>
          <p className="text-gray-600 mb-6">
            The store is not available at the moment. Please check back later.
          </p>
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
      <div className="mb-8">
        {isAdmin && storeOpen === false && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm font-medium">
              Admin view: this store is currently closed to regular users.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-purple-600 hover:text-purple-700"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Vittoria Store</h1>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                href="/dashboard/vittoria-store/admin"
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Cog6ToothIcon className="h-5 w-5" />
                <span>Admin</span>
              </Link>
            )}
            <Link
              href="/dashboard/vittoria-store/checkout"
              className="relative flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span>Checkout</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <p className="text-gray-600">
          Browse Vittoria products and review your store orders.
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
        </div>
      )}

      <div className="mb-12 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Products</h2>
            <p className="text-sm text-gray-500">
              Browse Vittoria catalog items available in the store.
            </p>
          </div>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Refresh Products
          </button>
        </div>

        {productsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader />
          </div>
        ) : productError ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{productError}</p>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No products available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <VittoriaProductCard
                key={product.product_id || product.variant_id || product.id}
                product={product}
                variants={product.variants}
              />
            ))}
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="mb-12 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Product Summary
              </h2>
              <p className="text-sm text-gray-500">
                Aggregated from rows stored in vittoria_store.
              </p>
            </div>
            <button
              onClick={fetchAllOrdersForSummary}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Refresh Summary
            </button>
          </div>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Orders</p>
              <p className="text-2xl font-bold text-gray-800">
                {allOrdersForSummary.length}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                EUR {totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Products</p>
              <p className="text-2xl font-bold text-gray-800">
                {productSummary.length}
              </p>
            </div>
          </div>

          {summaryLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader />
            </div>
          ) : productSummary.length === 0 ? (
            <p className="text-gray-600">No Vittoria orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="py-3 pr-4">Product</th>
                    <th className="py-3 pr-4">Quantity</th>
                    <th className="py-3 pr-4">Orders</th>
                    <th className="py-3">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {productSummary.map((item) => (
                    <tr key={item.name} className="border-b border-gray-100">
                      <td className="py-3 pr-4 font-medium text-gray-800">
                        {item.name}
                      </td>
                      <td className="py-3 pr-4 text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="py-3 pr-4 text-gray-600">
                        {item.orderCount}
                      </td>
                      <td className="py-3 text-gray-800 font-semibold">
                        EUR {item.revenue.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isAdmin ? "Recent Orders" : "My Orders"}
            </h2>
            <p className="text-sm text-gray-500">
              Orders linked through the Vittoria store table.
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Refresh Orders
          </button>
        </div>

        {ordersLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">No Vittoria store orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      Order #{order.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                    {isAdmin && order.user_email && (
                      <p className="text-sm text-gray-600 mt-1">
                        {order.user_email}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {isAdmin ? (
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusUpdate(
                            order.id,
                            e.target.value as OrderStatus
                          )
                        }
                        disabled={updatingStatus === order.id}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                        {order.status}
                      </span>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteClick(order)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-left text-gray-500">
                        <th className="py-3 pr-4">Item</th>
                        <th className="py-3 pr-4">Quantity</th>
                        <th className="py-3 pr-4">Unit Price</th>
                        <th className="py-3">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-gray-100 last:border-b-0"
                        >
                          <td className="py-3 pr-4 text-gray-800 font-medium">
                            {item.product_name}
                          </td>
                          <td className="py-3 pr-4 text-gray-600">
                            {item.quantity}
                          </td>
                          <td className="py-3 pr-4 text-gray-600">
                            {Number(item.price_at_time).toFixed(2)}{" "}
                            {item.currency}
                          </td>
                          <td className="py-3 text-gray-800 font-semibold">
                            {(
                              Number(item.price_at_time) * item.quantity
                            ).toFixed(2)}{" "}
                            {item.currency}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td
                          colSpan={3}
                          className="pt-4 pr-4 text-right font-semibold text-gray-700"
                        >
                          Order Total
                        </td>
                        <td className="pt-4 font-bold text-gray-900">
                          {Number(order.total_price).toFixed(2)}{" "}
                          {order.currency}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          if (!deleting) {
            setShowDeleteModal(false);
            setOrderToDelete(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Order"
        message={
          orderToDelete
            ? `Delete order #${orderToDelete.id}? This also removes the linked Vittoria order rows through the foreign-key cascade on orders/order_items.`
            : "Delete this order?"
        }
        confirmText={deleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        confirmColor="red"
        loading={deleting}
      />
    </div>
  );
}
