"use client";

import Image from "next/image";
import { Button, Typography } from "@material-tailwind/react";
import Link from "next/link";

function Home() {
  return (
    <header className="mt-12 bg-white px-8">
      <div className="container mx-auto grid h-full min-h-[65vh] w-full grid-cols-1 place-items-center gap-y-10 lg:grid-cols-2">
        <div className="row-start-1 sm:-row-start-2 sm:-row-auto lg:-mt-40 text-center sm:text-start">
          <Typography
            placeholder=""
            variant="h1"
            color="blue-gray"
            className="mb-2 max-w-sm text-3xl !leading-snug lg:mb-3 lg:text-5xl text-center sm:text-start"
          >
            Running, Triathlon and Cycling Trainings
          </Typography>
          <Typography
            placeholder=""
            variant="lead"
            className="mb-6 font-normal !text-gray-500 md:pr-16 xl:pr-28 text-center sm:text-start"
          >
            We are not just a team - we are a community of athletes from all
            corners of the globe. We provide individual training plans for
            triathlon, cycling and running.
          </Typography>
          <Link href="?modal=true">
            <Button placeholder="" size="lg" color="gray">
              See Plans
            </Button>
          </Link>
        </div>
        <div className=" mt-10 grid gap-6 lg:mt-0 ">
          <Image
            width={568}
            height={568}
            src="/image/France_Downhill_Kosta.jpg"
            className="animate-in fade-in zoom-in duration-1000 -mt-10 rounded-lg shadow-md "
            alt="cyclist in France"
          />
        </div>
      </div>
    </header>
  );
}
export default Home;
