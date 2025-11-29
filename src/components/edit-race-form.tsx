"use client";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Loader } from "@/components/loader";
import { Button } from "@material-tailwind/react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { RaceType, Rider, RaceCalendar } from "@/utils/types";
import { NavigationLink } from "./navigation-link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

interface RaceFormData {
  name: string;
  event_date: string;
  url: string;
  profile: string;
  distance_km: string;
  elevation_m: string;
  race_type: RaceType;
  participants: string[];
}

const raceValidationSchema = Yup.object().shape({
  name: Yup.string().required("Race name is required"),
  event_date: Yup.string().required("Event date is required"),
  url: Yup.string().url("Invalid URL").nullable(),
  profile: Yup.string().nullable(),
  distance_km: Yup.number().positive("Distance must be positive").nullable(),
  elevation_m: Yup.number().integer("Elevation must be an integer").nullable(),
  race_type: Yup.string()
    .oneOf(["road", "crit", "tt", "triathlon"], "Invalid race type")
    .required("Race type is required"),
});

interface EditRaceFormProps {
  raceId: string;
}

export const EditRaceForm = ({ raceId }: EditRaceFormProps) => {
  const [disabled, setDisabled] = useState(false);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loadingRiders, setLoadingRiders] = useState(true);
  const [loadingRace, setLoadingRace] = useState(true);
  const [race, setRace] = useState<RaceCalendar | null>(null);
  const router = useRouter();

  const getInitialValues = (raceData: RaceCalendar | null): RaceFormData => {
    if (!raceData) {
      return {
        name: "",
        event_date: "",
        url: "",
        profile: "",
        distance_km: "",
        elevation_m: "",
        race_type: "road",
        participants: [],
      };
    }

    return {
      name: raceData.name || "",
      event_date: raceData.event_date ? raceData.event_date.split("T")[0] : "",
      url: raceData.url || "",
      profile: raceData.profile || "",
      distance_km: raceData.distance_km?.toString() || "",
      elevation_m: raceData.elevation_m?.toString() || "",
      race_type: raceData.race_type || "road",
      participants: raceData.participants || [],
    };
  };

  useEffect(() => {
    async function fetchRace() {
      try {
        const { data, error } = await supabase
          .from("race_calendar")
          .select("*")
          .eq("id", raceId)
          .single();

        if (error) {
          toast.error("Failed to load race data");
          console.error("Error fetching race:", error);
          router.push("/calendar");
          return;
        }

        if (data) {
          setRace(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("An unexpected error occurred");
      } finally {
        setLoadingRace(false);
      }
    }

    fetchRace();
  }, [raceId, router]);

  useEffect(() => {
    async function fetchRiders() {
      try {
        const { data, error } = await supabase.from("riders").select("*");
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
    initialValues: getInitialValues(race),
    validationSchema: raceValidationSchema,
    enableReinitialize: true,
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
          participants:
            values.participants.length > 0 ? values.participants : null,
        };

        const { error } = await supabase
          .from("race_calendar")
          .update(raceData)
          .eq("id", raceId);

        if (error) {
          toast.error(error.message || "Failed to update race");
        } else {
          toast.success("Race updated successfully!");
          router.push(`/calendar/${raceId}`);
        }
      } catch (err: any) {
        toast.error("An unexpected error occurred");
        console.error(err);
      } finally {
        setDisabled(false);
      }
    },
  });

  if (loadingRace) {
    return (
      <section className="container mx-auto px-4 py-6 md:py-12 min-h-screen flex items-center justify-center">
        <Loader />
      </section>
    );
  }

  if (!race) {
    return (
      <section className="container mx-auto px-4 py-6 md:py-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Race not found</h2>
          <NavigationLink href="/calendar">
            <Button variant="text" placeholder={""} className="text-purple-600">
              Back to Calendar
            </Button>
          </NavigationLink>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-6 md:py-12 min-h-screen">
      <div className="mb-4 md:mb-6">
        <NavigationLink href={`/calendar/${raceId}`}>
          <Button
            variant="text"
            placeholder={""}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 p-0"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="text-sm md:text-base">Back to Race</span>
          </Button>
        </NavigationLink>
      </div>

      <div className="text-center mb-6 md:mb-8">
        <h1 className="mb-2 md:mb-4 leter-spacing-1 text-3xl md:text-5xl font-bold">
          Edit Race
        </h1>
        <p className="leter-spacing-1 text-base md:text-xl max-w-3xl mx-auto px-2">
          Update race information
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
              </select>
              {formik.errors.race_type && (
                <p className="text-red-500 text-xs italic mt-1">
                  {formik.errors.race_type}
                </p>
              )}
            </div>
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
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm md:text-base leading-tight focus:outline-none focus:shadow-outline"
              id="profile"
              type="text"
              name="profile"
              placeholder="e.g., flat, hilly, or profile image URL"
              value={formik.values.profile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
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
              {disabled ? <Loader /> : "Update Race"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

