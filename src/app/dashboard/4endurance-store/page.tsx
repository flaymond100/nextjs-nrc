"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { FourEnduranceStoreProduct } from "@/utils/types";
import { FourEnduranceProductCard } from "@/components/four-endurance-product-card";
import { Loader } from "@/components/loader";
import { getCartItemCount } from "@/utils/cart-storage";
import { useAdmin } from "@/hooks/use-admin";
import Link from "next/link";
import { ShoppingCartIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function FourEnduranceStorePage() {
  const [products, setProducts] = useState<FourEnduranceStoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { isAdmin } = useAdmin();
  const [storeOpen, setStoreOpen] = useState<boolean | null>(null);

  useEffect(() => {
    checkStoreStatus();
    updateCartCount();

    // Listen for storage changes to update cart count
    const handleStorageChange = () => {
      updateCartCount();
    };
    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events (for same-tab updates)
    window.addEventListener("cartUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, []);

  const checkStoreStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("store_management")
        .select("is_open")
        .eq("store_name", "endurance_store")
        .single();

      if (error) {
        console.error("Error checking store status:", error);
        // If table doesn't exist yet, assume store is open (backward compatibility)
        setStoreOpen(true);
        fetchProducts();
        return;
      }

      const isOpen = data?.is_open === true;
      setStoreOpen(isOpen);

      if (isOpen) {
        fetchProducts();
      }
    } catch (err) {
      console.error("Error checking store status:", err);
      // On error, assume store is open (backward compatibility)
      setStoreOpen(true);
      fetchProducts();
    }
  };

  const updateCartCount = () => {
    setCartItemCount(getCartItemCount());
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products with all required fields
      const { data, error: queryError } = await supabase
        .from("endurance_store")
        .select(
          "name, price, currency, available_bool, img_reference, product_url, product_id, variant_id, sku, product_item_info"
        )
        .order("available_bool", { ascending: false, nullsFirst: false })
        .order("name", { ascending: true });

      if (queryError) {
        // Log detailed error for debugging
        console.error("Supabase query error:", {
          message: queryError.message,
          code: queryError.code,
          details: queryError.details,
          hint: queryError.hint,
        });

        // If the error is about the table name, try an alternative approach
        if (
          queryError.message?.includes("relation") ||
          queryError.code === "PGRST204"
        ) {
          console.warn(
            "Table name issue detected. Trying alternative query method..."
          );
          throw new Error(
            `Table 'endurance_store' not found or not accessible. ` +
              `Error: ${queryError.message}. ` +
              `Please verify the table name and RLS policies.`
          );
        }

        throw queryError;
      }

      const fetchedProducts = (data || []) as FourEnduranceStoreProduct[];
      console.log(`Total products fetched: ${fetchedProducts.length}`);

      // Always show all products including unavailable ones
      setProducts(fetchedProducts);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(
        err.message ||
          err.details ||
          "Failed to load products. Please check the console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  // Group products by product_id for variant dropdown
  // Only group if product_id exists, otherwise treat each variant as separate product
  const groupedProducts = products.reduce(
    (acc, product) => {
      // Only group by product_id if it exists and is not null
      const productId = product.product_id?.toString();

      if (productId) {
        // Group by product_id
        if (!acc[productId]) {
          acc[productId] = [];
        }
        acc[productId].push(product);
      } else {
        // No product_id - treat as individual product (use variant_id or name as key)
        const individualKey = product.variant_id?.toString() || product.name;
        if (!acc[individualKey]) {
          acc[individualKey] = [];
        }
        acc[individualKey].push(product);
      }
      return acc;
    },
    {} as Record<string, FourEnduranceStoreProduct[]>
  );

  // Create display products - one per product_id group, with all variants
  const displayProducts = Object.values(groupedProducts).map((variants) => {
    // Use the first available variant as default, or first variant if none available
    const defaultVariant =
      variants.find((v) => v.available_bool === true) || variants[0];
    return {
      ...defaultVariant,
      variants: variants.sort((a, b) => {
        // Sort variants: available first, then by name
        if (a.available_bool === b.available_bool) {
          return (a.name || "").localeCompare(b.name || "");
        }
        return a.available_bool === true ? -1 : 1;
      }),
    };
  });

  if (loading || storeOpen === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (storeOpen === false) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            4Endurance Store
          </h1>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-2">
              Store is currently closed
            </p>
            <p className="text-gray-500">
              Please check back later or contact an administrator
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">4Endurance Store</h1>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                href="/dashboard/4endurance-store/admin"
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Cog6ToothIcon className="h-5 w-5" />
                <span>Admin</span>
              </Link>
            )}
            <Link
              href="/dashboard/4endurance-store/checkout"
              className="relative flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span>Checkout</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
        <p className="text-gray-600">
          Browse nutrition from our partner 4Endurance
        </p>
      </div>

      {/* Products Grid */}
      {displayProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No products available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayProducts.map((product) => (
            <FourEnduranceProductCard
              key={product.product_id || product.variant_id || product.name}
              product={product}
              variants={product.variants || [product]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
