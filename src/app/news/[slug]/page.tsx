import { Navbar, Footer } from "@/components";
import { NewsDetail } from "@/components/news-detail";
import { createClient } from "@supabase/supabase-js";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Disable dynamic params for static export - all routes must be pre-generated
export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

  // Prefer service role key to bypass RLS and fetch ALL articles (including drafts)
  // Fall back to anon key but only fetch published articles (RLS will filter)
  const supabaseKey = serviceRoleKey || anonKey;
  const useServiceRole = !!serviceRoleKey;

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

    // Build query based on available key
    let query = supabase.from("news").select("slug");

    // If using anon key, only fetch published articles (RLS will enforce this anyway)
    // If using service role key, fetch all articles
    if (!useServiceRole) {
      query = query.eq("is_published", true);
      console.log(
        "Using anon key - only fetching published articles for static generation"
      );
    } else {
      console.log(
        "Using service role key - fetching all articles (including drafts) for static generation"
      );
    }

    const { data: news, error } = await query;

    if (error) {
      console.error("Error fetching news for static params:", {
        error: error.message,
        code: error.code,
        details: error.details,
        usingServiceRole: useServiceRole,
      });
      // Return empty array - this will cause routes to not be generated
      // But this is better than crashing the build
      return [];
    }

    if (!news || news.length === 0) {
      console.warn("No news articles found for static generation");
      return [];
    }

    // Filter out any articles without slugs and ensure slug is a valid string
    const validSlugs = news
      .filter((article) => article.slug && typeof article.slug === "string")
      .map((article) => ({
        slug: String(article.slug),
      }));

    console.log(
      `Generated ${validSlugs.length} static params for news articles`
    );
    return validSlugs;
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
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

  // Prefer service role key to bypass RLS and fetch any article (including drafts)
  // Fall back to anon key - RLS will only allow published articles
  const supabaseKey = serviceRoleKey || anonKey;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase credentials not found");
    return null;
  }

  try {
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
      // Log the error but don't throw - return null to trigger notFound()
      // PGRST116 means "no rows returned" - this is expected for missing articles
      if (error.code === "PGRST116") {
        console.log(`Article not found for slug: ${slug}`);
      } else {
        console.error("Error fetching news article:", {
          slug,
          error: error.message,
          code: error.code,
          details: error.details,
          usingServiceRole: !!serviceRoleKey,
        });
      }
      return null;
    }

    if (!data) {
      console.warn(`No article data returned for slug: ${slug}`);
      return null;
    }

    return data;
  } catch (error: any) {
    console.error("Unexpected error fetching news article:", {
      slug,
      error: error?.message || String(error),
    });
    return null;
  }
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
