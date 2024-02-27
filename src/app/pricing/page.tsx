// components
import { Navbar, Footer } from "@/components";

// sections
import Prices from "../prices";
import Faq from "../faq";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <Prices />
      <Faq />
      <Footer />
    </>
  );
}
