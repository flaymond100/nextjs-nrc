"use client";

import React from "react";
import CategoryCard from "@/components/category-card";
import Image from "next/image";

import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import {
  GlobeEuropeAfricaIcon,
  MicrophoneIcon,
  PuzzlePieceIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";

const CATEGORIES = [
  {
    img: "/image/blogs/blog-3.png",
    icon: HeartIcon,
    title: "Fiction Books",
    desc: "up to 40% OFF",
  },
  {
    img: "/image/blogs/blog-12.jpeg",
    icon: PuzzlePieceIcon,
    title: "School Books",
    desc: "up to 40% OFF",
  },
  {
    img: "/image/blogs/blog-10.jpeg",
    icon: GlobeEuropeAfricaIcon,
    title: "Non-fiction Books",
    desc: "up to 40% OFF",
  },
  {
    img: "/image/blogs/blog-13.png",
    icon: MicrophoneIcon,
    title: "SF & Fantasy Books",
    desc: "up to 40% OFF",
  },
];

export function OurServices() {
  return (
    <section className="container mx-auto px-8 pb-20 pt-20 lg:pt-0 ">
      <div className="mb-12 grid place-items-center text-center ">
        <Typography
          placeholder=""
          variant="h2"
          color="blue-gray"
          className="my-3"
        >
          Our Services
        </Typography>
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card
          placeholder=""
          color="gray"
          className="relative grid h-full w-full place-items-center overflow-hidden text-center"
        >
          <Image
            width={768}
            height={768}
            src={"/image/8716_20230423_144655_274310037_original.webp"}
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
            <Button placeholder="" size="sm" color="white">
              Read More
            </Button>
          </CardBody>
        </Card>

        <Card
          placeholder=""
          color="gray"
          className="relative grid h-full w-full place-items-center overflow-hidden text-center"
        >
          <Image
            width={768}
            height={768}
            src={"/image/France_Downhill_Kosta.jpg"}
            alt={"/image/France_Downhill_Kosta.jpg"}
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
            <Button placeholder="" size="sm" color="white">
              Read More
            </Button>
          </CardBody>
        </Card>
        <Card
          placeholder=""
          color="gray"
          className="relative grid h-full w-full place-items-center overflow-hidden text-center"
        >
          <Image
            width={768}
            height={768}
            style={{ left: "-10px" }}
            src={"/image/tri_1.webp"}
            alt={"/image/tri_1.webp"}
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
            <Button className="mb-4" placeholder="" size="sm" color="white">
              Read More
            </Button>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}

export default OurServices;
