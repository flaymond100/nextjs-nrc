import { supabase } from "./supabase";

/**
 * Uploads an image file to Supabase Storage
 * @param file - The image file to upload
 * @param userId - The user's UUID
 * @param bucketName - The storage bucket name (default: "avatars")
 * @returns The public URL of the uploaded file, or null if upload fails
 */
export async function uploadAvatar(
  file: File,
  userId: string,
  bucketName: string = "avatars"
): Promise<string | null> {
  try {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image size must be less than 5MB");
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Please select a valid image file");
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${bucketName}/${fileName}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return publicUrl;
  } catch (error: any) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
}

/**
 * Deletes an avatar from Supabase Storage
 * @param fileUrl - The public URL of the file to delete
 * @param bucketName - The storage bucket name (default: "avatars")
 */
export async function deleteAvatar(
  fileUrl: string,
  bucketName: string = "avatars"
): Promise<void> {
  try {
    // Extract file path from URL
    const urlParts = fileUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `${bucketName}/${fileName}`;

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error("Error deleting avatar:", error);
      throw error;
    }
  } catch (error: any) {
    console.error("Error deleting avatar:", error);
    throw error;
  }
}

/**
 * Uploads an image file to Supabase Storage for news articles
 * @param file - The image file to upload
 * @param userId - The user's UUID
 * @param bucketName - The storage bucket name (default: "news-images", falls back to "avatars")
 * @returns The public URL of the uploaded file, or null if upload fails
 */
export async function uploadNewsImage(
  file: File,
  userId: string,
  bucketName: string = "news-images"
): Promise<string | null> {
  try {
    // Validate file size (max 10MB for news images)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("Image size must be less than 10MB");
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Please select a valid image file");
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `news-${userId}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    // Try to upload to the specified bucket first
    let uploadError = null;
    let actualBucket = bucketName;

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    uploadError = error;

    // If bucket doesn't exist, fallback to avatars bucket
    if (uploadError && uploadError.message?.includes("Bucket not found")) {
      console.warn(
        `Bucket "${bucketName}" not found, falling back to "avatars" bucket`
      );
      actualBucket = "avatars";

      const { error: fallbackError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (fallbackError) {
        console.error("Upload error (fallback):", fallbackError);
        throw new Error(
          `Failed to upload image. Please create a "${bucketName}" bucket in Supabase Storage, or contact an administrator.`
        );
      }
    } else if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(actualBucket).getPublicUrl(filePath);

    return publicUrl;
  } catch (error: any) {
    console.error("Error uploading news image:", error);
    // Provide user-friendly error message
    if (error.message?.includes("Bucket not found")) {
      throw new Error(
        `Storage bucket "${bucketName}" not found. Please create it in Supabase Dashboard > Storage, or contact an administrator.`
      );
    }
    throw error;
  }
}
