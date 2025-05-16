"use client";

import Image from "next/image";
import { Button } from "@material-tailwind/react";
import Link from "next/link";
import { BsInstagram } from "react-icons/bs";
import { TeamIntro } from "@/components/team-intro";
import { SocialRides } from "@/components/social-rides";
function Home() {
  const scrollToStripeTable = () => {
    const element = document.getElementById("stripe-pricing");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <section className="container text-center md:text-left mt-6 md:mt-10 mx-auto">
      <TeamIntro />
      <SocialRides />
    </section>
    // <section className="pt-12 px-8 pb-20 md:pb-0">
    //   <div className="container mx-auto grid h-full min-h-[65vh] w-full grid-cols-1 place-items-center gap-y-10 lg:grid-cols-2">
    //     <div className="animate-in slide-in-from-left duration-2000 row-start-1 sm:-row-start-2 sm:-row-auto lg:-mt-40 text-center sm:text-start">
    //       <p className="leter-spacing-1 text-xl max-w-3xl mb-5">
    //         We're more than just a team — we're a community of athletes striving
    //         to become the best versions of ourselves.
    //       </p>
    //       <p className="leter-spacing-1 text-xl max-w-3xl mb-5">
    //         Choose between your personalized training plan to unlock your
    //         potential and achieve peak performance or simply join our cycling
    //         team for free.
    //       </p>

    //       <div className="flex justify-center sm:justify-start gap-2">
    //         <Link
    //           target="_blank"
    //           href="https://docs.google.com/forms/d/e/1FAIpQLSe4vxuCkdCzWaMv8SQ60IAqyzCsAsdA5Hhq6ZePYL-J9I7T0g/viewform?usp=sf_link"
    //         >
    //           <Button
    //             style={{ background: "#37007d" }}
    //             placeholder={""}
    //             color="gray"
    //             size="lg"
    //             className="w-40 h-12"
    //           >
    //             Join Team
    //           </Button>
    //         </Link>
    //         <Button
    //           onClick={scrollToStripeTable}
    //           size="lg"
    //           style={{ background: "#37007d" }}
    //           className="flex justify-center items-center w-40 h-12"
    //         >
    //           Personal Coaching
    //         </Button>
    //       </div>
    //     </div>
    //     <div className="mt-10 grid gap-6 lg:mt-0 text-center mx-auto">
    //       <Image
    //         width={800}
    //         height={800}
    //         src={`${
    //           process.env.NEXT_PUBLIC_BASE_URL ?? ""
    //         }/image/team-picture-black.webp`}
    //         className="animate-in fade-in zoom-in duration-1000  mb-10 rounded-lg shadow-md "
    //         alt="cyclist in France"
    //       />
    //     </div>
    //   </div>
    // </section>
  );
}
export default Home;
