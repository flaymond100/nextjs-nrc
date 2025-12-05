"use client";
// components
import { Navbar, Footer } from "@/components";
import { EditNewsForm } from "@/components/edit-news-form";
import { useAdmin } from "@/hooks/use-admin";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "@/components/loader";
import toast from "react-hot-toast";
import { supabase } from "@/utils/supabase";

interface EditNewsPageClientProps {
  slug: string;
}

export default function EditNewsPageClient({ slug }: EditNewsPageClientProps) {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();
  const [newsId, setNewsId] = useState<string | null>(null);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      router.push(`/news/${slug}`);
    }
  }, [isAdmin, loading, router, slug]);

  useEffect(() => {
    async function fetchNewsId() {
      if (!isAdmin) return; // Don't fetch if not admin

      try {
        const { data, error } = await supabase
          .from("news")
          .select("id")
          .eq("slug", slug)
          .single();

        if (error || !data) {
          toast.error("News article not found");
          router.push("/news");
          return;
        }

        setNewsId(data.id);
      } catch (err) {
        console.error("Error fetching news:", err);
        router.push("/news");
      } finally {
        setLoadingNews(false);
      }
    }

    if (!loading && isAdmin) {
      fetchNewsId();
    }
  }, [slug, router, isAdmin, loading]);

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
            <p className="text-gray-600">Redirecting to news article...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (loadingNews || !newsId) {
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

  return (
    <>
      <Navbar />
      <EditNewsForm newsId={newsId} />
      <Footer />
    </>
  );
}

