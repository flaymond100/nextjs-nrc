"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import { Loader } from "@/components/loader";
import { supabase } from "@/utils/supabase";
import { Order, OrderItem } from "@/utils/types";

export default function VittoriaOrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }

    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);

      const parsedOrderId = Number.parseInt(orderId, 10);

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", parsedOrderId)
        .single();

      if (orderError) {
        throw orderError;
      }

      setOrder(orderData as Order);

      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", parsedOrderId)
        .order("id", { ascending: true });

      if (itemsError) {
        console.error("Error fetching order items:", itemsError);
      } else {
        setOrderItems((itemsData || []) as OrderItem[]);
      }
    } catch (err: any) {
      console.error("Error fetching Vittoria order:", err);
      setError(err.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          href="/dashboard/vittoria-store"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Back to Store</span>
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Order not found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "We couldn't find the order you're looking for."}
          </p>
          <Link
            href="/dashboard/vittoria-store"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <Link
        href="/dashboard/vittoria-store"
        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4 sm:mb-6 text-sm sm:text-base"
      >
        <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>Back to Store</span>
      </Link>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <CheckCircleIcon className="h-12 w-12 sm:h-16 sm:w-16 text-green-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Thank you for your order. Please complete the payment to finalize
            your purchase.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4 sm:pt-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
            Order Details
          </h2>
          <div className="space-y-2 mb-4 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-semibold text-gray-800">#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date:</span>
              <span className="text-gray-800">
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>

          {orderItems.length > 0 && (
            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                Items Ordered:
              </h3>
              <div className="space-y-2">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1 sm:gap-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm sm:text-base">
                        {item.product_name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Quantity: {item.quantity} ×{" "}
                        {item.price_at_time.toFixed(2)} {item.currency}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm sm:text-base sm:text-right">
                      {(item.price_at_time * item.quantity).toFixed(2)}{" "}
                      {item.currency}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 space-y-2">
            <div className="flex justify-between items-center text-sm sm:text-base text-gray-600">
              <span>Subtotal:</span>
              <span>
                {(order.total_price - 6).toFixed(2)} {order.currency}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm sm:text-base text-gray-600">
              <span>Delivery:</span>
              <span>6.00 {order.currency}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-lg sm:text-xl font-bold text-gray-800">
                Total Amount:
              </span>
              <span className="text-xl sm:text-2xl font-bold text-purple-700">
                {order.total_price.toFixed(2)} {order.currency}
              </span>
            </div>
            <p className="text-xs text-gray-500 text-right">
              Price already includes VAT
            </p>
          </div>
        </div>

        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
            Payment Instructions
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
            To complete your purchase, please transfer the total amount to the
            following bank account:
          </p>

          <div className="bg-white rounded-lg p-3 sm:p-4 border border-purple-200">
            <div className="space-y-3">
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-600">
                  Account Holder:
                </label>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <p className="text-base sm:text-lg font-semibold text-gray-800 break-all">
                    NRC INTERNATIONAL TEAM e.V.
                  </p>
                  <button
                    onClick={() =>
                      copyToClipboard("NRC INTERNATIONAL TEAM e.V.")
                    }
                    className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                    title="Copy to clipboard"
                  >
                    <ClipboardIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-600">
                  IBAN:
                </label>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <p className="text-sm sm:text-base md:text-lg font-mono font-semibold text-gray-800 break-all">
                    DE70 8306 5408 0006 8964 56
                  </p>
                  <button
                    onClick={() => copyToClipboard("DE70830654080006896456")}
                    className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                    title="Copy to clipboard"
                  >
                    <ClipboardIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-600">
                  BIC:
                </label>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <p className="text-sm sm:text-base font-mono font-semibold text-gray-800">
                    GENODEF1SLR
                  </p>
                  <button
                    onClick={() => copyToClipboard("GENODEF1SLR")}
                    className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                    title="Copy to clipboard"
                  >
                    <ClipboardIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-600">
                  Reference:
                </label>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <p className="text-sm sm:text-base font-semibold text-gray-800 break-all">
                    Vittoria Order #{order.id}
                  </p>
                  <button
                    onClick={() =>
                      copyToClipboard(`Vittoria Order #${order.id}`)
                    }
                    className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                    title="Copy to clipboard"
                  >
                    <ClipboardIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Once your payment is received, your order will be processed.
          </p>
          <Link
            href="/dashboard/vittoria-store"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
