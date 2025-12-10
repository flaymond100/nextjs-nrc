import { createClient } from "@supabase/supabase-js";
import EditNewsPageClient from "./edit-client";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Use service role key to bypass RLS and fetch ALL articles (including drafts)
  // This is necessary for static generation to include all routes
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

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

interface EditNewsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { slug } = await params;
  return <EditNewsPageClient slug={slug} />;
}
