"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Navbar, Footer } from "@/components";
import { RaceDetailSection } from "@/components/race-detail";
import { supabase } from "@/utils/supabase";
import { Loader } from "@/components/loader";

// This not-found page handles race routes that weren't generated at build time
// It checks if the URL matches a race ID pattern and tries to fetch the race client-side
export default function RaceNotFound() {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [raceId, setRaceId] = useState<string | null>(null);

  useEffect(() => {
    // Extract race ID from pathname (e.g., /calendar/race-id-123 -> race-id-123)
    const match = pathname?.match(/^\/calendar\/([^\/]+)$/);
    if (match && match[1]) {
      const id = match[1];
      
      // Check if this race exists in the database
      async function checkRace() {
        try {
          const { data, error } = await supabase
            .from("race_calendar")
            .select("id")
            .eq("id", id)
            .single();

          if (!error && data) {
            // Race exists! Set it to render the race detail component
            setRaceId(id);
          } else {
            // Race doesn't exist, show 404
            setChecking(false);
          }
        } catch (err) {
          console.error("Error checking race:", err);
          setChecking(false);
        }
      }

      checkRace();
    } else {
      setChecking(false);
    }
  }, [pathname]);

  // If we found a valid race, render it
  if (raceId) {
    return (
      <>
        <Navbar />
        <RaceDetailSection raceId={raceId} />
        <Footer />
      </>
    );
  }

  // Show loading while checking
  if (checking) {
    return (
      <>
        <Navbar />
        <section className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
          <Loader />
        </section>
        <Footer />
      </>
    );
  }

  // Show 404 if race doesn't exist
  return (
    <>
      <Navbar />
      <section className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Race Not Found
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            The race you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/calendar")}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            Back to Calendar
          </button>
        </div>
      </section>
      <Footer />
    </>
  );
}

