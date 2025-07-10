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
import { SocialRides } from "@/components/social-rides";

export default function Campaign() {
  return (
    <>
      <Home />
      {/* <SocialRides /> */}
      {/* <OurPrograms />
      <Prices />
      <OurServices />
      <CarouselFeatures />
      <CalendlyWidget /> */}
      <Faq />
      <Footer />
    </>
  );
}
