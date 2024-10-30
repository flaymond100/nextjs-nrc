// components
import { Navbar, Footer } from "@/components";

// sections
import Home from "./home";
import OurPrograms from "./our-programs";
import Prices from "./prices";
import OurServices from "./our-services";
import Faq from "./faq";
import CarouselFeatures from "./carousel-features";
import { CalendlyWidget } from "@/components/widget";

export default function Campaign() {
  return (
    <>
      <Navbar />
      <Home />
      <OurPrograms />
      <Prices />
      <OurServices />
      <CarouselFeatures />
      <CalendlyWidget />
      <Faq />
      <Footer />
    </>
  );
}
