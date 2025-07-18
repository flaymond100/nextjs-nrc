import Image from "next/image";
import Link from "next/link";

const sponsors = [
  {
    name: "Vittoria Tyres",
    image: "/sponsors/vittoria.webp",
    description:
      "Vittoria Tyres is a leading manufacturer of high-performance cycling tires, providing superior grip, durability, and performance for cyclists of all levels.",
  },
  {
    name: "Ventro Coaching",
    image: "/sponsors/ventro.webp",
    description:
      "Ventro Coaching is a leading provider of cycling coaching services, helping cyclists of all levels improve their performance and achieve their goals.",
  },
];
export const Sponsors = () => {
  return (
    <div>
      <h1 className="text-5xl font-bold text-center mb-6">Our Sponsors</h1>
      <p className="max-w-2xl mx-auto text-center text-gray-700 text-base mb-10">
        We’re incredibly grateful for the support of our amazing sponsors. Their
        contributions empower our team to train harder, race faster, and bring
        the cycling community together. Thank you for being part of our journey.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {sponsors.map((sponsor, index) => (
          <div
            key={index}
            className="rounded-2xl shadow-lg dark:shadow-black/20 hover:shadow-xl align-middle justify-center transition-shadow p-4 text-center"
            style={{
              backgroundColor: "#f3f2f0",
            }}
          >
            <div className="flex justify-center">
              <Image
                width={300}
                height={400}
                src={`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}${
                  sponsor.image
                }`}
                className="mb-6 w-80 rounded-lg "
                alt=""
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">{sponsor.name}</h2>
            <p className="text-sm text-gray-600">{sponsor.description}</p>
          </div>
        ))}
        <div
          className="rounded-2xl shadow-lg dark:shadow-black/20 hover:shadow-xl align-middle justify-center transition-shadow p-4 text-center"
          style={{
            backgroundColor: "#f3f2f0",
          }}
        >
          <div className="text-center mt-20">
            <h2 className="text-4xl font-semibold mb-2">
              Want to support our team?
            </h2>
            <p className="text-gray-600 mb-6">
              Partner with us and become part of our journey.
            </p>
            <Link href="/contact">
              <button className="px-6 py-3 bg-[#37007d] text-white font-semibold rounded-lg hover:bg-[#2a005f] transition-colors duration-200">
                BECOME A SPONSOR
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
