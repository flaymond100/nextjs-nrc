"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Footer } from "@/components";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Loader } from "@/components/loader";

export default function ConfirmEmailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is not logged in, redirect to login
    // (This shouldn't happen in normal flow, but just in case)
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="container mx-auto px-4 py-12 min-h-[calc(100vh-400px)] flex items-center justify-center">
          <Loader />
        </section>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <>
      <Navbar />
      <section className="container mx-auto px-4 py-12 min-h-[calc(100vh-400px)] flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircleIcon className="h-20 w-20 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Email Confirmed Successfully!
          </h1>
          <div className="space-y-4 text-gray-600 mb-8">
            <p className="text-lg">
              Your email has been successfully confirmed!
            </p>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 text-left">
              <p className="font-semibold text-green-800 mb-2">
                Your account is now active!
              </p>
              <p className="text-green-700 mb-2">
                You're now logged in and can access all features of your rider
                profile.
              </p>
              <p className="text-green-700 text-sm">
                <Link
                  href="/profile"
                  className="font-semibold underline hover:text-green-900"
                >
                  Update your profile
                </Link>{" "}
                to add your avatar, personal information, and other details.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/profile"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Complete Your Profile
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
