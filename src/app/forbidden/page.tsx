"use client";
import { Navbar, Footer } from "@/components";
import Link from "next/link";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export default function ForbiddenPage() {
  return (
    <>
      <Navbar />
      <section className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6 flex justify-center">
            <ExclamationTriangleIcon className="h-20 w-20 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Access Forbidden
          </h1>
          <div className="space-y-4 text-gray-600 mb-8">
            <p className="text-lg">
              You don't have permission to access this page.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Go to Home
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
