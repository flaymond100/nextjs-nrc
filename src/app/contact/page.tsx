"use client";
// components
import { Navbar, Footer } from "@/components";

// sections
import Faq from "../faq";
import React from "react";
import CarouselFeatures from "../carousel-features";
import { FormSection } from "@/components/contact-form";

export default function ContactUs() {
  return (
    <>
      <Navbar />
      <ContactUsPage />
      <CarouselFeatures />
      <Faq />
      <Footer />
    </>
  );
}

const ContactUsPage = () => {
  return (
    <>
      <section className="container mx-auto px-4 py-12">
        <FormSection />
      </section>
    </>
  );
};
