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
        {/* <Typography
          placeholder=""
          variant="lead"
          className="!text-gray-500 lg:w-6/12"
        >
          We are not just a team - we are a community of athletes from all
          corners of the world, united by a shared love for endurance sports and
          become healthier people.
        </Typography> */}
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
          <CardBody placeholder="" className="relative  h-full  w-full">
            {/* <Typography
              placeholder=""
              color="white"
              className="text-xs font-bold opacity-70"
            >
              up to 40% OFF
            </Typography> */}
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
            <Link href="/plans/running-trainings">
              <Button placeholder="" size="sm" color="white">
                Read More
              </Button>
            </Link>
          </CardBody>
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
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/image/France_Downhill_Kosta.jpg`}
            alt={" /image/France_Downhill_Kosta.jpg"}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
          <CardBody placeholder="" className="relative  h-full  w-full">
            {/* <Typography
              placeholder=""
              color="white"
              className="text-xs font-bold opacity-70"
            >
              up to 40% OFF
            </Typography> */}
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
              Discover the world of cycling with our personalized plans. Whether
              you are a beginner or an experienced athlete, we are here to help
              you reach your full potential.
            </Typography>
            <Link href="/plans/cycling-trainings">
              <Button placeholder="" size="sm" color="white">
                Read More
              </Button>
            </Link>
          </CardBody>
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
          <CardBody placeholder="" className="relative  h-full  w-full">
            {/* <Typography
              placeholder=""
              color="white"
              className="text-xs font-bold opacity-70"
            >
              up to 40% OFF
            </Typography> */}
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
              Dive into the world of triathlon with us! Whether you are a newbie
              or a seasoned triathlete, our presonalised plans will help you
              complete triathlon disciplines with confidence.
            </Typography>
            <Link href="/plans/triathlon-trainings">
              <Button className="mb-4" placeholder="" size="sm" color="white">
                Read More
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}

export default OurPrograms;
