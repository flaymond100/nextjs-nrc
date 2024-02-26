"use client";
import Image from "next/image";
import { Button } from "@material-tailwind/react";
import Link from "next/link";
import { ChatBubbleOvalLeftEllipsisIcon as Icon } from "@heroicons/react/24/solid";

export function FixedPlugin() {
  return (
    <Link href="?modal=true">
      <Button
        placeholder=""
        color="white"
        size="sm"
        className="!fixed bottom-4 right-4 flex p-6 items-center border rounded-full border-blue-gray-50"
      >
        <Icon className="h-7 w-7" />
      </Button>
    </Link>
  );
}
