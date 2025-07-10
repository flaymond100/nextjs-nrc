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
    title: "Are the training plans suitable for beginners?",
    desc: "Yes, our plans cater to all levels, including beginners. We tailor the intensity and structure based on your starting point, gradually building your capabilities.",
  },
  {
    title: "How often do you update the training plans?",
    desc: "We regularly review and update our training plans to incorporate the latest training methodologies and ensure they remain effective and aligned with current best practices.",
  },
  {
    title: "How long do you need to prepare for a triathlon?",
    desc: "Generally, a 12 to 16-week training plan is recommended forbeginners tackling a sprint distance. The ideal preparation time fora triathlon varies based on your current fitness level, experience, and the specific distance of the triathlon. Adequate time allows for a gradual increase in intensity, endurance, and skill development, reducing the risk of injury and enhancing overall performance on race day.",
  },
  {
    title: "What makes your online training plans different?",
    desc: "Our training plans are personalized to fit your specific needs, integrating a holistic approach that considers your fitness level, goals, and available time for training. We focus on tailored guidance rather than generic programs.",
  },
  {
    title: "How do I know if I'm ready for an advanced training plan?",
    desc: "If you've consistently trained at a moderate level and have specific performance goals, you're likely ready. Our coaches can further assess your readiness and customize the plan accordingly to challenge and advance your abilities.",
  },
  {
    title: "Can I switch plans if my goals change during the training period?",
    desc: "Absolutely, we understand that goals evolve. You can seamlessly switch plans, and our coaches will recalibrate your training to align with your new objectives, ensuring your program remains tailored to your aspirations.",
  },
  {
    title: "What equipment or gear do I need for the training plans?",
    desc: "Basic triathlon gear is recommended, and our coaches can provide guidance on suitable equipment based on your budget and the specific demands of your training, ensuring you have the essentials for a successful triathlon journey.",
  },
  {
    title: "What if I miss a workout or need to adjust the training schedule?",
    desc: "Life happens, and flexibility is built into our plans. Our coaches can help you adjust your schedule to accommodate unexpected events while keeping your goals in focus, ensuring your training remains adaptable to the realities of your daily life.",
  },
  {
    title: "What's the usual duration to see results with your training plans?",
    desc: "Results vary depending on individual goals and starting points, but many of our clients report significant improvements within the first few weeks, with substantial progress over a few months of consistent training.",
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
                className="text-left text-white"
              >
                {title}
              </AccordionHeader>
              <AccordionBody>
                <p color="blue-gray" className="font-normal text-xl text-white">
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
