"use client";

// components
import { Navbar, Footer } from "@/components";

// sections
import Faq from "../../faq";
import OurPrograms from "../../our-programs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@material-tailwind/react";

const CyclingTrainings = () => {
  return (
    <div className="container my-24 mx-auto md:px-6">
      <section className="mb-32">
        <h1 className="mb-4 text-3xl font-bold">Cycling Trainings</h1>

        <p className="mb-6">
          In today's fast-paced world, where health and fitness are increasingly
          becoming priorities, the choice of how we train and who guides our
          fitness journey is more important than ever. Many turn to digital
          solutions like TrainingPeaks for guidance. While these platforms offer
          convenience and a general framework for fitness, they lack the
          personal touch and adaptability that come with a personal trainer.
          Here's why having{" "}
          <Link href="/pricing">individual training plans</Link> much more
          beneficial than general plans from TrainingPeaks.
        </p>

        <p className="mb-6">
          <strong>Optio sapiente molestias consectetur?</strong>
        </p>

        <p className="mb-6">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum
          architecto ex ab aut tempora officia libero praesentium, sint id
          magnam eius natus unde blanditiis. Autem adipisci totam sit
          consequuntur eligendi.
        </p>

        <p className="mb-6 rounded border-l-4 border-neutral-800 bg-neutral-100 p-2 dark:border-neutral-200 dark:bg-neutral-700">
          <strong>Note:</strong> Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Optio odit consequatur porro sequi ab distinctio
          modi. Rerum cum dolores sint, adipisci ad veritatis laborum eaque
          illum saepe mollitia ut voluptatum.
        </p>

        <p className="mb-6">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus,
          libero repellat molestiae aperiam laborum aliquid atque magni nostrum,
          inventore perspiciatis possimus quia incidunt maiores molestias eaque
          nam commodi! Magnam, labore.
        </p>

        <Image
          width={500}
          height={600}
          src="https://mdbcdn.b-cdn.net/img/new/slides/194.jpg"
          className="mb-6 w-full rounded-lg shadow-lg dark:shadow-black/20"
          alt=""
        />

        <ul className="mb-6 list-inside list-disc">
          <li>Lorem</li>
          <li>Ipsum</li>
          <li>Dolor</li>
          <li>Sit</li>
          <li>Amet</li>
        </ul>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed,
          temporibus nulla voluptatibus accusantium sapiente doloremque.
          Doloribus ratione laboriosam culpa. Ab officiis quidem, debitis
          nostrum in accusantium dolore veritatis eius est?
        </p>
      </section>
    </div>
  );
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <CyclingTrainings />
      <OurPrograms />
      <Faq />
      <Footer />
    </>
  );
}
