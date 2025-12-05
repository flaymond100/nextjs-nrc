import { Navbar, Footer } from "@/components";
import { NewsDetail } from "@/components/news-detail";
import { createClient } from "@supabase/supabase-js";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Disable dynamic params for static export
export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Use service role key to bypass RLS and fetch ALL articles (including drafts)
  // This is necessary for static generation to include all routes
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials not found, returning empty params");
    return [];
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    // Fetch ALL news articles (including drafts/unpublished) for static generation
    // Using service role key bypasses RLS to ensure all routes are generated at build time
    // RLS policies will control access at runtime when users visit the pages
    const { data: news, error } = await supabase.from("news").select("slug");

    if (error) {
      console.error("Error fetching news for static params:", error);
      return [];
    }

    if (!news || news.length === 0) {
      return [];
    }

    // Filter out any articles without slugs and ensure slug is a valid string
    return news
      .filter((article) => article.slug && typeof article.slug === "string")
      .map((article) => ({
        slug: String(article.slug),
      }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getNewsArticle(slug: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Use service role key to bypass RLS for server-side rendering
  // This allows fetching draft articles during static generation
  // Client-side components will handle access control based on user permissions
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase credentials not found");
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching news article:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  return data;
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const article = await getNewsArticle(slug);

    if (!article) {
      return {
        title: "News Article Not Found",
      };
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://www.nrc-team.com";
    const publishedDate = article.published_at
      ? new Date(article.published_at).toISOString()
      : undefined;

    return {
      title: `${article.title} | NRC International Team`,
      description: article.excerpt || article.title,
      openGraph: {
        title: article.title,
        description: article.excerpt || article.title,
        url: `${baseUrl}/news/${article.slug}`,
        siteName: "NRC International Team",
        images: article.main_image_url
          ? [
              {
                url: article.main_image_url,
                width: 1200,
                height: 630,
                alt: article.title,
              },
            ]
          : [],
        type: "article",
        publishedTime: publishedDate,
        modifiedTime: article.updated_at,
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.excerpt || article.title,
        images: article.main_image_url ? [article.main_image_url] : [],
      },
      alternates: {
        canonical: `${baseUrl}/news/${article.slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "News Article | NRC International Team",
    };
  }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  try {
    const { slug } = await params;
    const article = await getNewsArticle(slug);

    if (!article) {
      notFound();
    }

    return (
      <>
        <Navbar />
        <NewsDetail article={article} />
        <Footer />
      </>
    );
  } catch (error) {
    console.error("Error rendering news detail page:", error);
    notFound();
  }
}
