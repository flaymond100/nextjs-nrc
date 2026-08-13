// components
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  CardFooter,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { BsInstagram, BsStrava } from "react-icons/bs";
import { supabase } from "@/utils/supabase";
import { Loader } from "@/components/loader";

// Only the non-sensitive columns exposed by the public.public_roster view.
type RosterRider = {
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  strava: string | null;
  instagram: string | null;
  avatarUrl: string | null;
};

export const Roster = () => {
  const [riders, setRiders] = useState<RosterRider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoster() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("public_roster")
          .select("firstName,lastName,bio,strava,instagram,avatarUrl")
          .order("firstName", { ascending: true });

        if (error) {
          setError(error.message);
          console.error("Error fetching roster:", error);
        } else {
          setRiders(data ?? []);
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoster();
  }, []);

  return (
    <section className="container mx-auto">
      <h1 className="mb-14 mt-10 text-center text-5xl font-bold">
        Team Riders
      </h1>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader />
        </div>
      ) : error ? (
        <div className="min-h-[200px] text-center text-red-500">
          Failed to load riders: {error}
        </div>
      ) : riders.length === 0 ? (
        <div className="min-h-[200px] text-center text-gray-500">
          No riders to display yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {riders.map((rider, index) => {
            const name =
              `${rider.firstName ?? ""} ${rider.lastName ?? ""}`.trim() ||
              "Rider";

            return (
              <Card
                key={`${name}-${index}`}
                className="shadow-lg mb-10 flex flex-col"
              >
                {/* CardHeader for Rider Photo */}
                <CardHeader style={{ height: "27rem" }} className="relative">
                  {rider.avatarUrl ? (
                    <img
                      src={rider.avatarUrl}
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-purple-600 text-6xl font-bold text-white">
                      {(rider.firstName?.[0] ?? "?").toUpperCase()}
                    </div>
                  )}
                </CardHeader>

                {/* CardBody for Rider Info */}
                <CardBody className="flex flex-col flex-grow">
                  <div>
                    <Typography variant="h5" className="mb-2 font-bold">
                      {name}
                    </Typography>
                    {!!rider.bio && (
                      <Typography className="mb-4">{rider.bio}</Typography>
                    )}
                  </div>
                </CardBody>
                <CardFooter className="pt-0">
                  <div className="flex gap-2">
                    {rider.strava && (
                      <Link
                        aria-label="Go to strava"
                        target="_blank"
                        to={rider.strava}
                      >
                        <Button
                          placeholder={""}
                          aria-label="Go to strava"
                          size="lg"
                          name="Strava"
                          style={{ background: "#f06723" }}
                          className="bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700 hover:from-yellow-600 hover:via-pink-700 hover:to-purple-800"
                        >
                          <BsStrava className="text-white text-xl" />
                        </Button>
                      </Link>
                    )}
                    {rider.instagram && (
                      <Link
                        aria-label="Go to instagram"
                        target="_blank"
                        to={rider.instagram}
                      >
                        <Button
                          placeholder={""}
                          aria-label="Go to instagram"
                          size="lg"
                          name="Instagram"
                          className="bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700 hover:from-yellow-600 hover:via-pink-700 hover:to-purple-800"
                        >
                          <BsInstagram className="text-white text-xl" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
};
