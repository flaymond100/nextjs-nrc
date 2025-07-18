"use client";
// components
import { Navbar, Footer } from "@/components";

// sections
import Faq from "../faq";
import CarouselFeatures from "../carousel-features";
import { CalendlyWidget } from "@/components/widget";
import { PersonalCoaching } from "@/components/personal-coaching";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <PersonalCoaching />
      <CarouselFeatures />
      <CalendlyWidget />
      <Faq />
      <Footer />
    </>
  );
}
