// components
import { Navbar, Footer } from "@/components";

// sections
import Faq from "../faq";
import Image from "next/image";
import CarouselFeatures from "../carousel-features";
import { CalendlyWidget } from "@/components/widget";
import Prices from "../prices";
import { ChooseType } from "@/components/home-choose-type";

export default function AboutUsPage() {
  return (
    <>
      {/* <Navbar /> */}
      <AboutUs />
      {/* <Footer /> */}
    </>
  );
}

const AboutUs = () => {
  return (
    <section className="center-section">
      <ChooseType />
    </section>
  );
};
