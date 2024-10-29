"use client";

import React, { useEffect } from "react";

export function Prices() {
  return (
    <section className="px-8 pt-20 pb-20">
      <div className="container mx-auto mb-10 text-center">
        <h1
          color="blue-gray"
          className="mb-4 leter-spacing-1 text-5xl font-bold"
        >
          Choose Your Plan
        </h1>

        <div className="flex justify-center">
          <p className="leter-spacing-1 text-xl max-w-3xl">
            Start your free trial today, and within 24 hours, you’ll receive a
            welcome email from us with an invitation link to TrainingPeaks,
            along with a questionnaire to complete your athlete profile. This
            information helps us tailor your training plan precisely to your
            needs, ensuring the best possible experience and results. Let’s get
            you started on the path to your goals!
          </p>
        </div>
      </div>
      <StripePricingTable />
    </section>
  );
}

export const StripePricingTable = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return React.createElement("stripe-pricing-table", {
    "pricing-table-id": process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID,
    "publishable-key": process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  });
};

export default Prices;
