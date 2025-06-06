"use client";
// components
import { Footer, Navbar } from "@/components";
import { TeamIntro } from "@/components/team-intro";
// sections
import Faq from "../faq";
import CarouselFeatures from "../carousel-features";
import { CalendlyWidget } from "@/components/widget";
import { Roster } from "./roster";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <Roster />
      <TeamIntro />
      <CarouselFeatures />
      <CalendlyWidget />
      <Faq />
      <Footer />
    </>
  );
}
