// components
import { Navbar, Footer } from "@/components";

// sections
import Faq from "../faq";
import Image from "next/image";
import CarouselFeatures from "../carousel-features";
import { CalendlyWidget } from "@/components/widget";
import Prices from "../prices";

const OFFERS = [
  "Personal Training Plans: Each plan is meticulously crafted to meet your unique goals, whether you're a beginner or a seasoned athlete. Our experienced coaches design these plans exclusively for you, focusing on your strengths, areas for improvement, and the goals you aim to achieve. Find out more information on our page. Experience the power of personalized training, guiding you toward excellence in your chosen discipline.",
  "Triathlon Trainings: Dive into a comprehensive triathlon training experience that covers swimming, cycling, and running. Our structured programs cater to all levels, guiding you through the diverse disciplines of triathlon, helping you reach your peak performance on race day.",
  "Cycling Trainings: Train towards your cycling goals with personalized training plans. From boosting endurance to refining techniques, our cycling training programs are tailored to enhance your skills and enjoyment on two wheels.",
  "Running Trainings: Step up your running game with tailored training plans designed for beginners to seasoned marathoners. Whether you aim to conquer distances or improve your pace, our running training focuses on technique, endurance, and goal-specific progress.",
  "Swimming Trainings: Dive into our individualized swimming training to refine strokes, build endurance, and enhance confidence in the water. Our programs are crafted to accommodate all skill levels, ensuring comfort and proficiency in every lap.",
  "Duathlon Trainings: Master the art of duathlon with specialized training plans focusing on both running and cycling. Our duathlon training programs target seamless transitions, pacing strategies, and performance optimization for each segment.",
  "Lose Weight Trainings: Join our specialized training programs designed to support your weight loss journey. Tailored exercises, personalized plans, and expert guidance await you in our comprehensive training designed to help you achieve your weight loss goals. Our approach focuses on a balanced mix of exercises, nutrition guidance, and ongoing support to help you attain a healthier and fitter you.",
  "Fitness for All: We believe that sport and physical activity are for everyone. Our programs cater to individuals of all experience levels, from newcomers to seasoned athletes, helping you discover the joy of movement.",
];
const CHOICE = [
  "Inclusivity: No matter your background or experience level, NRC is your inclusive fitness community where everyone is welcome.",
  "Health Awareness: Our core value is to raise awareness about the importance of health and overall well-being. We aim to guide you toward a healthier and more balanced lifestyle.",
  "Expert Guidance: Our coaches are here to support and encourage you every step of the way. We prioritize your well-being and individual goals.",
  "Community Bond: We foster a sense of belonging and connection. NRC is not just about sport; it's about building meaningful relationships while improving your health.",
  "Fun and Friendship: While we focus on health, we also enjoy fun, friendship, and social events. We're not just a team; we're a community.",
];
export default function AboutUsPage() {
  return (
    <>
      <Navbar />
      <AboutUs />
      <CarouselFeatures />
      <CalendlyWidget />
      <Faq />
      <Footer />
    </>
  );
}

const AboutUs = () => {
  return (
    <>
      <section className="mb-20 container text-center md:text-left mt-6 md:mt-10 mx-auto px-6">
        <h1
          color="blue-gray"
          className="mb-4 leter-spacing-1 text-5xl font-bold text-center"
        >
          About Us
        </h1>
        <h2 className="mb-8 text-center text-xl w-50">
          We are not just a team - we are a community of athletes from all
          corners of the world, united by a shared love for endurance sports and
          become healthier people.
        </h2>

        <div className="container mx-auto mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="animate-in slide-in-from-left duration-1000">
            <h2 className="mb-4 text-3xl font-bold">Who are we?</h2>
            <h3 className="mb-4 text-lg">
              We are a community bonded by a passion for endurance sports and a
              presuit of living a healthy life.
            </h3>
            <p className="mb-6">
              NRC inspired by the Latin words "Natantes," "Revolutio," and
              "Currit," embodies our commitment to fostering a culture of
              well-rounded well-being through triathlon, running, swimming, and
              cycling. We're a bonded by a passion for endurance sports and a
              commitment to holistic well-being. We embody inclusivity,
              dedication, and the belief that everyone, regardless of
              experience, has a place in our family.
            </p>
          </div>

          <Image
            width={500}
            height={600}
            src={`${
              process.env.NEXT_PUBLIC_BASE_URL ?? ""
            }/image/about-us.webp`}
            className="animate-in slide-in-from-right duration-1000 mb-6 w-full rounded-lg shadow-lg dark:shadow-black/20"
            alt=""
          />
        </div>

        <h2 className="mb-4 text-3xl font-bold">What we offer</h2>

        <ul
          className={`mb-16 font-normal list-image-[url(/image/checkmark.svg)] ml-4`}
        >
          {OFFERS.map((item, index) => (
            <li className="mb-4 pl-2" key={index}>
              {item}
            </li>
          ))}
        </ul>

        <div className="container mx-auto mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Image
            width={500}
            height={600}
            src={`${
              process.env.NEXT_PUBLIC_BASE_URL ?? ""
            }/image/ksu-running-min.webp`}
            className="mb-6 w-full rounded-lg shadow-lg dark:shadow-black/20"
            alt=""
          />
          <div>
            <h2 className="mb-4 text-3xl font-bold">Our Mission</h2>
            <h3 className="mb-4 text-lg">
              At the heart of the International Ventro Coaching is our mission
              to empower individuals, regardless of their sporting background,
              to lead healthier lives, one step at a time.
            </h3>
            <p className="mb-6">
              At NRC, we're not just a team; we're a community of athletes from
              all corners of the globe, united by a shared love for endurance
              sports. Our mission is to inspire, support, and empower
              individuals to achieve their athletic goals, no matter how big or
              small.
            </p>
          </div>
        </div>

        <h2 className="mb-4 text-3xl font-bold">Why Choose NRC?</h2>

        <ul
          className={`mb-16 font-normal list-image-[url(/image/checkmark.svg)] ml-4`}
        >
          {CHOICE.map((item, index) => (
            <li className="mb-4 pl-2" key={index}>
              {item}
            </li>
          ))}
        </ul>

        <p className="mb-6">
          Get started your journey to a healthier, more active life.
          International Ventro Coaching is your partner in making fitness a
          sustainable part of your daily routine. Whether you're a seasoned
          athlete or someone taking their first steps toward a more active
          lifestyle, we're here to help you achieve your goals.
        </p>
        <p>
          Ready to embark on this journey with us? the International Ventro
          Coaching and take the first step toward a healthier, more active you.
        </p>
      </section>
      <Prices />
    </>
  );
};
