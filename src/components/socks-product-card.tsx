"use client";
import { useState, useEffect } from "react";
import { ApparelStoreProduct, CartItem, Size, Gender } from "@/utils/types";
import { addToCart } from "@/utils/cart-storage";
import toast from "react-hot-toast";
import Image from "next/image";
import { LinkIcon } from "@heroicons/react/24/outline";

interface SocksProductCardProps {
  product: ApparelStoreProduct;
  variants?: ApparelStoreProduct[];
}

export function SocksProductCard({
  product,
  variants = [product],
}: SocksProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] =
    useState<ApparelStoreProduct>(product);
  const [selectedSize, setSelectedSize] = useState<Size>("M");
  const [selectedGender, setSelectedGender] = useState<Gender>("Men");

  const normalizeGender = (value?: string | null): Gender => {
    if (!value) return "Men";

    const normalizedValue = value.toLowerCase();
    if (normalizedValue.startsWith("w")) return "Women";
    if (normalizedValue.startsWith("m")) return "Men";

    return value;
  };

  // Update selected variant when product or variants change
  useEffect(() => {
    if (variants.length > 0) {
      const availableVariant =
        variants.find((v) => v.available_bool === true) || variants[0];
      setSelectedVariant(availableVariant);
    } else {
      setSelectedVariant(product);
    }
  }, [product, variants]);

  const currentProduct = selectedVariant || product;

  useEffect(() => {
    setSelectedSize(currentProduct.sizes?.[0] || "M");
    setSelectedGender(normalizeGender(currentProduct.gender?.[0]));
  }, [currentProduct]);

  const handleAddToCart = () => {
    const variantToAdd = currentProduct;

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
      return Number(variantToAdd.variant_id);
    };

    const cartItem: CartItem = {
      productId: getProductId(),
      productName: variantToAdd.name,
      category: "Apparel",
      variant: variantToAdd.variant_id?.toString() || null,
      price: Number(variantToAdd.price || 0),
      currency: variantToAdd.currency || "EUR",
      quantity,
      size: selectedSize,
      gender: selectedGender,
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
  const hasMultipleVariants = variants.length > 1;
  const availableSizes = currentProduct.sizes || [];
  const availableGenders = currentProduct.gender || [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* Product Image */}
      {currentProduct.img_reference && (
        <div className="relative w-full h-[300px] bg-gray-100 flex-shrink-0">
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
            Apparel
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
        {currentProduct.product_item_info && (
          <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-3">
            {currentProduct.product_item_info}
          </p>
        )}
        <div className="mb-2 sm:mb-3">
          <p className="text-base sm:text-lg font-bold text-purple-700">
            {Number(currentProduct.price || 0).toFixed(2)}{" "}
            {currentProduct.currency || "EUR"}
          </p>
        </div>
        {currentProduct.available && (
          <p className="text-xs text-gray-500 mb-3">
            {currentProduct.available}
          </p>
        )}
        {hasMultipleVariants && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Variant
            </label>
            <select
              value={currentProduct.variant_id?.toString() || ""}
              onChange={(e) => handleVariantChange(e.target.value || null)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {variants.map((variant) => (
                <option
                  key={variant.variant_id || variant.name}
                  value={variant.variant_id?.toString() || ""}
                >
                  {variant.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {availableSizes.length > 0 && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Size
            </label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value as Size)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {availableSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
        {availableGenders.length > 0 && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value as Gender)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {availableGenders.map((gender) => {
                const normalizedGender = normalizeGender(gender);

                return (
                  <option key={gender} value={normalizedGender}>
                    {gender}
                  </option>
                );
              })}
            </select>
          </div>
        )}
        {/* Product URL Link */}
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
        )}
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
