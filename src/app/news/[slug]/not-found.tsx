"use client";
import { Navbar, Footer } from "@/components";
import { NavigationLink } from "@/components/navigation-link";
import { Button } from "@material-tailwind/react";

export default function NewsNotFound() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 md:py-24 min-h-[calc(100vh-400px)] flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            News Article Not Found
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            The news article you're looking for doesn't exist or has been removed.
          </p>
          <NavigationLink href="/news">
            <Button
              style={{ background: "#37007d" }}
              placeholder={""}
              color="gray"
              size="lg"
            >
              Back to News
            </Button>
          </NavigationLink>
        </div>
      </div>
      <Footer />
    </>
  );
}

