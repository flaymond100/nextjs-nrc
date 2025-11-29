"use client";
// components
import { Navbar, Footer } from "@/components";
import { CreateRaceForm } from "@/components/create-race-form";

export default function CreateRacePage() {
  return (
    <>
      <Navbar />
      <CreateRaceForm />
      <Footer />
    </>
  );
}

