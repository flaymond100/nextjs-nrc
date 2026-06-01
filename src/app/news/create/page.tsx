// components
import { Navbar, Footer } from "@/components";
import { CreateNewsForm } from "@/components/create-news-form";
import { useAdmin } from "@/hooks/use-admin";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader } from "@/components/loader";
import toast from "react-hot-toast";

export default function CreateNewsPage() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/news");
    }
  }, [isAdmin, loading, navigate]);

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
            <p className="text-gray-600">Redirecting to news...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <CreateNewsForm />
      <Footer />
    </>
  );
}

