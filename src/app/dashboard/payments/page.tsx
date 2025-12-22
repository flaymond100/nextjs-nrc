"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { PaymentOverview } from "@/utils/types";
import { Loader } from "@/components/loader";
import { useAdmin } from "@/hooks/use-admin";
import toast from "react-hot-toast";
import { CheckIcon, XMarkIcon, CalendarIcon } from "@heroicons/react/24/solid";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const [processingPayment, setProcessingPayment] = useState<string | null>(
    null
  );
  const [filters, setFilters] = useState({
    status: "all" as "all" | "overdue" | "due_soon" | "current" | "no_info",
    search: "",
  });
  const [datePickerModal, setDatePickerModal] = useState<{
    isOpen: boolean;
    type: "payment" | "contract";
    riderUuid: string | null;
    defaultDate?: string;
  }>({
    isOpen: false,
    type: "payment",
    riderUuid: null,
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      router.push("/dashboard/profile");
    }
  }, [isAdmin, adminLoading, router]);

  useEffect(() => {
    async function fetchPayments() {
      try {
        setLoading(true);
        // Fetch payment data from riders table
        const { data, error } = await supabase
          .from("riders")
          .select(
            "uuid, email, firstName, lastName, contractStartDate, lastPaymentDate, nextPaymentDueDate, isPaid, paymentAmount"
          )
          .eq("isEmailConfirmed", true)
          .order("nextPaymentDueDate", { ascending: true, nullsFirst: false });

        if (error) {
          setError(error.message);
          console.error("Error fetching payments:", error);
        } else {
          // Calculate payment status and days overdue on the client side
          const paymentsWithStatus: PaymentOverview[] = (data || []).map(
            (rider) => {
              let payment_status: PaymentOverview["payment_status"] =
                "No payment info";
              let days_overdue = 0;

              // If unpaid, mark as overdue (unless they have a future due date)
              if (!rider.isPaid) {
                if (rider.nextPaymentDueDate) {
                  const dueDate = new Date(rider.nextPaymentDueDate);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  dueDate.setHours(0, 0, 0, 0);
                  const daysDiff = Math.floor(
                    (today.getTime() - dueDate.getTime()) /
                      (1000 * 60 * 60 * 24)
                  );

                  // If due date is in the past or today, it's overdue
                  if (daysDiff >= 0) {
                    payment_status = "Overdue";
                    days_overdue = Math.max(0, daysDiff);
                  } else {
                    // Future due date but unpaid - still mark as overdue
                    payment_status = "Overdue";
                    days_overdue = 0;
                  }
                } else {
                  // Unpaid and no due date - mark as overdue
                  payment_status = "Overdue";
                  days_overdue = 0;
                }
              } else if (rider.nextPaymentDueDate) {
                // Paid but check if next payment is due
                const dueDate = new Date(rider.nextPaymentDueDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                dueDate.setHours(0, 0, 0, 0);
                const daysDiff = Math.floor(
                  (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
                );

                if (daysDiff > 0) {
                  payment_status = "Overdue";
                  days_overdue = daysDiff;
                } else if (daysDiff <= 30 && daysDiff >= 0) {
                  payment_status = "Due Soon";
                } else {
                  payment_status = "Current";
                }
              }

              return {
                ...rider,
                payment_status,
                days_overdue,
              };
            }
          );

          setPayments(paymentsWithStatus);
        }
      } catch (err: any) {
        setError("An unexpected error occurred");
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (isAdmin) {
      fetchPayments();
    }
  }, [isAdmin]);

  const openDatePicker = (
    type: "payment" | "contract",
    riderUuid: string,
    defaultDate?: string
  ) => {
    setDatePickerModal({
      isOpen: true,
      type,
      riderUuid,
      defaultDate,
    });
  };

  const closeDatePicker = () => {
    setDatePickerModal({
      isOpen: false,
      type: "payment",
      riderUuid: null,
    });
  };

  const handleDatePickerConfirm = (selectedDate: string) => {
    if (!datePickerModal.riderUuid) return;

    if (datePickerModal.type === "payment") {
      handleRecordPayment(datePickerModal.riderUuid, selectedDate);
    } else {
      handleSetContractStart(datePickerModal.riderUuid, selectedDate);
    }
    closeDatePicker();
  };

  const handleRecordPayment = async (
    riderUuid: string,
    paymentDate?: string
  ) => {
    if (!isAdmin) {
      toast.error("You don't have permission to perform this action");
      return;
    }

    setProcessingPayment(riderUuid);
    try {
      const today = paymentDate || new Date().toISOString().split("T")[0];
      const paymentDateObj = new Date(today);

      // Get current rider data (to verify rider exists)
      const { error: fetchError } = await supabase
        .from("riders")
        .select("uuid")
        .eq("uuid", riderUuid)
        .single();

      if (fetchError) {
        toast.error(fetchError.message || "Failed to fetch rider data");
        return;
      }

      // Calculate next payment due date (6 months from payment date)
      const nextDueDate = new Date(paymentDateObj);
      nextDueDate.setMonth(nextDueDate.getMonth() + 6);

      // Update rider record
      const { error: updateError } = await supabase
        .from("riders")
        .update({
          isPaid: true,
          lastPaymentDate: today,
          nextPaymentDueDate: nextDueDate.toISOString().split("T")[0],
        })
        .eq("uuid", riderUuid);

      if (updateError) {
        toast.error(updateError.message || "Failed to record payment");
        console.error("Error recording payment:", updateError);
      } else {
        // Refresh payments list
        const { data: updatedRider } = await supabase
          .from("riders")
          .select(
            "uuid, email, firstName, lastName, contractStartDate, lastPaymentDate, nextPaymentDueDate, isPaid, paymentAmount"
          )
          .eq("uuid", riderUuid)
          .single();

        if (updatedRider) {
          setPayments((prev) =>
            prev.map((p) =>
              p.uuid === riderUuid
                ? {
                    ...p,
                    isPaid: true,
                    lastPaymentDate: today,
                    nextPaymentDueDate: nextDueDate.toISOString().split("T")[0],
                    payment_status: "Current",
                    days_overdue: 0,
                  }
                : p
            )
          );
        }

        toast.success("Payment recorded successfully!");
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred");
      console.error("Unexpected error:", err);
    } finally {
      setProcessingPayment(null);
    }
  };

  const handleSetContractStart = async (
    riderUuid: string,
    startDate: string
  ) => {
    if (!isAdmin) {
      toast.error("You don't have permission to perform this action");
      return;
    }

    try {
      // Calculate next payment due date (6 months from start date)
      const startDateObj = new Date(startDate);
      const nextDueDate = new Date(startDateObj);
      nextDueDate.setMonth(nextDueDate.getMonth() + 6);

      const { error } = await supabase
        .from("riders")
        .update({
          contractStartDate: startDate,
          nextPaymentDueDate: nextDueDate.toISOString().split("T")[0],
        })
        .eq("uuid", riderUuid);

      if (error) {
        toast.error(error.message || "Failed to set contract start date");
        console.error("Error setting contract start date:", error);
      } else {
        setPayments((prev) =>
          prev.map((p) =>
            p.uuid === riderUuid
              ? {
                  ...p,
                  contractStartDate: startDate,
                  nextPaymentDueDate: nextDueDate.toISOString().split("T")[0],
                  payment_status: "Current",
                }
              : p
          )
        );
        toast.success("Contract start date set successfully!");
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred");
      console.error("Unexpected error:", err);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeClass = (status: PaymentOverview["payment_status"]) => {
    switch (status) {
      case "Overdue":
        return "bg-red-100 text-red-800";
      case "Due Soon":
        return "bg-yellow-100 text-yellow-800";
      case "Current":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPayments = payments.filter((payment) => {
    if (filters.status !== "all") {
      const statusMap = {
        overdue: "Overdue",
        due_soon: "Due Soon",
        current: "Current",
        no_info: "No payment info",
      };
      if (payment.payment_status !== statusMap[filters.status]) return false;
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const fullName =
        `${payment.firstName || ""} ${payment.lastName || ""}`.toLowerCase();
      const email = payment.email.toLowerCase();
      if (!fullName.includes(searchLower) && !email.includes(searchLower)) {
        return false;
      }
    }

    return true;
  });

  if (loading || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500">Error loading payments: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Payments</h1>
        <p className="text-gray-600 mt-2">
          Manage member payments (60 EUR per 6 months)
        </p>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600">Total Members</div>
          <div className="text-2xl font-bold text-gray-900">
            {payments.length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600">Overdue</div>
          <div className="text-2xl font-bold text-red-600">
            {payments.filter((p) => p.payment_status === "Overdue").length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600">Due Soon</div>
          <div className="text-2xl font-bold text-yellow-600">
            {payments.filter((p) => p.payment_status === "Due Soon").length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600">Current</div>
          <div className="text-2xl font-bold text-green-600">
            {payments.filter((p) => p.payment_status === "Current").length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Filter
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value as any })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="overdue">Overdue</option>
              <option value="due_soon">Due Soon</option>
              <option value="current">Current</option>
              <option value="no_info">No Payment Info</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              placeholder="Search by name or email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Start
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No payments found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.uuid}
                    className={`${
                      payment.payment_status === "Overdue"
                        ? "bg-red-50"
                        : payment.payment_status === "Due Soon"
                          ? "bg-yellow-50"
                          : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.firstName} {payment.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(payment.contractStartDate)}
                      </div>
                      {!payment.contractStartDate && (
                        <button
                          onClick={() => {
                            const today = new Date()
                              .toISOString()
                              .split("T")[0];
                            openDatePicker("contract", payment.uuid, today);
                          }}
                          className="text-xs text-purple-600 hover:text-purple-800 mt-1"
                        >
                          Set start date
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(payment.lastPaymentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(payment.nextPaymentDueDate)}
                      </div>
                      {payment.days_overdue > 0 && (
                        <div className="text-xs text-red-600">
                          {payment.days_overdue} days overdue
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                          payment.payment_status
                        )}`}
                      >
                        {payment.payment_status}
                      </span>
                      <div className="mt-1">
                        {payment.isPaid ? (
                          <span className="inline-flex items-center text-xs text-green-600">
                            <CheckIcon className="h-4 w-4 mr-1" />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs text-red-600">
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Unpaid
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => {
                          const today = new Date().toISOString().split("T")[0];
                          openDatePicker("payment", payment.uuid, today);
                        }}
                        disabled={processingPayment === payment.uuid}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingPayment === payment.uuid ? (
                          <Loader />
                        ) : (
                          <>
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            Record Payment
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Date Picker Modal */}
      {datePickerModal.isOpen && (
        <DatePickerModal
          isOpen={datePickerModal.isOpen}
          onClose={closeDatePicker}
          onConfirm={handleDatePickerConfirm}
          title={
            datePickerModal.type === "payment"
              ? "Record Payment"
              : "Set Contract Start Date"
          }
          defaultDate={datePickerModal.defaultDate}
          label={
            datePickerModal.type === "payment"
              ? "Payment Date"
              : "Contract Start Date"
          }
        />
      )}
    </div>
  );
}

// Date Picker Modal Component
interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
  title: string;
  label: string;
  defaultDate?: string;
}

function DatePickerModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  label,
  defaultDate,
}: DatePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState(
    defaultDate || new Date().toISOString().split("T")[0]
  );

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      onConfirm(selectedDate);
    }
  };

  return (
    <dialog
      open={isOpen}
      className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur-sm flex justify-center items-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Date Input */}
            <div className="mb-6">
              <label
                htmlFor="date-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {label}
              </label>
              <input
                id="date-input"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
                max={
                  title === "Record Payment"
                    ? new Date().toISOString().split("T")[0]
                    : undefined
                } // Don't allow future dates for payments, but allow for contract start
              />
              <p className="mt-2 text-xs text-gray-500">
                Select the date for this {title.toLowerCase()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
}
