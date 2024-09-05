// components
import { Navbar, Footer } from "@/components";

// sections
import Prices from "../prices";
import Faq from "../faq";
import OurPrograms from "../our-programs";
import CarouselFeatures from "../carousel-features";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <OurPrograms />
      <CarouselFeatures />
      <Faq />
    </>
  );
}
