"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { FourEnduranceStoreProduct } from "@/utils/types";
import { Loader } from "@/components/loader";
import { useAdmin } from "@/hooks/use-admin";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PencilIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

export default function StoreAdminPage() {
  const [products, setProducts] = useState<FourEnduranceStoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editForm, setEditForm] = useState<{
    price: string;
    available_bool: boolean;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    price: string;
    available_bool: string;
    img_reference: string;
    product_url: string;
    product_item_info: string;
  }>({
    name: "",
    price: "",
    available_bool: "true",
    img_reference: "",
    product_url: "",
    product_item_info: "",
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      router.push("/dashboard/4endurance-store");
    }
  }, [isAdmin, adminLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from("endurance_store")
        .select(
          "name, price, currency, available_bool, img_reference, product_url, product_id, variant_id, sku, product_item_info"
        )
        .order("name", { ascending: true });

      if (queryError) {
        console.error("Supabase query error:", queryError);
        setError(queryError.message);
        return;
      }

      setProducts((data || []) as FourEnduranceStoreProduct[]);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: FourEnduranceStoreProduct) => {
    // Use name as the identifier since it's the primary key
    setEditingId(product.name);
    setEditForm({
      price: product.price?.toString() || "0",
      available_bool: product.available_bool === true,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSaveEdit = async (product: FourEnduranceStoreProduct) => {
    if (!editForm) return;

    try {
      setSaving(true);
      const price = parseFloat(editForm.price);
      if (isNaN(price) || price < 0) {
        toast.error("Please enter a valid price");
        return;
      }

      // Update only price and available_bool
      // Use name as the identifier since it's the primary key
      const { error: updateError } = await supabase
        .from("endurance_store")
        .update({
          price: price,
          available_bool: editForm.available_bool,
        })
        .eq("name", product.name);

      if (updateError) {
        console.error("Error updating product:", updateError);
        toast.error(`Failed to update product: ${updateError.message}`);
        return;
      }

      toast.success("Product updated successfully");
      setEditingId(null);
      setEditForm(null);
      fetchProducts();
    } catch (err: any) {
      console.error("Error saving product:", err);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Generate unique numeric IDs for product creation (bigint compatible)
  const generateId = (): number => {
    // Generate a unique numeric ID using timestamp + random number
    // JavaScript safe integer range: -2^53 to 2^53-1 (about 16 digits)
    // We'll use timestamp (13 digits) + random (3 digits) = 16 digits max
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000); // 3-digit random (0-999)
    // Combine: timestamp (13 digits) + random (3 digits) = safe 16-digit number
    const idString = `${timestamp}${random.toString().padStart(3, '0')}`;
    return Number(idString);
  };

  const generateSKU = (): number => {
    // Generate numeric SKU (bigint compatible)
    // Similar to generateId but with a slight offset to ensure uniqueness
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000); // 3-digit random (0-999)
    // Add a small offset (100) to differentiate from product_id/variant_id
    const offset = 100;
    // Combine: timestamp (13 digits) + offset (3 digits) + random (3 digits) = safe 16-digit number
    const skuString = `${timestamp}${offset.toString().padStart(3, '0')}${random.toString().padStart(3, '0')}`;
    return Number(skuString);
  };

  const handleCopyProduct = (product: FourEnduranceStoreProduct) => {
    setFormData({
      name: product.name || "",
      price: product.price?.toString() || "",
      available_bool: product.available_bool === true ? "true" : "false",
      img_reference: product.img_reference || "",
      product_url: product.product_url || "",
      product_item_info: product.product_item_info || "",
    });
    setShowCreateForm(true);
    toast.success("Product information copied to form");
    // Scroll to form
    setTimeout(() => {
      const formElement = document.getElementById("create-product-form");
      formElement?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setCreating(true);

      const productName = formData.name;
      const price = parseFloat(formData.price);
      const currency = "EUR"; // Always EUR
      const available_bool = formData.available_bool === "true";

      if (!productName) {
        toast.error("Product name is required");
        return;
      }

      if (isNaN(price) || price < 0) {
        toast.error("Please enter a valid price");
        return;
      }

      // Generate unique IDs on the fly
      const product_id = generateId();
      const variant_id = generateId();
      const sku = generateSKU();

      const newProduct = {
        name: productName,
        price: price,
        currency: currency,
        available_bool: available_bool,
        product_item_info: formData.product_item_info || null,
        img_reference: formData.img_reference || null,
        product_url: formData.product_url || null,
        product_id: product_id,
        variant_id: variant_id,
        sku: sku,
      };

      const { error: insertError } = await supabase
        .from("endurance_store")
        .insert([newProduct]);

      if (insertError) {
        console.error("Error creating product:", insertError);
        toast.error(`Failed to create product: ${insertError.message}`);
        return;
      }

      toast.success("Product created successfully");
      setShowCreateForm(false);
      setFormData({
        name: "",
        price: "",
        available_bool: "true",
        img_reference: "",
        product_url: "",
        product_item_info: "",
      });
      fetchProducts();
    } catch (err: any) {
      console.error("Error creating product:", err);
      toast.error("Failed to create product");
    } finally {
      setCreating(false);
    }
  };

  if (adminLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/4endurance-store"
              className="text-purple-600 hover:text-purple-700"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">
              Store Administration
            </h1>
          </div>
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              if (!showCreateForm) {
                // Reset form when opening
                setFormData({
                  name: "",
                  price: "",
                  available_bool: "true",
                  img_reference: "",
                  product_url: "",
                  product_item_info: "",
                });
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Product</span>
          </button>
        </div>
        <p className="text-gray-600">Manage product prices and availability</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Create Product Form */}
      {showCreateForm && (
        <div
          id="create-product-form"
          className="mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Create New Product
          </h2>
          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (EUR) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available
                </label>
                <select
                  name="available_bool"
                  value={formData.available_bool}
                  onChange={(e) =>
                    setFormData({ ...formData, available_bool: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  name="img_reference"
                  value={formData.img_reference}
                  onChange={(e) =>
                    setFormData({ ...formData, img_reference: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product URL
                </label>
                <input
                  type="url"
                  name="product_url"
                  value={formData.product_url}
                  onChange={(e) =>
                    setFormData({ ...formData, product_url: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Info
              </label>
              <textarea
                name="product_item_info"
                value={formData.product_item_info}
                onChange={(e) =>
                  setFormData({ ...formData, product_item_info: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? "Creating..." : "Create Product"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({
                    name: "",
                    price: "",
                    available_bool: "true",
                    img_reference: "",
                    product_url: "",
                    product_item_info: "",
                  });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variant ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isEditing = editingId === product.name;
                  return (
                    <tr key={product.name}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        {product.sku && (
                          <div className="text-xs text-gray-500">
                            SKU: {product.sku}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.variant_id?.toString() || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editForm?.price || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm!,
                                price: e.target.value,
                              })
                            }
                            className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        ) : (
                          <span className="text-sm text-gray-900">
                            {Number(product.price).toFixed(2)}{" "}
                            {product.currency || "EUR"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <select
                            value={editForm?.available_bool ? "true" : "false"}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm!,
                                available_bool: e.target.value === "true",
                              })
                            }
                            className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="true">Available</option>
                            <option value="false">Not Available</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.available_bool === true
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.available_bool === true
                              ? "Available"
                              : "Not Available"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(product)}
                              disabled={saving}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              title="Save"
                            >
                              <CheckIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-red-600 hover:text-red-900"
                              title="Cancel"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-purple-600 hover:text-purple-900"
                              title="Edit"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleCopyProduct(product)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Copy to create form"
                            >
                              <DocumentDuplicateIcon className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
