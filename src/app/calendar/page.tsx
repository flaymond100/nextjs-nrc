"use client";
// components
import { Navbar, Footer } from "@/components";
import { RaceCalendarTable } from "@/components/race-calendar";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@material-tailwind/react";
import { NavigationLink } from "@/components/navigation-link";
import { usePathname } from "next/navigation";

export default function CalendarPage() {
  return (
    <>
      <Navbar />
      <div className="flex items-start w-full">
        {/* Left Banner - visible at lg+ */}
        <div className="hidden lg:flex flex-col items-center justify-start sticky top-[50%] transform -translate-y-1/2 self-start flex-1 max-w-[180px] xl:max-w-[280px] shrink-0 py-8">
          <a
            href="https://www.roadclassics.cz/en/propozice/palava"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/banner.png"
              alt="Banner"
              className="w-[120px] xl:w-[180px] object-contain rounded-lg border border-black shadow-sm hover:opacity-90 transition-opacity"
            />
          </a>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <CalendarPageContent />
        </div>

        {/* Right Banner - visible at lg+ */}
        <div className="hidden lg:flex flex-col items-center justify-start sticky top-[50%] transform -translate-y-1/2 self-start flex-1 max-w-[180px] xl:max-w-[280px] shrink-0 py-8">
          <a
            href="https://www.roadclassics.cz/en/propozice/palava"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/banner.png"
              alt="Banner"
              className="w-[120px] xl:w-[180px] object-contain rounded-lg border border-black shadow-sm hover:opacity-90 transition-opacity"
            />
          </a>
        </div>
      </div>

      {/* Bottom fixed banner - visible below 960px */}
      <div className="960:hidden fixed bottom-0 left-1/2 -translate-x-1/2 z-50">
        <a
          href="https://www.roadclassics.cz/en/propozice/palava"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/banner-mobile.png"
            alt="Banner"
            className="w-[80vw] max-w-[80vw] h-auto object-contain rounded-lg border border-black shadow-lg hover:opacity-90 transition-opacity"
          />
        </a>
      </div>
      <Footer />
    </>
  );
}

export const CalendarPageContent = () => {
  const { isAdmin } = useAdmin();
  const pathname = usePathname();
  const isCalendarPage = pathname === "/calendar/";

  return (
    <section
      className={`container mx-auto px-4 py-6 md:py-12 ${isCalendarPage ? "min-h-[calc(100vh-400px)]" : ""}`}
    >
      <div className="text-center mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="flex-1 hidden md:block"></div>
          <h1 className="flex-1 leter-spacing-1 text-3xl md:text-5xl font-bold">
            Calendar
          </h1>
          <div className="flex-1 flex justify-center md:justify-end w-full md:w-auto">
            {isAdmin && (
              <NavigationLink href="/calendar/create">
                <Button
                  style={{ background: "#37007d" }}
                  placeholder={""}
                  color="gray"
                  size="sm"
                  className="w-full md:w-auto"
                >
                  Create Race
                </Button>
              </NavigationLink>
            )}
          </div>
        </div>
        <p className="leter-spacing-1 text-base md:text-xl max-w-3xl mx-auto px-2">
          Upcoming races and events
        </p>
      </div>
      <RaceCalendarTable />
    </section>
  );
};
