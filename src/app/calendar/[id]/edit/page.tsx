import { createClient } from "@supabase/supabase-js";
import EditRacePageClient from "./edit-client";

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

interface EditRacePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRacePage({ params }: EditRacePageProps) {
  const { id: raceId } = await params;
  return <EditRacePageClient raceId={raceId} />;
}
  const params = useParams();
  const raceId = params?.id as string;
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      router.push(raceId ? `/calendar/${raceId}` : "/calendar");
    }
  }, [isAdmin, loading, router, raceId]);

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
            <p className="text-gray-600">Redirecting...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <EditRaceForm raceId={raceId} />
      <Footer />
    </>
  );
}

