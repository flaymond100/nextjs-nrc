"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  PencilIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { Loader } from "@/components/loader";
import { useAdmin } from "@/hooks/use-admin";
import { supabase } from "@/utils/supabase";
import { StoreManagement, VittoriaStoreProduct } from "@/utils/types";

export default function VittoriaStoreAdminPage() {
  const [products, setProducts] = useState<VittoriaStoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{
    price: string;
    quantity: string;
    available_bool: boolean;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [storeId, setStoreId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    price: string;
    quantity: string;
    available_bool: string;
    img_reference: string;
    product_url: string;
    product_item_info: string;
  }>({
    name: "",
    price: "",
    quantity: "",
    available_bool: "true",
    img_reference: "",
    product_url: "",
    product_item_info: "",
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      router.push("/dashboard/vittoria-store");
    }
  }, [isAdmin, adminLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchStoreId();
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchStoreId = async () => {
    try {
      const { data, error: queryError } = await supabase
        .from("store_management")
        .select("id")
        .eq("store_name", "vittoria_store")
        .single();

      if (queryError) {
        console.error("Error fetching Vittoria store id:", queryError);
        return;
      }

      setStoreId((data as Pick<StoreManagement, "id"> | null)?.id ?? null);
    } catch (err) {
      console.error("Error fetching Vittoria store id:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from("vittoria_store")
        .select(
          "id, store_id, order_id, order_item_id, created_at, updated_at, price, quantity, name, currency, available_bool, img_reference, product_url, product_id, variant_id, sku, product_item_info"
        )
        .is("order_id", null)
        .is("order_item_id", null)
        .order("available_bool", { ascending: false, nullsFirst: false })
        .order("name", { ascending: true });

      if (queryError) {
        console.error("Supabase query error:", queryError);
        setError(queryError.message);
        return;
      }

      setProducts((data || []) as VittoriaStoreProduct[]);
    } catch (err: any) {
      console.error("Error fetching Vittoria products:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: VittoriaStoreProduct) => {
    setEditingId(product.id);
    setEditForm({
      price: product.price?.toString() || "0",
      quantity: product.quantity?.toString() || "",
      available_bool: product.available_bool === true,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSaveEdit = async (product: VittoriaStoreProduct) => {
    if (!editForm) return;

    try {
      setSaving(true);
      const price = parseFloat(editForm.price);
      const parsedQuantity = editForm.quantity.trim()
        ? parseInt(editForm.quantity, 10)
        : null;

      if (isNaN(price) || price < 0) {
        toast.error("Please enter a valid price");
        return;
      }

      if (
        parsedQuantity !== null &&
        (isNaN(parsedQuantity) || parsedQuantity <= 0)
      ) {
        toast.error("Quantity must be empty or greater than zero");
        return;
      }

      const { error: updateError } = await supabase
        .from("vittoria_store")
        .update({
          price,
          quantity: parsedQuantity,
          available_bool: editForm.available_bool,
        })
        .eq("id", product.id);

      if (updateError) {
        console.error("Error updating Vittoria product:", updateError);
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

  const generateId = (): number => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return Number(`${timestamp}${random.toString().padStart(3, "0")}`);
  };

  const generateSku = (): number => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const offset = 200;
    return Number(
      `${timestamp}${offset.toString().padStart(3, "0")}${random.toString().padStart(3, "0")}`
    );
  };

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setCreating(true);

      const productName = formData.name.trim();
      const price = parseFloat(formData.price);
      const quantity = formData.quantity.trim()
        ? parseInt(formData.quantity, 10)
        : null;

      if (!productName) {
        toast.error("Product name is required");
        return;
      }

      if (isNaN(price) || price < 0) {
        toast.error("Please enter a valid price");
        return;
      }

      if (quantity !== null && (isNaN(quantity) || quantity <= 0)) {
        toast.error("Quantity must be empty or greater than zero");
        return;
      }

      const newProduct = {
        store_id: storeId,
        name: productName,
        price,
        quantity,
        currency: "EUR",
        available_bool: formData.available_bool === "true",
        img_reference: formData.img_reference.trim() || null,
        product_url: formData.product_url.trim() || null,
        product_item_info: formData.product_item_info.trim() || null,
        product_id: generateId(),
        variant_id: generateId(),
        sku: generateSku(),
      };

      const { error: insertError } = await supabase
        .from("vittoria_store")
        .insert([newProduct]);

      if (insertError) {
        console.error("Error creating Vittoria product:", insertError);
        toast.error(`Failed to create product: ${insertError.message}`);
        return;
      }

      toast.success("Product created successfully");
      setShowCreateForm(false);
      setFormData({
        name: "",
        price: "",
        quantity: "",
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

  const handleDuplicate = async (product: VittoriaStoreProduct) => {
    try {
      const duplicatedProduct = {
        store_id: storeId,
        name: `${product.name || "Unnamed product"} (Copy)`,
        price: Number(product.price || 0),
        quantity: product.quantity,
        currency: product.currency || "EUR",
        available_bool: false,
        img_reference: product.img_reference,
        product_url: product.product_url,
        product_item_info: product.product_item_info,
        product_id: generateId(),
        variant_id: generateId(),
        sku: generateSku(),
      };

      const { error: insertError } = await supabase
        .from("vittoria_store")
        .insert([duplicatedProduct]);

      if (insertError) {
        console.error("Error duplicating Vittoria product:", insertError);
        toast.error(`Failed to duplicate product: ${insertError.message}`);
        return;
      }

      toast.success("Product duplicated successfully");
      fetchProducts();
    } catch (err: any) {
      console.error("Error duplicating product:", err);
      toast.error("Failed to duplicate product");
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
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/vittoria-store"
              className="text-purple-600 hover:text-purple-700"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">
              Vittoria Store Admin
            </h1>
          </div>
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              if (!showCreateForm) {
                setFormData({
                  name: "",
                  price: "",
                  quantity: "",
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
        <p className="text-gray-600">
          Manage Vittoria store products and inventory
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {showCreateForm && (
        <div
          id="create-product-form"
          className="mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Add New Product
          </h2>
          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Vittoria Corsa Pro"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="29.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
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
                  value={formData.img_reference}
                  onChange={(e) =>
                    setFormData({ ...formData, img_reference: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product URL
                </label>
                <input
                  type="url"
                  value={formData.product_url}
                  onChange={(e) =>
                    setFormData({ ...formData, product_url: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/product"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Info
              </label>
              <textarea
                value={formData.product_item_info}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    product_item_info: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Additional product information..."
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
                    quantity: "",
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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
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
                  const isEditing = editingId === product.id;
                  return (
                    <tr key={product.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {product.img_reference && (
                            <img
                              src={product.img_reference}
                              alt={product.name || "Vittoria product"}
                              className="w-12 h-12 object-cover rounded-lg mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            {product.product_item_info && (
                              <div className="text-xs text-gray-500">
                                {product.product_item_info}
                              </div>
                            )}
                            {product.sku && (
                              <div className="text-xs text-gray-400">
                                SKU: {product.sku}
                              </div>
                            )}
                          </div>
                        </div>
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
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="0.00"
                          />
                        ) : (
                          <span className="text-sm text-gray-500">
                            €{Number(product.price || 0).toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="number"
                            min="1"
                            value={editForm?.quantity || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm!,
                                quantity: e.target.value,
                              })
                            }
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="0"
                          />
                        ) : (
                          <span className="text-sm text-gray-500">
                            {product.quantity ?? "-"}
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
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="true">Available</option>
                            <option value="false">Not Available</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.available_bool
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.available_bool
                              ? "Available"
                              : "Not Available"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
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
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-purple-600 hover:text-purple-900"
                              title="Edit"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDuplicate(product)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Duplicate"
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
