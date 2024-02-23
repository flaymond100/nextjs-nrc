// components
import { Navbar, Footer } from "@/components";

// sections
import Home from "./home";
import OurServices from "./our-services";
import BackToSchoolBooks from "./back-to-school-books";
import OtherBookOffers from "./other-book-offers";
import CarouselFeatures from "./carousel-features";
import GetYourBookFromUs from "./get-your-book-from-us";
import Faq from "./faq";

export default function Campaign() {
  return (
    <>
      <Navbar />
      <Home />
      <OurServices />
      <BackToSchoolBooks />
      <OtherBookOffers />
      <CarouselFeatures />
      <GetYourBookFromUs />
      <Faq />
      <Footer />
    </>
  );
}
