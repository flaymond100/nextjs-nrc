import React from "react";
import { Footer, Navbar } from "@/components";
import { Sponsors } from "@/components/sponsors";

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
