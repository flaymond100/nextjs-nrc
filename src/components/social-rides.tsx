"use client";

import Link from "next/link";
import { Button } from "@material-tailwind/react";
import Image from "next/image";

export const SocialRides = () => {
  return (
    <section className="mb-20 container text-center md:text-left mt-6 md:mt-20 mx-auto px-6">
      <h1
        color="blue-gray"
        className="mb-4 leter-spacing-1 text-5xl font-bold text-center"
      >
        Join NRC Cycling Team
      </h1>
      <Image
        width={800}
        height={800}
        src={`${
          process.env.NEXT_PUBLIC_BASE_URL ?? ""
        }/image/NRC-Team-Jersey.png`}
        className="animate-in slide-in-from-right duration-1000 mb-6 w-full rounded-lg shadow-lg dark:shadow-black/20  "
        alt=""
      />

      <div className="flex flex-col items-center justify-center mb-10">
        <p className="leter-spacing-1 text-xl max-w-3xl mb-5 text-center">
          Joining the team is easy and completely free. The only commitment is
          purchasing our team jersey for €60, which represents our shared spirit
          and identity.
        </p>
        <p className="leter-spacing-1 text-xl max-w-3xl mb-5 text-center">
          Once you have it, you’re officially part of the team and ready to ride
          with us both online and offline. You can join us on Zwift, where we
          ride virtually as a team, train, and compete—all from the comfort of
          your home.
        </p>

        <Link
          target="_blank"
          href="https://docs.google.com/forms/d/e/1FAIpQLSe4vxuCkdCzWaMv8SQ60IAqyzCsAsdA5Hhq6ZePYL-J9I7T0g/viewform?usp=sf_link"
        >
          <Button
            style={{ background: "#ecd06f" }}
            placeholder={""}
            color="gray"
            size="lg"
          >
            Join Us
          </Button>
        </Link>
      </div>

      <h1 className="mb-8 text-center text-4xl font-bold">
        {" "}
        Open Social Rides in Leipzig
      </h1>

      <div className="container mx-auto  grid grid-cols-1 gap-6 lg:grid-cols-2 justify-items-center md:justify-items-end">
        <div className="animate-in slide-in-from-left duration-1000">
          <p className="leter-spacing-1 text-xl max-w-3xl mb-5">
            For those nearby, we host regular rides and training sessions in
            Leipzig, creating opportunities to connect and grow together in
            person.
          </p>
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
              style={{ background: "#ecd06f", marginRight: "20px" }}
              placeholder={""}
              color="gray"
              size="lg"
            >
              Join Us
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

        <Image
          width={300}
          height={400}
          src={`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/image/poster.png`}
          className="animate-in slide-in-from-right duration-1000 mb-6 w-80 rounded-lg shadow-lg dark:shadow-black/20  "
          alt=""
        />
      </div>
    </section>
  );
};
