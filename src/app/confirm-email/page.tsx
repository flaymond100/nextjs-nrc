import { Navbar, Footer } from "@/components";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function ConfirmEmailPage() {
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
              <p className="text-green-700">
                You can now log in and access all features of your rider
                profile.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
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
