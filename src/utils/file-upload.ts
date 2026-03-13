import { supabase } from "./supabase";
import toast from "react-hot-toast";

export interface FileUploadResult {
  success: boolean;
  publicUrl?: string;
  error?: string;
}

/**
 * Upload a file to Supabase storage
 * @param file - File to upload
 * @param userId - User's UUID
 * @param fileType - Type of file: 'registration-form' or 'sepa-mandate'
 */
export async function uploadDocumentToSupabase(
  file: File,
  userId: string,
  fileType: "registration-form" | "sepa-mandate"
): Promise<FileUploadResult> {
  try {
    // Validate file
    if (!file) {
      return { success: false, error: "No file selected" };
    }

    // Validate file type (PDF or Word)
    const allowedTypes = [
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    ];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Only PDF or Word files are allowed" };
    }

    // Validate file size (max 3MB)
    const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "File must be smaller than 3MB" };
    }

    // Create file path: userId/fileType_timestamp.ext
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop() || "pdf";
    const filePath = `${userId}/${fileType}_${timestamp}.${fileExt}`;

    // Upload file to Supabase
    const { data, error } = await supabase.storage
      .from("rider-documents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("rider-documents")
      .getPublicUrl(filePath);

    return {
      success: true,
      publicUrl: urlData.publicUrl,
    };
  } catch (err: any) {
    console.error("Unexpected error during upload:", err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred",
    };
  }
}

/**
 * Update rider's document URLs in the database
 */
export async function updateRiderDocuments(
  userId: string,
  registrationFormUrl?: string,
  sepaMandateUrl?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = {
      documentsUploadedAt: new Date().toISOString(),
    };

    if (registrationFormUrl) {
      updateData.registrationFormUrl = registrationFormUrl;
    }
    if (sepaMandateUrl) {
      updateData.sepaMandateUrl = sepaMandateUrl;
    }

    const { error } = await supabase
      .from("riders")
      .update(updateData)
      .eq("uuid", userId);

    if (error) {
      console.error("Database update error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Unexpected error updating rider documents:", err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred",
    };
  }
}

/**
 * Delete a document from Supabase storage
 * @param documentPath - Full path to document (e.g., "user-uuid/filename.pdf")
 */
export async function deleteDocument(
  documentPath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from("rider-documents")
      .remove([documentPath]);

    if (error) {
      console.error("Delete error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Unexpected error deleting document:", err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred",
    };
  }
}

/**
 * Get a signed URL for a private document (for admins/users to view)
 */
export async function getSignedDocumentUrl(
  documentPath: string,
  expiresIn: number = 3600 // 1 hour
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from("rider-documents")
      .createSignedUrl(documentPath, expiresIn);

    if (error) {
      console.error("Signed URL error:", error);
      return null;
    }

    return data.signedUrl;
  } catch (err: any) {
    console.error("Unexpected error getting signed URL:", err);
    return null;
  }
}
