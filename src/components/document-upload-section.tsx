"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/utils/supabase";
import {
  uploadDocumentToSupabase,
  updateRiderDocuments,
} from "@/utils/file-upload";
import toast from "react-hot-toast";
import { Button } from "@material-tailwind/react";
import { CheckCircleIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { Loader } from "./loader";

interface DocumentData {
  registrationFormUrl: string | null;
  sepaMandateUrl: string | null;
  documentsUploadedAt: string | null;
}

export const DocumentUploadSection = () => {
  const { user } = useAuth();
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingRegForm, setUploadingRegForm] = useState(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Check if email is confirmed
    setIsEmailConfirmed(!!user.email_confirmed_at);

    // Fetch document data from riders table
    const fetchDocuments = async () => {
      try {
        const { data, error } = await supabase
          .from("riders")
          .select("registrationFormUrl, sepaMandateUrl, documentsUploadedAt")
          .eq("uuid", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching documents:", error);
        } else if (data) {
          setDocumentData({
            registrationFormUrl: data.registrationFormUrl || null,
            sepaMandateUrl: data.sepaMandateUrl || null,
            documentsUploadedAt: data.documentsUploadedAt || null,
          });
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [user]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploadingRegForm(true);

    try {
      const result = await uploadDocumentToSupabase(
        file,
        user.id,
        "registration-form"
      );

      if (!result.success) {
        toast.error(result.error || "Upload failed");
        return;
      }

      const publicUrl = result.publicUrl || "";

      // Update the database
      const updateResult = await updateRiderDocuments(
        user.id,
        publicUrl,
        undefined
      );

      if (!updateResult.success) {
        toast.error(updateResult.error || "Failed to save document URL");
        return;
      }

      // Update local state
      setDocumentData((prev) => {
        if (!prev) {
          return {
            registrationFormUrl: publicUrl,
            sepaMandateUrl: null,
            documentsUploadedAt: new Date().toISOString(),
          };
        }
        return {
          registrationFormUrl: publicUrl,
          sepaMandateUrl: prev.sepaMandateUrl ?? null,
          documentsUploadedAt: new Date().toISOString(),
        };
      });

      toast.success("Registration form uploaded successfully");

      // Reset file input
      event.target.value = "";
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    } finally {
      setUploadingRegForm(false);
    }
  };

  if (!isEmailConfirmed) {
    return (
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          ⏳ Please confirm your email first to upload documents. Check your
          inbox for the confirmation link.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      {documentData?.registrationFormUrl ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-600">
              Registration form uploaded
            </span>
          </div>
          <div className="mb-2">
            <a
              href={documentData.registrationFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm flex items-center gap-1"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              View Uploaded Document
            </a>
          </div>
        </>
      ) : (
        <div>
          <h3 className="text-gray-700 font-bold mb-4">
            📋 Upload Signed Mitgliedsantrag (Registration Form)
          </h3>
          <span className="text-gray-600 text-sm mb-6">
            In order to complete your membership, please upload the signed
            <a
              href="https://osefawvokdseqiosdivb.supabase.co/storage/v1/object/public/docs/Mitgliedsantrag.pdf"
              target="_blank"
              download
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline text-sm"
            >
              📄 Mitgliedsantrag (Registration Form)
            </a>
          </span>

          <br />
          <p className="text-gray-600 text-sm mb-6">
            Once uploaded, we will review your documents and get back to you
            within 2-3 business days.{" "}
          </p>
          <div className="space-y-4">
            {/* Registration Form */}
            <div className="p-3 bg-white border border-gray-300 rounded">
              <div className="flex items-center justify-between mb-2">
                {documentData?.registrationFormUrl && (
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    <span className="text-xs text-green-600">Uploaded</span>
                  </div>
                )}
              </div>

              {documentData?.registrationFormUrl ? (
                <div className="mb-2">
                  <a
                    href={documentData.registrationFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    View Uploaded Document
                  </a>
                </div>
              ) : null}

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="registration-form-input"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e)}
                  disabled={uploadingRegForm}
                  className="text-sm"
                />
                {uploadingRegForm && <Loader />}
              </div>
              <p className="text-xs text-gray-500 mt-1">PDF or Word, max 3MB</p>
            </div>
          </div>
        </div>
      )}

      {documentData?.documentsUploadedAt && (
        <p className="text-xs text-gray-500 mt-4">
          Last updated:{" "}
          {new Date(documentData.documentsUploadedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};
