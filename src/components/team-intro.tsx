import Link from "next/link";
import { Button } from "@material-tailwind/react";

export const TeamIntro = () => {
  return (
    <div className="container text-center md:text-left mt-6  mx-auto">
      <div className="flex flex-col items-center justify-center mb-10">
        <p className="leter-spacing-1 text-xl max-w-3xl mb-5 text-center">
          Our team is open to everyone who wants to join and wear our official
          jersey with pride. You become part of who we are on the road and
          online.
        </p>
        <p className="leter-spacing-1 text-xl max-w-3xl mb-5 text-center">
          As a member, you will enjoy an international community that is
          friendly and helpful. We also have a special deals from our partners.
        </p>
        <p className="leter-spacing-1 text-xl max-w-3xl mb-5 text-center">
          In addition, we have group rides and races on Zwift and in the real
          world. Along the way, there will be special events, challenges and
          other perks. There is a place for you on our team if you like bikes,
          good vibes and riding with others.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
          <Link target="_blank" href="/register/">
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
