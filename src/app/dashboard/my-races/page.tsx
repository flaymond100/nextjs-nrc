"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/utils/supabase";
import { RaceCalendar } from "@/utils/types";
import { Loader } from "@/components/loader";
import { NavigationLink } from "@/components/navigation-link";
import { getRaceTypeBadgeClasses, formatRaceType } from "@/utils/race-types";
import Link from "next/link";
import { CalendarIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function MyRacesPage() {
  const { user, loading: authLoading } = useAuth();
  const [races, setRaces] = useState<RaceCalendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    async function fetchMyRaces() {
      try {
        setLoading(true);
        setError(null);

        // Fetch all races
        const { data: allRaces, error: racesError } = await supabase
          .from("race_calendar")
          .select("*")
          .order("event_date", { ascending: true });

        if (racesError) {
          setError(racesError.message);
          console.error("Error fetching races:", racesError);
          return;
        }

        // Filter races where user is registered
        const myRaces =
          allRaces?.filter(
            (race) => race.participants && user && race.participants.includes(user.id)
          ) || [];

        setRaces(myRaces);
      } catch (err: any) {
        setError("An unexpected error occurred");
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyRaces();
  }, [user, authLoading]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <NavigationLink href="/calendar">
            <button className="text-purple-600 hover:text-purple-800 underline">
              View All Races
            </button>
          </NavigationLink>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Races</h1>
        <p className="text-gray-600">
          Races you have registered for ({races.length})
        </p>
      </div>

      {races.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="mb-4">
            <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            No Races Registered
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't registered for any races yet.
          </p>
          <NavigationLink href="/calendar">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Browse Races
            </button>
          </NavigationLink>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {races.map((race) => (
            <div
              key={race.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex-1">
                  {race.name}
                </h3>
                <span className={getRaceTypeBadgeClasses(race.race_type)}>
                  {formatRaceType(race.race_type)}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarIcon className="h-5 w-5 text-purple-600" />
                  <span className="text-sm">{formatDate(race.event_date)}</span>
                </div>

                {race.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPinIcon className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">{race.location}</span>
                  </div>
                )}

                {(race.distance_km || race.elevation_m) && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <ClockIcon className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">
                      {race.distance_km
                        ? `${race.distance_km} km`
                        : ""}
                      {race.distance_km && race.elevation_m
                        ? " / "
                        : ""}
                      {race.elevation_m
                        ? `${race.elevation_m} m`
                        : ""}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {race.url && (
                  <Link
                    href={race.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    View Details
                  </Link>
                )}
                <NavigationLink
                  href={`/calendar/${race.id}`}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-center rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  View Race
                </NavigationLink>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

