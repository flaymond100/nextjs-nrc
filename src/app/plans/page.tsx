"use client";
// components
import { Navbar } from "@/components";

// sections
import Prices from "../prices";
import Faq from "../faq";
import OurPrograms from "../our-programs";
import CarouselFeatures from "../carousel-features";
import { CalendlyWidget } from "@/components/widget";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <OurPrograms />
      <Prices />
      <CarouselFeatures />
      <CalendlyWidget />
      <Faq />
    </>
  );
}
