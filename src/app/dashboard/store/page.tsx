import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ShoppingBagIcon,
  ShoppingCartIcon,
  TrashIcon,
  Cog6ToothIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Loader } from "@/components/loader";
import { ConfirmModal } from "@/components/confirm-modal";
import { useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/utils/supabase";
import {
  StoreProduct,
  Order,
  OrderItem,
  OrderStatus,
  StoreOrderRow,
} from "@/utils/types";
import { StoreProductCard } from "@/components/store-product-card";
import { getCartItemCount } from "@/utils/cart-storage";

type StoreOrderRowExpanded = StoreOrderRow & {
  orders?: {
    id: number;
    user_id: string;
    total_price: number;
    currency: string;
    status: OrderStatus;
    created_at: string;
    updated_at: string;
    delivery_requested: boolean;
    delivery_name: string | null;
    delivery_address: string | null;
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

type StoreOrder = Order & { items: OrderItem[] };
type DisplayStoreProduct = StoreProduct & {
  variants: StoreProduct[];
};

function buildOrderItem(row: StoreOrderRowExpanded): OrderItem | null {
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

function buildOrders(rows: StoreOrderRowExpanded[]): StoreOrder[] {
  const ordersMap = new Map<number, StoreOrder>();

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
        delivery_requested: orderData.delivery_requested === true,
        delivery_name: orderData.delivery_name ?? null,
        delivery_address: orderData.delivery_address ?? null,
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

async function attachCustomerInfo(orders: StoreOrder[]): Promise<StoreOrder[]> {
  if (orders.length === 0) {
    return orders;
  }

  const userIds = Array.from(new Set(orders.map((order) => order.user_id)));

  const { data: ridersData, error: ridersError } = await supabase
    .schema("private")
    .from("riders")
    .select("uuid, email, firstName, lastName")
    .in("uuid", userIds);

  if (ridersError) {
    console.error("Error fetching customer info:", ridersError);
    return orders;
  }

  const ridersMap = new Map(
    (ridersData || []).map((rider) => [rider.uuid, rider])
  );

  return orders.map((order) => {
    const rider = ridersMap.get(order.user_id);
    return {
      ...order,
      user_email: rider?.email ?? null,
      user_first_name: rider?.firstName ?? null,
      user_last_name: rider?.lastName ?? null,
    };
  });
}

export default function StorePage() {
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
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [allOrdersForSummary, setAllOrdersForSummary] = useState<
    StoreOrder[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [productError, setProductError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [editOrderQuantities, setEditOrderQuantities] = useState<
    Record<number, number>
  >({});
  const [savingOrderItems, setSavingOrderItems] = useState(false);

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

  const fetchStoreRows = async (filterUserId?: string) => {
    let query = supabase
      .from("vittoria_store")
      .select(
        "id, store_id, order_id, order_item_id, created_at, updated_at, price, quantity, name, orders!inner(id, user_id, total_price, currency, status, created_at, updated_at, delivery_requested, delivery_name, delivery_address), order_items(id, order_id, variant_id, product_name, quantity, price_at_time, currency, created_at, size, gender)"
      )
      .order("created_at", { ascending: false });

    if (filterUserId) {
      query = query.eq("orders.user_id", filterUserId);
    }

    const { data, error: queryError } = await query;

    if (queryError) {
      throw queryError;
    }

    return (data || []) as unknown as StoreOrderRowExpanded[];
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

      setProducts((data || []) as StoreProduct[]);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setProductError(err.message || "Failed to load products");
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
      const rows = await fetchStoreRows(isAdmin ? undefined : user.id);
      const builtOrders = buildOrders(rows);
      setOrders(isAdmin ? await attachCustomerInfo(builtOrders) : builtOrders);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load store orders");
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
      const rows = await fetchStoreRows();
      setAllOrdersForSummary(await attachCustomerInfo(buildOrders(rows)));
    } catch (err) {
      console.error("Error fetching all orders:", err);
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
      // vittoria_store rows reference this order (and its order_items) via
      // foreign keys with no cascade, so they must be cleared out first or
      // the delete on "orders" below is rejected with a FK violation.
      const { error: deleteStoreRowsError } = await supabase
        .from("vittoria_store")
        .delete()
        .eq("order_id", orderToDelete.id);

      if (deleteStoreRowsError) {
        toast.error(
          deleteStoreRowsError.message || "Failed to delete order"
        );
        return;
      }

      const { error: deleteItemsError } = await supabase
        .from("order_items")
        .delete()
        .eq("order_id", orderToDelete.id);

      if (deleteItemsError) {
        toast.error(deleteItemsError.message || "Failed to delete order");
        return;
      }

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

  const handleEditOrderItems = (order: StoreOrder) => {
    const quantities: Record<number, number> = {};
    order.items.forEach((item) => {
      quantities[item.id] = item.quantity;
    });
    setEditingOrderId(order.id);
    setEditOrderQuantities(quantities);
  };

  const handleCancelEditOrderItems = () => {
    setEditingOrderId(null);
    setEditOrderQuantities({});
  };

  const handleOrderItemQuantityChange = (itemId: number, quantity: number) => {
    setEditOrderQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, quantity),
    }));
  };

  const handleSaveOrderItems = async (order: StoreOrder) => {
    if (!isAdmin) return;

    const remainingItems = order.items.filter(
      (item) => (editOrderQuantities[item.id] ?? item.quantity) > 0
    );

    if (remainingItems.length === 0) {
      toast.error(
        "An order needs at least one item. Delete the order instead if you want to remove it entirely."
      );
      return;
    }

    setSavingOrderItems(true);
    try {
      await Promise.all(
        order.items.map(async (item) => {
          const newQuantity = editOrderQuantities[item.id] ?? item.quantity;

          if (newQuantity <= 0) {
            const { error: deleteItemError } = await supabase
              .from("order_items")
              .delete()
              .eq("id", item.id);
            if (deleteItemError) throw deleteItemError;

            const { error: deleteStoreRowError } = await supabase
              .from("vittoria_store")
              .delete()
              .eq("order_item_id", item.id);
            if (deleteStoreRowError) throw deleteStoreRowError;
            return;
          }

          if (newQuantity === item.quantity) {
            return;
          }

          const { error: updateItemError } = await supabase
            .from("order_items")
            .update({ quantity: newQuantity })
            .eq("id", item.id);
          if (updateItemError) throw updateItemError;

          const { error: updateStoreRowError } = await supabase
            .from("vittoria_store")
            .update({ quantity: newQuantity })
            .eq("order_item_id", item.id);
          if (updateStoreRowError) throw updateStoreRowError;
        })
      );

      const newTotal = remainingItems.reduce((sum, item) => {
        const quantity = editOrderQuantities[item.id] ?? item.quantity;
        return sum + Number(item.price_at_time) * quantity;
      }, 0);

      const { error: updateOrderError } = await supabase
        .from("orders")
        .update({ total_price: newTotal })
        .eq("id", order.id);

      if (updateOrderError) throw updateOrderError;

      toast.success("Order items updated successfully");
      setEditingOrderId(null);
      setEditOrderQuantities({});
      fetchOrders();
      fetchAllOrdersForSummary();
    } catch (err: any) {
      console.error("Error updating order items:", err);
      toast.error(err.message || "Failed to update order items");
    } finally {
      setSavingOrderItems(false);
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

  const displayProducts = useMemo<DisplayStoreProduct[]>(() => {
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
      {} as Record<string, StoreProduct[]>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Store</h1>
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
            Store is Currently Closed
          </h1>
          <p className="text-gray-600 mb-6">
            The store is not available at the moment. Please check back later.
          </p>
          <div className="mt-8">
            <Link
              to="/dashboard"
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
              to="/dashboard"
              className="text-purple-600 hover:text-purple-700"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Store</h1>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/dashboard/store/admin"
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Cog6ToothIcon className="h-5 w-5" />
                <span>Admin</span>
              </Link>
            )}
            <Link
              to="/dashboard/store/checkout"
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
          Browse products and review your store orders.
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
              Browse catalog items available in the store.
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
              <StoreProductCard
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
                Aggregated from rows stored in the store table.
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
            <p className="text-gray-600">No orders found.</p>
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
              Orders linked through the store table.
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
          <p className="text-gray-600">No store orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isEditingItems = isAdmin && editingOrderId === order.id;
              const liveOrderTotal = isEditingItems
                ? order.items.reduce(
                    (sum, item) =>
                      sum +
                      Number(item.price_at_time) *
                        (editOrderQuantities[item.id] ?? item.quantity),
                    0
                  )
                : Number(order.total_price);

              return (
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
                    {isAdmin && (
                      <p className="text-sm text-gray-600 mt-1">
                        {order.user_first_name || order.user_last_name
                          ? `${order.user_first_name || ""} ${
                              order.user_last_name || ""
                            }`.trim()
                          : "Unknown user"}
                        {order.user_email && (
                          <span className="text-gray-400">
                            {" "}
                            ({order.user_email})
                          </span>
                        )}
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

                    {isAdmin &&
                      (isEditingItems ? (
                        <>
                          <button
                            onClick={() => handleSaveOrderItems(order)}
                            disabled={savingOrderItems}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                          >
                            <CheckIcon className="h-4 w-4" />
                            {savingOrderItems ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={handleCancelEditOrderItems}
                            disabled={savingOrderItems}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors text-sm"
                          >
                            <XMarkIcon className="h-4 w-4" />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEditOrderItems(order)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit Items
                        </button>
                      ))}

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

                <div className="mb-4 rounded-lg border border-gray-200 p-3 bg-gray-50">
                  {order.delivery_requested ? (
                    <>
                      <p className="text-sm font-semibold text-gray-800">
                        📦 Self-shipped — customer prints their own label
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {order.delivery_name}
                      </p>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {order.delivery_address}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Shipping label will be sent to Jan Wagebach via
                        WhatsApp.
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-600">
                      🏠 Pickup in person (no shipping)
                    </p>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-left text-gray-500">
                        <th className="py-3 pr-4">Item</th>
                        <th className="py-3 pr-4">Quantity</th>
                        <th className="py-3 pr-4">Unit Price</th>
                        <th className="py-3">Total</th>
                        {isEditingItems && <th className="py-3 pl-4" />}
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => {
                        const editedQuantity =
                          editOrderQuantities[item.id] ?? item.quantity;
                        const markedForRemoval = editedQuantity <= 0;

                        return (
                          <tr
                            key={item.id}
                            className={`border-b border-gray-100 last:border-b-0 ${
                              markedForRemoval ? "opacity-50" : ""
                            }`}
                          >
                            <td
                              className={`py-3 pr-4 text-gray-800 font-medium ${
                                markedForRemoval ? "line-through" : ""
                              }`}
                            >
                              {item.product_name}
                            </td>
                            <td className="py-3 pr-4 text-gray-600">
                              {isEditingItems ? (
                                <input
                                  type="number"
                                  min="0"
                                  value={editedQuantity}
                                  onChange={(e) =>
                                    handleOrderItemQuantityChange(
                                      item.id,
                                      parseInt(e.target.value, 10) || 0
                                    )
                                  }
                                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              ) : (
                                item.quantity
                              )}
                            </td>
                            <td className="py-3 pr-4 text-gray-600">
                              {Number(item.price_at_time).toFixed(2)}{" "}
                              {item.currency}
                            </td>
                            <td className="py-3 text-gray-800 font-semibold">
                              {(
                                Number(item.price_at_time) * editedQuantity
                              ).toFixed(2)}{" "}
                              {item.currency}
                            </td>
                            {isEditingItems && (
                              <td className="py-3 pl-4">
                                <button
                                  onClick={() =>
                                    handleOrderItemQuantityChange(
                                      item.id,
                                      markedForRemoval ? item.quantity : 0
                                    )
                                  }
                                  className="text-red-600 hover:text-red-900"
                                  title={
                                    markedForRemoval
                                      ? "Restore item"
                                      : "Remove item"
                                  }
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
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
                          {liveOrderTotal.toFixed(2)} {order.currency}
                        </td>
                        {isEditingItems && <td className="pt-4" />}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              );
            })}
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
            ? `Delete order #${orderToDelete.id}? This also removes its linked store rows and order items.`
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
