"use client";

import Image from "next/image";
import { Button } from "@material-tailwind/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Home() {
  const pathname = usePathname();
  return (
    <section className="pt-12 px-8 pb-20 md:pb-0">
      <div className="container mx-auto grid h-full min-h-[65vh] w-full grid-cols-1 place-items-center gap-y-10 lg:grid-cols-2">
        <div className="animate-in slide-in-from-left duration-1000 row-start-1 sm:-row-start-2 sm:-row-auto lg:-mt-40 text-center sm:text-start">
          <h1
            color="black"
            className="mb-2 max-w-sm text-3xl !leading-snug lg:mb-3 lg:text-6xl text-center sm:text-start font-bold"
          >
            Running, Triathlon and Cycling Trainings
          </h1>
          <h4 className="mb-6 font-normal !text-gray-800 md:pr-16 xl:pr-28 text-center sm:text-start">
            We are not just a team - we are a community of athletes from all
            corners of the globe. We provide individual training plans for
            triathlon, cycling and running.
          </h4>
          <Link aria-label="Join NRC Team" href={pathname + "?modal=true"}>
            <Button placeholder="" size="lg" style={{ background: "#37007d" }}>
              Join NRC Team
            </Button>
          </Link>
        </div>
        <div className=" mt-10 grid gap-6 lg:mt-0 ">
          <Image
            width={568}
            height={568}
            src={`${
              process.env.NEXT_PUBLIC_BASE_URL ?? ""
            }/image/France_Downhill_Kosta.webp`}
            className="animate-in fade-in zoom-in duration-1000 -mt-10 rounded-lg shadow-md "
            alt="cyclist in France"
          />
        </div>
      </div>
    </section>
  );
}
export default Home;
