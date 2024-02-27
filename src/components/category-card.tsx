import React from "react";
import Image from "next/image";
import { Card, CardBody, Typography } from "@material-tailwind/react";

interface CategoryCardProps {
  img: string;
  title: string;
  desc: string;
  icon: React.ElementType;
}

function CategoryCard({ img, title, desc, icon: Icon }: CategoryCardProps) {
  return (
    <Card
      placeholder={""}
      className="relative grid min-h-[12rem] w-full overflow-hidden"
    >
      <Image
        width={768}
        height={768}
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/${img}`}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 h-full w-full bg-black/70" />
      <CardBody
        placeholder={""}
        className="relative flex flex-col justify-between"
      >
        <Icon className="h-8 w-8 text-white" />
        <div>
          <Typography
            placeholder={""}
            variant="h5"
            className="mb-1"
            color="white"
          >
            {title}
          </Typography>
          <Typography
            placeholder={""}
            color="white"
            className="text-xs font-bold opacity-50"
          >
            {desc}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
}
export default CategoryCard;
