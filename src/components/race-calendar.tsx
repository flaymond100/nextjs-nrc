"use client";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/utils/supabase";
import { RaceCalendar, Rider } from "@/utils/types";
import { formatRaceType, getRaceTypeBadgeClasses } from "@/utils/race-types";
import { Loader } from "./loader";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { NavigationLink } from "./navigation-link";
import { useAdmin } from "@/hooks/use-admin";
import { ConfirmModal } from "./confirm-modal";

// Custom profile icon components
interface ProfileIconProps {
  className?: string;
  title?: string;
}

const FlatProfileIcon = ({
  className = "h-5 w-5",
  title,
}: ProfileIconProps) => (
  <div className={className} title={title}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
      style={{ transform: "rotate(90deg)" }}
    >
      {/* Road edges */}
      <line x1="2" y1="5" x2="22" y2="5" />
      <line x1="2" y1="19" x2="22" y2="19" />
      {/* Road center line */}
      <line x1="4" y1="12" x2="6" y2="12" />
      <line x1="9" y1="12" x2="11" y2="12" />
      <line x1="13" y1="12" x2="15" y2="12" />
      <line x1="18" y1="12" x2="20" y2="12" />
    </svg>
  </div>
);

const HillyProfileIcon = ({
  className = "h-5 w-5",
  title,
}: ProfileIconProps) => (
  <div className={className} title={title}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M1 18 L6 12 L12 18 L14 12 L18 18 L24 12" />
    </svg>
  </div>
);

const MountainProfileIcon = ({
  className = "h-5 w-5",
  title,
}: ProfileIconProps) => (
  <div className={className} title={title}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M2 20 L8 6 L12 12 L16 4 L22 20" />
    </svg>
  </div>
);

const RollingProfileIcon = ({
  className = "h-5 w-5",
  title,
}: ProfileIconProps) => (
  <div className={className} title={title}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M2 12 Q6 8 10 12 T18 12 T22 12" />
    </svg>
  </div>
);

interface FilterState {
  search: string;
  dateFilter: "all" | "upcoming" | "past";
  location: string;
  series: string;
  profile: string;
  registeredOnly: boolean;
}

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

  // Filter and pagination state
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    dateFilter: "all",
    location: "",
    series: "",
    profile: "",
    registeredOnly: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

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

  // Helper function to get profile type - must be defined before use
  const getProfileType = (
    profile: string | null | undefined
  ): string | null => {
    if (!profile) return null;

    const trimmed = profile.trim();

    // Check for exact matches first (for dropdown values)
    const validTypes = ["Flat", "Hilly", "Mountain", "Rolling"];
    if (validTypes.includes(trimmed)) {
      return trimmed;
    }

    // Normalize to lowercase for comparison
    const normalized = trimmed.toLowerCase();

    // Map common profile descriptions to standardized types
    const profileMap: Record<string, string> = {
      flat: "Flat",
      hilly: "Hilly",
      mountain: "Mountain",
      mountainous: "Mountain",
      rolling: "Rolling",
    };

    // Check if it matches a known profile type
    for (const [key, value] of Object.entries(profileMap)) {
      if (normalized.includes(key)) {
        return value;
      }
    }

    // If it looks like a URL, return null (we don't display URLs)
    if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
      return null;
    }

    // Otherwise, capitalize first letter of each word
    return trimmed
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Get unique values for filter dropdowns
  const uniqueLocations = Array.from(
    new Set(races.map((r) => r.location).filter(Boolean))
  ).sort() as string[];
  const uniqueSeries = Array.from(
    new Set(races.map((r) => r.series).filter(Boolean))
  ).sort() as string[];
  const uniqueProfiles = Array.from(
    new Set(
      races
        .map((r) => getProfileType(r.profile))
        .filter((p): p is string => p !== null)
    )
  ).sort();

  // Filter races based on filter state
  const filteredRaces = races.filter((race) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        race.name.toLowerCase().includes(searchLower) ||
        race.location?.toLowerCase().includes(searchLower) ||
        race.series?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Date filter
    if (filters.dateFilter !== "all") {
      const raceDate = new Date(race.event_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      raceDate.setHours(0, 0, 0, 0);

      if (filters.dateFilter === "upcoming" && raceDate < today) return false;
      if (filters.dateFilter === "past" && raceDate >= today) return false;
    }

    // Location filter
    if (filters.location && race.location !== filters.location) return false;

    // Series filter
    if (filters.series && race.series !== filters.series) return false;

    // Profile filter
    if (filters.profile) {
      const raceProfile = getProfileType(race.profile);
      if (raceProfile !== filters.profile) return false;
    }

    // Registered only filter
    if (filters.registeredOnly && user) {
      if (!race.participants?.includes(user.id)) return false;
    }

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRaces.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRaces = filteredRaces.slice(startIndex, endIndex);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      dateFilter: "all",
      location: "",
      series: "",
      profile: "",
      registeredOnly: false,
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== false && value !== "all"
  );

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

  // Check if a race is in the past
  const isPastRace = (race: RaceCalendar): boolean => {
    const raceDate = new Date(race.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    raceDate.setHours(0, 0, 0, 0);
    return raceDate < today;
  };

  // Map profile types to appropriate custom icons
  const profileIconMap: Record<
    string,
    React.ComponentType<{ className?: string; title?: string }>
  > = {
    Flat: FlatProfileIcon,
    Hilly: HillyProfileIcon,
    Mountain: MountainProfileIcon,
    Rolling: RollingProfileIcon,
  };

  const getProfileIcon = (profileType: string | null) => {
    if (!profileType) return null;
    return profileIconMap[profileType] || null;
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
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="bg-white rounded-lg border border-gray-200  shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div className="xl:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search races..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <select
              value={filters.dateFilter}
              onChange={(e) => handleFilterChange("dateFilter", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Dates</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Series Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Series
            </label>
            <select
              value={filters.series}
              onChange={(e) => handleFilterChange("series", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Series</option>
              {uniqueSeries.map((series) => (
                <option key={series} value={series}>
                  {series}
                </option>
              ))}
            </select>
          </div>

          {/* Profile Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile
            </label>
            <select
              value={filters.profile}
              onChange={(e) => handleFilterChange("profile", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Profiles</option>
              {uniqueProfiles.map((profile) => (
                <option key={profile} value={profile}>
                  {profile}
                </option>
              ))}
            </select>
          </div>

          {/* Registered Only Filter */}
          {user && (
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.registeredOnly}
                  onChange={(e) =>
                    handleFilterChange("registeredOnly", e.target.checked)
                  }
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  My Races Only
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table
          className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg"
          style={{ tableLayout: "fixed" }}
        >
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                style={{ width: "20%" }}
              >
                Race Name
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                style={{ width: "10%" }}
              >
                Series
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Location
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Type
            </th> */}

              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                style={{ width: "10%" }}
              >
                Distance
              </th>
              {/* <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Profile
            </th> */}
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
            {paginatedRaces.length === 0 ? (
              <tr>
                <td
                  colSpan={7 + (user ? 1 : 0) + (isAdmin ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No races match your filters. Try adjusting your search
                  criteria.
                </td>
              </tr>
            ) : (
              paginatedRaces.map((race) => {
                const isPast = isPastRace(race);
                return (
                  <tr
                    key={race.id}
                    className={`${isPast ? "opacity-60 bg-gray-50" : "hover:bg-gray-50"}`}
                  >
                    <td className="px-6 py-4" style={{ width: "20%" }}>
                      <NavigationLink
                        href={`/calendar/${race.id}`}
                        className={`text-sm font-medium break-words ${
                          isPast
                            ? "text-gray-500 hover:text-gray-700 hover:underline"
                            : "text-purple-600 hover:text-purple-800 hover:underline"
                        }`}
                      >
                        {race.name}
                      </NavigationLink>
                    </td>
                    <td className="px-6 py-4">
                      {race.series_image ? (
                        <img
                          src={race.series_image}
                          alt={race.series || "Series"}
                          className="h-8 w-auto max-w-28 object-contain"
                        />
                      ) : race.series ? (
                        <div
                          className={`text-sm ${isPast ? "text-gray-500" : "text-gray-900"}`}
                        >
                          {race.series}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm ${isPast ? "text-gray-500" : "text-gray-900"}`}
                      >
                        {formatDate(race.event_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 ">
                      <div
                        className={`text-sm ${isPast ? "text-gray-500" : "text-gray-900"}`}
                      >
                        {race.location || "-"}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex text-xs leading-5 ${getRaceTypeBadgeClasses(race.race_type)}`}
                >
                  {formatRaceType(race.race_type)}
                </span>
              </td> */}

                    <td className="px-6 gap-2 items-center py-6 flex">
                      <div className="flex items-center justify-center gap-2">
                        {(() => {
                          const profileType = getProfileType(race.profile);
                          const IconComponent = profileType
                            ? getProfileIcon(profileType)
                            : null;
                          return profileType && IconComponent ? (
                            <div className="relative group inline-flex items-center">
                              <IconComponent className="h-5 w-5 text-gray-600 cursor-help" />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                                {profileType}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          );
                        })()}
                      </div>
                      <div
                        className={`text-sm ${isPast ? "text-gray-500" : "text-gray-900"}`}
                      >
                        {race.distance_km
                          ? race.elevation_m
                            ? `${race.distance_km} km (${race.elevation_m}m)`
                            : `${race.distance_km} km`
                          : null}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {race.url ? (
                        <Link
                          href={race.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={
                            isPast
                              ? "text-gray-400 hover:text-gray-600 hover:underline"
                              : "text-purple-600 hover:text-purple-800 hover:underline"
                          }
                        >
                          Event
                        </Link>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm text-center ${isPast ? "text-gray-500" : "text-gray-900"}`}
                    >
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4">
        <div className="text-sm text-gray-600">
          {/* Showing {paginatedRaces.length} of {filteredRaces.length} races */}
          {/* {totalPages > 1 && `Page ${currentPage} of ${totalPages}`} */}
          <div className="flex items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
            >
              <ChevronLeftIcon className="h-5 w-5" />
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (page === 1 || page === totalPages) return true;
                  if (Math.abs(page - currentPage) <= 1) return true;
                  return false;
                })
                .map((page, index, array) => {
                  // Add ellipsis if there's a gap
                  const showEllipsisBefore =
                    index > 0 && page - array[index - 1] > 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsisBefore && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 border rounded-lg ${
                          currentPage === page
                            ? "bg-purple-600 text-white border-purple-600"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
            >
              Next
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
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
