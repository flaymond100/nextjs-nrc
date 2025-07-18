"use client";
// components
import { Footer, Navbar } from "@/components";
import { TeamIntro } from "@/components/team-intro";
// sections
import { Roster } from "./roster";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <Roster />
      <TeamIntro />
      <Footer />
    </>
  );
}
