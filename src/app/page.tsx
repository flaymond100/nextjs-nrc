// components
import { Navbar, Footer } from "@/components";

// sections
import Home from "./home";
import OurPrograms from "./our-programs";
import Prices from "./prices";
import OurServices from "./our-services";
import Faq from "./faq";
import CarouselFeatures from "./carousel-features";

export default function Campaign() {
  return (
    <>
      <Navbar />
      <Home />
      <OurPrograms />
      <Prices />
      <OurServices />
      <CarouselFeatures />
      <Faq />
      <Footer />
    </>
  );
}
