"use client";
// components
import { Navbar, Footer } from "@/components";
import { CreateRaceForm } from "@/components/create-race-form";
import { useAdmin } from "@/hooks/use-admin";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/components/loader";
import toast from "react-hot-toast";

export default function CreateRacePage() {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      router.push("/calendar");
    }
  }, [isAdmin, loading, router]);

  // Show loading while checking admin status
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
          <Loader />
        </div>
        <Footer />
      </>
    );
  }

  // Don't render the form if not admin (redirect will happen)
  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600">Redirecting to calendar...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <CreateRaceForm />
      <Footer />
    </>
  );
}
