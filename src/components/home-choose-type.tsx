"use client";
import Image from "next/image";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import Link from "next/link";
import { ChatBubbleOvalLeftEllipsisIcon as Icon } from "@heroicons/react/24/solid";

export function ChooseType() {
  return (
    <div className="container mx-auto grid h-full min-h-[65vh] w-full grid-cols-1 place-items-center gap-y-0 lg:grid-cols-2 gap-5">
      <div className="container h-full ">
        <Link
          aria-label="Read more about cycling trainings"
          style={{ zIndex: "1" }}
          href="/trainings/cycling-trainings"
          className="flip-card-1"
        >
          <Card
            id="cycling"
            color="gray"
            style={{ borderRadius: 3 }}
            className="animate-in slide-in-from-bottom duration-1000 relative grid h-full w-full place-items-center overflow-hidden text-center "
          >
            <Image
              width={768}
              height={768}
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/image/France_Downhill_Kosta.webp`}
              alt={" /image/France_Downhill_Kosta.webp"}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div
              style={{ zIndex: "2" }}
              className="absolute inset-0 h-full w-full flip-card-1"
            />
          </Card>
        </Link>
      </div>
      <div className="container h-full ">
        <Card
          id="cycling"
          color="gray"
          style={{ borderRadius: 3 }}
          className="animate-in  slide-in-from-bottom duration-1000 relative grid h-full w-full place-items-center overflow-hidden text-center"
        >
          <div
            style={{ zIndex: "2" }}
            className=" absolute inset-0 h-full w-full flip-card-1 bg-gray-900/75"
          />

          <Image
            width={768}
            height={768}
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/image/France_Downhill_Kosta.webp`}
            alt={" /image/France_Downhill_Kosta.webp"}
            className=" absolute inset-0  h-full w-full object-cover object-center"
          />
        </Card>
      </div>
    </div>
  );
}
