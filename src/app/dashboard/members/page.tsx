"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { Rider } from "@/utils/types";
import { Loader } from "@/components/loader";
import { useAdmin } from "@/hooks/use-admin";
import { ConfirmModal } from "@/components/confirm-modal";
import toast from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/solid";

export default function MembersPage() {
  const [members, setMembers] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      router.push("/dashboard/profile");
    }
  }, [isAdmin, adminLoading, router]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Rider | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingPaid, setUpdatingPaid] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMembers() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("riders")
          .select("*")
          .order("firstName", { ascending: true });

        if (error) {
          setError(error.message);
          console.error("Error fetching members:", error);
        } else {
          setMembers(data || []);
        }
      } catch (err: any) {
        setError("An unexpected error occurred");
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, []);

  const handleTogglePaid = async (member: Rider) => {
    if (!isAdmin) {
      toast.error("You don't have permission to perform this action");
      return;
    }

    setUpdatingPaid(member.uuid);
    try {
      const { error } = await supabase
        .from("riders")
        .update({ isPaid: !member.isPaid })
        .eq("uuid", member.uuid);

      if (error) {
        toast.error(error.message || "Failed to update payment status");
        console.error("Error updating payment status:", error);
      } else {
        // Update local state
        setMembers((prev) =>
          prev.map((m) =>
            m.uuid === member.uuid ? { ...m, isPaid: !m.isPaid } : m
          )
        );
        toast.success(
          `Payment status updated to ${!member.isPaid ? "Paid" : "Unpaid"}`
        );
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred");
      console.error("Unexpected error:", err);
    } finally {
      setUpdatingPaid(null);
    }
  };

  const handleDeleteClick = (member: Rider) => {
    if (!isAdmin) {
      toast.error("You don't have permission to perform this action");
      return;
    }
    setMemberToDelete(member);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete || !isAdmin) return;

    setDeleting(true);
    try {
      // Delete from riders table first
      const { error: riderError } = await supabase
        .from("riders")
        .delete()
        .eq("uuid", memberToDelete.uuid);

      if (riderError) {
        toast.error(
          riderError.message || "Failed to delete member from riders table"
        );
        console.error("Error deleting rider:", riderError);
        setDeleting(false);
        return;
      }

      // Delete user from auth.users using RPC function
      const { error: authError } = await supabase.rpc("admin_delete_user", {
        target_uuid: memberToDelete.uuid,
      });

      if (authError) {
        toast.error(authError.message || "Failed to delete user from auth");
        console.error("Error deleting user from auth:", authError);
        // Note: Rider is already deleted, but auth user deletion failed
        // Still update UI since rider is gone
      }

      // Remove from local state
      setMembers((prev) => prev.filter((m) => m.uuid !== memberToDelete.uuid));
      toast.success("Member deleted successfully");
      setDeleteModalOpen(false);
      setMemberToDelete(null);
    } catch (err: any) {
      toast.error("An unexpected error occurred");
      console.error("Unexpected error:", err);
    } finally {
      setDeleting(false);
    }
  };

  if (adminLoading || loading) {
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
          <p className="text-red-500">Error loading members: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Members</h1>
        <p className="text-gray-600 mt-2">View and manage all team members</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Confirmed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 7 : 6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No members found
                  </td>
                </tr>
              ) : (
                members.map((member) => {
                  // Get email from auth.users table if needed
                  // For now, we'll show what we have from riders table
                  const fullName = `${member.firstName || ""} ${
                    member.lastName || ""
                  }`.trim();

                  return (
                    <tr key={member.uuid} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {member.avatarUrl ? (
                            <img
                              className="h-10 w-10 rounded-full mr-3"
                              src={member.avatarUrl}
                              alt={fullName || "Member"}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold mr-3">
                              {(member.firstName?.[0] || "").toUpperCase()}
                            </div>
                          )}
                          <div className="text-sm font-medium text-gray-900">
                            {fullName || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {member.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            member.isEmailConfirmed
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {member.isEmailConfirmed ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isAdmin ? (
                          <button
                            onClick={() => handleTogglePaid(member)}
                            disabled={updatingPaid === member.uuid}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                              member.isPaid
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            title="Click to toggle payment status"
                          >
                            {updatingPaid === member.uuid ? (
                              <Loader />
                            ) : member.isPaid ? (
                              "Yes"
                            ) : (
                              "No"
                            )}
                          </button>
                        ) : (
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              member.isPaid
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {member.isPaid ? "Yes" : "No"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            member.is_admin
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {member.is_admin ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.updateAt
                          ? new Date(member.updateAt).toLocaleDateString()
                          : "-"}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDeleteClick(member)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete member"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Total members: {members.length}
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setMemberToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Member"
        message={
          memberToDelete
            ? `Are you sure you want to delete ${memberToDelete.firstName || ""} ${memberToDelete.lastName || ""} (${memberToDelete.email})? This action cannot be undone.`
            : "Are you sure you want to delete this member?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
        loading={deleting}
      />
    </div>
  );
}
