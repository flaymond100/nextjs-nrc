"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { RaceCalendar, Rider } from "@/utils/types";
import { formatRaceType, getRaceTypeBadgeClasses } from "@/utils/race-types";
import { Loader } from "./loader";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { NavigationLink } from "./navigation-link";

export function RaceCalendarTable() {
  const [races, setRaces] = useState<RaceCalendar[]>([]);
  const [riders, setRiders] = useState<Map<string, Rider>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingRaces, setUpdatingRaces] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch race calendar and riders in parallel
        const [raceResult, riderResult] = await Promise.all([
          supabase
            .from("race_calendar")
            .select("*")
            .order("event_date", { ascending: true }),
          supabase.from("riders").select("*"),
        ]);

        const { data: raceData, error: raceError } = raceResult;
        const { data: riderData, error: riderError } = riderResult;

        if (raceError) {
          setError(raceError.message);
          console.error("Error fetching race calendar:", raceError);
          return;
        }

        if (riderError) {
          console.error("Error fetching riders:", riderError);
          // Continue even if riders fail to load
        } else {
          // Create a map of UUID to Rider for quick lookup
          const riderMap = new Map<string, Rider>();
          riderData?.forEach((rider) => {
            riderMap.set(rider.uuid, rider);
          });
          setRiders(riderMap);
        }

        setRaces(raceData || []);
      } catch (err: any) {
        setError("An unexpected error occurred");
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading calendar: {error}</p>
      </div>
    );
  }

  if (races.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No races scheduled at this time.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


  const getParticipantNames = (
    participantUuids: string[] | null | undefined
  ): string[] => {
    if (!participantUuids || participantUuids.length === 0) {
      return [];
    }

    return participantUuids
      .map((uuid) => {
        const rider = riders.get(uuid);
        if (rider) {
          const firstName = rider.firstName || "";
          const lastName = rider.lastName || "";
          return `${firstName} ${lastName}`.trim();
        }
        return null;
      })
      .filter((name): name is string => name !== null && name !== "");
  };

  const isRegistered = (race: RaceCalendar) => {
    return user && race.participants?.includes(user.id);
  };

  const handleToggleRegistration = async (race: RaceCalendar) => {
    if (!user) {
      toast.error("Please log in to register for races");
      router.push("/?login=true");
      return;
    }

    setUpdatingRaces((prev) => new Set(prev).add(race.id));
    try {
      const currentParticipants = race.participants || [];
      const registered = isRegistered(race);
      let newParticipants: string[];

      if (registered) {
        // Unregister: remove user from participants
        newParticipants = currentParticipants.filter((id) => id !== user.id);
      } else {
        // Register: add user to participants
        newParticipants = [...currentParticipants, user.id];
      }

      const { error: updateError } = await supabase
        .from("race_calendar")
        .update({ participants: newParticipants })
        .eq("id", race.id);

      if (updateError) {
        toast.error(updateError.message || "Failed to update registration");
        console.error("Error updating race:", updateError);
      } else {
        // Update local state
        setRaces((prevRaces) =>
          prevRaces.map((r) =>
            r.id === race.id ? { ...r, participants: newParticipants } : r
          )
        );

        // If registering, only fetch the new rider's data if not already loaded
        if (!registered && user && !riders.has(user.id)) {
          const { data: newRider } = await supabase
            .from("riders")
            .select("*")
            .eq("uuid", user.id)
            .single();

          if (newRider) {
            setRiders((prev) => new Map(prev).set(user.id, newRider));
          }
        }

        toast.success(
          registered
            ? "Successfully unregistered from race"
            : "Successfully registered for race"
        );
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred");
      console.error("Unexpected error:", err);
    } finally {
      setUpdatingRaces((prev) => {
        const newSet = new Set(prev);
        newSet.delete(race.id);
        return newSet;
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Race Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Distance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Elevation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Profile
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Link
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Participants
            </th>
            {user && (
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Participation
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {races.map((race) => (
            <tr key={race.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <NavigationLink
                  href={`/calendar/${race.id}`}
                  className="text-sm font-medium text-purple-600 hover:text-purple-800 hover:underline"
                >
                  {race.name}
                </NavigationLink>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatDate(race.event_date)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex text-xs leading-5 ${getRaceTypeBadgeClasses(race.race_type)}`}>
                  {formatRaceType(race.race_type)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {race.distance_km ? `${race.distance_km} km` : "-"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {race.elevation_m ? `${race.elevation_m} m` : "-"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {race.profile || "-"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {race.url ? (
                  <Link
                    href={race.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 hover:underline"
                  >
                    View Event
                  </Link>
                ) : (
                  "-"
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {race.participants && race.participants.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {getParticipantNames(race.participants).map(
                      (name, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {name}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              {user && (
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleToggleRegistration(race)}
                    disabled={updatingRaces.has(race.id)}
                    className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors ${
                      isRegistered(race)
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={
                      isRegistered(race)
                        ? "Unregister from race"
                        : "Register for race"
                    }
                  >
                    {updatingRaces.has(race.id) ? (
                      <Loader />
                    ) : isRegistered(race) ? (
                      <MinusIcon className="h-5 w-5" />
                    ) : (
                      <PlusIcon className="h-5 w-5" />
                    )}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
