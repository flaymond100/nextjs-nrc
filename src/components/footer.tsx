import { Typography, Button, Input } from "@material-tailwind/react";
import { BsStrava, BsInstagram, BsFacebook, BsTwitter } from "react-icons/bs";
import Link from "next/link";

const LINKS = [
  { title: "Personal Coaching", link: "/personal-coaching" },
  { title: "Our Trainings", link: "/trainings" },
  { title: "Our Trainers", link: "/trainers" },
  { title: "About", link: "/about-us" },
  { title: "Contact", link: "/contact" },
  { title: "Terms", link: "/terms-and-conditions" },
];
const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-10  p-20">
      <div className="container max-w-full mx-auto">
        <div className="flex flex-wrap items-end justify-center gap-8 md:justify-between">
          <div className="text-center md:text-left">
            <Typography as="a" href="/" variant="h4" className="mb-6">
              Ventro Coaching
            </Typography>
            <ul className="flex flex-wrap items-center justify-center md:justify-start">
              {LINKS.map((data, idx) => (
                <li key={data.link}>
                  <Typography
                    as="a"
                    href={data.link}
                    className={`py-1 font-medium !text-gray-700 transition-colors hover:!text-gray-900 ${
                      idx === 0 ? "pr-3" : "px-3"
                    }`}
                  >
                    {data.title}
                  </Typography>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center w-full sm:w-[24rem] sm:min-w-[24rem] md:text-left">
            <Typography variant="h6" color="blue-gray" className="mb-3 text-lg">
              Follow Us
            </Typography>
            <div className="flex flex-row justify-center md:justify-start gap-3">
              <Link
                aria-label="Go to strava"
                target="_blank"
                href="https://www.strava.com/clubs/nrc-tri-team"
              >
                <Button
                  placeholder={""}
                  aria-label="Go to strava"
                  size="sm"
                  name="Strava"
                >
                  <BsStrava />
                </Button>
              </Link>
              <Link
                aria-label="Go to instagram"
                target="_blank"
                href="https://www.instagram.com/nrc.int.team/"
              >
                <Button
                  placeholder={""}
                  aria-label="Go to instagram"
                  size="sm"
                  name="Instagram"
                >
                  <BsInstagram />
                </Button>
              </Link>

              <Link
                aria-label="Go to facebook"
                target="_blank"
                href="https://www.facebook.com/nrcinternation"
              >
                <Button
                  placeholder={""}
                  aria-label="Go to facebook"
                  size="sm"
                  name="Facebook"
                >
                  <BsFacebook />
                </Button>
              </Link>
              <Link
                aria-label="Go to twitter"
                target="_blank"
                href="https://twitter.com/nrc_tri_team"
              >
                <Button
                  placeholder={""}
                  aria-label="Go to twitter"
                  size="sm"
                  name="Twitter"
                >
                  <BsTwitter />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-center gap-y-4 gap-x-8 border-t border-blue-gray-50 py-6 md:justify-between">
          <p className="text-center font-normal !text-gray-700">
            &copy; {CURRENT_YEAR} Ventro Coaching
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
