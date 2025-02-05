"use client";
// components
import { Footer, Navbar } from "@/components";

// sections
import Prices from "../prices";
import Faq from "../faq";
import OurPrograms from "../our-programs";
import CarouselFeatures from "../carousel-features";
import { CalendlyWidget } from "@/components/widget";
import { SocialRides } from "@/components/social-rides";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <SocialRides />
      <CarouselFeatures />
      <CalendlyWidget />
      <Faq />
      <Footer />
    </>
  );
}
