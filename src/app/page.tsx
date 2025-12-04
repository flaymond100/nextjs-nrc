// components
import { Navbar, Footer } from "@/components";

// sections
import Home from "./home";
import { FormSection } from "@/components/contact-form";
import { Sponsors } from "@/components/sponsors";
import { CalendarPageContent } from "./calendar/page";

export default function Campaign() {
  return (
    <>
      <Navbar />
      <Home />
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
