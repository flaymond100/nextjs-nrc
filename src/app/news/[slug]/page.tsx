import { Navbar, Footer } from "@/components";
import { NewsDetail } from "@/components/news-detail";
import { createClient } from "@supabase/supabase-js";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials not found, returning empty params");
    return [];
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: news, error } = await supabase
      .from("news")
      .select("slug")
      .eq("is_published", true)
      .lte("published_at", new Date().toISOString());

    if (error) {
      console.error("Error fetching news for static params:", error);
      return [];
    }

    if (!news || news.length === 0) {
      return [];
    }

    return news.map((article) => ({
      slug: article.slug,
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
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase credentials not found");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .lte("published_at", new Date().toISOString())
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticle(slug);

  if (!article) {
    return {
      title: "News Article Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.nrc-team.com";
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
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
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
}

