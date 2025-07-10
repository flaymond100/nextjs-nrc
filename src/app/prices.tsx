"use client";

import React, { useEffect } from "react";

export function Prices() {
  return (
    <section className="pt-40 px-8 pb-20 md:pb-0 list-item bg-[url('/ben-guernsey.jpeg')] bg-cover bg-center bg-no-repeat relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/30 to-gray-900/50 mix-blend-multiply"></div>

      {/* Dotted grid overlay */}
      <div
        className="absolute inset-0 z-10"
        style={
          {
            "--dot-bg": "rgba(66 66 66 / 10%))",
            "--dot-color": "transparent",
            "--dot-size": "1px",
            "--dot-space": "22px",
            background: `
            linear-gradient(90deg, var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
            linear-gradient(var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
            var(--dot-color)
          `,
          } as React.CSSProperties
        }
      ></div>
      <div className="relative z-20">
        <div className="container mx-auto mb-0 sm:mb-10 text-center">
          <h1
            color="blue-gray"
            className="mb-4 leter-spacing-1 text-5xl font-bold"
          >
            Individual Training Plans
          </h1>

          <div className="flex flex-col items-center justify-center">
            {/* <p className="leter-spacing-1 text-xl max-w-3xl">
              There are 3 distinct plans to choose from, each designed to meet
              your specific needs. Every option is fully personalized to help you
              unlock your potential and achieve your best performance.
            </p>
            <br /> */}
            <p className="leter-spacing-1 text-xl max-w-3xl">
              Sign up for a free 7-day trial, and we'll connect with you within
              24 hours for a personal chat to set up everything you need to
              start training.
            </p>
          </div>
        </div>
        <div>
          <StripePricingTable />
        </div>
      </div>
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
