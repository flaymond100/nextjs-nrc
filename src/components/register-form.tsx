"use client";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Loader } from "@/components/loader";
import { Button } from "@material-tailwind/react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  ftp: string | null;
  weight: string | null;
  instagram: string | null;
  strava: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

const registerValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  firstName: Yup.string()
    .required("First name is required")
    .min(1, "First name is required"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(1, "Last name is required"),
  dateOfBirth: Yup.string().nullable(),
  ftp: Yup.string().nullable(),
  weight: Yup.string().nullable(),
  instagram: Yup.string().url("Invalid Instagram URL").nullable(),
  strava: Yup.string().url("Invalid Strava URL").nullable(),
  bio: Yup.string().nullable(),
});

export const RegisterSection = () => {
  const [disabled, setDisabled] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { signUp } = useAuth();
  const router = useRouter();

  const formik = useFormik<RegisterData>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      dateOfBirth: null,
      ftp: null,
      weight: null,
      instagram: null,
      strava: null,
      bio: null,
      avatarUrl: null,
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      setDisabled(true);
      try {
        // Step 1: Create the user account
        const { data: authData, error: authError } = await signUp(
          values.email,
          values.password
        );

        if (authError) {
          toast.error(authError.message || "Failed to create account");
          setDisabled(false);
          return;
        }

        if (!authData || !authData.user) {
          toast.error("Account creation failed");
          setDisabled(false);
          return;
        }

        // Step 2: Upload avatar image if selected
        let avatarUrl = values.avatarUrl;
        if (selectedFile && authData.user.id) {
          setUploading(true);
          try {
            const fileExt = selectedFile.name.split(".").pop();
            const fileName = `${authData.user.id}-${Date.now()}.${fileExt}`;
            // Path is relative to bucket root, so just use the filename
            const filePath = fileName;

            // Upload file
            const { error: uploadError } = await supabase.storage
              .from("avatars")
              .upload(filePath, selectedFile, {
                cacheControl: "3600",
                upsert: false,
              });

            if (uploadError) {
              console.error("Upload error:", uploadError);
              toast.error("Failed to upload image, but account was created.");
            } else {
              // Get public URL
              const {
                data: { publicUrl },
              } = supabase.storage.from("avatars").getPublicUrl(filePath);
              avatarUrl = publicUrl;
            }
          } catch (err: any) {
            console.error("Error uploading image:", err);
            toast.error("Failed to upload image, but account was created.");
          } finally {
            setUploading(false);
          }
        }

        // Step 3: Create the rider profile
        const { error: riderError } = await supabase.from("riders").insert({
          uuid: authData.user.id,
          email: values.email.trim(),
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          isEmailConfirmed: false,
          isPaid: false,
          dateOfBirth: values.dateOfBirth || null,
          ftp: values.ftp?.trim() || null,
          weight: values.weight?.trim() || null,
          instagram: values.instagram?.trim() || null,
          strava: values.strava?.trim() || null,
          bio: values.bio?.trim() || null,
          avatarUrl: avatarUrl || null,
          updateAt: new Date().toISOString(),
        });

        if (riderError) {
          console.error("Error creating rider profile:", riderError);
          // Don't fail the registration if rider profile creation fails
          // The user can update it later
          toast.success(
            "Account created! Please check your email to verify. You can complete your profile later."
          );
        } else {
          toast.success(
            "Account created successfully! Please check your email to verify your account."
          );
        }

        // Redirect to profile page or home
        router.push("/profile");
      } catch (err: any) {
        toast.error("An unexpected error occurred");
        console.error(err);
      } finally {
        setDisabled(false);
      }
    },
  });

  return (
    <section className="container mx-auto px-4 py-12 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="mb-4 leter-spacing-1 text-5xl font-bold">
          Join NRC International Team
        </h1>
        <p className="leter-spacing-1 text-xl max-w-3xl mx-auto">
          Create your account and complete your rider profile
        </p>
        <p className="leter-spacing-1 text-sm text-gray-600 mt-2">
          Already have an account?{" "}
          <Link href="/?login=true" className="text-purple-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>

      <div className="flex justify-center">
        <form
          onSubmit={formik.handleSubmit}
          className="min-w-[300px] md:min-w-[700px] bg-white rounded-lg shadow-lg p-8"
        >
          {/* Account Information Section */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Account Information
            </h2>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                className={`shadow appearance-none border ${
                  formik.errors.email && "border-red-500"
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="email"
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.email && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  className={`shadow appearance-none border ${
                    formik.errors.password && "border-red-500"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  id="password"
                  type="password"
                  name="password"
                  placeholder="At least 6 characters"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.password && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  className={`shadow appearance-none border ${
                    formik.errors.confirmPassword && "border-red-500"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.confirmPassword && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {formik.errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Rider Profile Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Rider Profile
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Fill in your rider information. You can update this later in your
              profile.
            </p>

            {/* Avatar Preview */}
            {previewUrl && (
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Profile Avatar Preview"
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                  />
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <div className="text-white text-sm">Uploading...</div>
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
                onChange={(e) => {
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

                  setSelectedFile(file);

                  // Create preview
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewUrl(reader.result as string);
                  };
                  reader.readAsDataURL(file);

                  // Note: Image will be uploaded after account creation
                }}
                disabled={uploading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload a profile picture (max 5MB, JPG/PNG/GIF). Image will be uploaded after account creation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="firstName"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={`shadow appearance-none border ${
                    formik.errors.firstName && "border-red-500"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.firstName && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {formik.errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="lastName"
                >
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={`shadow appearance-none border ${
                    formik.errors.lastName && "border-red-500"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.lastName && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {formik.errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="dateOfBirth"
              >
                Date of Birth
              </label>
              <input
                className={`shadow appearance-none border ${
                  formik.errors.dateOfBirth && "border-red-500"
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={formik.values.dateOfBirth || ""}
                onChange={(e) => {
                  formik.setFieldValue("dateOfBirth", e.target.value || null);
                }}
                onBlur={formik.handleBlur}
                max={new Date().toISOString().split("T")[0]}
              />
              {formik.errors.dateOfBirth && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.dateOfBirth}
                </p>
              )}
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
          </div>

          <div className="flex justify-center mt-8">
            <Button
              type="submit"
              style={{ background: "#f06723" }}
              placeholder={""}
              color="gray"
              disabled={disabled}
              className="w-full md:w-auto px-8"
            >
              {disabled ? <Loader /> : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

