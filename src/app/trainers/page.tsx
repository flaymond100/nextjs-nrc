// components
import { Navbar, Footer } from "@/components";

// sections
import Trainers from "../trainers";
import Faq from "../faq";
import CarouselFeatures from "../carousel-features";
import { CalendlyWidget } from "@/components/widget";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <Trainers />
      <CarouselFeatures />
      <CalendlyWidget />
      <Faq />
      <Footer />
    </>
  );
}
