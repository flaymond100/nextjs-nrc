"use client";

import React from "react";
import Image from "next/image";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import Link from "next/link";

export function OurPrograms() {
  return (
    <section
      style={{
        background:
          "linear-gradient(to bottom, rgb(237 242 246), rgba(255 255 255))",
      }}
      className="px-8 pt-20 pb-20"
    >
      <div className="animate-in slide-in-from-bottom duration-1000 container mx-auto mb-10 grid place-items-center text-center ">
        <h1 color="blue-gray" className="my-3 text-4xl font-bold">
          Our Trainings
        </h1>
      </div>
      <div className="container mx-auto mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card
          id="running"
          placeholder=""
          color="gray"
          className="animate-in slide-in-from-left duration-1000 relative grid h-full w-full place-items-center overflow-hidden text-center"
        >
          <Image
            width={768}
            height={768}
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/image/8716_20230423_144655_274310037_original.webp`}
            alt={"/image/8716_20230423_144655_274310037_original.webp"}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
          <div className="flex flex-col " style={{ zIndex: "1" }}>
            <CardBody placeholder="" className="relative  h-full  w-full">
              <Typography
                placeholder=""
                variant="h4"
                className="mt-9"
                color="white"
              >
                Running Trainings
              </Typography>
              <Typography
                placeholder=""
                color="white"
                className="mt-4 mb-14 font-normal opacity-70"
              >
                Elevate your running performance with our personalized training
                plans tailored to your fitness level and goals. Our experienced
                coaches provide support to help you reach new goals.
              </Typography>
            </CardBody>
            <Link style={{ zIndex: "1" }} href="/plans/running-trainings">
              <Button placeholder="" className="mb-8" size="sm" color="white">
                Read More
              </Button>
            </Link>
          </div>
        </Card>

        <Card
          id="cycling"
          placeholder=""
          color="gray"
          className="animate-in slide-in-from-bottom duration-1000 relative grid h-full w-full place-items-center overflow-hidden text-center"
        >
          <Image
            width={768}
            height={768}
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/image/France_Downhill_Kosta.webp`}
            alt={" /image/France_Downhill_Kosta.webp"}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
          <div className="flex flex-col " style={{ zIndex: "1" }}>
            <CardBody placeholder="" className="relative  h-full  w-full">
              <Typography
                placeholder=""
                variant="h4"
                className="mt-9"
                color="white"
              >
                Cycling Trainings
              </Typography>
              <Typography
                placeholder=""
                color="white"
                className="mt-4 mb-14 font-normal opacity-70"
              >
                Discover the world of cycling with our personalized plans.
                Whether you are a beginner or an experienced athlete, we are
                here to help you reach your full potential.
              </Typography>
            </CardBody>
            <Link
              aria-label="Read more about cycling trainings"
              style={{ zIndex: "1" }}
              href="/plans/cycling-trainings"
            >
              <Button placeholder="" className="mb-8" size="sm" color="white">
                Read More
              </Button>
            </Link>
          </div>
        </Card>
        <Card
          id="triathlon"
          placeholder=""
          color="gray"
          className="animate-in slide-in-from-right duration-1000 relative grid h-full w-full place-items-center overflow-hidden text-center"
        >
          <Image
            width={768}
            height={768}
            style={{ left: "-10px" }}
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/image/tri_1.webp`}
            alt={" /image/tri_1.webp"}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
          <div className="flex flex-col " style={{ zIndex: "1" }}>
            <CardBody placeholder="" className="relative  h-full  w-full">
              <Typography
                placeholder=""
                variant="h4"
                className="mt-9"
                color="white"
              >
                Triathlon Trainings
              </Typography>
              <Typography
                placeholder=""
                color="white"
                className="mt-4 mb-14 font-normal opacity-70"
              >
                Dive into the world of triathlon with us! Whether you are a
                newbie or a seasoned triathlete, our presonalised plans will
                help you complete triathlon disciplines with confidence.
              </Typography>
            </CardBody>
            <Link
              aria-label="Read more about triathlon trainings"
              style={{ zIndex: "1" }}
              href="/plans/triathlon-trainings"
            >
              <Button placeholder="" className="mb-8" size="sm" color="white">
                Read More
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}

export default OurPrograms;
