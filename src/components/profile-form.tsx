"use client";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Loader } from "@/components/loader";
import { Button } from "@material-tailwind/react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { NavigationLink } from "./navigation-link";

interface RiderData {
  firstName: string | null;
  lastName: string | null;
  ftp: string | null;
  weight: string | null;
  instagram: string | null;
  strava: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

const profileValidationSchema = Yup.object().shape({
  firstName: Yup.string().nullable(),
  lastName: Yup.string().nullable(),
  ftp: Yup.string().nullable(),
  weight: Yup.string().nullable(),
  instagram: Yup.string().nullable(),
  strava: Yup.string().nullable(),
  bio: Yup.string().nullable(),
});

export const ProfileSection = () => {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const formik = useFormik<RiderData>({
    initialValues: {
      firstName: null,
      lastName: null,
      ftp: null,
      weight: null,
      instagram: null,
      strava: null,
      bio: null,
      avatarUrl: null,
    },
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      if (!user) {
        toast.error("You must be logged in to update your profile");
        router.push("/?login=true");
        return;
      }

      setDisabled(true);
      try {
        const { error } = await supabase.from("riders").upsert(
          {
            uuid: user.id,
            firstName: values.firstName || null,
            lastName: values.lastName || null,
            ftp: values.ftp || null,
            weight: values.weight || null,
            instagram: values.instagram || null,
            strava: values.strava || null,
            bio: values.bio || null,
            avatarUrl: values.avatarUrl || null,
            updateAt: new Date().toISOString(),
          },
          {
            onConflict: "uuid",
          }
        );

        if (error) {
          toast.error(error.message || "Failed to update profile");
        } else {
          toast.success("Profile updated successfully!");
          router.push("/profile");
        }
      } catch (err: any) {
        toast.error("An unexpected error occurred");
        console.error(err);
      } finally {
        setDisabled(false);
      }
    },
  });

  useEffect(() => {
    // Wait for auth to finish loading before checking user
    if (authLoading) {
      return;
    }

    // Only redirect if auth has finished loading and user is still null
    if (!user) {
      router.push("/?login=true");
      return;
    }

    async function fetchRiderData() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("riders")
          .select("*")
          .eq("uuid", user!.id)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "no rows returned" which is fine for new users
          console.error("Error fetching rider data:", error);
        } else if (data) {
          formik.setValues({
            firstName: data.firstName || null,
            lastName: data.lastName || null,
            ftp: data.ftp || null,
            weight: data.weight || null,
            instagram: data.instagram || null,
            strava: data.strava || null,
            bio: data.bio || null,
            avatarUrl: data.avatarUrl || null,
          });
        }
      } catch (err: any) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRiderData();
  }, [user, authLoading, router]);

  // Show loader while auth is loading or rider data is loading
  if (authLoading || loading) {
    return (
      <section className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <Loader />
      </section>
    );
  }

  // Only show nothing if auth has finished loading and user is still null
  if (!user) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-12 min-h-screen">
      <div className="mb-6">
        <NavigationLink href="/profile">
          <Button
            variant="text"
            placeholder={""}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 p-0"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="text-sm md:text-base">Back to Profile</span>
          </Button>
        </NavigationLink>
      </div>
      <div className="text-center mb-8">
        <h1 className="mb-4 leter-spacing-1 text-5xl font-bold">
          Edit Profile
        </h1>
        <p className="leter-spacing-1 text-xl max-w-3xl mx-auto">
          Update your rider profile information
        </p>
      </div>

      <div className="flex justify-center">
        <form
          onSubmit={formik.handleSubmit}
          className="min-w-[300px] md:min-w-[700px] bg-white rounded-lg shadow-lg p-8"
        >
          {/* Avatar Preview */}
          {(previewUrl || formik.values.avatarUrl) && (
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <Image
                  src={previewUrl || formik.values.avatarUrl || ""}
                  alt="Profile Avatar"
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-2 border-gray-300"
                />
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <Loader />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Avatar Upload */}
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="avatarUpload"
            >
              Profile Picture
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="avatarUpload"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                  toast.error("Image size must be less than 5MB");
                  return;
                }

                // Validate file type
                if (!file.type.startsWith("image/")) {
                  toast.error("Please select a valid image file");
                  return;
                }

                // Create preview
                const reader = new FileReader();
                reader.onloadend = () => {
                  setPreviewUrl(reader.result as string);
                };
                reader.readAsDataURL(file);

                // Upload to Supabase Storage
                if (!user) {
                  toast.error("You must be logged in to upload images");
                  return;
                }

                setUploading(true);
                try {
                  // Delete old avatar if exists
                  if (
                    formik.values.avatarUrl &&
                    formik.values.avatarUrl.includes("supabase.co/storage")
                  ) {
                    try {
                      const urlParts = formik.values.avatarUrl.split("/");
                      const fileName = urlParts[urlParts.length - 1];
                      await supabase.storage.from("avatars").remove([fileName]);
                    } catch (deleteErr) {
                      // Ignore delete errors (file might not exist)
                      console.log("Could not delete old avatar:", deleteErr);
                    }
                  }

                  const fileExt = file.name.split(".").pop();
                  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
                  // Path is relative to bucket root, so just use the filename
                  const filePath = fileName;

                  // Upload file
                  const { error: uploadError } = await supabase.storage
                    .from("avatars")
                    .upload(filePath, file, {
                      cacheControl: "3600",
                      upsert: false,
                    });

                  if (uploadError) {
                    console.error("Upload error:", uploadError);
                    toast.error("Failed to upload image. Please try again.");
                    setPreviewUrl(null);
                    return;
                  }

                  // Get public URL
                  const {
                    data: { publicUrl },
                  } = supabase.storage.from("avatars").getPublicUrl(filePath);

                  // Update form value
                  formik.setFieldValue("avatarUrl", publicUrl);
                  toast.success("Image uploaded successfully!");
                } catch (err: any) {
                  console.error("Unexpected error:", err);
                  toast.error("An unexpected error occurred");
                } finally {
                  setUploading(false);
                }
              }}
              disabled={uploading || !user}
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload a profile picture (max 5MB, JPG/PNG/GIF)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="firstName"
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formik.values.firstName || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formik.values.lastName || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="ftp"
              >
                FTP (Functional Threshold Power)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="ftp"
                type="text"
                name="ftp"
                placeholder="e.g., 250"
                value={formik.values.ftp || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="weight"
              >
                Weight (kg)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="weight"
                type="text"
                name="weight"
                placeholder="e.g., 70"
                value={formik.values.weight || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="instagram"
              >
                Instagram URL
              </label>
              <input
                className={`shadow appearance-none border ${
                  formik.errors.instagram && "border-red-500"
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="instagram"
                type="text"
                name="instagram"
                placeholder="https://instagram.com/username"
                value={formik.values.instagram || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.instagram && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.instagram}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="strava"
              >
                Strava URL
              </label>
              <input
                className={`shadow appearance-none border ${
                  formik.errors.strava && "border-red-500"
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="strava"
                type="text"
                name="strava"
                placeholder="https://strava.com/athletes/username"
                value={formik.values.strava || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.strava && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.strava}
                </p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="bio"
            >
              Bio
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="bio"
              name="bio"
              rows={6}
              placeholder="Tell us about yourself..."
              value={formik.values.bio || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              style={{ background: "#37007d" }}
              placeholder={""}
              color="gray"
              disabled={disabled}
              className="w-full md:w-auto px-8"
            >
              {disabled ? <Loader /> : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
