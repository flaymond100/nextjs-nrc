"use client";
import { Button } from "@material-tailwind/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/utils/supabase";
import { RaceCalendar } from "@/utils/types";
import { formatRaceType, getRaceTypeBadgeClasses } from "@/utils/race-types";
import { Loader } from "./loader";
import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";

interface WelcomeSectionProps {
  firstName: string | null;
}

export function WelcomeSection({ firstName }: WelcomeSectionProps) {
  const displayName = firstName || "there";
  const { user } = useAuth();
  const [nextRace, setNextRace] = useState<RaceCalendar | null>(null);
  const [loadingRace, setLoadingRace] = useState(true);

  useEffect(() => {
    async function fetchNextRace() {
      if (!user) {
        setLoadingRace(false);
        return;
      }

      try {
        setLoadingRace(true);
        // Fetch all races ordered by date
        const { data: allRaces, error } = await supabase
          .from("race_calendar")
          .select("*")
          .order("event_date", { ascending: true });

        if (error) {
          console.error("Error fetching races:", error);
          setLoadingRace(false);
          return;
        }

        // Filter for races where user is registered and date is in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const userRaces =
          allRaces?.filter(
            (race) =>
              race.participants &&
              race.participants.includes(user.id) &&
              new Date(race.event_date) >= today
          ) || [];

        // Get the next race (first one in the future)
        if (userRaces.length > 0) {
          setNextRace(userRaces[0]);
        } else {
          setNextRace(null);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoadingRace(false);
      }
    }

    fetchNextRace();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="pt-8 px-8 pb-20 md:pb-0 relative  flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="animate-in slide-in-from-bottom duration-1000 flex flex-col items-center justify-center mb-10">
          <div className="w-full max-w-2xl mb-4">
            <h3 className="leter-spacing-1 text-3xl font-bold text-gray-900">
              Hi, {displayName}!
            </h3>
          </div>

          {loadingRace ? (
            <div className="flex justify-start py-8">
              <Loader />
            </div>
          ) : nextRace ? (
            <div className="w-full max-w-2xl mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">
                Your Next Race
              </h2>
              <Link href={`/calendar/${nextRace.id}`}>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {nextRace.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getRaceTypeBadgeClasses(nextRace.race_type)}`}
                    >
                      {formatRaceType(nextRace.race_type)}
                    </span>
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-purple-600" />
                      <span>{formatDate(nextRace.event_date)}</span>
                    </div>
                    {nextRace.location && (
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="h-5 w-5 text-purple-600" />
                        <span>{nextRace.location}</span>
                      </div>
                    )}
                    {nextRace.distance_km && (
                      <div className="text-sm text-gray-600">
                        Distance: {nextRace.distance_km} km
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ) : (
            <div className="w-full max-w-2xl mb-8 text-left">
              <p className="text-gray-600 text-lg">
                You don't have any upcoming races registered.{" "}
                <Link
                  href="/calendar"
                  className="text-purple-600 hover:text-purple-800 hover:underline"
                >
                  Browse the calendar
                </Link>{" "}
                to find your next race!
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-start items-start gap-4 mt-8">
            <Link href="/dashboard">
              <Button
                style={{ background: "#37007d" }}
                placeholder={""}
                color="gray"
                size="lg"
                className="w-48 h-12"
              >
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
