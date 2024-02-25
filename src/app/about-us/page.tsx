// components
import { Navbar, Footer } from "@/components";

// sections
import Prices from "../prices";
import Faq from "../faq";

export default function Campaign() {
  return (
    <>
      <Navbar />
      <Prices />
      <Faq />
    </>
  );
}
