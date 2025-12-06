"use client";
import { useState } from "react";
import { GobikProduct, Size, Gender, CartItem } from "@/utils/types";
import { addToCart } from "@/utils/cart-storage";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: GobikProduct;
}

const SIZES: Size[] = ["2XS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];
const GENDERS: Gender[] = ["Men", "Women"];

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<Size>("M");
  const [selectedGender, setSelectedGender] = useState<Gender>("Men");

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      productId: product.id,
      productName: product.product_name,
      category: product.category,
      variant: product.variant,
      price: product.price_5_24_eur,
      currency: product.currency,
      quantity,
      size: selectedSize,
      gender: selectedGender,
    };

    addToCart(cartItem);
    toast.success(`${product.product_name} added to cart!`);
    // Dispatch event to update cart count in other components
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="mb-2">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
            {product.category}
          </span>
        </div>
        
        <h3 className="text-base font-bold text-gray-800 mb-1 line-clamp-2">
          {product.product_name}
        </h3>
        
        {product.variant && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-1">{product.variant}</p>
        )}

        <div className="mb-3">
          <p className="text-lg font-bold text-purple-700">
            {product.price_5_24_eur.toFixed(2)} {product.currency}
          </p>
        </div>

        {/* Gender Selection */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Gender
          </label>
          <div className="flex gap-1">
            {GENDERS.map((gender) => (
              <button
                key={gender}
                onClick={() => setSelectedGender(gender)}
                className={`
                  flex-1 px-2 py-1 text-xs font-medium rounded transition-colors
                  ${
                    selectedGender === gender
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Size
          </label>
          <div className="grid grid-cols-3 gap-1">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`
                  px-2 py-1 text-xs font-medium rounded transition-colors
                  ${
                    selectedSize === size
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Selection */}
        <div className="mb-3">
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

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

