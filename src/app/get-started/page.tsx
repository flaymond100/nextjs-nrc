"use client";
// components
import { Navbar, Footer } from "@/components";

// sections
import Faq from "../faq";
import React from "react";
import CarouselFeatures from "../carousel-features";
import { StripePricingTable } from "../prices";
import { CalendlyWidget } from "@/components/widget";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <StripePricingTable />
      <CarouselFeatures />
      <CalendlyWidget />
      <Faq />
      <Footer />
    </>
  );
}
