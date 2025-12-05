import { createClient } from "@supabase/supabase-js";
import EditNewsPageClient from "./edit-client";

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

interface EditNewsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { slug } = await params;
  return <EditNewsPageClient slug={slug} />;
}

