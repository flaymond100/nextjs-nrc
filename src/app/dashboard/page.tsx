"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { StoreManagement } from "@/utils/types";
import { Loader } from "@/components/loader";
import Link from "next/link";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const [openStores, setOpenStores] = useState<StoreManagement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpenStores();
  }, []);

  const fetchOpenStores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("store_management")
        .select("*")
        .eq("is_open", true)
        .order("display_name", { ascending: true });

      if (error) {
        console.error("Error fetching open stores:", error);
        setOpenStores([]);
        return;
      }

      setOpenStores((data || []) as StoreManagement[]);
    } catch (err) {
      console.error("Error fetching open stores:", err);
      setOpenStores([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your dashboard</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/profile"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
        >
          <div className="text-2xl mb-2">👤</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Profile</h3>
          <p className="text-sm text-gray-600">View and edit your profile</p>
        </Link>
        <Link
          href="/dashboard/my-races"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
        >
          <div className="text-2xl mb-2">🏁</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">My Races</h3>
          <p className="text-sm text-gray-600">View your registered races</p>
        </Link>
        {openStores.length > 0 && (
          <Link
            href="/dashboard/4endurance-store"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="text-2xl mb-2">🛍️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Store</h3>
            <p className="text-sm text-gray-600">Browse all products</p>
          </Link>
        )}
      </div>
    </div>
  );
}
