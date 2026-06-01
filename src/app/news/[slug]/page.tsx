import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar, Footer } from "@/components";
import { NewsDetail } from "@/components/news-detail";
import { Loader } from "@/components/loader";
import { supabase } from "@/utils/supabase";
import NewsNotFound from "./not-found";

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "found" | "missing">(
    "loading"
  );

  useEffect(() => {
    if (!slug) {
      setStatus("missing");
      return;
    }

    let alive = true;
    setStatus("loading");

    supabase
      .from("news")
      .select("*")
      .eq("slug", slug)
      .single()
      .then(({ data, error }) => {
        if (!alive) return;
        if (error || !data) {
          if (error && error.code !== "PGRST116") {
            console.error("Error fetching news article:", error);
          }
          setStatus("missing");
        } else {
          setArticle(data);
          setStatus("found");
        }
      });

    return () => {
      alive = false;
    };
  }, [slug]);

  if (status === "loading") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader />
        </div>
        <Footer />
      </>
    );
  }

  if (status === "missing") {
    return <NewsNotFound />;
  }

  return (
    <>
      <Navbar />
      <NewsDetail article={article} />
      <Footer />
    </>
  );
}
