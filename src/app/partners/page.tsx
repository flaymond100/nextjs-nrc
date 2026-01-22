import React from "react";
import { Footer, Navbar } from "@/components";
import { Sponsors } from "@/components/sponsors";

// Force static generation for static export
export const dynamic = "force-static";
export const dynamicParams = false;

export default function SponsorsPage() {
  return (
    <>
      <Navbar />
      <SponsorsSection />
      <Footer />
    </>
  );
}
const SponsorsSection = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Sponsors />
    </div>
  );
};
