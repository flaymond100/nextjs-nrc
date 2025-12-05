"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { News } from "@/utils/types";
import { Loader } from "./loader";
import Image from "next/image";
import { NavigationLink } from "./navigation-link";
import { format } from "date-fns";
import { useAdmin } from "@/hooks/use-admin";

export function NewsList() {
  const [publishedNews, setPublishedNews] = useState<News[]>([]);
  const [draftNews, setDraftNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);

        if (isAdmin) {
          // Admins see both published and draft articles
          const { data: allNewsData, error: fetchError } = await supabase
            .from("news")
            .select("*")
            .order("created_at", { ascending: false });

          if (fetchError) {
            setError(fetchError.message);
            console.error("Error fetching news:", fetchError);
            return;
          }

          // Separate into published and draft/unpublished
          const published: News[] = [];
          const draft: News[] = [];

          (allNewsData || []).forEach((article) => {
            if (article.is_published) {
              published.push(article);
            } else {
              draft.push(article);
            }
          });

          // Sort published by published_at (or created_at) descending
          published.sort((a, b) => {
            const dateA = a.published_at 
              ? new Date(a.published_at).getTime() 
              : a.created_at 
                ? new Date(a.created_at).getTime() 
                : 0;
            const dateB = b.published_at 
              ? new Date(b.published_at).getTime() 
              : b.created_at 
                ? new Date(b.created_at).getTime() 
                : 0;
            return dateB - dateA;
          });

          setPublishedNews(published);
          setDraftNews(draft);
        } else {
          // Regular users only see published articles
          const { data, error: fetchError } = await supabase
            .from("news")
            .select("*")
            .eq("is_published", true)
            .order("published_at", { ascending: false });

          if (fetchError) {
            setError(fetchError.message);
            console.error("Error fetching news:", fetchError);
            return;
          }

          setPublishedNews(data || []);
        }
      } catch (err: any) {
        setError("An unexpected error occurred");
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [isAdmin]);

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

  const allNews = [...publishedNews, ...draftNews];

  if (allNews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No news articles available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Published News */}
      {publishedNews.length > 0 && (
        <div>
          {isAdmin && (
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Published News
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {publishedNews.map((article) => (
              <NewsCard key={article.id} article={article} isPublished={true} />
            ))}
          </div>
        </div>
      )}

      {/* Draft/Unpublished News (Admin Only) */}
      {isAdmin && draftNews.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Drafts (Hidden)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {draftNews.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                isPublished={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface NewsCardProps {
  article: News;
  isPublished: boolean;
}

function NewsCard({ article, isPublished }: NewsCardProps) {
  const publishedDate = article.published_at
    ? format(new Date(article.published_at), "MMMM d, yyyy")
    : null;

  return (
    <NavigationLink
      href={`/news/${article.slug}`}
      className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden relative"
    >
      {/* Status Badge for Drafts */}
      {!isPublished && (
        <div className="absolute top-2 right-2 z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Draft
          </span>
        </div>
      )}

      {article.main_image_url && (
        <div className="relative w-full h-48 md:h-64 overflow-hidden">
          <Image
            src={article.main_image_url}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!isPublished && (
            <div className="absolute inset-0 bg-black bg-opacity-20" />
          )}
        </div>
      )}
      <div className="p-4 md:p-6">
        {publishedDate && (
          <p className="text-sm text-gray-500 mb-2">{publishedDate}</p>
        )}
        {!publishedDate && !article.is_published && (
          <p className="text-sm text-gray-500 mb-2 font-medium">Draft</p>
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

