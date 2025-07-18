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
    // <section className="container text-center md:text-left mt-6 md:mt-10 mx-auto">

    // </section>
    <section className="mb-10 pt-24 flex px-8 pb-20 md:pb-0 bg-[url('/image/team-picture-white.webp')] bg-cover bg-center bg-no-repeat relative min-h-screen flex items-end">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-400 to-white mix-blend-multiply"></div>

      <div className="w-full">
        <div className="animate-in slide-in-from-bottom duration-1000 flex flex-col items-center justify-end mb-10">
          <div className="text-white rounded-lg p-4 bg-gray-900/80 mb-10 z-10">
            <p className="leter-spacing-1 text-xl max-w-3xl mb-5 text-center">
              Welcome to NRC International Team. Whether you're preparing for
              races or simply want to become a part of open minded community
              come and join us! We have regular social rides, monthly training
              plans and we all assist each other to improve.
            </p>
            <p className="leter-spacing-1 text-xl max-w-3xl mb-5 text-center">
              To become part of the team, just fill out our short sign-up form
              and we’ll get in touch with the next steps. Let’s ride stronger,
              together.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 z-10">
            <Link
              target="_blank"
              href="https://docs.google.com/forms/d/e/1FAIpQLSe4vxuCkdCzWaMv8SQ60IAqyzCsAsdA5Hhq6ZePYL-J9I7T0g/viewform?usp=sf_link"
            >
              <Button
                style={{ background: "#37007d" }}
                placeholder={""}
                color="gray"
                size="lg"
                className="w-40 h-12"
              >
                Join Team
              </Button>
            </Link>
            <Link href="/coaching">
              <Button
                style={{ background: "#37007d" }}
                placeholder={""}
                color="gray"
                size="lg"
              >
                Coaching
              </Button>
            </Link>
            <Link
              target="_blank"
              href="https://www.zwift.com/clubs/6a08d729-8add-4088-ad16-7af3316f440f/home"
            >
              <Button
                style={{ background: "#f06723" }}
                placeholder={""}
                color="gray"
                size="lg"
              >
                Zwift Club
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Home;
