"use client";

import Link from "next/link";
import { Button } from "@material-tailwind/react";
import Image from "next/image";

export const SocialRides = () => {
  return (
    <section className="mb-20 container text-center md:text-left mt-6 md:mt-20 mx-auto px-6">
      <h1 className="mb-8 text-center text-4xl font-bold">
        {" "}
        Open Social Rides in Leipzig
      </h1>
      {/* <h2 className="mb-8 text-center text-xl w-50">
                Join us in Leipzig for an open group rides.
              </h2> */}

      <div className="container mx-auto  grid grid-cols-1 gap-6 lg:grid-cols-2 justify-items-center md:justify-items-end">
        <div className="animate-in slide-in-from-left duration-1000">
          {/* <h2 className="mb-4 text-3xl font-bold">
                    Open Social Rides in Leipzig
                  </h2> */}
          <h3 className="mb-4 text-lg">
            Join us for a group ride and stay fit throughout a year by keeping
            up your training!
          </h3>
          <p className="mb-6">
            🇬🇧 Join us for an open group ride! 🚴‍♀️
            <br /> 📅 Date: Every Saturday <br /> ⏰ Time: 10:00 - 12:30 <br />
            📍 Starting Point: Eventpalast Leipzig
            <br />
            <br />
            We'll ride at a steady, moderated pace (around 27-29 km/h) to ensure
            everyone feels welcome. No one gets left behind—we wait for
            everyone! 🌟
          </p>
          <p className="mb-6">
            🇩🇪 Offene Gruppenausfahrt für alle! 🚴‍♀️ <br />
            📅 Datum: Jeden Samstag <br />⏰ Uhrzeit: 10:00 - 12:30 <br />
            📍 Treffpunkt: Eventpalast Leipzig <br />
            <br /> Wir fahren in einem moderaten Tempo (ca. 27-29 km/h), damit
            sich alle willkommen fühlen. Niemand wird zurückgelassen – wir
            warten auf jeden! 🌟
          </p>
          <br />
          <h3 className="mb-4 text-lg">
            If you want to join the team for free, sign up through the form and
            let's get started together!
          </h3>
          <Link
            target="_blank"
            href="https://docs.google.com/forms/d/e/1FAIpQLSe4vxuCkdCzWaMv8SQ60IAqyzCsAsdA5Hhq6ZePYL-J9I7T0g/viewform?usp=sf_link"
          >
            <Button
              style={{ background: "#37007d" }}
              placeholder={""}
              color="gray"
            >
              Sign Up
            </Button>
          </Link>
        </div>

        <Image
          width={300}
          height={400}
          src={`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/image/poster.png`}
          className="animate-in slide-in-from-right duration-1000 mb-6 w-70 rounded-lg shadow-lg dark:shadow-black/20  "
          alt=""
        />
      </div>
    </section>
  );
};
