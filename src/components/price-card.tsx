import React from "react";
import { Card, CardBody, CardHeader, Button } from "@material-tailwind/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PriceCardProps {
  title: string;
  desc: string[];
  price: number;
  pricePerYear: number;
  offPrice?: number;
  delay: number;
}

export function PriceCard({
  title,
  desc,
  price,
  offPrice,
  pricePerYear,
  delay,
}: PriceCardProps) {
  const pathname = usePathname();
  return (
    <Card
      className={`animate-in slide-in-from-bottom duration-1000 delay-${delay} bg-white relative grid w-full `}
      placeholder={""}
      color="transparent"
      shadow={true}
    >
      <CardHeader
        style={{
          padding: "50px",
          textAlign: "center",
          background: "#00000008",
        }}
        shadow={false}
        className="mt-0 mr-0 mb-0 ml-0 bg-grey border-0 rounded-none rounded-t-lg"
        placeholder={undefined}
      >
        <h4
          color="blue-gray"
          className="font-bold text-2xl text-black normal-case mb-8 tracking-tight"
        >
          {title}
        </h4>
        <div className="mb-3 flex gap-2 items-end justify-center">
          {!offPrice && (
            <div className="flex-col">
              <h2
                className={
                  offPrice
                    ? "text-3xl text-black font-bold line-through tracking-tight"
                    : "text-3xl text-black font-bold tracking-tight"
                }
              >
                €{price}
              </h2>
              <h2
                style={{ fontWeight: 500 }}
                color="blue-gray"
                className={offPrice ? "text-lg line-through" : "text-lg mb-8"}
              >
                /month
              </h2>
            </div>
          )}

          {/* <Typography placeholder={""} variant="h4" color="red">
            {offPrice && (
              <>
                €{offPrice}
                <span className="text-xs">/month</span>
              </>
            )}
          </Typography>
          {offPrice && (
            <Typography
              placeholder={""}
              variant={offPrice ? "h6" : "h4"}
              color="blue-gray"
              className={offPrice ? "line-through" : ""}
            >
              €{price}/month
            </Typography>
          )} */}
        </div>

        <Link aria-label="open-contact-modal" href="/get-started">
          <Button
            className="rounded-none"
            placeholder={""}
            style={{ background: "#37007d" }}
          >
            Get Started
          </Button>
        </Link>
      </CardHeader>
      <CardBody placeholder={""} className="lg:px-16 sm:px-8">
        <ul
          className={`mb-4 font-normal list-image-[url(/image/checkmark.svg)] ml-4`}
        >
          {desc.map((item, index) => (
            <li className="mb-4 pl-2" key={index}>
              {item}
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
export default PriceCard;
