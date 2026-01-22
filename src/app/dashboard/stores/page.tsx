"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { StoreManagement } from "@/utils/types";
import { Loader } from "@/components/loader";
import { useAdmin } from "@/hooks/use-admin";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

export default function StoreManagementPage() {
  const [stores, setStores] = useState<StoreManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{
    display_name: string;
    description: string;
    is_open: boolean;
    closing_date: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      router.push("/dashboard/4endurance-store");
    }
  }, [isAdmin, adminLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchStores();
      // Check and auto-close stores periodically
      checkAndAutoCloseStores();
      const interval = setInterval(() => {
        checkAndAutoCloseStores();
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const checkAndAutoCloseStores = async () => {
    if (!isAdmin) return;

    try {
      const now = new Date().toISOString();
      
      // Find stores that should be closed (closing_date is set and in the past, but store is still open)
      const { data: storesToClose, error } = await supabase
        .from("store_management")
        .select("*")
        .eq("is_open", true)
        .not("closing_date", "is", null)
        .lt("closing_date", now);

      if (error) {
        console.error("Error checking closing dates:", error);
        return;
      }

      if (storesToClose && storesToClose.length > 0) {
        // Close all stores that have passed their closing date
        const storeIds = storesToClose.map((s) => s.id);
        const { error: updateError } = await supabase
          .from("store_management")
          .update({ is_open: false })
          .in("id", storeIds);

        if (updateError) {
          console.error("Error auto-closing stores:", updateError);
        } else {
          // Refresh stores list if any were closed
          fetchStores();
        }
      }
    } catch (err) {
      console.error("Error in auto-close check:", err);
    }
  };

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from("store_management")
        .select("*")
        .order("store_name", { ascending: true });

      if (queryError) {
        console.error("Supabase query error:", queryError);
        setError(queryError.message);
        return;
      }

      setStores((data || []) as StoreManagement[]);
    } catch (err: any) {
      console.error("Error fetching stores:", err);
      setError(err.message || "Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (store: StoreManagement) => {
    setEditingId(store.id);
    // Format closing_date for input (YYYY-MM-DDTHH:mm)
    const closingDate = store.closing_date
      ? new Date(store.closing_date).toISOString().slice(0, 16)
      : "";
    setEditForm({
      display_name: store.display_name,
      description: store.description || "",
      is_open: store.is_open === true,
      closing_date: closingDate,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSaveEdit = async (store: StoreManagement) => {
    if (!editForm) return;

    try {
      setSaving(true);

      if (!editForm.display_name.trim()) {
        toast.error("Display name is required");
        return;
      }

      // Check if closing_date is in the past and auto-close if needed
      let shouldBeOpen = editForm.is_open;
      if (editForm.closing_date) {
        const closingDate = new Date(editForm.closing_date);
        const now = new Date();
        if (closingDate <= now) {
          shouldBeOpen = false;
          toast.info(
            `Store will be closed because closing date (${closingDate.toLocaleDateString()}) has passed.`
          );
        }
      }

      const { error: updateError } = await supabase
        .from("store_management")
        .update({
          display_name: editForm.display_name.trim(),
          description: editForm.description.trim() || null,
          is_open: shouldBeOpen,
          closing_date: editForm.closing_date || null,
        })
        .eq("id", store.id);

      if (updateError) {
        console.error("Error updating store:", updateError);
        toast.error(`Failed to update store: ${updateError.message}`);
        return;
      }

      toast.success("Store updated successfully");
      setEditingId(null);
      setEditForm(null);
      fetchStores();
    } catch (err: any) {
      console.error("Error saving store:", err);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateStore = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      setCreating(true);

      const newStore = {
        store_name: formData.get("store_name") as string,
        store_table_name: formData.get("store_table_name") as string,
        display_name: formData.get("display_name") as string,
        description: formData.get("description") as string || null,
        is_open: formData.get("is_open") === "true",
      };

      if (!newStore.store_name || !newStore.store_table_name || !newStore.display_name) {
        toast.error("Store name, table name, and display name are required");
        return;
      }

      const { error: insertError } = await supabase
        .from("store_management")
        .insert([newStore]);

      if (insertError) {
        console.error("Error creating store:", insertError);
        toast.error(`Failed to create store: ${insertError.message}`);
        return;
      }

      toast.success("Store created successfully");
      setShowCreateForm(false);
      e.currentTarget.reset();
      fetchStores();
    } catch (err: any) {
      console.error("Error creating store:", err);
      toast.error("Failed to create store");
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
              Store Management
            </h1>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Store</span>
          </button>
        </div>
        <p className="text-gray-600">
          Manage which stores are open or closed for authenticated users
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Create Store Form */}
      {showCreateForm && (
        <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Create New Store
          </h2>
          <form onSubmit={handleCreateStore} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name (unique identifier) *
                </label>
                <input
                  type="text"
                  name="store_name"
                  required
                  placeholder="e.g., endurance_store"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Table Name (database table) *
                </label>
                <input
                  type="text"
                  name="store_table_name"
                  required
                  placeholder="e.g., endurance_store"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name *
                </label>
                <input
                  type="text"
                  name="display_name"
                  required
                  placeholder="e.g., 4Endurance Store"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Status
                </label>
                <select
                  name="is_open"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="false">Closed</option>
                  <option value="true">Open</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Store description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? "Creating..." : "Create Store"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stores Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Display Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Table Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Closing Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stores.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No stores found
                  </td>
                </tr>
              ) : (
                stores.map((store) => {
                  const isEditing = editingId === store.id;
                  return (
                    <tr key={store.id}>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editForm?.display_name || ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm!,
                                  display_name: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Display Name"
                            />
                            <textarea
                              value={editForm?.description || ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm!,
                                  description: e.target.value,
                                })
                              }
                              rows={2}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Description (optional)"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="text-sm font-medium text-gray-900">
                              {store.display_name}
                            </div>
                            {store.description && (
                              <div className="text-xs text-gray-500">
                                {store.description}
                              </div>
                            )}
                          </>
                        )}
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {store.store_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {store.store_table_name}
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <div className="space-y-2">
                            <select
                              value={editForm?.is_open ? "true" : "false"}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm!,
                                  is_open: e.target.value === "true",
                                })
                              }
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="true">Open</option>
                              <option value="false">Closed</option>
                            </select>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Closing Date (optional)
                              </label>
                              <input
                                type="datetime-local"
                                value={editForm?.closing_date || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm!,
                                    closing_date: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Select closing date"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Store will automatically close on this date
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              store.is_open
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {store.is_open ? "Open" : "Closed"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {store.closing_date
                          ? new Date(store.closing_date).toLocaleString()
                          : "—"}
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSaveEdit(store)}
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
                        <button
                          onClick={() => handleEdit(store)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
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
