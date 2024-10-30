// components
import { Navbar, Footer } from "@/components";

// sections
import Trainers from "../trainers";
import Faq from "../faq";
import CarouselFeatures from "../carousel-features";
import { CalendlyWidget } from "@/components/widget";
import Prices from "../prices";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <Trainers />
      <Prices />
      <CarouselFeatures />
      <CalendlyWidget />
      <Faq />
      <Footer />
    </>
  );
}
