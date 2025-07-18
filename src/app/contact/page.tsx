"use client";
// components
import { Navbar, Footer } from "@/components";

// sections
import Faq from "../faq";
import React from "react";
import CarouselFeatures from "../carousel-features";
import { Prices } from "../prices";
import { FormSection } from "@/components/contact-form";

export default function ContactUs() {
  return (
    <>
      <Navbar />
      <FormSection />
      <Prices />
      <CarouselFeatures />
      <Faq />
      <Footer />
    </>
  );
}
