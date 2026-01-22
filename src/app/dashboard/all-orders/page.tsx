"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useAdmin } from "@/hooks/use-admin";
import { supabase } from "@/utils/supabase";
import { Order, OrderItem } from "@/utils/types";
import { Loader } from "@/components/loader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

export default function AllOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const [orders, setOrders] = useState<(Order & { items: OrderItem[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      router.push("/dashboard");
    }
  }, [isAdmin, adminLoading, router]);

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchOrders();
    }
  }, [user, authLoading, isAdmin]);

  const fetchOrders = async () => {
    if (!isAdmin) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch all orders (admin can see all)
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) {
        throw ordersError;
      }

      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      // Get unique user IDs to fetch user information
      const userIds = Array.from(new Set(ordersData.map((order) => order.user_id)));

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

      // Combine orders with their items and user information
      const ordersWithItems = ordersData.map((order) => {
        const rider = ridersMap.get(order.user_id);
        return {
          ...order,
          user_email: rider?.email || null,
          user_first_name: rider?.firstName || null,
          user_last_name: rider?.lastName || null,
          items: itemsMap.get(order.id) || [],
        };
      }) as (Order & { items: OrderItem[] })[];

      setOrders(ordersWithItems);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (orderId: number) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (authLoading || adminLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          All Orders
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          View all orders from all users
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 mb-4">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrders.has(order.id);
            const userName = order.user_first_name || order.user_last_name
              ? `${order.user_first_name || ""} ${order.user_last_name || ""}`.trim()
              : "Unknown User";
            
            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Order Header */}
                <div
                  className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleOrder(order.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                          Order #{order.id}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>
                          <span className="font-medium">Customer:</span>{" "}
                          {userName}
                          {order.user_email && (
                            <span className="text-gray-500">
                              {" "}({order.user_email})
                            </span>
                          )}
                        </span>
                        <span>
                          <span className="font-medium">Date:</span>{" "}
                          {new Date(order.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                        <span>
                          <span className="font-medium">Total:</span>{" "}
                          <span className="font-bold text-purple-700">
                            {order.total_price.toFixed(2)} {order.currency}
                          </span>
                        </span>
                        <span>
                          <span className="font-medium">Items:</span>{" "}
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {isExpanded ? "Hide" : "Show"} Details
                      </span>
                      {isExpanded ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-600" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items (Expandable) */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      Order Items
                    </h4>
                    {order.items.length === 0 ? (
                      <p className="text-gray-600 text-sm">
                        No items found for this order.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-800 mb-1">
                                  {item.product_name}
                                </h5>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                  <span>
                                    <span className="font-medium">Quantity:</span>{" "}
                                    {item.quantity}
                                  </span>
                                  <span>
                                    <span className="font-medium">Price:</span>{" "}
                                    {item.price_at_time.toFixed(2)}{" "}
                                    {item.currency}
                                  </span>
                                  {item.variant_id && (
                                    <span>
                                      <span className="font-medium">
                                        Variant ID:
                                      </span>{" "}
                                      {item.variant_id}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-purple-700">
                                  {(item.price_at_time * item.quantity).toFixed(
                                    2
                                  )}{" "}
                                  {item.currency}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.quantity} × {item.price_at_time.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-800">
                          Order Total:
                        </span>
                        <span className="text-2xl font-bold text-purple-700">
                          {order.total_price.toFixed(2)} {order.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
