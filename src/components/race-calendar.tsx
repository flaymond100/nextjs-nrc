"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { RaceCalendar, Rider } from "@/utils/types";
import { Loader } from "./loader";
import Link from "next/link";

export function RaceCalendarTable() {
  const [races, setRaces] = useState<RaceCalendar[]>([]);
  const [riders, setRiders] = useState<Map<string, Rider>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch race calendar
        const { data: raceData, error: raceError } = await supabase
          .from("race_calendar")
          .select("*")
          .order("event_date", { ascending: true });

        if (raceError) {
          setError(raceError.message);
          console.error("Error fetching race calendar:", raceError);
          return;
        }

        // Fetch all riders
        const { data: riderData, error: riderError } = await supabase
          .from("riders")
          .select("*");

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

  const formatRaceType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {races.map((race) => (
            <tr key={race.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/calendar/${race.id}`}
                  className="text-sm font-medium text-purple-600 hover:text-purple-800 hover:underline"
                >
                  {race.name}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatDate(race.event_date)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
