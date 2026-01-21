"use client";
import { useEffect, useState } from "react";
import { CartItem, Size, Gender } from "@/utils/types";
import {
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartTotal,
} from "@/utils/cart-storage";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = getCart();
    if (cart) {
      setCartItems(cart.items);
      setTotal(getCartTotal());
    } else {
      setCartItems([]);
      setTotal(0);
    }
  };

  const handleQuantityChange = (
    productId: number,
    size: Size,
    gender: Gender,
    newQuantity: number,
    variant?: string | null
  ) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId, size, gender, variant);
    } else {
      updateCartItem(productId, size, gender, newQuantity, variant);
      loadCart();
      // Dispatch event to update cart count in other components
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const handleRemoveItem = (
    productId: number,
    size: Size,
    gender: Gender,
    variant?: string | null
  ) => {
    removeFromCart(productId, size, gender, variant);
    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart();
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const handleSubmitOrder = async () => {
    if (!user) {
      setSubmitError("You must be logged in to submit an order.");
      return;
    }

    if (cartItems.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Filter only 4Endurance products (those with variant_id)
      const enduranceItems = cartItems.filter(
        (item) => item.category === "4Endurance" && item.variant
      );

      if (enduranceItems.length === 0) {
        setSubmitError("No 4Endurance products in cart to order.");
        setSubmitting(false);
        return;
      }

      // Calculate total from endurance items only
      const orderTotal = enduranceItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_price: orderTotal,
          currency: "EUR",
          status: "pending",
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Create order items
      const orderItemsData = enduranceItems.map((item) => ({
        order_id: order.id,
        variant_id: item.variant ? parseInt(item.variant) : null,
        product_name: item.productName,
        quantity: item.quantity,
        price_at_time: item.price,
        currency: item.currency || "EUR",
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsData);

      if (itemsError) {
        // If order items fail, try to delete the order
        await supabase.from("orders").delete().eq("id", order.id);
        throw itemsError;
      }

      // Clear cart and redirect
      clearCart();
      window.dispatchEvent(new Event("cartUpdated"));
      
      // Notify admin views to refresh orders
      window.dispatchEvent(new Event("orderSubmitted"));
      
      // Show success message and redirect
      alert(`Order #${order.id} submitted successfully!`);
      router.push("/dashboard/4endurance-store");
    } catch (err: any) {
      console.error("Error submitting order:", err);
      setSubmitError(
        err.message || "Failed to submit order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard/4endurance-store"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Store</span>
        </Link>

        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some products to your cart to continue.
          </p>
          <Link
            href="/dashboard/4endurance-store"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/dashboard/4endurance-store"
        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        <span>Back to Store</span>
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
          <button
            onClick={handleClearCart}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {cartItems.map((item, index) => {
            // Use variant_id if available for unique key, otherwise use standard key
            const uniqueKey = item.variant
              ? `${item.variant}-${index}`
              : `${item.productId}-${item.size}-${item.gender}-${index}`;

            return (
              <div
                key={uniqueKey}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {item.productName}
                    </h3>
                    {item.variant && (
                      <p className="text-sm text-gray-600 mb-2">
                        Variant ID: {item.variant}
                      </p>
                    )}
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>
                        <span className="font-medium">Category:</span>{" "}
                        {item.category}
                      </span>
                      {item.category !== "4Endurance" && (
                        <>
                          <span>
                            <span className="font-medium">Size:</span>{" "}
                            {item.size}
                          </span>
                          <span>
                            <span className="font-medium">Gender:</span>{" "}
                            {item.gender}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-lg font-bold text-purple-700 mb-2">
                      {(item.price * item.quantity).toFixed(2)} {item.currency}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      {item.price.toFixed(2)} {item.currency} each
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.size,
                            item.gender,
                            item.quantity - 1,
                            item.variant
                          )
                        }
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                      >
                        −
                      </button>
                      <span className="text-lg font-semibold text-gray-800 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.size,
                            item.gender,
                            item.quantity + 1,
                            item.variant
                          )
                        }
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        handleRemoveItem(
                          item.productId,
                          item.size,
                          item.gender,
                          item.variant
                        )
                      }
                      className="mt-2 flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-800">
              Total Items:
            </span>
            <span className="text-lg font-semibold text-gray-800">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-purple-700">
              {total.toFixed(2)} EUR
            </span>
          </div>

          {/* Error message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">{submitError}</p>
            </div>
          )}

          {/* Submit Order Button */}
          <button
            onClick={handleSubmitOrder}
            disabled={submitting || cartItems.filter(item => item.category === "4Endurance").length === 0}
            className={`w-full py-3 font-semibold rounded-lg transition-colors ${
              submitting || cartItems.filter(item => item.category === "4Endurance").length === 0
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {submitting ? "Submitting Order..." : "Submit Order"}
          </button>

          {cartItems.filter(item => item.category === "4Endurance").length === 0 && (
            <p className="text-sm text-gray-600 text-center mt-2">
              Only 4Endurance products can be ordered through this store.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
