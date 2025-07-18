// components
import { Navbar, Footer } from "@/components";

// sections
import Home from "./home";
import Faq from "./faq";
import CarouselFeatures from "./carousel-features";
import { CalendlyWidget } from "@/components/widget";
import { FormSection } from "@/components/contact-form";
import { Sponsors } from "@/components/sponsors";

export default function Campaign() {
  return (
    <>
      <Navbar />
      <Home />
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
