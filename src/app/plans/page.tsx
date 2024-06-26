// components
import { Navbar, Footer } from "@/components";

// sections
import Prices from "../prices";
import Faq from "../faq";
import OurPrograms from "../our-programs";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <OurPrograms />
      <Faq />
    </>
  );
}
