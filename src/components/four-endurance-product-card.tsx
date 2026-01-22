"use client";
import { useState, useEffect } from "react";
import {
  FourEnduranceStoreProduct,
  CartItem,
  Size,
  Gender,
} from "@/utils/types";
import { addToCart } from "@/utils/cart-storage";
import toast from "react-hot-toast";
import Image from "next/image";
import { LinkIcon } from "@heroicons/react/24/outline";

interface FourEnduranceProductCardProps {
  product: FourEnduranceStoreProduct;
  variants?: FourEnduranceStoreProduct[];
}

export function FourEnduranceProductCard({
  product,
  variants = [product],
}: FourEnduranceProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] =
    useState<FourEnduranceStoreProduct>(product);

  // Update selected variant when product or variants change
  useEffect(() => {
    if (variants.length > 0) {
      // Find first available variant, or use first variant
      const availableVariant =
        variants.find((v) => v.available_bool === true) || variants[0];
      setSelectedVariant(availableVariant);
    } else {
      setSelectedVariant(product);
    }
  }, [product, variants]);

  // Update displayed product when variant changes
  const currentProduct = selectedVariant || product;
  const hasMultipleVariants = variants.length > 1;

  const handleAddToCart = () => {
    // Use the selected variant for cart
    const variantToAdd = currentProduct;

    // Convert variant_id to number for cart compatibility
    // If variant_id is a string, hash it; if it's a number, use it directly
    const getProductId = (): number => {
      if (
        variantToAdd.variant_id === null ||
        variantToAdd.variant_id === undefined
      ) {
        // Fallback: hash the name if variant_id is missing
        let hash = 0;
        const str = variantToAdd.name;
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash = hash & hash;
        }
        return Math.abs(hash);
      }
      if (typeof variantToAdd.variant_id === "number") {
        return variantToAdd.variant_id;
      }
      // If it's a string, convert to number
      let hash = 0;
      for (let i = 0; i < variantToAdd.variant_id.length; i++) {
        const char = variantToAdd.variant_id.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      return Math.abs(hash);
    };

    // For 4endurance products, we use variant_id as the unique identifier
    // Since CartItem requires size/gender fields, we'll use "M" and "Men" as defaults
    const cartItem: CartItem = {
      productId: getProductId(),
      productName: variantToAdd.name,
      category: "4Endurance",
      variant: variantToAdd.variant_id?.toString() || null,
      price: Number(variantToAdd.price),
      currency: variantToAdd.currency || "EUR",
      quantity,
      size: "M" as Size, // Default size (not applicable for 4endurance products)
      gender: "Men" as Gender, // Default gender (not applicable for 4endurance products)
    };

    addToCart(cartItem);
    toast.success(`${variantToAdd.name} added to cart!`);
    // Dispatch event to update cart count in other components
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleVariantChange = (variantId: string | number | null) => {
    const variant = variants.find(
      (v) => v.variant_id?.toString() === variantId?.toString()
    );
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const isAvailable = currentProduct.available_bool === true;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* Product Image */}
      {currentProduct.img_reference && (
        <div className="relative w-full h-32 sm:h-40 md:h-48 bg-gray-100 flex-shrink-0">
          <Image
            src={currentProduct.img_reference}
            alt={currentProduct.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      )}

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
            4Endurance
          </span>
          {/* Availability Badge */}
          {!isAvailable && (
            <span className="inline-block px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
              Not available
            </span>
          )}
        </div>
        <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-2 line-clamp-3">
          {currentProduct.name}
        </h3>
        <div className="mb-2 sm:mb-3">
          <p className="text-base sm:text-lg font-bold text-purple-700">
            {Number(currentProduct.price).toFixed(2)}{" "}
            {currentProduct.currency || "EUR"}
          </p>
        </div>
        {/* Product URL Link
        {currentProduct.product_url && (
          <div className="mb-3">
            <a
              href={currentProduct.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 hover:underline"
            >
              <LinkIcon className="h-3 w-3" />
              <span>Open product page</span>
            </a>
          </div>
        )} */}
        {/* Spacer to push quantity/cart section to bottom */}
        <div className="flex-1"></div>
        {/* Quantity Selection */}
        <div className="mb-2 sm:mb-3 mt-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm transition-colors"
            >
              −
            </button>
            <span className="text-xs sm:text-sm font-semibold text-gray-800 w-6 sm:w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm transition-colors"
            >
              +
            </button>
          </div>
        </div>
        {/* Add to Cart / Notify Me Button */}
        {isAvailable ? (
          <button
            onClick={handleAddToCart}
            className="w-full py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors bg-purple-600 text-white hover:bg-purple-700"
          >
            Add to Cart
          </button>
        ) : (
          <div className="space-y-1 sm:space-y-2">
            <button
              disabled
              className="w-full py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors bg-gray-300 text-gray-500 cursor-not-allowed"
            >
              Notify me
            </button>
            <p className="text-xs text-gray-500 text-center">Out of stock</p>
          </div>
        )}
      </div>
    </div>
  );
}
