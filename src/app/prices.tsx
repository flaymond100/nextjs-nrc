"use client";

export function Prices() {
  return (
    <section className="px-8 pt-10 pb-10" id="stripe-pricing">
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
        </div>
      </div>
      <div>
        <StripePricingTable />
      </div>
    </section>
  );
}

export const StripePricingTable = () => {
  return null;
};

export default Prices;
