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
import { Bars3Icon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

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
    name: "Store",
    href: "/dashboard/store",
    icon: "🛍️",
    adminOnly: true,
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
  const [isActivated, setIsActivated] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(true);
  const [checkingActivation, setCheckingActivation] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile menu state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop collapse state

  useEffect(() => {
    async function checkUserStatus() {
      if (!user) {
        setEmailConfirmed(false);
        setIsActivated(false);
        setCheckingEmail(false);
        setCheckingActivation(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("riders")
          .select("isEmailConfirmed, isActivated")
          .eq("uuid", user.id)
          .single();

        if (error) {
          console.error("Error checking user status:", error);
          setEmailConfirmed(false);
          setIsActivated(false);
        } else {
          setEmailConfirmed(data?.isEmailConfirmed === true);
          setIsActivated(data?.isActivated === true);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setEmailConfirmed(false);
        setIsActivated(false);
      } finally {
        setCheckingEmail(false);
        setCheckingActivation(false);
      }
    }

    if (!authLoading && user) {
      checkUserStatus();
    } else if (!authLoading && !user) {
      setEmailConfirmed(false);
      setIsActivated(false);
      setCheckingEmail(false);
      setCheckingActivation(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!authLoading && !checkingEmail && !checkingActivation) {
      if (!user) {
        toast.error("Please log in to access the dashboard.");
        router.push("/login");
      } else if (!emailConfirmed) {
        toast.error("Please confirm your email to access the dashboard.");
        router.push("/");
      } else if (!isActivated) {
        toast.error("Your account must be activated by an admin to access the dashboard.");
        router.push("/forbidden");
      }
    }
  }, [user, emailConfirmed, isActivated, authLoading, checkingEmail, checkingActivation, router]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const loading = authLoading || checkingEmail || checkingActivation || adminLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user || !emailConfirmed || !isActivated) {
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
        <div className="flex relative">
          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Mobile Expanded Menu Overlay */}
          {sidebarOpen && (
            <aside
              className={`
                fixed top-[80px] left-0 z-50
                w-64 h-[calc(100vh-80px)]
                bg-white border-r border-gray-200
                transform transition-transform duration-300 ease-in-out
                md:hidden
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
              `}
            >
              {/* Mobile Close Button */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800">Menu</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              <nav className="space-y-2 p-4">
                {SIDEBAR_MENU.map((item) => {
                  if (item.adminOnly && !isAdmin) {
                    return null;
                  }
                  if (item.verifiedOnly && !isActivated) {
                    return null;
                  }

                  const isActive =
                    pathname === item.href || pathname?.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                        ${isActive
                          ? "bg-purple-100 text-purple-700 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
                    >
                      <span className="text-xl flex-shrink-0">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </aside>
          )}

          {/* Icon-Only Sidebar (Mobile) / Collapsible Sidebar (Desktop) */}
          <aside
            className={`
              sticky top-[80px] left-0 z-40
              w-16
              ${sidebarCollapsed ? "md:w-16" : "md:w-64"}
              bg-white border-r border-gray-200
              min-h-[calc(100vh-80px)]
              flex-shrink-0
              transition-all duration-300 ease-in-out
            `}
          >
            {/* Desktop Title and Toggle */}
            <div className="hidden md:block">
              <div className={`${sidebarCollapsed ? "p-2" : "p-6"} transition-all duration-300`}>
                <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"} mb-6`}>
                  {!sidebarCollapsed && (
                    <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
                  )}
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                    aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  >
                    {sidebarCollapsed ? (
                      <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                    ) : (
                      <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <nav className={`space-y-2 p-2 ${sidebarCollapsed ? "md:p-2" : "md:p-6"} md:pt-0 transition-all duration-300`}>
              {SIDEBAR_MENU.map((item) => {
                // Hide admin-only items for non-admins
                if (item.adminOnly && !isAdmin) {
                  return null;
                }
                // Hide verified-only items for non-verified riders
                if (item.verifiedOnly && !isActivated) {
                  return null;
                }

                // Check if current path matches the item href or starts with it (for sub-paths)
                const isActive =
                  pathname === item.href || pathname?.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative flex items-center justify-center
                      ${sidebarCollapsed ? "md:justify-center" : "md:justify-start"}
                      gap-0 md:gap-3 px-2 md:px-4 py-3 rounded-lg transition-colors
                      ${isActive
                        ? "bg-purple-100 text-purple-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                      }
                      group
                    `}
                    title={item.name}
                  >
                    <span className="text-2xl md:text-xl flex-shrink-0">{item.icon}</span>
                    <span className={`hidden ${sidebarCollapsed ? "md:hidden" : "md:inline"} transition-opacity duration-300`}>
                      {item.name}
                    </span>
                    {/* Mobile tooltip - shows on hover */}
                    <span className="md:hidden absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                      {item.name}
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></span>
                    </span>
                    {/* Desktop tooltip when collapsed */}
                    <span className={`hidden ${sidebarCollapsed ? "md:block" : "md:hidden"} absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg`}>
                      {item.name}
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></span>
                    </span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 w-full md:w-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}

