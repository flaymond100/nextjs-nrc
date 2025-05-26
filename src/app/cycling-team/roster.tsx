"use client";
// components
import { Footer, Navbar } from "@/components";

// sections
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  CardFooter,
} from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { BsInstagram, BsStrava } from "react-icons/bs";
export const Roster = () => {
  const riders = [
    {
      id: 2,
      name: "Christoph",
      role: "Rouleur/All-rounder",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Christoph.webp`,
      bio: "I love long, rolling courses and like putting pressure on for my team.",
      stravaUrl: "https://strava.app.link/xmg0DzbYzTb",
      instagramUrl:
        "https://www.instagram.com/christoph.hm?igsh=N2x0YnptMDBoM3V6&utm_source=qr",
    },
    {
      id: 3,
      name: "Erik",
      role: "Climber",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Erik.webp`,
      bio: "",
    },
    {
      id: 11,
      name: "Gabri",
      role: "Domestique/Puncheur",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Gabi.webp`,
      bio: "Always ready to help my teammates, but if I get the chance, I'm all about those uphill sprints!",
      stravaUrl: "https://www.strava.com/athletes/18142633",
      instagramUrl: "https://www.instagram.com/gabrydls/",
    },
    {
      id: 1,
      name: "Jan",
      role: "All-rounder",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Jan_R.webp`,
      bio: "I love all surfaces! As a team member, I try to give my best for the team in every position.",
      stravaUrl: "https://www.strava.com/athletes/125166280",
      instagramUrl: "https://www.instagram.com/janrslr/",
    },
    {
      id: 14,
      name: "Jan",
      role: "",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Jan.webp`,
      bio: "",
    },
    {
      id: 10,
      name: "Kosta",
      role: "All-rounder",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Kosta.webp`,
      bio: "I love all terrains, especially with gradient. Also I like to help our sprinters to be in the best position at the finish.",
      stravaUrl: "https://www.strava.com/athletes/9059790",
      instagramUrl: "https://www.instagram.com/garbar.kos/",
    },
    {
      id: 9,
      name: "Lisa",
      role: "",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Lisa.webp`,
      bio: "",
    },
    {
      id: 8,
      name: "Paul",
      role: "",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Paul.webp`,
      bio: "",
    },
    {
      id: 7,
      name: "Robert",
      role: "Sprinter",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Robert.webp`,
      bio: "",
      stravaUrl: "https://strava.app.link/33AFoyhoATb",
      instagramUrl: "https://www.instagram.com/smirrni?igsh=ZnhnenBya2Izcjdl",
    },
    {
      id: 6,
      name: "Simon",
      role: "",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Simon.webp`,
      bio: "",
    },
    {
      id: 13,
      name: "Silvio",
      role: "Sprinter",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Silvio.webp`,
      bio: "I’m the veteran of the team – the oldest rider, but still fired up and ready to roll. With experience, awareness, and team spirit, I aim to contribute more than just watts – I bring wisdom to the ride.",
      stravaUrl: "https://strava.app.link/5molBNZIBTb",
      instagramUrl: "https://www.instagram.com/smcolor",
    },
    {
      id: 5,
      name: "Tina",
      role: "",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Tina.webp`,
      bio: "",
    },
    {
      id: 4,
      name: "Tony",
      role: "",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Tony.webp`,
      bio: "",
    },
    {
      id: 12,
      name: "Tristan",
      role: "Climber/All-rounder",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Tristan.webp`,
      bio: "I'm a versatile rider who thrives on rolling terrain and long climbs, but I also enjoy flatter, punchy race profiles and doing the best I can for the Team.",
      stravaUrl: "https://strava.app.link/GAbtnRtpATb",
      instagramUrl:
        "https://www.instagram.com/tristan.brrtt?igsh=MTJlbnd3Z2ZncXlraA%3D%3D&utm_source=qr",
    },
    {
      id: 15,
      name: "Noah",
      role: "Puncheur",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Noah.webp`,
      bio: "I love tackling short, steep climbs with explosive power and launching strong attacks to shake off my rivals and help my team.",
      stravaUrl: "https://strava.app.link/u0dNM7B5CTb",
    },
  ];
  return (
    <section className="container mx-auto py-10 px-6">
      <h1 className="mb-10 text-center text-5xl font-bold">Team Squad</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {riders.map((rider) => (
          <Card
            key={rider.id}
            className="shadow-lg mb-10 h-[45rem] flex flex-col"
          >
            {/* CardHeader for Rider Photo */}
            <CardHeader style={{ height: "27rem" }} className="relative">
              <Image
                src={rider.photoUrl}
                alt={rider.name}
                fill
                className="object-cover"
              />
            </CardHeader>

            {/* CardBody for Rider Info */}
            <CardBody className="flex flex-col flex-grow">
              <div>
                <Typography variant="h5" className="mb-2 font-bold">
                  {rider.name}
                </Typography>
                <Typography variant="small" className="text-gray-500 mb-4">
                  {rider.role}
                </Typography>
                {!!rider.bio && (
                  <Typography className="mb-4">{rider.bio}</Typography>
                )}
              </div>
            </CardBody>
            <CardFooter className="pt-0">
              <div className="flex gap-2">
                {rider.stravaUrl && (
                  <Link
                    aria-label="Go to strava"
                    target="_blank"
                    href={rider.stravaUrl}
                  >
                    <Button
                      placeholder={""}
                      aria-label="Go to strava"
                      size="lg"
                      name="Strava"
                      style={{ background: "#f06723" }}
                      className="bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700 hover:from-yellow-600 hover:via-pink-700 hover:to-purple-800"
                    >
                      <BsStrava className="text-white text-xl" />
                    </Button>
                  </Link>
                )}
                {rider.instagramUrl && (
                  <Link
                    aria-label="Go to instagram"
                    target="_blank"
                    href={rider.instagramUrl}
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
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
