import Link from "next/link";
import { Button } from "@material-tailwind/react";

export const TeamIntro = () => {
  return (
    <div className="container text-center md:text-left mt-6  mx-auto">
      <div className="flex flex-col items-center justify-center mb-10">
        <p className="leter-spacing-1 text-xl max-w-3xl mb-5 text-center">
          Joining the team is easy and completely free. The only commitment is
          purchasing our team jersey, which represents our shared spirit and
          identity.
        </p>
        <p className="leter-spacing-1 text-xl max-w-3xl mb-5 text-center">
          Once you have it, you’re officially part of the team and ready to ride
          with us both online and offline. You can join us on Zwift, where we
          ride virtually as a team, train, and compete—all from the comfort of
          your home.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
          <Link
            target="_blank"
            href="https://docs.google.com/forms/d/e/1FAIpQLSe4vxuCkdCzWaMv8SQ60IAqyzCsAsdA5Hhq6ZePYL-J9I7T0g/viewform?usp=sf_link"
          >
            <Button
              style={{ background: "#37007d" }}
              placeholder={""}
              color="gray"
              size="lg"
              className="w-40 h-12"
            >
              Join Team
            </Button>
          </Link>
          <Link href="/coaching">
            <Button
              style={{ background: "#37007d" }}
              placeholder={""}
              color="gray"
              size="lg"
            >
              Coaching
            </Button>
          </Link>
          <Link
            target="_blank"
            href="https://www.zwift.com/clubs/6a08d729-8add-4088-ad16-7af3316f440f/home"
          >
            <Button
              style={{ background: "#f06723" }}
              placeholder={""}
              color="gray"
              size="lg"
            >
              Zwift Club
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
