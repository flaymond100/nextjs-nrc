"use client";

import Image from "next/image";
import { Typography, Rating } from "@material-tailwind/react";
import Marquee from "react-fast-marquee";

export function CarouselFeatures() {
  return (
    <>
      {/* <section
        style={{
          background: "rgb(55 0 125 / 91%)",
        }}
        className="p-16"
      >
        <div className="container mx-auto grid grid-cols-1 gap-y-12 md:grid-cols-2 lg:grid-cols-2">
          <div className="px-8 text-center">
            <Typography
               
              variant="h3"
              color="white"
              className="mb-6 font-medium"
            >
              &quot;Thanks to this plan, I hit my PB in my last triathlon! The
              coaches are incredibly supportive and responsive to my needs,
              making it feel like I'm never training alone.&quot;
            </Typography>
            <Typography
               
              color="white"
              variant="h4"
              className="mt-4"
            >
              Oleg
            </Typography>
            <Typography
               
              color="white"
              className="mb-4 font-normal"
            >
              Software Developer
            </Typography>
            <Rating   value={5} readonly />
          </div>
          <div className="px-8 text-center">
            <Typography
               
              variant="h3"
              color="white"
              className="mb-6 font-medium"
            >
              &quot;The level of detail and customization in these plans is
              outstanding. They’ve helped me balance work, life, and training
              without feeling overwhelmed.&quot;
            </Typography>
            <Typography
               
              color="white"
              variant="h4"
              className="mt-4"
            >
              Anna
            </Typography>
            <Typography
               
              color="white"
              className="mb-4 font-normal"
            >
              Marketing Specialist
            </Typography>
            <Rating   value={5} readonly />
          </div>
        </div>
      </section> */}
      <section
        style={{
          background: "rgb(55 0 125 / 91%)",
        }}
        className="flex p-8 justify-center items-center w-screen"
      >
        <div>
          <Marquee
            style={{
              maxWidth: "100vw",
            }}
            speed={50}
            delay={0}
            className="overflow-hidden grid"
          >
            <div className=" flex flex-col justify-center items-center mx-16 ">
              <Image
                width={150}
                height={150}
                src={`https://firebasestorage.googleapis.com/v0/b/nrc-team.appspot.com/o/files%2Fcarousel%2F65530c5a5e0d75755dd4bf51_zwift-inc-logo-vector-2%402x.webp?alt=media&token=4af41770-98ee-4d9f-8f8d-95a119537883`}
                alt="zwift logo"
              />
            </div>

            <div className=" flex flex-col justify-center items-center    mx-16 ">
              <Image
                width={150}
                height={150}
                src={`https://firebasestorage.googleapis.com/v0/b/nrc-team.appspot.com/o/files%2Fcarousel%2F65530c5addac87c670d4c904_Wahoo%402x.webp?alt=media&token=e1b7e6b7-ebd4-486a-bde2-f42e474f081e`}
                alt="wahoo logo"
              />
            </div>

            <div className=" flex flex-col justify-center items-center    mx-16 ">
              <Image
                width={150}
                height={170}
                src={`https://firebasestorage.googleapis.com/v0/b/nrc-team.appspot.com/o/files%2Fcarousel%2F65530cc1e8c20d4b3f24c4f0_Strava_Logo%402x.webp?alt=media&token=bb489393-06d7-4ae7-b131-d0c3156d2f32`}
                alt="strava logo"
              />
            </div>

            <div className=" flex flex-col justify-center items-center   mx-16 ">
              <Image
                width={150}
                height={170}
                src={`https://firebasestorage.googleapis.com/v0/b/nrc-team.appspot.com/o/files%2Fcarousel%2F65549b703d9a1a82ff6ceffc_garmin-logo.webp?alt=media&token=f6676ba3-2e0b-46bd-b377-d1f9cef4aff2`}
                alt="garmin logo"
              />
            </div>

            <div className=" flex flex-col justify-center items-center    mx-16 ">
              <Image
                width={150}
                height={150}
                src={`https://firebasestorage.googleapis.com/v0/b/nrc-team.appspot.com/o/files%2Fcarousel%2F65530c5a5e0d75755dd4bf51_zwift-inc-logo-vector-2%402x.webp?alt=media&token=4af41770-98ee-4d9f-8f8d-95a119537883`}
                alt="zwift logo"
              />
            </div>

            <div className=" flex flex-col justify-center items-center    mx-16 ">
              <Image
                width={150}
                height={150}
                src={`https://firebasestorage.googleapis.com/v0/b/nrc-team.appspot.com/o/files%2Fcarousel%2F65549b703d9a1a82ff6ceff6_polar-logo.webp?alt=media&token=fdaa2eb2-fa90-4d12-996d-0704813f4e82`}
                alt="polar logo"
              />
            </div>
            <div className=" flex flex-col justify-center items-center    mx-16 ">
              <Image
                width={150}
                height={150}
                src={`https://firebasestorage.googleapis.com/v0/b/nrc-team.appspot.com/o/files%2Fcarousel%2F65530c5a5e0d75755dd4bf51_zwift-inc-logo-vector-2%402x.webp?alt=media&token=4af41770-98ee-4d9f-8f8d-95a119537883`}
                alt="zwift logo"
              />
            </div>

            <div className=" flex flex-col justify-center items-center    mx-16 ">
              <Image
                width={150}
                height={150}
                src={`https://firebasestorage.googleapis.com/v0/b/nrc-team.appspot.com/o/files%2Fcarousel%2F65530c5addac87c670d4c904_Wahoo%402x.webp?alt=media&token=e1b7e6b7-ebd4-486a-bde2-f42e474f081e`}
                alt="wahoo logo"
              />
            </div>

            <div className=" flex flex-col justify-center items-center    mx-16 ">
              <Image
                width={150}
                height={170}
                src={`https://firebasestorage.googleapis.com/v0/b/nrc-team.appspot.com/o/files%2Fcarousel%2F65530cc1e8c20d4b3f24c4f0_Strava_Logo%402x.webp?alt=media&token=bb489393-06d7-4ae7-b131-d0c3156d2f32`}
                alt="strava logo"
              />
            </div>

            <div className=" flex flex-col justify-center items-center   mx-16 ">
              <Image
                width={150}
                height={170}
                src={`https://firebasestorage.googleapis.com/v0/b/nrc-team.appspot.com/o/files%2Fcarousel%2F65549b703d9a1a82ff6ceffc_garmin-logo.webp?alt=media&token=f6676ba3-2e0b-46bd-b377-d1f9cef4aff2`}
                alt="garmin logo"
              />
            </div>

            <div className=" flex flex-col justify-center items-center    mx-16 ">
              <Image
                width={150}
                height={150}
                src={`https://firebasestorage.googleapis.com/v0/b/nrc-team.appspot.com/o/files%2Fcarousel%2F65530c5a5e0d75755dd4bf51_zwift-inc-logo-vector-2%402x.webp?alt=media&token=4af41770-98ee-4d9f-8f8d-95a119537883`}
                alt="zwift logo"
              />
            </div>

            <div className=" flex flex-col justify-center items-center    mx-16 ">
              <Image
                width={150}
                height={150}
                src={`https://firebasestorage.googleapis.com/v0/b/nrc-team.appspot.com/o/files%2Fcarousel%2F65549b703d9a1a82ff6ceff6_polar-logo.webp?alt=media&token=fdaa2eb2-fa90-4d12-996d-0704813f4e82`}
                alt="polar logo"
              />
            </div>
          </Marquee>
        </div>
      </section>
    </>
  );
}

export default CarouselFeatures;
