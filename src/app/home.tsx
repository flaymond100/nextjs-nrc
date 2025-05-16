"use client";

import Image from "next/image";
import { Button } from "@material-tailwind/react";
import Link from "next/link";
import { BsInstagram } from "react-icons/bs";

function Home() {
  const scrollToStripeTable = () => {
    const element = document.getElementById("stripe-pricing");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <section className="mb-20 container text-center md:text-left mt-6 md:mt-10 mx-auto ">
      <h1
        color="blue-gray"
        className="mb-10 leter-spacing-1 text-5xl font-bold text-center"
      >
        NRC Cycling Team
      </h1>
      <Image
        width={800}
        height={800}
        src={`${
          process.env.NEXT_PUBLIC_BASE_URL ?? ""
        }/image/team-picture-white.webp`}
        className="animate-in slide-in-from-right duration-1000 mb-6 w-full rounded-lg shadow-lg dark:shadow-black/20  "
        alt=""
      />
      <div className="flex justify-center flex-col items-center text-center">
        <p className="leter-spacing-1 text-2xl max-w-3xl mb-5">
          We're more than just a team — we're a community of athletes striving
          to become the best versions of ourselves.
        </p>
        <p className="leter-spacing-1 text-2xl max-w-3xl mb-5">
          Choose between your personalized training plan to unlock your
          potential and achieve peak performance or simply join our cycling team
          for free.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
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
        <Button
          onClick={scrollToStripeTable}
          size="lg"
          style={{ background: "#37007d" }}
          className="flex justify-center items-center w-40 h-12"
        >
          Personal Coaching
        </Button>
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

      <h1 className="mb-8 mt-20 text-center text-4xl font-bold">
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
          <p className="mb-4">
            🇩🇪 Offene Gruppenausfahrt für alle! 🚴‍♀️ <br />
            📅 Datum: Jeden Samstag <br />⏰ Uhrzeit: 10:00 - 12:30 <br />
            📍 Treffpunkt: Eventpalast Leipzig <br />
            <br /> Wir fahren in einem moderaten Tempo (ca. 27-29 km/h), damit
            sich alle willkommen fühlen. Niemand wird zurückgelassen – wir
            warten auf jeden! 🌟
          </p>
          <br />
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
              className="bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700 hover:from-yellow-600 hover:via-pink-700 hover:to-purple-800"
            >
              <BsInstagram className="text-white text-xl" />
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
