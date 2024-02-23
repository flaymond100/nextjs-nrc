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
      <div className="mb-20 grid place-items-center text-center ">
        <Typography
          placeholder=""
          variant="h2"
          color="blue-gray"
          className="my-3"
        >
          Our Services
        </Typography>
        <Typography
          placeholder=""
          variant="lead"
          className="!text-gray-500 lg:w-6/12"
        >
          We are not just a team - we are a community of athletes from all
          corners of the world, united by a shared love for endurance sports and
          become healthier people.
        </Typography>
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
          <CardBody placeholder="" className="relative w-full">
            {/* <Typography
              placeholder=""
              color="white"
              className="text-xs font-bold opacity-50"
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
              className="mt-4 mb-14 font-normal opacity-50"
            >
              Explore our extensive collection of textbooks, workbooks, novels,
              and more. From preschool to post-grad, we have books for every age
              and academic level.
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
          <CardBody placeholder="" className="relative w-full">
            {/* <Typography
              placeholder=""
              color="white"
              className="text-xs font-bold opacity-50"
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
              className="mt-4 mb-14 font-normal opacity-50"
            >
              Explore our extensive collection of textbooks, workbooks, novels,
              and more. From preschool to post-grad, we have books for every age
              and academic level.
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
          <CardBody placeholder="" className="relative w-full">
            {/* <Typography
              placeholder=""
              color="white"
              className="text-xs font-bold opacity-50"
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
              className="mt-4 mb-14 font-normal opacity-50"
            >
              Explore our extensive collection of textbooks, workbooks, novels,
              and more. From preschool to post-grad, we have books for every age
              and academic level.
            </Typography>
            <Button placeholder="" size="sm" color="white">
              Read More
            </Button>
          </CardBody>
        </Card>
        {/* <div className="col-span-1 flex flex-col gap-6">
          {CATEGORIES.slice(0, 2).map((props, key) => (
            <CategoryCard key={key} {...props} />
          ))}
        </div>
        <div className="col-span-1 flex flex-col gap-6">
          {CATEGORIES.slice(2, 4).map((props, key) => (
            <CategoryCard key={key} {...props} />
          ))}
        </div> */}
      </div>
    </section>
  );
}

export default OurServices;
