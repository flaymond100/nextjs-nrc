"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/utils/supabase";
import { CartItem, Gender, Size, VittoriaStoreProduct } from "@/utils/types";
import {
  clearCart,
  getCart,
  removeFromCart,
  saveCart,
  updateCartItem,
} from "@/utils/cart-storage";

type VittoriaCartItem = CartItem & { category: string };

export default function VittoriaCheckoutPage() {
  const [cartItems, setCartItems] = useState<VittoriaCartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = getCart();
    if (!cart) {
      setCartItems([]);
      return;
    }

    setCartItems(
      cart.items.filter(
        (item) => item.category === "Vittoria"
      ) as VittoriaCartItem[]
    );
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
      return;
    }

    updateCartItem(productId, size, gender, newQuantity, variant);
    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
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
    if (!confirm("Are you sure you want to clear your Vittoria cart?")) {
      return;
    }

    const cart = getCart();
    if (!cart) {
      setCartItems([]);
      return;
    }

    const remainingItems = cart.items.filter(
      (item) => item.category !== "Vittoria"
    );
    if (remainingItems.length === 0) {
      clearCart();
    } else {
      saveCart({ items: remainingItems, updatedAt: new Date().toISOString() });
    }

    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const DELIVERY_FEE = 6;

  const vittoriaSubtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      ),
    [cartItems]
  );

  const vittoriaTotal = useMemo(
    () => vittoriaSubtotal + DELIVERY_FEE,
    [vittoriaSubtotal]
  );

  const handleSubmitOrder = async () => {
    if (!user) {
      setSubmitError("You must be logged in to submit an order.");
      return;
    }

    if (cartItems.length === 0) {
      setSubmitError("Your Vittoria cart is empty.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const variantIds = cartItems
        .map((item) => item.variant)
        .filter((variant): variant is string => Boolean(variant))
        .map((variant) => Number.parseInt(variant, 10));

      if (
        variantIds.length !== cartItems.length ||
        variantIds.some(Number.isNaN)
      ) {
        throw new Error(
          "One or more cart items are missing a valid variant ID."
        );
      }

      const { data: catalogRows, error: catalogError } = await supabase
        .from("vittoria_store")
        .select(
          "id, store_id, price, quantity, name, currency, product_id, variant_id, sku, img_reference, product_url, product_item_info, available_bool"
        )
        .is("order_id", null)
        .is("order_item_id", null)
        .in("variant_id", variantIds);

      if (catalogError) {
        throw catalogError;
      }

      const catalogByVariantId = new Map(
        ((catalogRows || []) as VittoriaStoreProduct[]).map((row) => [
          row.variant_id?.toString(),
          row,
        ])
      );

      for (const item of cartItems) {
        const product = catalogByVariantId.get(item.variant || "");

        if (!product) {
          throw new Error(
            `Product ${item.productName} is no longer available.`
          );
        }

        if (product.available_bool !== true) {
          throw new Error(`${item.productName} is no longer available.`);
        }

        if (
          product.quantity !== null &&
          product.quantity !== undefined &&
          item.quantity > product.quantity
        ) {
          throw new Error(
            `${item.productName} only has ${product.quantity} item(s) left in stock.`
          );
        }
      }

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_price: vittoriaTotal,
          currency: "EUR",
          status: "pending",
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      const orderItemsData = cartItems.map((item) => ({
        order_id: order.id,
        variant_id: item.variant ? Number.parseInt(item.variant, 10) : null,
        product_name: item.productName,
        quantity: item.quantity,
        price_at_time: item.price,
        currency: item.currency || "EUR",
      }));

      const { data: insertedOrderItems, error: orderItemsError } =
        await supabase
          .from("order_items")
          .insert(orderItemsData)
          .select("id, variant_id");

      if (orderItemsError) {
        await supabase.from("orders").delete().eq("id", order.id);
        throw orderItemsError;
      }

      const orderItemsByVariantId = new Map(
        (insertedOrderItems || []).map((item) => [
          item.variant_id?.toString(),
          item.id,
        ])
      );

      const linkedStoreRows = cartItems.map((item) => {
        const product = catalogByVariantId.get(item.variant || "");
        const orderItemId = orderItemsByVariantId.get(item.variant || "");

        if (!product || !orderItemId) {
          throw new Error(
            `Failed to link ${item.productName} into Vittoria store rows.`
          );
        }

        return {
          store_id: product.store_id,
          order_id: order.id,
          order_item_id: orderItemId,
          price: item.price,
          quantity: item.quantity,
          name: item.productName,
          currency: item.currency || "EUR",
          available_bool: product.available_bool,
          img_reference: product.img_reference,
          product_url: product.product_url,
          product_id: product.product_id,
          variant_id: product.variant_id,
          sku: product.sku,
          product_item_info: product.product_item_info,
        };
      });

      const { error: linkedRowsError } = await supabase
        .from("vittoria_store")
        .insert(linkedStoreRows);

      if (linkedRowsError) {
        await supabase.from("orders").delete().eq("id", order.id);
        throw linkedRowsError;
      }

      const inventoryUpdates = cartItems.map(async (item) => {
        const product = catalogByVariantId.get(item.variant || "");
        if (
          !product ||
          product.quantity === null ||
          product.quantity === undefined
        ) {
          return;
        }

        const nextQuantity = Math.max(product.quantity - item.quantity, 0);

        const { error: updateError } = await supabase
          .from("vittoria_store")
          .update({
            quantity: nextQuantity,
            available_bool: nextQuantity > 0,
          })
          .eq("id", product.id);

        if (updateError) {
          throw updateError;
        }
      });

      await Promise.all(inventoryUpdates);

      const cart = getCart();
      if (cart) {
        const remainingItems = cart.items.filter(
          (item) => item.category !== "Vittoria"
        );
        if (remainingItems.length === 0) {
          clearCart();
        } else {
          saveCart({
            items: remainingItems,
            updatedAt: new Date().toISOString(),
          });
        }
      }

      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("orderSubmitted"));
      router.push(`/dashboard/vittoria-store/confirmation?orderId=${order.id}`);
    } catch (err: any) {
      console.error("Error submitting Vittoria order:", err);
      setSubmitError(
        err.message || "Failed to submit order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Vittoria Checkout
          </h1>
          <p className="text-gray-600 mb-6">
            Your cart is empty or contains no Vittoria products.
          </p>
          <Link
            href="/dashboard/vittoria-store"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Vittoria Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/dashboard/vittoria-store"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Vittoria Store
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
        <p className="text-gray-600">Review your Vittoria order</p>
      </div>

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{submitError}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.productId}-${item.variant}`}
              className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {item.productName}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  €{item.price.toFixed(2)} each
                </p>
                {item.variant && (
                  <p className="text-xs text-gray-500 mt-1">
                    Variant ID: {item.variant}
                  </p>
                )}
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

        <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
          <div className="flex justify-between items-center text-gray-600">
            <span>Subtotal:</span>
            <span>€{vittoriaSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>Delivery:</span>
            <span>€{DELIVERY_FEE.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-lg font-bold text-gray-800">Total:</span>
            <span className="text-lg font-bold text-purple-600">
              €{vittoriaTotal.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-gray-500 text-right">
            Price already includes VAT
          </p>
        </div>
      </div>

      <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">
          Payment Instructions
        </h2>
        <p className="text-sm text-gray-700 mb-4">
          After submitting your order, please transfer the total amount to the
          team bank account:
        </p>
        <div className="bg-white rounded-lg p-4 border border-purple-200 space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Account Holder:
            </label>
            <p className="text-base font-semibold text-gray-800 mt-1">
              NRC INTERNATIONAL TEAM e.V.
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">IBAN:</label>
            <p className="text-base font-mono font-semibold text-gray-800 mt-1 break-all">
              DE70 8306 5408 0006 8964 56
            </p>
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
