"use client";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Loader } from "@/components/loader";
import { Button } from "@material-tailwind/react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { RaceType, Rider } from "@/utils/types";
import { useAuth } from "@/contexts/auth-context";
import { uploadSeriesImage } from "@/utils/storage";

interface RaceFormData {
  name: string;
  event_date: string;
  url: string;
  profile: string;
  distance_km: string;
  elevation_m: string;
  race_type: RaceType;
  location: string;
  participants: string[];
  series: string;
  series_image: string;
}

const PROFILE_TYPES = ["Flat", "Hilly", "Mountain", "Rolling"] as const;

const raceValidationSchema = Yup.object().shape({
  name: Yup.string().required("Race name is required"),
  event_date: Yup.string().required("Event date is required"),
  url: Yup.string().url("Invalid URL").nullable(),
  profile: Yup.string()
    .oneOf([...PROFILE_TYPES, ""], "Invalid profile type")
    .nullable(),
  distance_km: Yup.number().positive("Distance must be positive").nullable(),
  elevation_m: Yup.number().integer("Elevation must be an integer").nullable(),
  race_type: Yup.string()
    .oneOf(["road", "crit", "tt", "triathlon", "social"], "Invalid race type")
    .required("Race type is required"),
  location: Yup.string().required("Location is required"),
});

export const CreateRaceForm = () => {
  const [disabled, setDisabled] = useState(false);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loadingRiders, setLoadingRiders] = useState(true);
  const [uploadingSeriesImage, setUploadingSeriesImage] = useState(false);
  const [seriesImagePreview, setSeriesImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchRiders() {
      try {
        const { data, error } = await supabase
          .from("riders")
          .select("*")
          .eq("isEmailConfirmed", true);
        if (error) {
          console.error("Error fetching riders:", error);
        } else {
          setRiders(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoadingRiders(false);
      }
    }
    fetchRiders();
  }, []);

  const formik = useFormik<RaceFormData>({
    initialValues: {
      name: "",
      event_date: "",
      url: "",
      profile: "",
      distance_km: "",
      elevation_m: "",
      race_type: "road",
      location: "",
      participants: [],
      series: "",
      series_image: "",
    },
    validationSchema: raceValidationSchema,
    onSubmit: async (values) => {
      setDisabled(true);
      try {
        const raceData = {
          name: values.name,
          event_date: values.event_date,
          url: values.url || null,
          profile: values.profile || null,
          distance_km: values.distance_km
            ? parseFloat(values.distance_km)
            : null,
          elevation_m: values.elevation_m ? parseInt(values.elevation_m) : null,
          race_type: values.race_type,
          location: values.location,
          participants:
            values.participants.length > 0 ? values.participants : null,
          series: values.series || null,
          series_image: values.series_image || null,
        };

        const { error } = await supabase.from("race_calendar").insert(raceData);

        if (error) {
          toast.error(error.message || "Failed to create race");
        } else {
          toast.success("Race created successfully!");
          router.push("/calendar");
        }
      } catch (err: any) {
        toast.error("An unexpected error occurred");
        console.error(err);
      } finally {
        setDisabled(false);
      }
    },
  });

  return (
    <section className="container mx-auto px-4 py-6 md:py-12 min-h-screen">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="mb-2 md:mb-4 leter-spacing-1 text-3xl md:text-5xl font-bold">
          Create New Race
        </h1>
        <p className="leter-spacing-1 text-base md:text-xl max-w-3xl mx-auto px-2">
          Add a new race to the calendar
        </p>
      </div>

      <div className="flex justify-center">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-full md:min-w-[700px] bg-white rounded-lg shadow-lg p-4 md:p-8"
        >
          <div className="mb-4 md:mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Race Name <span className="text-red-500">*</span>
            </label>
            <input
              className={`shadow appearance-none border ${
                formik.errors.name && "border-red-500"
              } rounded w-full py-2 px-3 text-gray-700 text-sm md:text-base leading-tight focus:outline-none focus:shadow-outline`}
              id="name"
              type="text"
              name="name"
              placeholder="Race name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.name && (
              <p className="text-red-500 text-xs italic mt-1">
                {formik.errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="event_date"
              >
                Event Date <span className="text-red-500">*</span>
              </label>
              <input
                className={`shadow appearance-none border ${
                  formik.errors.event_date && "border-red-500"
                } rounded w-full py-2 px-3 text-gray-700 text-sm md:text-base leading-tight focus:outline-none focus:shadow-outline`}
                id="event_date"
                type="date"
                name="event_date"
                value={formik.values.event_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.event_date && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.event_date}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="race_type"
              >
                Race Type <span className="text-red-500">*</span>
              </label>
              <select
                className={`shadow appearance-none border ${
                  formik.errors.race_type && "border-red-500"
                } rounded w-full py-2 px-3 text-gray-700 text-sm md:text-base leading-tight focus:outline-none focus:shadow-outline`}
                id="race_type"
                name="race_type"
                value={formik.values.race_type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="road">Road</option>
                <option value="crit">Criterium</option>
                <option value="tt">Time Trial</option>
                <option value="triathlon">Triathlon</option>
                <option value="social">Social</option>
              </select>
              {formik.errors.race_type && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.race_type}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4 md:mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="location"
            >
              Location <span className="text-red-500">*</span>
            </label>
            <input
              className={`shadow appearance-none border ${
                formik.errors.location && "border-red-500"
              } rounded w-full py-2 px-3 text-gray-700 text-sm md:text-base leading-tight focus:outline-none focus:shadow-outline`}
              id="location"
              type="text"
              name="location"
              placeholder="e.g., Paris, France"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.location && (
              <p className="text-red-500 text-xs italic mt-1">
                {formik.errors.location}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="distance_km"
              >
                Distance (km)
              </label>
              <input
                className={`shadow appearance-none border ${
                  formik.errors.distance_km && "border-red-500"
                } rounded w-full py-2 px-3 text-gray-700 text-sm md:text-base leading-tight focus:outline-none focus:shadow-outline`}
                id="distance_km"
                type="number"
                step="0.01"
                name="distance_km"
                placeholder="e.g., 150.5"
                value={formik.values.distance_km}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.distance_km && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.distance_km}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="elevation_m"
              >
                Elevation (m)
              </label>
              <input
                className={`shadow appearance-none border ${
                  formik.errors.elevation_m && "border-red-500"
                } rounded w-full py-2 px-3 text-gray-700 text-sm md:text-base leading-tight focus:outline-none focus:shadow-outline`}
                id="elevation_m"
                type="number"
                name="elevation_m"
                placeholder="e.g., 2500"
                value={formik.values.elevation_m}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.elevation_m && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.elevation_m}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4 md:mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="url"
            >
              Event URL
            </label>
            <input
              className={`shadow appearance-none border ${
                formik.errors.url && "border-red-500"
              } rounded w-full py-2 px-3 text-gray-700 text-sm md:text-base leading-tight focus:outline-none focus:shadow-outline`}
              id="url"
              type="url"
              name="url"
              placeholder="https://example.com/race"
              value={formik.values.url}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.url && (
              <p className="text-red-500 text-xs italic mt-1">
                {formik.errors.url}
              </p>
            )}
          </div>

          <div className="mb-4 md:mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="profile"
            >
              Profile
            </label>
            <select
              className={`shadow appearance-none border ${
                formik.errors.profile && "border-red-500"
              } rounded w-full py-2 px-3 text-gray-700 text-sm md:text-base leading-tight focus:outline-none focus:shadow-outline`}
              id="profile"
              name="profile"
              value={formik.values.profile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select profile type</option>
              {PROFILE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {formik.errors.profile && (
              <p className="text-red-500 text-xs italic mt-1">
                {formik.errors.profile}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="series"
              >
                Series
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm md:text-base leading-tight focus:outline-none focus:shadow-outline`}
                id="series"
                type="text"
                name="series"
                placeholder="e.g., UCI World Tour"
                value={formik.values.series}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="series_image"
              >
                Series Image
              </label>
              
              {/* File Upload */}
              <div className="mb-2">
                <label
                  htmlFor="series-image-upload"
                  className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingSeriesImage ? "Uploading..." : "Upload Image"}
                </label>
                <input
                  id="series-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingSeriesImage}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    if (!user) {
                      toast.error("You must be logged in to upload images");
                      return;
                    }

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

                    setUploadingSeriesImage(true);
                    try {
                      // Cleanup old preview URL if exists
                      if (seriesImagePreview) {
                        URL.revokeObjectURL(seriesImagePreview);
                      }

                      const publicUrl = await uploadSeriesImage(file, user.id);
                      if (publicUrl) {
                        formik.setFieldValue("series_image", publicUrl);
                        // Create preview URL for local file
                        const previewUrl = URL.createObjectURL(file);
                        setSeriesImagePreview(previewUrl);
                        toast.success("Image uploaded successfully!");
                      }
                    } catch (err: any) {
                      toast.error(err.message || "Failed to upload image");
                    } finally {
                      setUploadingSeriesImage(false);
                    }
                  }}
                />
              </div>

              {/* Image Preview */}
              {(seriesImagePreview || formik.values.series_image) && (
                <div className="mb-2">
                  <img
                    src={seriesImagePreview || formik.values.series_image}
                    alt="Series preview"
                    className="max-w-32 h-16 object-contain border border-gray-300 rounded"
                  />
                </div>
              )}

              {/* URL Input (Alternative) */}
              <div className="text-sm text-gray-600 mb-2">
                Or enter image URL:
              </div>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm md:text-base leading-tight focus:outline-none focus:shadow-outline`}
                id="series_image"
                type="url"
                name="series_image"
                placeholder="https://example.com/series-logo.png"
                value={formik.values.series_image}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <div className="mb-4 md:mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Participants
            </label>
            {loadingRiders ? (
              <div className="text-gray-500 text-sm">Loading riders...</div>
            ) : riders.length === 0 ? (
              <div className="text-gray-500 text-sm">No riders available</div>
            ) : (
              <div className="max-h-48 md:max-h-64 overflow-y-auto border border-gray-300 rounded p-2 md:p-3">
                {riders.map((rider) => {
                  const riderName =
                    `${rider.firstName || ""} ${rider.lastName || ""}`.trim() ||
                    rider.uuid;
                  const isSelected = formik.values.participants.includes(
                    rider.uuid
                  );
                  return (
                    <label
                      key={rider.uuid}
                      className="flex items-center py-1.5 md:py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            formik.setFieldValue("participants", [
                              ...formik.values.participants,
                              rider.uuid,
                            ]);
                          } else {
                            formik.setFieldValue(
                              "participants",
                              formik.values.participants.filter(
                                (id) => id !== rider.uuid
                              )
                            );
                          }
                        }}
                        className="mr-2 flex-shrink-0"
                      />
                      <span className="text-xs md:text-sm text-gray-700 break-words">
                        {riderName}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-center mt-6 md:mt-8">
            <Button
              type="submit"
              style={{ background: "#37007d" }}
              placeholder={""}
              color="gray"
              disabled={disabled}
              className="w-full md:w-auto px-6 md:px-8 py-2 md:py-3 text-sm md:text-base"
            >
              {disabled ? <Loader /> : "Create Race"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
