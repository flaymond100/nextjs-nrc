// components
import { Navbar, Footer } from "@/components";

// sections
import Trainers from "../trainers";
import Faq from "../faq";
import CarouselFeatures from "../carousel-features";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <Trainers />
      <CarouselFeatures />
      <Faq />
      <Footer />
    </>
  );
}
