"use client";
// components

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
      role: "Coffee Ride Specialist",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Jan.webp`,
      bio: "Shocked to learn that I need to start in the masters category not because I’ve mastered cycling — it just means my knees now creak louder than my freehub. It's less “King of the Mountain” and more “Lord of the Ibuprofen.” I still love cycling - miles are my meditation.",
      stravaUrl: "https://www.strava.com/athletes/8125327",
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
      role: "Gravel Grinder",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Lisa.webp`,
      bio: "Off-road addict with a soft spot for climbs, teammates, and gummy bears. Racing ultras, chasing dirt, and modeling hearts when I’m not riding mine out.",
      stravaUrl: "https://www.strava.com/athletes/38193512",
      instagramUrl:
        "https://www.instagram.com/lieschenpe?igsh=dWgwOWEwMHo0NzZ1&utm_source=qr",
    },
    {
      id: 8,
      name: "Paul",
      role: "All-rounder / Breakaway Specialist",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Paul.webp`,
      bio: "I'm a rider who loves all kinds of races. I want to create breakaways and help my teammates the best I can.",
      stravaUrl: "https://strava.app.link/AmKJhe1LHTb",
      instagramUrl:
        "https://www.instagram.com/pamecycling?igsh=MXA4dWszamIxbG5v&utm_source=qr",
    },
    {
      id: 7,
      name: "Robert",
      role: "Sprinter",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Robert.webp`,
      bio: "Crit lover with a need for speed and corners so tight they squeal. Full gas always, unless the road tilts up — then it’s survival mode. Built for watts, not altitude.",
      stravaUrl: "https://strava.app.link/33AFoyhoATb",
      instagramUrl: "https://www.instagram.com/smirrni?igsh=ZnhnenBya2Izcjdl",
    },
    {
      id: 6,
      name: "Simon",
      role: "All-rounder / Rouleur",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Simon.webp`,
      bio: "Challenging races and tactical battles - this is where I feel at home. I also enjoy cycling in the mountains.",
      stravaUrl: "https://strava.app.link/OoDLP06KHTb",
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
      id: 20,
      name: "Sven",
      role: "All-rounder",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Sven.webp`,
      bio: "All-rounder with a racing mindset. I combine tactical awareness with team commitment - driven by performance, Energy Drinks, sweets and loud music.",
      stravaUrl: "https://www.strava.com/athletes/100549976",
      instagramUrl: "https://www.instagram.com/svenferres/",
    },
    {
      id: 5,
      name: "Tina",
      role: "All-rounder",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Tina.webp`,
      bio: "Whether asphalt or gravel - the main thing is movement and freedom, where the team spirit isn’t neglected.",
      stravaUrl: "https://strava.app.link/PKBENRPEGTb",
      instagramUrl: "https://www.instagram.com/tiri80",
    },
    {
      id: 4,
      name: "Tony",
      role: "All-rounder / Rouleur",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Tony.webp`,
      bio: "`Business is like riding a bicycle, either you keep moving or you fall down.` ...So i stay tuned &  give everything I can",
      stravaUrl: "https://strava.app.link/ZHkCjFQXGTb",
      instagramUrl:
        "https://www.instagram.com/tonyschurigt?utm_source=qr&igsh=MWRidWQ0ODlzanh2MQ==",
      komootUrl: "https://www.komoot.de/user/3989840054079?ref=amk",
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
      instagramUrl: "https://www.instagram.com/noah_nrc_international/",
    },
    {
      id: 16,
      name: "Lion",
      role: "Rouleur/Sprinter",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Lion.webp`,
      bio: "Four corners and absolutely flat, that's my habitat, recently trying to get familiar with mountains.",
      stravaUrl: "https://strava.app.link/bEse6o9zGTb",
    },
    {
      id: 17,
      name: "Lukas",
      role: "Sprinter",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Lukas.webp`,
      bio: "I'm a sprinter who favours flat and slightly undulating profiles. Always ready for town sign sprints.",
      stravaUrl: "https://strava.app.link/9URFuOzMGTb",
    },
    {
      id: 18,
      name: "Martin",
      role: "Gravel & Bikepacking",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Martin.jpg`,
      bio: "I'm the hobby rider in the team. Some gucci gravel, small climbs, single trails in the forest and I'm happy.",
      stravaUrl: "https://www.strava.com/athletes/19424135",
      instagramUrl: "https://www.instagram.com/herr_bpunkt",
      komootUrl: "https://www.komoot.com/de-de/user/376857048740",
    },
    {
      id: 19,
      name: "Max",
      role: "All-rounder",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Max.webp`,
      bio: "Formerly a soccer player and fitness enthusiast, I've been trying my luck with the bike since last year (2024).",
      stravaUrl: "https://www.strava.com/athletes/106788303",
      instagramUrl: "https://www.instagram.com/mmmakz",
    },
    {
      id: 21,
      name: "Robin",
      role: "Puncheur",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Robin.jpeg`,
      bio: "The French! 🇫🇷",
      stravaUrl: "https://strava.app.link/66iVLAUuVWb",
    },
    {
      id: 21,
      name: "Lisa",
      role: "All-rounder",
      photoUrl: `${
        process.env.NEXT_PUBLIC_BASE_URL ?? ""
      }/image/team-pictures/Lisa.jpeg`,
      bio: "Wether it's on a mountainbike, roadbike, fixed gear or in my running shoes - I love racing!",
    },
  ].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="container mx-auto  ">
      <h1 className="mb-14 mt-10 text-center text-5xl font-bold">
        Team Riders
      </h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {riders.map((rider) => (
          <Card key={rider.id} className="shadow-lg mb-10  flex flex-col">
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
                {rider.komootUrl && (
                  <Link
                    aria-label="Go to komoot"
                    target="_blank"
                    href={rider.komootUrl}
                  >
                    <Button
                      placeholder={""}
                      aria-label="Go to komoot"
                      size="lg"
                      name="Komoot"
                      style={{ background: "#447c00" }}
                      className="bg-gradient-to-tr from-#8acb3c via-#66ae0e to-#447c00 hover:from-yellow-600 hover:via-pink-700 hover:to-purple-800"
                    >
                      <Image
                        src={`${
                          process.env.NEXT_PUBLIC_BASE_URL ?? ""
                        }/image/komoot.png`}
                        alt="Komoot"
                        width={20}
                        height={20}
                      />
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
