"use client";
import { Navbar, Footer } from "@/components";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterSuccessPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) {
      return;
    }

    // If user is logged in, redirect to home
    if (user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Don't render content if user is logged in (will redirect)
  if (loading || user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <section className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircleIcon className="h-20 w-20 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Account Created Successfully!
          </h1>
          <div className="space-y-4 text-gray-600 mb-8">
            <p className="text-lg">
              We've sent a confirmation email to your inbox.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-left">
              <p className="font-semibold text-blue-800 mb-2">
                Important: Please confirm your email within 24 hours
              </p>
              <p className="text-blue-700">
                Check your email inbox and click the confirmation link to verify
                your account. Once confirmed, you'll be able to log in and fill
                in your rider profile information.
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Didn't receive the email? Check your spam folder or{" "}
              <Link href="/contact" className="text-purple-600 hover:underline">
                contact us
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/?login=true"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Go to Login
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
