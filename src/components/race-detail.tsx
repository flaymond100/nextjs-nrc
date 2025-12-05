"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { RaceCalendar, Rider } from "@/utils/types";
import { formatRaceType, getRaceTypeBadgeClasses } from "@/utils/race-types";
import { Loader } from "./loader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import {
  PlusIcon,
  MinusIcon,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { NavigationLink } from "./navigation-link";
import { Button } from "@material-tailwind/react";
import { useAdmin } from "@/hooks/use-admin";
import { ConfirmModal } from "./confirm-modal";

interface RaceDetailSectionProps {
  raceId: string;
}

export function RaceDetailSection({ raceId }: RaceDetailSectionProps) {
  const [race, setRace] = useState<RaceCalendar | null>(null);
  const [riders, setRiders] = useState<Map<string, Rider>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const router = useRouter();

  const isRegistered = user && race?.participants?.includes(user.id);

  useEffect(() => {
    async function fetchRaceData() {
      try {
        setLoading(true);

        // Fetch race data
        const { data: raceData, error: raceError } = await supabase
          .from("race_calendar")
          .select("*")
          .eq("id", raceId)
          .single();

        if (raceError) {
          setError(raceError.message);
          console.error("Error fetching race:", raceError);
          return;
        }

        if (!raceData) {
          setError("Race not found");
          return;
        }

        setRace(raceData);

        // Fetch all riders if there are participants
        if (raceData.participants && raceData.participants.length > 0) {
          const { data: riderData, error: riderError } = await supabase
            .from("riders")
            .select("*")
            .in("uuid", raceData.participants);

          if (riderError) {
            console.error("Error fetching riders:", riderError);
          } else {
            const riderMap = new Map<string, Rider>();
            riderData?.forEach((rider) => {
              riderMap.set(rider.uuid, rider);
            });
            setRiders(riderMap);
          }
        }
      } catch (err: any) {
        setError("An unexpected error occurred");
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRaceData();
  }, [raceId]);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <Loader />
      </section>
    );
  }

  if (error || !race) {
    return (
      <section className="container mx-auto px-4 py-12 min-h-screen">
        <div className="text-center">
          <h1 className="mb-4 leter-spacing-1 text-5xl font-bold">
            Race Not Found
          </h1>
          <p className="text-red-500 mb-4">{error || "Race not found"}</p>
          <Link
            href="/calendar"
            className="text-purple-600 hover:text-purple-800 hover:underline"
          >
            ← Back to Calendar
          </Link>
        </div>
      </section>
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
  ) => {
    if (!participantUuids || participantUuids.length === 0) {
      return [];
    }

    return participantUuids
      .map((uuid) => {
        const rider = riders.get(uuid);
        if (rider && rider.isEmailConfirmed) {
          const firstName = rider.firstName || "";
          const lastName = rider.lastName || "";
          return { uuid, name: `${firstName} ${lastName}`.trim() || uuid };
        }
        return null;
      })
      .filter((item): item is { uuid: string; name: string } => item !== null && item.name !== "");
  };

  const handleToggleRegistration = async () => {
    if (!user) {
      toast.error("Please log in to register for races");
      router.push("/?login=true");
      return;
    }

    if (!race) return;

    setUpdating(true);
    try {
      const currentParticipants = race.participants || [];
      let newParticipants: string[];

      if (isRegistered) {
        // Unregister: remove user from participants
        newParticipants = currentParticipants.filter((id) => id !== user.id);
      } else {
        // Register: add user to participants
        newParticipants = [...currentParticipants, user.id];
      }

      const { error: updateError } = await supabase
        .from("race_calendar")
        .update({ participants: newParticipants })
        .eq("id", raceId);

      if (updateError) {
        toast.error(updateError.message || "Failed to update registration");
        console.error("Error updating race:", updateError);
      } else {
        // Update local state
        setRace({ ...race, participants: newParticipants });

        // If registering, only fetch the new rider's data if not already loaded
        if (!isRegistered && user && !riders.has(user.id)) {
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
          isRegistered
            ? "Successfully unregistered from race"
            : "Successfully registered for race"
        );
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred");
      console.error("Unexpected error:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = () => {
    if (!race || !isAdmin) return;
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!race) return;

    setDeleting(true);
    try {
      const { error: deleteError } = await supabase
        .from("race_calendar")
        .delete()
        .eq("id", raceId);

      if (deleteError) {
        toast.error(deleteError.message || "Failed to delete race");
        console.error("Error deleting race:", deleteError);
        setShowDeleteModal(false);
      } else {
        toast.success("Race deleted successfully!");
        setShowDeleteModal(false);
        // Redirect to calendar page after a short delay
        setTimeout(() => {
          router.push("/calendar");
        }, 1000);
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred");
      console.error("Unexpected error:", err);
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <section className="container mx-auto px-4 py-6 md:py-12 min-h-screen">
      <div className="mb-4 md:mb-6">
        <NavigationLink href="/calendar">
          <Button
            variant="text"
            placeholder={""}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 p-0"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="text-sm md:text-base">Back to Calendar</span>
          </Button>
        </NavigationLink>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="leter-spacing-1 text-5xl font-bold">
                {race.name}
              </h1>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <>
                    <NavigationLink href={`/calendar/${raceId}/edit`}>
                      <Button
                        variant="outlined"
                        placeholder={""}
                        className="flex items-center gap-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                      >
                        <PencilIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                    </NavigationLink>
                    <Button
                      variant="outlined"
                      placeholder={""}
                      onClick={handleDeleteClick}
                      disabled={deleting}
                      className="flex items-center gap-2 border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </>
                )}
                {user && (
                  <button
                    onClick={handleToggleRegistration}
                    disabled={updating}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                      isRegistered
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={
                      isRegistered
                        ? "Unregister from race"
                        : "Register for race"
                    }
                  >
                    {updating ? (
                      <Loader />
                    ) : isRegistered ? (
                      <>
                        <MinusIcon className="h-5 w-5" />
                        <span>Unregister</span>
                      </>
                    ) : (
                      <>
                        <PlusIcon className="h-5 w-5" />
                        <span>Register</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="text-lg">{formatDate(race.event_date)}</span>
              {race.location && (
                <span className="text-lg text-gray-600">• {race.location}</span>
              )}
              <span className={`px-3 py-1 rounded-full font-semibold text-sm ${getRaceTypeBadgeClasses(race.race_type)}`}>
                {formatRaceType(race.race_type)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {race.distance_km && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">
                  Distance
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {race.distance_km} km
                </p>
              </div>
            )}

            {race.elevation_m && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">
                  Elevation
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {race.elevation_m} m
                </p>
              </div>
            )}
          </div>

          {race.profile && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Profile
              </h3>
              <p className="text-gray-700">{race.profile}</p>
            </div>
          )}

          {race.url && (
            <div className="mb-6">
              <Link
                href={race.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                View Event Page →
              </Link>
            </div>
          )}

          {(() => {
            const confirmedParticipants = race.participants?.filter((uuid) => {
              const rider = riders.get(uuid);
              return rider && rider.isEmailConfirmed;
            }) || [];
            const participantNames = getParticipantNames(confirmedParticipants);
            
            return participantNames.length > 0 ? (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Participants ({participantNames.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {participantNames.map((participant) => (
                    <span
                      key={participant.uuid}
                      className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {participant.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-gray-500">No confirmed participants registered yet.</p>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Race"
        message={`Are you sure you want to delete "${race?.name}"? This action cannot be undone and all associated data will be permanently removed.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
        loading={deleting}
      />
    </section>
  );
}
