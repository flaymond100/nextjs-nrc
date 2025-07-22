import { FC } from "react";
import Image from "next/image";
import { FormSection } from "@/components/contact-form";

export const PersonalCoaching: FC = () => {
  return (
    <section className="px-8 pt-10 pb-10" id="stripe-pricing">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-400/50 via-gray-100/60 to-white mix-blend-multiply"></div>

      <div className="container mx-auto mb-0 sm:mb-10 text-center">
        <h1 className="mb-4 leter-spacing-1 text-5xl font-bold">
          Personal Coaching
        </h1>
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-6 lg:grid-cols-2 lg:pl-44 lg:pr-44 lg:mb-20">
        <div
          className="overflow-hidden h-[466px] md:h-[560px]"
          style={{ zIndex: 2 }}
        >
          <Image
            width={370}
            height={300}
            src={`${
              process.env.NEXT_PUBLIC_BASE_URL ?? ""
            }/image/kosta-coach.webp`}
            className="animate-in slide-in-from-left duration-1000 "
            alt=""
          />
        </div>
        <div className="animate-in slide-in-from-right duration-1000">
          <h2 className="mb-4 text-3xl font-bold">Konstantin</h2>
          <h3 className="mb-4 text-xl">
            As a founder of NRC International Team I offer personal coaching to
            athletes who want to take their performance to the next level.
            <br />
          </h3>
          <p className="">
            My coaching philosophy focuses on creating personalized training
            plans according to your specific needs and goals. With over a 8
            years of coaching experience in professional sport, I apply the best
            practices to make the training process as enjoyable as it might be.
            <br />
            <br />
            I believe that the key to success is becoming a friend of the
            athlete. For me coaching is more than just write trainings, it's
            about being a part of the athlete's journey and support you in a
            good or bad moments.
            <br />
            <br />
            Whether you're a beginner or an experienced athelte, I'm here to
            help you reach your potential in cycling, triathlon or running.
            Start your free trial now and let's achieve your goals together!
          </p>
        </div>
      </div>
      <FormSection />
    </section>
  );
};
