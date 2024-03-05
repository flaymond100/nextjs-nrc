// components
import { Navbar, Footer } from "@/components";

// sections
import Prices from "../prices";
import Faq from "../faq";
import OurPrograms from "../our-programs";

export default function TrainingsPage() {
  return (
    <>
      <Navbar />
      <OurPrograms />
      <Trainings />
      <Faq />
    </>
  );
}

const Trainings = () => {
  // return (
  //   <section className="mb-20 container text-center md:text-left mt-0 mx-auto px-6">
  //     <h2 className="mb-8 text-center text-4xl font-bold">
  //       Offline Trainings in Leipzig
  //     </h2>
  //     <h3 className="mb-8 text-center text-xl w-50">
  //       We are not just a team - we are a community of athletes from all corners
  //       of the world, united by a shared love for endurance sports and become
  //       healthier people.
  //     </h3>
  //     <div className="container mx-auto mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
  //       <div className="animate-in slide-in-from-left duration-1000">
  //         <h2 className="mb-4 text-3xl font-bold">Who are we?</h2>
  //         <h3 className="mb-4 text-lg">
  //           We are a community bonded by a passion for endurance sports and a
  //           presuit of living a healthy life.
  //         </h3>
  //         <p className="mb-6">
  //           NRC inspired by the Latin words "Natantes," "Revolutio," and
  //           "Currit," embodies our commitment to fostering a culture of
  //           well-rounded well-being through triathlon, running, swimming, and
  //           cycling. We're a bonded by a passion for endurance sports and a
  //           commitment to holistic well-being. We embody inclusivity,
  //           dedication, and the belief that everyone, regardless of experience,
  //           has a place in our family.
  //         </p>
  //       </div>
  //       Map
  //     </div>
  //     {/* <p className="mb-6">
  //       Join us in your journey to a healthier, more active life. International
  //       NRC Team is your partner in making fitness a sustainable part of your
  //       daily routine. Whether you're a seasoned athlete or someone taking their
  //       first steps toward a more active lifestyle, we're here to help you
  //       achieve your goals.
  //     </p>
  //     <p>
  //       Ready to embark on this journey with us? the International NRC Team and
  //       take the first step toward a healthier, more active you.
  //     </p> */}
  //   </section>
  // );
};
