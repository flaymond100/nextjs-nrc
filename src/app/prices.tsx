"use client";

import PriceCard from "@/components/price-card";
import React from "react";

const PRICES = [
  {
    category: "William Gibson",
    title: "Lite",
    desc: [
      "First discussion, sports history & analysis",
      "Testing",
      "Goal setting",
      "Monthly training plan",
      "Training Peaks account",
      "Zwift compatible workouts",
      "Personalised training zones",
      "Training plan adjustment up to 2x per month",
    ],
    price: 70,
    pricePerYear: 600,
  },
  {
    category: "J.R.R. Tolkien",
    title: "Premium",
    desc: [
      "First discussion, sports history & analysis",
      "Testing",
      "Goal setting",
      "Personalised training plan",
      "Training Peaks account",
      "Zwift compatible workouts",
      "Personalised training zones",
      "Weekly training plan adjustment",
      "Contact with coach by email, WhatsApp or Training Peaks",
      "Base nutrition support",
      "Pre-race strategy review",
      "Post-event review",
    ],
    price: 100,
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
      "Testing",
      "Goal setting",
      "Personalised training plan",
      "Training Peaks account",
      "Personalised training zones",
      "DAILY training plan adjustment",
      "Regular weekly video call",
      "Contact with coach available 24/7 by email, WhatsApp, and Training Peaks",
      "Nutrition support and analysis",
      "Individual race day advices on nutrition, strategy and equipment",
      "Detailed planning of competitions",
      "Metric/wearable monitoring",
      "Post-event review",
    ],
    price: 200,
    pricePerYear: 1700,
    // offPrice: 160,
  },
];

export function Prices() {
  return (
    <section
      // style={{
      //   background:
      //     "linear-gradient(to bottom, rgb(250, 201, 44), rgba(255 255 255))",
      // }}
      className="px-8 pt-20 pb-20"
    >
      <div className="container mx-auto mb-10 text-center">
        <h1
          color="blue-gray"
          className="mb-4 leter-spacing-1 text-5xl font-bold"
        >
          Choose Our Plan
        </h1>

        <div className="flex justify-center">
          <p className="leter-spacing-1 text-xl max-w-3xl">
            You are one step closer to your goal! Choose the plan that suits you
            best and start training with us today.
          </p>
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-1 items-start gap-x-6 gap-y-20 md:grid-cols-2 xl:grid-cols-3">
        {PRICES.map((props, key) => (
          <PriceCard delay={key * 4000} key={key} {...props} />
        ))}
      </div>
    </section>
  );
}

export default Prices;
