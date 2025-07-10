"use client";

import Image from "next/image";
import { Button } from "@material-tailwind/react";

function Home() {
  const scrollToStripeTable = () => {
    const element = document.getElementById("stripe-pricing");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <section className="pt-12 px-8 pb-20 md:pb-0">
      <div className="container mx-auto grid h-full min-h-[65vh] w-full grid-cols-1 place-items-center gap-y-10 lg:grid-cols-2">
        <div className="animate-in slide-in-from-left duration-2000 row-start-1 sm:-row-start-2 sm:-row-auto lg:-mt-40 text-center sm:text-start">
          <h1
            color="black"
            className="mb-2 max-w-sm text-3xl !leading-snug lg:mb-3 lg:text-6xl text-center sm:text-start font-bold"
          >
            Cycling and Triathlon Coaching
          </h1>
          <p className="leter-spacing-1 text-xl max-w-3xl mb-5">
            Choose between your personalized training plan to unlock your
            potential and achieve peak performance or simply join our cycling
            team for free. We’re more than just a team—we’re a global community
            of athletes striving to become the best versions of ourselves.
          </p>

          <Button
            onClick={scrollToStripeTable}
            size="lg"
            style={{ background: "#37007d" }}
          >
            Get Started
          </Button>
        </div>
        <div className=" mt-10 grid gap-6 lg:mt-0 ">
          <Image
            width={568}
            height={568}
            src={`${
              process.env.NEXT_PUBLIC_BASE_URL ?? ""
            }/image/nrc_kosta.webp`}
            className="animate-in fade-in zoom-in duration-1000  mb-10 rounded-lg shadow-md "
            alt="cyclist in France"
          />
        </div>
      </div>
    </section>
  );
}
export default Home;
