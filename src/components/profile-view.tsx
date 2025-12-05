"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/loader";
import Image from "next/image";
import { Button } from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { NavigationLink } from "./navigation-link";

interface RiderData {
  firstName: string | null;
  lastName: string | null;
  instagram: string | null;
  strava: string | null;
  bio: string | null;
  avatarUrl: string | null;
  email: string | null;
}

export const ProfileView = () => {
  const [loading, setLoading] = useState(true);
  const [riderData, setRiderData] = useState<RiderData | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to finish loading before checking user
    if (authLoading) {
      return;
    }

    // Only redirect if auth has finished loading and user is still null
    if (!user) {
      router.push("/login");
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
          setRiderData({
            firstName: data.firstName || null,
            lastName: data.lastName || null,
            instagram: data.instagram || null,
            strava: data.strava || null,
            bio: data.bio || null,
            avatarUrl: data.avatarUrl || null,
            email: user?.email || null,
          });
        } else {
          // No rider data yet, set empty state
          setRiderData({
            firstName: null,
            lastName: null,
            instagram: null,
            strava: null,
            bio: null,
            avatarUrl: null,
            email: user?.email || null,
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

  const fullName = riderData
    ? `${riderData.firstName || ""} ${riderData.lastName || ""}`.trim() ||
      "Rider"
    : "Rider";
  const displayName = riderData?.firstName || "there";

  return (
    <section className="mb-10 pt-24 px-8 pb-20 md:pb-0 relative min-h-[calc(100vh-100px)]">
      <div className="w-full max-w-4xl mx-auto">
        <div className="animate-in slide-in-from-bottom duration-1000">
          <div className="flex items-center justify-between mb-8">
            <h1 className="leter-spacing-1 text-4xl md:text-5xl font-bold text-left text-gray-900">
              Hi, {displayName}!
            </h1>
            <NavigationLink href="/profile/edit">
              <Button
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                placeholder={""}
              >
                <PencilIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Edit Profile</span>
              </Button>
            </NavigationLink>
          </div>

          <div className="p-6 md:p-8">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 pb-8 border-b border-gray-200">
              <div className="flex-shrink-0">
                {riderData?.avatarUrl ? (
                  <Image
                    src={riderData.avatarUrl}
                    alt="Profile Avatar"
                    width={150}
                    height={150}
                    className="rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-[150px] h-[150px] rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                    <span className="text-4xl font-bold text-gray-400">
                      {fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {fullName}
                </h2>
                {riderData?.email && (
                  <p className="text-gray-600 mb-4">{riderData.email}</p>
                )}
              </div>
            </div>

            {/* Social Links */}
            {(riderData?.instagram || riderData?.strava) && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Social Links
                </h3>
                <div className="flex flex-wrap gap-4">
                  {riderData.instagram && (
                    <Link
                      href={riderData.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                    >
                      <span>Instagram</span>
                      <svg
                        className="ml-2 h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </Link>
                  )}
                  {riderData.strava && (
                    <Link
                      href={riderData.strava}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <span>Strava</span>
                      <svg
                        className="ml-2 h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7.008 13.828h4.169" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Bio */}
            {riderData?.bio && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  About
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {riderData.bio}
                </p>
              </div>
            )}

            {/* Empty State */}
            {!riderData?.firstName &&
              !riderData?.lastName &&
              !riderData?.instagram &&
              !riderData?.strava &&
              !riderData?.bio && (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    Your profile is empty. Start by adding your information!
                  </p>
                  <NavigationLink href="/profile/edit">
                    <Button
                      className="bg-purple-600 hover:bg-purple-700"
                      placeholder={""}
                    >
                      Complete Your Profile
                    </Button>
                  </NavigationLink>
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
};
