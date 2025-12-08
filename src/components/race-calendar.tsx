"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/utils/supabase";
import { RaceCalendar, Rider } from "@/utils/types";
import { formatRaceType, getRaceTypeBadgeClasses } from "@/utils/race-types";
import { Loader } from "./loader";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { NavigationLink } from "./navigation-link";
import { useAdmin } from "@/hooks/use-admin";
import { ConfirmModal } from "./confirm-modal";

export function RaceCalendarTable() {
  const [races, setRaces] = useState<RaceCalendar[]>([]);
  const [riders, setRiders] = useState<Map<string, Rider>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingRaces, setUpdatingRaces] = useState<Set<string>>(new Set());
  const [deletingRaces, setDeletingRaces] = useState<Set<string>>(new Set());
  const [raceToDelete, setRaceToDelete] = useState<RaceCalendar | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userRider, setUserRider] = useState<Rider | null>(null);
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
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

  // Fetch current user's rider data to check activation status
  useEffect(() => {
    async function fetchUserRider() {
      if (!user) {
        setUserRider(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("riders")
          .select("*")
          .eq("uuid", user.id)
          .single();

        if (error) {
          console.error("Error fetching user rider data:", error);
          setUserRider(null);
        } else {
          setUserRider(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setUserRider(null);
      }
    }

    fetchUserRider();
  }, [user]);

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

    // Check if user is activated
    if (!userRider?.isActivated) {
      toast.error(
        "Your account must be activated by an admin before you can register for races"
      );
      router.push("/forbidden");
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

  const handleDeleteClick = (race: RaceCalendar) => {
    setRaceToDelete(race);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!raceToDelete) return;

    setDeletingRaces((prev) => new Set(prev).add(raceToDelete.id));
    try {
      const { error: deleteError } = await supabase
        .from("race_calendar")
        .delete()
        .eq("id", raceToDelete.id);

      if (deleteError) {
        toast.error(deleteError.message || "Failed to delete race");
        console.error("Error deleting race:", deleteError);
        setShowDeleteModal(false);
      } else {
        // Remove race from local state
        setRaces((prevRaces) =>
          prevRaces.filter((r) => r.id !== raceToDelete.id)
        );
        toast.success("Race deleted successfully!");
        setShowDeleteModal(false);
        setRaceToDelete(null);
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred");
      console.error("Unexpected error:", err);
      setShowDeleteModal(false);
    } finally {
      setDeletingRaces((prev) => {
        const newSet = new Set(prev);
        newSet.delete(raceToDelete.id);
        return newSet;
      });
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRaceToDelete(null);
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
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Distance
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
            {isAdmin && (
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Actions
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
                <div className="text-sm text-gray-900">
                  {race.location || "-"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex text-xs leading-5 ${getRaceTypeBadgeClasses(race.race_type)}`}
                >
                  {formatRaceType(race.race_type)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {race.distance_km
                    ? race.elevation_m
                      ? `${race.distance_km} km (${race.elevation_m}m)`
                      : `${race.distance_km} km`
                    : "-"}
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
              <td className="px-6 py-4 text-sm text-gray-900 text-center">
                {(() => {
                  const confirmedParticipants =
                    race.participants?.filter((uuid) => {
                      const rider = riders.get(uuid);
                      return rider && rider.isEmailConfirmed;
                    }) || [];
                  return confirmedParticipants.length > 0 ? (
                    <div className="flex justify-center">
                      <ParticipantsDisplay
                        participants={confirmedParticipants}
                        riders={riders}
                      />
                    </div>
                  ) : (
                    <span className="text-gray-400">0</span>
                  );
                })()}
              </td>
              {user && (
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleToggleRegistration(race)}
                    disabled={
                      updatingRaces.has(race.id) ||
                      (!isRegistered(race) && !userRider?.isActivated)
                    }
                    className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors ${
                      !isRegistered(race) && !userRider?.isActivated
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : isRegistered(race)
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={
                      !isRegistered(race) && !userRider?.isActivated
                        ? "Your account must be activated by an admin to register for races"
                        : isRegistered(race)
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
              {isAdmin && (
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleDeleteClick(race)}
                    disabled={deletingRaces.has(race.id)}
                    className="inline-flex items-center justify-center p-2 rounded-lg transition-colors bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete race"
                  >
                    {deletingRaces.has(race.id) ? (
                      <Loader />
                    ) : (
                      <TrashIcon className="h-5 w-5" />
                    )}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Race"
        message={
          raceToDelete
            ? `Are you sure you want to delete "${raceToDelete.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this race? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
        loading={raceToDelete ? deletingRaces.has(raceToDelete.id) : false}
      />
    </div>
  );
}

interface ParticipantsDisplayProps {
  participants: string[];
  riders: Map<string, Rider>;
}

function ParticipantsDisplay({
  participants,
  riders,
}: ParticipantsDisplayProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const badgeRef = useRef<HTMLDivElement>(null);

  const getParticipantNames = (
    participantUuids: string[]
  ): Array<{ uuid: string; name: string }> => {
    return participantUuids
      .map((uuid) => {
        const rider = riders.get(uuid);
        if (rider && rider.isEmailConfirmed) {
          const firstName = rider.firstName || "";
          const lastName = rider.lastName || "";
          const fullName = `${firstName} ${lastName}`.trim();
          return { uuid, name: fullName || uuid };
        }
        return null;
      })
      .filter(
        (item): item is { uuid: string; name: string } =>
          item !== null && item.name !== ""
      );
  };

  const participantNames = getParticipantNames(participants);
  const count = participants.length;

  const handleMouseEnter = () => {
    if (badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
      setShowTooltip(true);
    }
  };

  return (
    <>
      <div
        ref={badgeRef}
        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-semibold cursor-help hover:bg-purple-700 transition-colors"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {count}
      </div>
      {showTooltip && participantNames.length > 0 && (
        <div
          className="fixed z-[9999] w-64 bg-gray-900 text-white text-sm rounded-lg shadow-xl p-4 pointer-events-none"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
        >
          <div className="font-semibold mb-3 pb-2 border-b border-gray-700">
            Participants ({count})
          </div>
          <div className="max-h-64 overflow-y-auto">
            {participantNames.map((participant) => (
              <div key={participant.uuid} className="py-1.5 text-gray-200">
                {participant.name}
              </div>
            ))}
          </div>
          <div className="absolute -top-1 left-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      )}
    </>
  );
}
