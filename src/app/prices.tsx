"use client";

import { Typography } from "@material-tailwind/react";
import PriceCard from "@/components/price-card";

const OTHER_BOOKS = [
  {
    category: "William Gibson",
    title: "Lite",
    desc: [
      "First discussion, sports history & analysis",
      "Personalised training plan",
      "Training Peaks account",
      "Personalised training zones",
      "Training plan adjustment up to 2x per month",
    ],
    price: 60,
    pricePerYear: 600,
  },
  {
    category: "J.R.R. Tolkien",
    title: "Premium",
    desc: [
      "First discussion, sports history & analysis",
      "Personalised training plan",
      "Training Peaks account",
      "Personalised training zones",
      "Weekly training plan adjustment",
      "Contact with coach available 24/7 by email, WhatsApp, and Training Peaks",
      "Base nutrition support",
    ],
    price: 90,
    pricePerYear: 1000,
    /* The `offPrice: 90` property in the `DELUXE` object within the `OTHER_BOOKS` array is defining a
discounted price for that particular plan. In this case, the `DELUXE` plan has an `offPrice` of 90,
which suggests that there is a discount of 90 units (currency) applied to the original price of the
plan. This can be used to display the discounted price to users or apply special offers within the
pricing component of the application. */
    // offPrice: 90,
  },
  {
    category: "Frank Herbert",
    title: "Deluxe",
    desc: [
      "First discussion, sports history & analysis",
      "Personalised training plan",
      "Training Peaks account",
      "Personalised training zones",
      "DAILY training plan adjustment",
      "Regular weekly video call",
      "Contact with coach available 24/7 by email, WhatsApp, and Training Peaks",
      "Full nutrition support and analysis",
      "Detailed planning of competitions",
      "Individual race day advices on nutrition, strategy and equipment",
    ],
    price: 160,
    pricePerYear: 1700,
    // offPrice: 160,
  },
];

export function Prices() {
  return (
    <section style={{ background: "#fac92c" }} className="px-8 pt-20 pb-20">
      <div className="container mx-auto mb-10 text-center">
        <Typography
          placeholder={""}
          variant="h2"
          color="blue-gray"
          className="mb-2"
        >
          OUR PLANS & PRICING
        </Typography>
        <div className="flex justify-center">
          <Typography
            placeholder={""}
            variant="lead"
            className="w-full max-w-lg !text-gray-500 text-center"
          >
            We are not just a team - we are a community of athletes from all
            corners of the world, united by a shared love for endurance sports
            and become healthier people.
          </Typography>
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-1 items-start gap-x-6 gap-y-20 md:grid-cols-2 xl:grid-cols-3">
        {OTHER_BOOKS.map((props, key) => (
          <PriceCard delay={key * 4000} key={key} {...props} />
        ))}
      </div>
    </section>
  );
}

export default Prices;
