"use client";

import Link from "next/link";
import { Button } from "@material-tailwind/react";
import Image from "next/image";
import { BsInstagram } from "react-icons/bs";

export const SocialRides = () => {
  return (
    <div className="container text-center md:text-left mt-6 mb-10 md:mt-10 mx-auto">
      <h1 className="mb-8 mt-10 text-center text-4xl font-bold">
        {" "}
        Open Social Rides in Leipzig
      </h1>
      <h1 className="mb-8 mt-10 text-center text-2xl font-bold text-red-600">
        {" "}
        <strong>NO Social Ride on 31 May!</strong> The team will be in Magdeburg
        for the race.
        <br />
        We will be back on 7 June.
      </h1>
      <div className="container mx-auto  grid grid-cols-1 gap-6 lg:grid-cols-2 justify-items-center md:justify-items-end">
        <div className="animate-in slide-in-from-left duration-1000">
          <p className="leter-spacing-1 text-xl max-w-3xl mb-5">
            For those nearby, we host regular rides and training sessions in
            Leipzig, creating opportunities to connect and grow together in
            person.
          </p>
          <h3 className="mb-2 text-2xl font-bold text-red-600">
            ⚠️ Be aware that starting point might change! Please follow us on
            Instagram for updates. ⚠️
          </h3>
          <Link
            aria-label="Go to instagram"
            target="_blank"
            href="https://www.instagram.com/nrc.int.team/"
          >
            <Button
              placeholder={""}
              aria-label="Go to instagram"
              size="lg"
              name="Instagram"
              className="bg-gradient-to-tr mb-10 from-yellow-500 via-pink-600 to-purple-700 hover:from-yellow-600 hover:via-pink-700 hover:to-purple-800"
            >
              <BsInstagram className="text-white text-xl" />
            </Button>
          </Link>
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
          <p className="mb-4">
            🇩🇪 Offene Gruppenausfahrt für alle! 🚴‍♀️ <br />
            📅 Datum: Jeden Samstag <br />⏰ Uhrzeit: 10:00 - 12:30 <br />
            📍 Treffpunkt: Eventpalast Leipzig <br />
            <br /> Wir fahren in einem moderaten Tempo (ca. 27-29 km/h), damit
            sich alle willkommen fühlen. Niemand wird zurückgelassen – wir
            warten auf jeden! 🌟
          </p>
          <br />
        </div>

        <Image
          width={300}
          height={400}
          src={`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/image/poster.png`}
          className="animate-in slide-in-from-right duration-1000 mb-6 w-80 rounded-lg shadow-lg dark:shadow-black/20  "
          alt=""
        />
      </div>
    </div>
  );
};
