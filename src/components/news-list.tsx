"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { News } from "@/utils/types";
import { Loader } from "./loader";
import Image from "next/image";
import { NavigationLink } from "./navigation-link";
import { format } from "date-fns";

export function NewsList() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("news")
          .select("*")
          .eq("is_published", true)
          .lte("published_at", new Date().toISOString())
          .order("published_at", { ascending: false });

        if (fetchError) {
          setError(fetchError.message);
          console.error("Error fetching news:", fetchError);
          return;
        }

        setNews(data || []);
      } catch (err: any) {
        setError("An unexpected error occurred");
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading news: {error}</p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No news articles available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {news.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}

interface NewsCardProps {
  article: News;
}

function NewsCard({ article }: NewsCardProps) {
  const publishedDate = article.published_at
    ? format(new Date(article.published_at), "MMMM d, yyyy")
    : null;

  return (
    <NavigationLink
      href={`/news/${article.slug}`}
      className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      {article.main_image_url && (
        <div className="relative w-full h-48 md:h-64 overflow-hidden">
          <Image
            src={article.main_image_url}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-4 md:p-6">
        {publishedDate && (
          <p className="text-sm text-gray-500 mb-2">{publishedDate}</p>
        )}
        <h2 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-[#37007d] transition-colors">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="text-gray-600 line-clamp-3">{article.excerpt}</p>
        )}
      </div>
    </NavigationLink>
  );
}

