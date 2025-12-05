"use client";
// components
import { Navbar, Footer } from "@/components";

// sections
import Home from "./home";
import { WelcomeSection } from "@/components/welcome-section";
import { FormSection } from "@/components/contact-form";
import { Sponsors } from "@/components/sponsors";
import { CalendarPageContent } from "./calendar/page";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Rider } from "@/utils/types";
import { Loader } from "@/components/loader";

export default function Campaign() {
  const { user, loading: authLoading } = useAuth();
  const [userRider, setUserRider] = useState<Rider | null>(null);
  const [checkingRider, setCheckingRider] = useState(true);

  useEffect(() => {
    async function fetchUserRider() {
      if (!user) {
        setUserRider(null);
        setCheckingRider(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("riders")
          .select("*")
          .eq("uuid", user.id)
          .single();

        if (error) {
          console.error("Error fetching rider data:", error);
          setUserRider(null);
        } else {
          setUserRider(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setUserRider(null);
      } finally {
        setCheckingRider(false);
      }
    }

    if (!authLoading) {
      fetchUserRider();
    }
  }, [user, authLoading]);

  // Show loader while checking auth and rider status
  if (authLoading || checkingRider) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader />
        </div>
        <Footer />
      </>
    );
  }

  // Check if user is logged in and activated
  const showWelcome = user && userRider?.isActivated;

  return (
    <>
      <Navbar />
      {showWelcome ? (
        <WelcomeSection firstName={userRider.firstName} />
      ) : (
        <Home />
      )}
      <CalendarPageContent />
      <SponsorsWrapper />
      <FormSection />
      <Footer />
    </>
  );
}

const SponsorsWrapper = () => {
  return (
    <div className="container mx-auto px-4 py-12 mb-10">
      <Sponsors />
    </div>
  );
};
