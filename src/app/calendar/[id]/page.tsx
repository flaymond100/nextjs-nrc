// components
import { Navbar, Footer } from "@/components";
import { RaceDetailSection } from "@/components/race-detail";
import { createClient } from "@supabase/supabase-js";

// Generate static params for existing races at build time
// For new races created after build, we'll use a catch-all route approach
export async function generateStaticParams(): Promise<{ id: string }[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials not found, returning empty params");
    return [];
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: races, error } = await supabase
      .from("race_calendar")
      .select("id");

    if (error) {
      console.error("Error fetching races for static params:", error);
      return [];
    }

    if (!races || races.length === 0) {
      return [];
    }

    return races.map((race) => ({
      id: race.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

interface RaceDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RaceDetailPage({ params }: RaceDetailPageProps) {
  const { id: raceId } = await params;

  return (
    <>
      <Navbar />
      <RaceDetailSection raceId={raceId} />
      <Footer />
    </>
  );
}
