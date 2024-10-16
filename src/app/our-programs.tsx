"use client";

import React from "react";
import Image from "next/image";
import {
  Card,
  CardBody,
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  PaperAirplaneIcon,
  DocumentCheckIcon,
  CalendarDaysIcon,
  CheckIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function OurPrograms() {
  const pathname = usePathname();
  const homePage = pathname === "/";
  return (
    <section
      style={{
        background:
          "linear-gradient(to bottom, rgb(237 242 246), rgba(255 255 255))",
      }}
      className="px-8 pt-20 pb-20"
    >
      {homePage && <TimelineWithIcon />}

      <div className="animate-in slide-in-from-bottom duration-1000 container mx-auto mb-10 grid place-items-center text-center ">
        <h1 color="blue-gray" className=" my-3 text-4xl font-bold">
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

      {!homePage && <TimelineWithIcon />}
    </section>
  );
}

const TimelineWithIcon = () => {
  return (
    <div className="mx-auto w-4/5 lg:w-[32rem]">
      <div className="animate-in slide-in-from-bottom duration-2000 container mx-auto mb-10 grid place-items-center text-center ">
        <h1 color="blue-gray" className=" text-4xl font-bold">
          How it Works
        </h1>
      </div>
      <Timeline>
        <TimelineItem className="animate-in slide-in-from-left duration-2000">
          <TimelineConnector />
          <TimelineHeader>
            <TimelineIcon className="p-2">
              <PaperAirplaneIcon className="h-4 w-4" />
            </TimelineIcon>
            <Typography placeholder="" variant="h5" color="blue-gray">
              Sign Up and Get in Touch
            </Typography>
          </TimelineHeader>
          <TimelineBody className="pb-8">
            <Typography
              placeholder=""
              color="gray"
              className="font-normal text-gray-600"
            >
              Begin by filling out our quick{" "}
              <Link
                className="underline"
                style={{ fontWeight: "bold", color: "black" }}
                aria-label="sign-up-form"
                href="/get-started"
              >
                sign-up form
              </Link>
              . Leave your contact details, and we’ll reach out to you shortly
              to get started on your journey.
            </Typography>
          </TimelineBody>
        </TimelineItem>
        <TimelineItem className="animate-in slide-in-from-right duration-3000">
          <TimelineConnector />
          <TimelineHeader>
            <TimelineIcon className="p-2">
              <DocumentCheckIcon className="h-4 w-4" />
            </TimelineIcon>
            <Typography placeholder="" variant="h5" color="blue-gray">
              Complete the Athlete Questionnaire
            </Typography>
          </TimelineHeader>
          <TimelineBody className="pb-8">
            <Typography
              placeholder=""
              color="gray"
              className="font-normal text-gray-600"
            >
              To help us better understand your sport background, training
              history, and future goals, we will send you over email our athlete
              questionnaire. Please send it back to us once you have filled it
              out. This will give us valuable insights to create a plan tailored
              just for you.
            </Typography>
          </TimelineBody>
        </TimelineItem>
        <TimelineItem className="animate-in slide-in-from-left duration-4000">
          <TimelineConnector />
          <TimelineHeader>
            <TimelineIcon className="p-2">
              <CalendarDaysIcon className="h-4 w-4" />
            </TimelineIcon>
            <Typography placeholder="" variant="h5" color="blue-gray">
              Schedule a Personal Call
            </Typography>
          </TimelineHeader>
          <TimelineBody>
            <Typography
              placeholder=""
              color="gray"
              className="font-normal text-gray-600 pb-8"
            >
              Let’s get to know each other! We'll set up a call to discuss your
              goals, preferences, and any specific requirements you have. It’s a
              chance for us to align on how we can best work together.
            </Typography>
          </TimelineBody>
        </TimelineItem>
        <TimelineItem className="animate-in slide-in-from-right duration-5000">
          <TimelineHeader>
            <TimelineIcon className="p-2">
              <CheckIcon className="h-4 w-4" />
            </TimelineIcon>
            <Typography placeholder="" variant="h5" color="blue-gray">
              Receive Your Customized Training Plan
            </Typography>
          </TimelineHeader>
          <TimelineBody>
            <Typography
              placeholder=""
              color="gray"
              className="font-normal text-gray-600"
            >
              Once we've gathered all the details, you’ll receive a personalized
              training plan via TrainingPeaks. Follow your plan, track your
              progress, and start your journey toward achieving your cycling
              goals.
            </Typography>
          </TimelineBody>
        </TimelineItem>
      </Timeline>

      <div className="animate-in slide-in-from-bottom duration-2000 container mx-auto mt-10 mb-10 grid place-items-center text-center ">
        <div
          style={{ color: "white" }}
          className="animate-bounce p-2 mb-10 w-10 h-10 ring-1 ring-purple-900 shadow-lg rounded-full flex items-center justify-center"
        >
          <ChevronDownIcon className="h-4 w-4" style={{ color: "#37007d" }} />
        </div>
        <Link aria-label="sing-up-form" href="/get-started">
          <Button placeholder="" size="lg" style={{ background: "#37007d" }}>
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OurPrograms;
