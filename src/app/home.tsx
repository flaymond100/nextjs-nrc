"use client";

import Image from "next/image";
import { Button } from "@material-tailwind/react";
import Link from "next/link";

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
          <Image
            width={368}
            height={368}
            src={`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/NRC-2.png`}
            className="animate-in fade-in zoom-in duration-1000  mb-10 "
            alt="logo"
          />
          <p className="leter-spacing-1 text-xl max-w-3xl mb-5">
            Choose between your personalized training plan to unlock your
            potential and achieve peak performance or simply join our cycling
            team for free. We're more than just a team — we're a global
            community of athletes striving to become the best versions of
            ourselves.
          </p>

          <div className="flex justify-center sm:justify-start gap-2">
            <Link
              target="_blank"
              href="https://docs.google.com/forms/d/e/1FAIpQLSe4vxuCkdCzWaMv8SQ60IAqyzCsAsdA5Hhq6ZePYL-J9I7T0g/viewform?usp=sf_link"
            >
              <Button
                style={{ background: "#37007d" }}
                placeholder={""}
                color="gray"
                size="lg"
              >
                Join Team
              </Button>
            </Link>
            <Button
              onClick={scrollToStripeTable}
              size="lg"
              style={{ background: "#37007d" }}
            >
              Personal Coaching
            </Button>
          </div>
        </div>
        <div className=" mt-10 grid gap-6 lg:mt-0 ">
          <Image
            width={468}
            height={468}
            src={`${
              process.env.NEXT_PUBLIC_BASE_URL ?? ""
            }/image/nrc_team_picture.webp`}
            className="animate-in fade-in zoom-in duration-1000  mb-10 rounded-lg shadow-md "
            alt="cyclist in France"
          />
        </div>
      </div>
    </section>
  );
}
export default Home;
