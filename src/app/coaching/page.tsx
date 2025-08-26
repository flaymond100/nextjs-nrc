"use client";
// components
import { Navbar, Footer } from "@/components";

// sections
import CarouselFeatures from "../carousel-features";
import { PersonalCoaching } from "@/components/personal-coaching";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <PersonalCoaching />
      <CarouselFeatures />
      <Footer />
    </>
  );
}
