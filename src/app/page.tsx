// components
import { Navbar, Footer } from "@/components";

// sections
import Home from "./home";
import OurPrograms from "./our-programs";
import Prices from "./prices";
import OurServices from "./our-services";
import Faq from "./faq";

export default function Campaign() {
  return (
    <>
      <Navbar />
      <Home />
      <OurPrograms />
      <OurServices />
      <Prices />
      {/* <CarouselFeatures /> */}
      <Faq />
      <Footer />
    </>
  );
}
