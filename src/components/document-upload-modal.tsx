"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/utils/supabase";
import { DocumentUploadSection } from "./document-upload-section";
import { XMarkIcon } from "@heroicons/react/24/solid";

export function DocumentUploadModal() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowModal(false);
      return;
    }

    // Skip showing only after successful upload in this browser session.
    const modalAcknowledged = sessionStorage.getItem(
      "registrationFormModalCompleted"
    );
    if (modalAcknowledged === "true") {
      return;
    }

    // Fetch rider data to check if registration form is uploaded.
    const fetchRiderData = async () => {
      try {
        const { data, error } = await supabase
          .schema("private")
          .from("riders")
          .select("registrationFormUrl")
          .eq("uuid", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching rider data:", error);
          return;
        }

        const hasUploaded = data?.registrationFormUrl != null;

        if (!hasUploaded) {
          setShowModal(true);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchRiderData();
  }, [user]);

  const handleClose = () => {
    setShowModal(false);
  };

  // Listen for document upload completion
  useEffect(() => {
    const handleDocumentUploaded = () => {
      sessionStorage.setItem("registrationFormModalCompleted", "true");
      handleClose();
    };

    window.addEventListener("documentUploaded", handleDocumentUploaded);

    return () => {
      window.removeEventListener("documentUploaded", handleDocumentUploaded);
    };
  }, []);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Complete Your Membership
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            To complete your membership in the NRC International Team, please
            upload the required documents.
          </p>
          <DocumentUploadSection />
        </div>
      </div>
    </div>
  );
}
