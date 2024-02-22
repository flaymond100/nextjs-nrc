"use client";

import Image from "next/image";
import { Button, Typography } from "@material-tailwind/react";

function Hero() {
  return (
    <header className="mt-12 bg-white px-8">
      <div className="container mx-auto grid h-full min-h-[65vh] w-full grid-cols-1 place-items-center gap-y-10 lg:grid-cols-2">
        <div className="row-start-2 lg:row-auto lg:-mt-40">
          <Typography
            variant="h1"
            color="blue-gray"
            className="mb-2 max-w-sm text-3xl !leading-snug lg:mb-3 lg:text-5xl"
          >
            Running, Triathlon and Cycling Trainings
          </Typography>
          <Typography
            variant="lead"
            className="mb-6 font-normal !text-gray-500 md:pr-16 xl:pr-28"
          >
            We are not just a team - we are a community of athletes from all
            corners of the globe. We provide individual training plans for
            triathlon, cycling and running.
          </Typography>
          <Button size="lg" color="gray">
            See Plans
          </Button>
        </div>
        <div className="mt-10 grid gap-6 lg:mt-0">
          <Image
            width={568}
            height={568}
            src="/image/France_Downhill.jpg"
            className="-mt-10 rounded-lg shadow-md"
            alt="flowers"
          />
        </div>
      </div>
    </header>
  );
}
export default Hero;
