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
import { useScrollPosition } from "@/hooks/use-scroll-position";

export default function Campaign() {
  const { user, loading: authLoading } = useAuth();
  const [userRider, setUserRider] = useState<Rider | null>(null);
  const [checkingRider, setCheckingRider] = useState(true);
  const [showMobileBanner, setShowMobileBanner] = useState(false);
  const scrollPosition = useScrollPosition();

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

  useEffect(() => {
    const syncBannerFromHash = () => {
      setShowMobileBanner(window.location.hash === "#calendar-anchor");
    };

    // Initialize from current URL and keep in sync with hash updates.
    syncBannerFromHash();
    window.addEventListener("hashchange", syncBannerFromHash);

    return () => {
      window.removeEventListener("hashchange", syncBannerFromHash);
    };
  }, []);

  useEffect(() => {
    if (authLoading || checkingRider) return;

    const anchorElement = document.getElementById("calendar-anchor");
    if (!anchorElement) return;

    const rect = anchorElement.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const inViewport =
      rect.top <= viewportHeight * 0.8 && rect.bottom >= viewportHeight * 0.2;
    const hasAnchorHash = window.location.hash === "#calendar-anchor";

    if (inViewport && !hasAnchorHash) {
      window.location.hash = "calendar-anchor";
      setShowMobileBanner(true);
    }

    if (!inViewport && hasAnchorHash) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`
      );
      setShowMobileBanner(false);
    }
  }, [scrollPosition, authLoading, checkingRider]);

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
      <div className="relative flex items-start w-full">
        {/* Left Banner - visible at lg+ */}
        <div className="hidden lg:flex flex-col items-center justify-start sticky top-24 self-start flex-1 max-w-[180px] xl:max-w-[280px] shrink-0 py-8">
          <a
            href="https://www.roadclassics.cz/en/propozice/palava"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/banner.png"
              alt="Banner"
              className="w-[120px] xl:w-[180px] object-contain rounded-lg border border-black shadow-md shadow-black/20 hover:opacity-90 transition-opacity"
            />
          </a>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 pb-28 960:pb-0">
          <CalendarPageContent />
        </div>

        {/* Right Banner - visible at lg+ */}
        <div className="hidden lg:flex flex-col items-center justify-start sticky top-24 self-start flex-1 max-w-[180px] xl:max-w-[280px] shrink-0 py-8">
          <a
            href="https://www.roadclassics.cz/en/propozice/palava"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/banner.png"
              alt="Banner"
              className="w-[120px] xl:w-[180px] object-contain rounded-lg border border-black shadow-md shadow-black/20 hover:opacity-90 transition-opacity"
            />
          </a>
        </div>

        {/* Bottom banner - visible below 960px, fixed to viewport bottom */}
        {!showWelcome && (
          <div
            className={`960:hidden fixed bottom-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
              showMobileBanner
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6 pointer-events-none"
            }`}
          >
            <a
              href="https://www.roadclassics.cz/en/propozice/palava"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/banner-mobile.png"
                alt="Banner"
                className={`w-[80vw] max-w-[80vw] h-auto object-contain rounded-lg border border-black shadow-md shadow-black/20 hover:opacity-90 transition-all duration-500 ${
                  showMobileBanner ? "scale-100" : "scale-95"
                }`}
              />
            </a>
          </div>
        )}
      </div>
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
