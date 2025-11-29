"use client";
// components
import { Navbar, Footer } from "@/components";
import { RaceCalendarTable } from "@/components/race-calendar";

export default function CalendarPage() {
  return (
    <>
      <Navbar />
      <section className="container mx-auto px-4 py-12 min-h-screen">
        <div className="text-center mb-8">
          <h1 className="mb-4 leter-spacing-1 text-5xl font-bold">Calendar</h1>
          <p className="leter-spacing-1 text-xl max-w-3xl mx-auto">
            Upcoming races and events
          </p>
        </div>
        <RaceCalendarTable />
      </section>
      <Footer />
    </>
  );
}

