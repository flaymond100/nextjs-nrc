"use client";
// components
import { Navbar, Footer } from "@/components";
import { RaceCalendarTable } from "@/components/race-calendar";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/utils/supabase";
import { Button } from "@material-tailwind/react";
import { NavigationLink } from "@/components/navigation-link";
import { useEffect, useState } from "react";

export default function CalendarPage() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user?.id) {
        setIsAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("riders")
          .select("is_admin")
          .eq("uuid", user.id)
          .single();

        if (error) {
          console.error("Error fetching rider admin status:", error);
          setIsAdmin(false);
          return;
        }

        setIsAdmin(data?.is_admin === true);
      } catch (err) {
        console.error("Unexpected error:", err);
        setIsAdmin(false);
      }
    }

    checkAdminStatus();
  }, [user]);

  return (
    <>
      <Navbar />
      <section className="container mx-auto px-4 py-6 md:py-12 min-h-screen">
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
      <Footer />
    </>
  );
}
