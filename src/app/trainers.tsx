"use client";

import {
  Typography,
  Card,
  CardBody,
  CardHeader,
  Button,
} from "@material-tailwind/react";
import Image from "next/image";

const KOSTA = [
  "My coaching philosophy focuses on creating personalized training plans according to your specific needs and goals.",
  "With over a 8 years of coaching experience in professional sport, I apply the best practices to make the training process as enjoyable as it might be.",
  "Whether you're a beginner or an experienced athelte, I'm here to help you reach your potential in bike and run disciplines.",
  "Join our team and embark on your triathlon journey. Let's set and achieve your goals together!",
];
const KSU = [
  "I hold a Master's degree in Sports Science and completed specialized courses in nutrition and triathlon coaching.",
  "Multiple medalist of national swimming championships. Completed multiple triathlon courses, including Ironman 70.3 competitions.",
  "My philosophy centers around creating tailored training plans designed to meet your unique goals and adapt to your individual needs. My main disciplines are swimming, running and nutritioning.",
  "Don't hesitate to take the first step toward reaching your triathlon goals. I'm excited to help you along every leg of the race. Get started today!",
];
export function Trainers() {
  const scrollToStripeTable = () => {
    const element = document.getElementById("stripe-pricing");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      // style={{
      //   background:
      //     "linear-gradient(to bottom, rgb(250, 201, 44), rgba(255 255 255))",
      // }}
      className="px-8 pt-20 pb-20"
    >
      <div className="container mx-auto mb-20 text-center">
        <h1
          color="blue-gray"
          className="mb-2 leter-spacing-1 text-5xl font-bold"
        >
          Coaching Team
        </h1>

        <div className="flex justify-center">
          <Typography
            placeholder={""}
            variant="lead"
            className="w-full max-w-lg  text-center text-gray-600"
          >
            Meet our coaching team to help you reach your maximal potential.
          </Typography>
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-1 items-start gap-x-6 gap-y-20 md:grid-cols-2">
        <Card
          className={`animate-in slide-in-from-bottom duration-500 bg-white relative grid w-full `}
          placeholder={""}
          color="transparent"
          shadow={true}
        >
          <CardHeader
            style={{
              padding: "50px",
              textAlign: "center",
              background: "#00000008",
            }}
            shadow={false}
            className="mt-0 mr-0 mb-0 ml-0 bg-grey border-0 rounded-none rounded-t-lg"
            placeholder={undefined}
          >
            <div className="flex align-middle justify-center">
              <Image
                width={300}
                height={300}
                style={{
                  objectFit: "cover",
                  objectPosition: "0 -33px",
                }}
                src={`${
                  process.env.NEXT_PUBLIC_BASE_URL ?? ""
                }/image/kosta-avatar.webp`}
                className="w-44 h-44 lg:w-72 lg:h-72 mb-4 rounded-full shadow-lg"
                alt=""
              />
            </div>
            <h2
              color="blue-gray"
              className="font-bold text-3xl text-black normal-case mb-2 tracking-tight"
            >
              Konstantin
            </h2>
            <div className="mb-3 flex gap-2 items-end justify-center">
              <h4 className={"text-xl text-black font-bold tracking-tight"}>
                Founder, Head Coach
              </h4>
            </div>

            <Button
              placeholder={""}
              style={{ background: "#ecd06f" }}
              onClick={scrollToStripeTable}
            >
              Get Started
            </Button>
          </CardHeader>
          <CardBody placeholder={""} className="lg:px-16 sm:px-8">
            <ul
              className={`mb-4 font-normal list-image-[url(/image/checkmark.svg)] ml-4`}
            >
              {KOSTA.map((item, index) => (
                <li className="mb-4 pl-2" key={index}>
                  {item}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
        <Card
          className={`animate-in slide-in-from-bottom duration-1000 bg-white relative grid w-full `}
          placeholder={""}
          color="transparent"
          shadow={true}
        >
          <CardHeader
            style={{
              padding: "50px",
              textAlign: "center",
              background: "#00000008",
            }}
            shadow={false}
            className="mt-0 mr-0 mb-0 ml-0 bg-grey border-0 rounded-none rounded-t-lg"
            placeholder={undefined}
          >
            <div className="flex align-middle justify-center">
              <Image
                width={500}
                height={600}
                style={{
                  objectFit: "cover",
                  objectPosition: "0 -33px",
                }}
                src={`${
                  process.env.NEXT_PUBLIC_BASE_URL ?? ""
                }/image/ksu-avatar.webp`}
                className="w-44 h-44 lg:w-72 lg:h-72 mb-4 rounded-full shadow-lg"
                alt=""
              />
            </div>
            <h2
              color="blue-gray"
              className="font-bold text-3xl text-black normal-case mb-2 tracking-tight"
            >
              Oksana
            </h2>
            <div className="mb-3 flex gap-2 items-end justify-center">
              <h4 className={"text-xl text-black font-bold tracking-tight"}>
                Co-Founder, Coach
              </h4>
            </div>
            <Button
              placeholder={""}
              style={{ background: "#ecd06f" }}
              onClick={scrollToStripeTable}
            >
              Get Started
            </Button>
          </CardHeader>
          <CardBody placeholder={""} className="lg:px-16 sm:px-8">
            <ul
              className={`mb-4 font-normal list-image-[url(/image/checkmark.svg)] ml-4`}
            >
              {KSU.map((item, index) => (
                <li className="mb-4 pl-2" key={index}>
                  {item}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}

export default Trainers;
