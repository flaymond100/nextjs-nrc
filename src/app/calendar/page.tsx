"use client";
// components
import { Navbar, Footer } from "@/components";

export default function CalendarPage() {
  return (
    <>
      <Navbar />
      <section className="container mx-auto px-4 py-12 min-h-screen">
        <div className="text-center">
          <h1 className="mb-4 leter-spacing-1 text-5xl font-bold">Calendar</h1>
        </div>
      </section>
      <Footer />
    </>
  );
}

