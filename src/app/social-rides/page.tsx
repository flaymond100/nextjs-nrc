// components
import { Navbar, Footer } from "@/components";

// sections
import Faq from "../faq";
import CarouselFeatures from "../carousel-features";
import { CalendlyWidget } from "@/components/widget";
import { SocialRides } from "@/components/social-rides";
import { FormSection } from "../coaching/page";

export default function SocialRidesPage() {
  return (
    <>
      <Navbar />
      <SocialRides />
      <FormSection />
      <CarouselFeatures />
      <CalendlyWidget />
      <Faq />
      <Footer />
    </>
  );
}
