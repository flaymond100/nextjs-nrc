// components
import { Navbar, Footer } from "@/components";

// sections
import Faq from "../../faq";
import OurPrograms from "../../our-programs";
import Image from "next/image";
import Link from "next/link";
import CarouselFeatures from "@/app/carousel-features";
import { CalendlyWidget } from "@/components/widget";

const desc = [
  {
    name: "Invest in Proper Gear",
    content:
      "Before you hit the pavement, make sure you have the right gear. Invest in a good pair of running shoes that provide adequate support and cushioning for your feet. Comfortable moisture-wicking clothing is also essential to keep you dry and comfortable during your runs.",
  },
  {
    name: "Start Slowly",
    content:
      "One of the most common mistakes beginner runners make is doing too much, too soon. Start with a combination of walking and running to gradually build up your endurance. A popular method is the run-walk technique, where you alternate between running and walking intervals. For example, start with running for one minute and walking for two minutes, and gradually increase the running intervals as you progress.",
  },
  {
    name: "Focus on Proper Form",
    content:
      "Pay attention to your running form from the beginning to prevent injuries and improve efficiency. Keep your posture tall, shoulders relaxed, and arms swinging naturally. Land softly on your midfoot with each step and aim for a quick turnover of your feet.",
  },
  {
    name: "Listen to Your Body",
    content:
      "It's normal to experience some discomfort when you start running, but it's important to differentiate between normal muscle soreness and potential injury. If you experience sharp or persistent pain, it's best to take a break and consult a healthcare professional.",
  },
  {
    name: "Stay Consistent",
    content:
      "Consistency is key when it comes to building a solid running foundation. Aim to run at least three to four times a week to see progress and improvements in your endurance and fitness level. Be patient with yourself and celebrate small victories along the way.",
  },
];

const RunningTrainings = () => {
  return (
    <section className="mb-20 container text-center md:text-left mt-6 md:mt-10 mx-auto px-6">
      <h1 className="mb-8 text-center text-4xl font-bold">Running Trainings</h1>

      <p className="mb-6">
        Today, it's really important to stay healthy and fit. Some folks use
        apps like TrainingPeaks to help them with workouts. These apps are easy
        to use and give a general plan. But they can't give you the same
        personal help as a real trainer. That's why having your own customized
        workout plan is better than using one from TrainingPeaks. When it comes
        to your health, having a plan that fits you perfectly can make a big
        difference. That's why personalized workouts beat generic ones every
        time.
      </p>

      <Image
        width={500}
        height={600}
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/image/8716_20230423_144655_274310037_original.webp`}
        className="mb-6 w-full rounded-lg shadow-lg dark:shadow-black/20"
        alt=""
      />

      <h2 className="mb-4 text-3xl font-bold">
        Importance of running training
      </h2>

      <p className="mb-6">
        Running training holds immense significance for individuals aiming to
        enhance their fitness levels and overall well-being. Through structured
        running programs, participants not only improve their cardiovascular
        health but also build endurance, strength, and mental resilience.
        Consistent training helps individuals to gradually increase their
        mileage, pace, and efficiency, leading to enhanced performance and
        decreased risk of injuries.
      </p>
      <p className="mb-6">
        Moreover, running training provides a valuable opportunity for
        individuals to set and achieve personal goals, whether it's completing a
        certain distance, participating in races, or simply improving their
        speed and agility. Beyond physical benefits, regular running can also
        have positive effects on mental health, reducing stress, boosting mood,
        and promoting overall cognitive function.
      </p>

      <p
        style={{ borderColor: "green" }}
        className="mb-6 rounded border-l-4 bg-green p-2"
      >
        <strong>Note:</strong> At Ventro Coaching we are offering an individual
        and flexible options, which will be suitable for everyone. Find more
        about what we{" "}
        <Link
          style={{ textDecoration: "underline", fontWeight: "bold" }}
          href="/personal-coaching"
        >
          offer
        </Link>{" "}
        and start your journey today.
      </p>

      <p className="mb-6">
        Furthermore, running training fosters a sense of community and
        camaraderie among participants, as they often join running groups or
        clubs to share experiences, support each other, and celebrate
        achievements. This social aspect adds motivation and accountability,
        making it easier for individuals to stay consistent with their training
        regimen.
      </p>

      <Image
        width={500}
        height={600}
        src={`https://firebasestorage.googleapis.com/v0/b/nrc-team.appspot.com/o/files%2F9567_20230623_190013_294449077_original.JPG?alt=media&token=39e40240-fb56-406c-a0e9-a24d5c7ddac1`}
        className="mb-6 w-full rounded-lg shadow-lg dark:shadow-black/20"
        alt=""
      />

      <h2 className="mb-4 text-3xl font-bold">Motivation and Accountability</h2>

      <p className="mb-6">
        One of the biggest challenges in any training regimen is staying
        motivated and accountable. This is where a personal trainer becomes an
        indispensable ally. They provide the encouragement and support you need
        to push through tough days and celebrate your victories on good ones.
        Knowing that someone is tracking your progress and is as invested in
        your success as you are can be a powerful motivator.
      </p>
      <p className="mb-6">
        Your trainer will set realistic, incremental goals that lead up to your
        main objective – completing a triathlon. These smaller goals provide
        short-term targets to aim for, keeping your training on track and giving
        you a sense of achievement as you tick each one off. This structured
        approach helps maintain a high level of motivation and commitment.
      </p>
      <p className="mb-6">
        Furthermore, the regular training sessions with your trainer create a
        routine and add a layer of accountability. It's easier to skip a workout
        when you're on your own, but knowing your trainer is waiting for you can
        be just the push you need to get out the door.
      </p>

      <h2 className="mb-4 text-3xl font-bold">Building Your Foundation</h2>
      <p className="mb-6">
        Starting a running training program can be both exciting and daunting,
        especially if you're new to the sport. Here are some essential tips to
        help you build a strong foundation for your running journey:
      </p>
      <ul
        className={`mb-4 font-normal list-image-[url(/image/checkmark.svg)] ml-4`}
      >
        {desc.map((item, index) => (
          <li className="mb-4 pl-2" key={index}>
            <strong>{item.name}</strong> : {item.content}
          </li>
        ))}
      </ul>

      <Image
        width={500}
        height={600}
        src={`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/image/tri_3.webp`}
        className="mb-6 w-full rounded-lg shadow-lg dark:shadow-black/20"
        alt=""
      />

      <p className="mb-6">
        By following these tips and gradually building your running mileage,
        you'll establish a strong foundation that will support you as you
        progress in your running journey. Remember to enjoy the process and
        celebrate every milestone, no matter how small.
      </p>

      <h2 className="mb-4 text-3xl font-bold">
        Importance of running training
      </h2>

      <p className="mb-6">
        Starting on the journey from sedentary to completing a 5K race might
        seem daunting, but our team is here to guide and support you every step
        of the way. We'll kick off by designing a personalized training plan
        that fits your fitness level and aspirations. This plan will gradually
        introduce you to running, starting with a combination of walking and
        jogging intervals to build up your stamina and endurance.
      </p>
      <p className="mb-6">
        As you progress through the training program, we'll gradually increase
        the duration and intensity of your runs, helping you to steadily improve
        your fitness and confidence. Our experienced coaches will be on hand to
        offer guidance on proper running form, pacing, and recovery techniques,
        ensuring that you stay injury-free and motivated throughout the process.
      </p>
      <p className="mb-6">
        In addition to your individual training plan, you'll also have the
        opportunity to participate in group runs and virtual meetups with fellow
        runners. These sessions provide a supportive environment where you can
        share experiences, exchange tips, and draw inspiration from one another
        as you work towards your common goal.
      </p>
      <p className="mb-6">
        As race day approaches, we'll fine-tune your training plan to ensure
        you're fully prepared to tackle the 5K distance. You'll receive guidance
        on race day logistics, including what to wear, what to eat, and how to
        mentally prepare for the challenge ahead. With our comprehensive
        approach to training and support, we're confident that you'll not only
        complete your first 5K race but also discover a newfound love for
        running along the way.
      </p>

      <h2 className="mb-4 text-3xl font-bold">
        Setting Goals and Staying Motivated
      </h2>

      <p className="mb-6">
        In any fitness journey, setting clear and achievable goals is crucial
        for success. When it comes to running training, defining your objectives
        can provide a sense of direction and purpose, keeping you focused and
        motivated throughout the process.
      </p>
      <p className="mb-6">
        Our team will work closely with you to establish realistic goals that
        align with your fitness level, lifestyle, and aspirations. Whether your
        aim is to complete your first 5K race, improve your running speed, or
        simply enjoy the physical and mental benefits of regular exercise, we'll
        help you articulate your objectives and break them down into manageable
        milestones.
      </p>
      <p className="mb-6">
        Once your goals are set, staying motivated becomes the next challenge.
        Running training, like any form of exercise, can sometimes feel like a
        grind, especially on days when you're tired or lacking motivation.
        That's why it's essential to find strategies to keep yourself inspired
        and engaged along the way.
      </p>
      <p className="mb-6">
        Our coaches will provide ongoing support and encouragement to help you
        stay motivated throughout your training journey. We'll celebrate your
        progress, no matter how small, and remind you of the reasons why you
        started this journey in the first place. Additionally, participating in
        group runs and virtual meetups with fellow runners can provide a sense
        of camaraderie and accountability, making it easier to stay committed to
        your goals.
      </p>
      <p className="mb-6">
        In addition to external sources of motivation, cultivating an intrinsic
        desire to improve and challenge yourself can be a powerful driving
        force. Reflecting on your achievements, acknowledging your progress, and
        focusing on the positive impact that running has on your physical and
        mental well-being can help fuel your motivation and sustain your
        commitment to your goals.
      </p>
      <p className="mb-6">
        Ultimately, setting goals and staying motivated is a dynamic process
        that requires ongoing effort and adaptation. Our team is here to support
        you every step of the way, providing the guidance, encouragement, and
        accountability you need to turn your running aspirations into reality.
        Together, we'll celebrate your achievements and overcome any obstacles
        that may arise, ensuring that you stay on track to reach your full
        potential as a runner.
      </p>

      <p
        style={{ borderColor: "green" }}
        className="mb-6 rounded border-l-4 bg-green p-2"
      >
        <strong>Note:</strong> At Ventro Coaching we are offering an individual
        running plans with a full 24/7 support. Find our{" "}
        <Link
          style={{ textDecoration: "underline", fontWeight: "bold" }}
          href="/personal-coaching"
        >
          training plans
        </Link>{" "}
        and start your journey today.
      </p>

      <p className="mb-6">
        Starting with the basics, we provide personalized training plans
        tailored to your fitness level and goals. Our structured workouts
        gradually build your endurance and confidence, ensuring a steady
        progression while minimizing the risk of injury. With expert coaching
        and support, you'll receive guidance on running technique, pacing, and
        nutrition, empowering you to reach your full potential as a runner.
      </p>

      <p>
        Get started this journey, and let's make your running dreams come true
        together. With our guidance, expertise, and supportive community, you'll
        not only achieve your running goals but also discover a newfound passion
        for running that will enrich your life both on and off the track.
      </p>
    </section>
  );
};

export default function RunningTrainingPage() {
  return (
    <>
      <Navbar />
      <RunningTrainings />
      <OurPrograms />
      <CarouselFeatures />
      <CalendlyWidget />
      <Faq />
      <Footer />
    </>
  );
}
