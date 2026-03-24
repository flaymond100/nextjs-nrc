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

export default function SocksCheckoutPage() {
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
      // Filter only Socks products (those with category "Socks")
      const socksItems = cartItems.filter(
        (item) => item.category === "Socks" && item.variant
      );

      if (socksItems.length === 0) {
        setSubmitError("No socks products in cart to order.");
        setSubmitting(false);
        return;
      }

      // Calculate total from socks items only
      const orderTotal = socksItems.reduce(
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
      const orderItemsData = socksItems.map((item) => ({
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

      router.push("/dashboard/apparel-store/confirmation");
    } catch (error: any) {
      console.error("Error submitting order:", error);
      setSubmitError(
        error.message || "Failed to submit order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Filter cart items to show only socks products
  const socksItems = cartItems.filter((item) => item.category === "Socks");
  const socksTotal = socksItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (socksItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Apparel Store Checkout
          </h1>
          <p className="text-gray-600 mb-6">
            Your cart is empty or contains no apparel products.
          </p>
          <Link
            href="/dashboard/apparel-store"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Apparel Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/dashboard/apparel-store"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Apparel Store
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
        <p className="text-gray-600">Review your apparel order</p>
      </div>

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{submitError}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

        <div className="space-y-4">
          {socksItems.map((item) => (
            <div
              key={`${item.productId}-${item.variant}`}
              className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {item.productName}
                </h3>
                <p className="text-sm text-gray-600">
                  €{item.price.toFixed(2)} each
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
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
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors"
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold text-gray-800 w-8 text-center">
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
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm font-semibold text-gray-800 w-20 text-right">
                  €{(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() =>
                    handleRemoveItem(
                      item.productId,
                      item.size,
                      item.gender,
                      item.variant
                    )
                  }
                  className="text-red-600 hover:text-red-900 ml-4"
                  title="Remove item"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">Total:</span>
            <span className="text-lg font-bold text-purple-600">
              €{socksTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handleClearCart}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Clear Cart
        </button>

        <button
          onClick={handleSubmitOrder}
          disabled={submitting}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Submitting Order..." : "Submit Order"}
        </button>
      </div>
    </div>
  );
}
