import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useAdmin } from "@/hooks/use-admin";
import { supabase } from "@/utils/supabase";
import { CampReservation, CampReservationStatus } from "@/utils/types";
import { Loader } from "@/components/loader";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Calpe Camp 2027 — limited to 15 places, first come first served (by deposit).
const CAMP_CAPACITY = 15;

const STATUS_OPTIONS: CampReservationStatus[] = [
  "pending",
  "confirmed",
  "waitlisted",
  "cancelled",
];

const STATUS_COLORS: Record<CampReservationStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  waitlisted: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

function formatEur(value: number): string {
  return `${value.toLocaleString("de-DE")} EUR`;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function CampReservationsPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<CampReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchReservations();
    }
  }, [user, authLoading, isAdmin]);

  const fetchReservations = async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("camp_reservations")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setReservations((data || []) as CampReservation[]);
    } catch (err: any) {
      console.error("Error fetching reservations:", err);
      setError(err.message || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePaid = async (r: CampReservation) => {
    if (!isAdmin) {
      toast.error("You don't have permission to perform this action");
      return;
    }
    setUpdatingId(r.id);
    try {
      const newPaid = !r.deposit_paid;
      const { data, error: updateError } = await supabase
        .from("camp_reservations")
        .update({
          deposit_paid: newPaid,
          deposit_paid_at: newPaid ? new Date().toISOString() : null,
        })
        .eq("id", r.id)
        .select();

      if (updateError) {
        toast.error(updateError.message || "Failed to update deposit status");
        console.error("Error updating deposit:", updateError);
      } else if (data && data.length > 0) {
        const updated = data[0] as CampReservation;
        setReservations((prev) =>
          prev.map((x) => (x.id === r.id ? { ...x, ...updated } : x))
        );
        toast.success(newPaid ? "Marked as paid" : "Marked as unpaid");
      } else {
        toast.error("Update may have failed. Check Row Level Security policies.");
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred");
      console.error("Unexpected error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = async (
    r: CampReservation,
    status: CampReservationStatus
  ) => {
    if (!isAdmin) {
      toast.error("You don't have permission to perform this action");
      return;
    }
    setUpdatingId(r.id);
    try {
      const { data, error: updateError } = await supabase
        .from("camp_reservations")
        .update({ status })
        .eq("id", r.id)
        .select();

      if (updateError) {
        toast.error(updateError.message || "Failed to update status");
        console.error("Error updating status:", updateError);
      } else if (data && data.length > 0) {
        const updated = data[0] as CampReservation;
        setReservations((prev) =>
          prev.map((x) => (x.id === r.id ? { ...x, ...updated } : x))
        );
        toast.success("Status updated");
      } else {
        toast.error("Update may have failed. Check Row Level Security policies.");
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred");
      console.error("Unexpected error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || adminLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (!isAdmin) return null; // Will redirect

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchReservations}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const total = reservations.length;
  const paidCount = reservations.filter((r) => r.deposit_paid).length;
  const placesLeft = Math.max(CAMP_CAPACITY - paidCount, 0);
  const doubleCount = reservations.filter(
    (r) => r.package_id === "double"
  ).length;
  const singleCount = reservations.filter(
    (r) => r.package_id === "single"
  ).length;

  const summary = [
    { label: "Registrations", value: String(total), note: "Total requests" },
    {
      label: "Deposits Paid",
      value: `${paidCount} / ${CAMP_CAPACITY}`,
      note: "Places secured",
    },
    {
      label: "Places Left",
      value: String(placesLeft),
      note: "Until camp is full",
    },
    {
      label: "Rooms",
      value: `${doubleCount} / ${singleCount}`,
      note: "Double / Single",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Calpe Camp 2027 — Reservations
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Who has registered and whether their deposit has been paid. Places are
          first come, first served — secured once the deposit is in.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {summary.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-lg shadow-md p-4 sm:p-5"
          >
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
              {s.label}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-700">
              {s.value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{s.note}</p>
          </div>
        ))}
      </div>

      {total === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">No reservations yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3 font-semibold">Participant</th>
                  <th className="px-4 py-3 font-semibold">Room</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Deposit</th>
                  <th className="px-4 py-3 font-semibold">Registered</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-center">
                    Deposit Paid
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reservations.map((r) => {
                  const name = `${r.first_name} ${r.last_name}`.trim();
                  const isUpdating = updatingId === r.id;
                  return (
                    <tr key={r.id} className="hover:bg-gray-50 align-top">
                      {/* Participant */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-800">
                          {name || "—"}
                        </div>
                        <div className="text-gray-500">{r.email}</div>
                        <div className="text-xs text-gray-400 mt-1 space-x-2">
                          {r.gender && <span>{r.gender}</span>}
                          <span>· DOB {formatDate(r.date_of_birth)}</span>
                        </div>
                        {r.package_id === "double" && (
                          <div className="text-xs text-gray-500 mt-1">
                            {r.roommate_preference ? (
                              <span>Shares with: {r.roommate_preference}</span>
                            ) : r.auto_allocate_by_gender ? (
                              <span>Auto-allocate by gender</span>
                            ) : (
                              <span className="text-gray-400">
                                No sharing preference
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Room */}
                      <td className="px-4 py-3 capitalize text-gray-700">
                        {r.package_id}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 text-gray-700">
                        {formatEur(r.price_eur)}
                      </td>

                      {/* Deposit */}
                      <td className="px-4 py-3 text-gray-700">
                        {formatEur(r.deposit_eur)}
                        {r.deposit_paid && r.deposit_paid_at && (
                          <div className="text-xs text-green-600">
                            paid {formatDate(r.deposit_paid_at)}
                          </div>
                        )}
                      </td>

                      {/* Registered */}
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {formatDate(r.created_at)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <select
                          value={r.status}
                          disabled={isUpdating}
                          onChange={(e) =>
                            handleStatusChange(
                              r,
                              e.target.value as CampReservationStatus
                            )
                          }
                          className={`text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-purple-300 ${
                            STATUS_COLORS[r.status]
                          }`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Deposit paid toggle */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleTogglePaid(r)}
                          disabled={isUpdating}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                            r.deposit_paid
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {isUpdating
                            ? "…"
                            : r.deposit_paid
                              ? "✓ Paid"
                              : "Mark paid"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
