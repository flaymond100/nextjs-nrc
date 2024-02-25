import React from "react";
import Image from "next/image";

import {
  Typography,
  Card,
  CardBody,
  CardHeader,
  Button,
} from "@material-tailwind/react";
import Link from "next/link";

interface PriceCardProps {
  title: string;
  desc: string[];
  price: number;
  pricePerYear: number;
  offPrice?: number;
}

export function PriceCard({
  title,
  desc,
  price,
  offPrice,
  pricePerYear,
}: PriceCardProps) {
  return (
    <Card
      className="bg-white relative grid w-full "
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
        <a href="#">
          <Typography
            placeholder={""}
            variant="h4"
            color="blue-gray"
            className="font-bold normal-case mb-8 tracking-tight"
          >
            {title}
          </Typography>
        </a>
        <div className="mb-3 flex gap-2 items-end justify-center">
          {!offPrice && (
            <div className="flex-col">
              <Typography
                placeholder={""}
                variant={offPrice ? "h6" : "h2"}
                color="blue-gray"
                className={
                  offPrice ? "line-through tracking-tight" : "tracking-tight"
                }
              >
                €{price}
              </Typography>
              <Typography
                placeholder={""}
                variant={offPrice ? "h6" : "h6"}
                style={{ fontWeight: 500 }}
                color="blue-gray"
                className={offPrice ? "line-through" : "mb-8"}
              >
                /month
              </Typography>
            </div>
          )}

          <Typography placeholder={""} variant="h4" color="red">
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
          )}
        </div>

        <Link href="?modal=true">
          <Button className="rounded-none" placeholder={""} color="gray">
            Get Started
          </Button>
        </Link>
      </CardHeader>
      <CardBody placeholder={""} className="lg:px-16 sm:px-8">
        <ul className="mb-4 font-normal list-image-[url(/image/checkmark.svg)] ml-4">
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
