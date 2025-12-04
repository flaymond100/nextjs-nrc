"use client";
import React from "react";

import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { useState } from "react";

const FAQS = [
  {
    title: "How do I join NRC International Team?",
    desc: "Joining our team is easy! Simply register on our website through the registration page. We welcome cyclists of all levels who share our passion for cycling. Once registered, you'll have access to our training programs, race calendar, and team events. Our team is based in Leipzig, Germany, but we welcome members from around the world.",
  },
  {
    title: "What skill level do I need to join?",
    desc: "We welcome cyclists of all levels, from beginners to experienced racers. Our team includes riders with various backgrounds and abilities. Whether you're just starting out or looking to compete in races, you'll find a supportive community and training programs tailored to your level.",
  },
  {
    title: "Do I need to live in Leipzig to join?",
    desc: "While our team is based in Leipzig, Germany, we're an international team and welcome members from anywhere. You can participate in our online training programs, join virtual team activities, and connect with team members worldwide. If you're in the Leipzig area, you can also join our local group rides and training sessions.",
  },
  {
    title: "What types of cycling does the team focus on?",
    desc: "We participate in various cycling disciplines including road racing, criteriums, time trials, triathlons, and social rides. Our race calendar includes events across all these categories, so you can choose what interests you most or try different types of cycling.",
  },
  {
    title: "What equipment do I need to get started?",
    desc: "At minimum, you'll need a road bike in good working condition, a helmet, and appropriate cycling clothing. For racing, you may want to invest in aero equipment, but it's not required to start. Our team can provide guidance on equipment based on your goals and budget.",
  },
  {
    title: "How often does the team train together?",
    desc: "We organize regular group training sessions, social rides, and team events. The frequency depends on the season and member availability. Check our race calendar for upcoming training rides and events. Many team members also follow individual training plans that align with our team goals.",
  },
  {
    title: "Can I participate in races if I'm a beginner?",
    desc: "Absolutely! We encourage all members to participate in races at their comfort level. Our race calendar includes various events suitable for different skill levels. You can start with social rides or shorter races and gradually work your way up to more competitive events. The team provides support and guidance for first-time racers.",
  },
  {
    title: "What are social rides and how do they differ from races?",
    desc: "Social rides are group cycling events focused on enjoyment, camaraderie, and building fitness rather than competition. They're perfect for beginners or anyone who wants to ride in a relaxed, supportive environment. Races are competitive events where you'll test your skills against other cyclists. Both are important parts of our team culture.",
  },
  {
    title: "Is there a membership fee?",
    desc: "Please contact us at contact@nrc-team.com for current membership information and any associated fees. We believe in making cycling accessible and will work with you to find a membership option that fits your situation.",
  },
  {
    title: "How do I register for races?",
    desc: "Once you're a team member, you can view our race calendar on the website. For team-organized races, you can register directly through the calendar. For external races, we'll provide information and support to help you register. Some races may require advance registration, so check the calendar regularly.",
  },
  {
    title: "What support does the team provide?",
    desc: "As a team member, you'll have access to special deals from our partners, race calendar, team coaching, group rides, and a supportive community of fellow cyclists. You'll also connect with teammates for training partners, race strategies, and cycling tips.",
  },
  {
    title: "Can I join if I'm primarily interested in triathlons?",
    desc: "Yes! Many of our team members participate in triathlons, and cycling is a crucial component of triathlon training. Our cycling programs will help improve your bike leg, and you'll benefit from training with experienced cyclists. We have team members who compete in Ironman and other triathlon events.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(1);
  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  return (
    <section className="px-8 pt-20">
      <div className="container mx-auto">
        <div className="text-center">
          <h1 color="blue-gray" className="mb-4 text-5xl font-bold">
            Frequently Asked Questions
          </h1>
        </div>
        <div className="mx-auto lg:max-w-screen-lg lg:px-20">
          {FAQS.map(({ title, desc }, key) => (
            <Accordion
              placeholder={""}
              key={key}
              open={open === key + 1}
              onClick={() => handleOpen(key + 1)}
            >
              <AccordionHeader
                placeholder={""}
                className="text-left text-gray-900"
              >
                {title}
              </AccordionHeader>
              <AccordionBody>
                <p
                  color="blue-gray"
                  className="font-normal text-xl text-gray-700"
                >
                  {desc}
                </p>
              </AccordionBody>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
