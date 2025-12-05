"use client";
import { useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "@/components/loader";
import toast from "react-hot-toast";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar, Footer } from "@/components";
import { supabase } from "@/utils/supabase";

const SIDEBAR_MENU = [
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: "👤",
  },
  {
    name: "My Races",
    href: "/dashboard/my-races",
    icon: "🏁",
  },
  {
    name: "Members",
    href: "/dashboard/members",
    icon: "👥",
    adminOnly: true,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const [emailConfirmed, setEmailConfirmed] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(true);

  useEffect(() => {
    async function checkEmailConfirmation() {
      if (!user) {
        setEmailConfirmed(false);
        setCheckingEmail(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("riders")
          .select("isEmailConfirmed")
          .eq("uuid", user.id)
          .single();

        if (error) {
          console.error("Error checking email confirmation:", error);
          setEmailConfirmed(false);
        } else {
          setEmailConfirmed(data?.isEmailConfirmed === true);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setEmailConfirmed(false);
      } finally {
        setCheckingEmail(false);
      }
    }

    if (!authLoading && user) {
      checkEmailConfirmation();
    } else if (!authLoading && !user) {
      setEmailConfirmed(false);
      setCheckingEmail(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!authLoading && !checkingEmail) {
      if (!user) {
        toast.error("Please log in to access the dashboard.");
        router.push("/login");
      } else if (!emailConfirmed) {
        toast.error("Please confirm your email to access the dashboard.");
        router.push("/");
      }
    }
  }, [user, emailConfirmed, authLoading, checkingEmail, router]);

  const loading = authLoading || checkingEmail || adminLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user || !emailConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)] sticky top-[80px]">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Dashboard</h2>
            <nav className="space-y-2">
              {SIDEBAR_MENU.map((item) => {
                // Hide admin-only items for non-admins
                if (item.adminOnly && !isAdmin) {
                  return null;
                }

                // Check if current path matches the item href or starts with it (for sub-paths)
                const isActive =
                  pathname === item.href || pathname?.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-purple-100 text-purple-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
      <Footer />
    </>
  );
}

