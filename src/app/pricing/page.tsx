// components
import { Navbar, Footer } from "@/components";

// sections
import Prices from "../prices";
import Faq from "../faq";
import CarouselFeatures from "../carousel-features";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <Prices />
      <CarouselFeatures />
      <Faq />
      <Footer />
    </>
  );
}
