"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { LinkIcon } from "@heroicons/react/24/outline";
import { addToCart } from "@/utils/cart-storage";
import { CartItem, Gender, Size, VittoriaStoreProduct } from "@/utils/types";

interface VittoriaProductCardProps {
  product: VittoriaStoreProduct;
  variants?: VittoriaStoreProduct[];
}

export function VittoriaProductCard({
  product,
  variants = [product],
}: VittoriaProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] =
    useState<VittoriaStoreProduct>(product);

  useEffect(() => {
    if (variants.length > 0) {
      const availableVariant =
        variants.find((variant) => variant.available_bool === true) ||
        variants[0];
      setSelectedVariant(availableVariant);
    } else {
      setSelectedVariant(product);
    }
  }, [product, variants]);

  const currentProduct = selectedVariant || product;
  const hasMultipleVariants = variants.length > 1;
  const maxQuantity = currentProduct.quantity;
  const isAvailable =
    currentProduct.available_bool === true &&
    (maxQuantity === null || maxQuantity === undefined || maxQuantity > 0);

  const getProductId = (): number => {
    if (
      currentProduct.variant_id === null ||
      currentProduct.variant_id === undefined
    ) {
      let hash = 0;
      const name = currentProduct.name || "vittoria-product";
      for (let index = 0; index < name.length; index += 1) {
        const char = name.charCodeAt(index);
        hash = (hash << 5) - hash + char;
        hash &= hash;
      }
      return Math.abs(hash);
    }

    if (typeof currentProduct.variant_id === "number") {
      return currentProduct.variant_id;
    }

    let hash = 0;
    for (let index = 0; index < currentProduct.variant_id.length; index += 1) {
      const char = currentProduct.variant_id.charCodeAt(index);
      hash = (hash << 5) - hash + char;
      hash &= hash;
    }
    return Math.abs(hash);
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      productId: getProductId(),
      productName: currentProduct.name || "Vittoria product",
      category: "Vittoria",
      variant: currentProduct.variant_id?.toString() || null,
      price: Number(currentProduct.price || 0),
      currency: currentProduct.currency || "EUR",
      quantity,
      size: "M" as Size,
      gender: "Men" as Gender,
    };

    addToCart(cartItem);
    toast.success(`${currentProduct.name || "Product"} added to cart!`);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleQuantityChange = (delta: number) => {
    const nextQuantity = quantity + delta;
    if (nextQuantity < 1) {
      setQuantity(1);
      return;
    }

    if (maxQuantity !== null && maxQuantity !== undefined) {
      setQuantity(Math.min(nextQuantity, maxQuantity));
      return;
    }

    setQuantity(nextQuantity);
  };

  const handleVariantChange = (variantId: string | number | null) => {
    const variant = variants.find(
      (item) => item.variant_id?.toString() === variantId?.toString()
    );
    if (variant) {
      setSelectedVariant(variant);
      setQuantity(1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      {currentProduct.img_reference && (
        <div className="relative w-full h-48 bg-gray-100 flex-shrink-0">
          <Image
            src={currentProduct.img_reference}
            alt={currentProduct.name || "Vittoria product"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full">
            Vittoria
          </span>
          {!isAvailable && (
            <span className="inline-block px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
              Not available
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-3">
          {currentProduct.name}
        </h3>

        {currentProduct.product_item_info && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {currentProduct.product_item_info}
          </p>
        )}

        <div className="mb-3">
          <p className="text-lg font-bold text-purple-700">
            {Number(currentProduct.price || 0).toFixed(2)}{" "}
            {currentProduct.currency || "EUR"}
          </p>
          {maxQuantity !== null && maxQuantity !== undefined && (
            <p className="text-xs text-gray-500 mt-1">
              In stock: {maxQuantity}
            </p>
          )}
        </div>

        {hasMultipleVariants && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Variant
            </label>
            <select
              value={currentProduct.variant_id?.toString() || ""}
              onChange={(event) =>
                handleVariantChange(event.target.value || null)
              }
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

        <div className="flex-1" />

        <div className="mb-3 mt-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors"
            >
              −
            </button>
            <span className="text-sm font-semibold text-gray-800 w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {isAvailable ? (
          <button
            onClick={handleAddToCart}
            className="w-full py-2 text-sm font-semibold rounded-lg transition-colors bg-purple-600 text-white hover:bg-purple-700"
          >
            Add to Cart
          </button>
        ) : (
          <div className="space-y-2">
            <button
              disabled
              className="w-full py-2 text-sm font-semibold rounded-lg transition-colors bg-gray-300 text-gray-500 cursor-not-allowed"
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
