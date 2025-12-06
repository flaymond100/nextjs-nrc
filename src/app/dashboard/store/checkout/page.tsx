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
import Link from "next/link";
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

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
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId, size, gender);
    } else {
      updateCartItem(productId, size, gender, newQuantity);
      loadCart();
      // Dispatch event to update cart count in other components
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const handleRemoveItem = (productId: number, size: Size, gender: Gender) => {
    removeFromCart(productId, size, gender);
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

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard/store"
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
            href="/dashboard/store"
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
        href="/dashboard/store"
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
          {cartItems.map((item, index) => (
            <div
              key={`${item.productId}-${item.size}-${item.gender}-${index}`}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {item.productName}
                  </h3>
                  {item.variant && (
                    <p className="text-sm text-gray-600 mb-2">{item.variant}</p>
                  )}
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>
                      <span className="font-medium">Category:</span> {item.category}
                    </span>
                    <span>
                      <span className="font-medium">Size:</span> {item.size}
                    </span>
                    <span>
                      <span className="font-medium">Gender:</span> {item.gender}
                    </span>
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
                          item.quantity - 1
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
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() =>
                      handleRemoveItem(item.productId, item.size, item.gender)
                    }
                    className="mt-2 flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
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

          {/* Note about submit button */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> The submit button will be implemented once
              the order endpoint is available.
            </p>
          </div>

          {/* Placeholder for future submit button */}
          <div className="opacity-50 cursor-not-allowed">
            <button
              disabled
              className="w-full py-3 bg-gray-400 text-white font-semibold rounded-lg"
            >
              Submit Order (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

