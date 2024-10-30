"use client";
import Image from "next/image";
import { Button } from "@material-tailwind/react";
import Link from "next/link";
import { ChatBubbleOvalLeftEllipsisIcon as Icon } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";

export function FixedPlugin() {
  const pathname = usePathname();

  return (
    <Link aria-label="open-contact-modal" href={pathname + "?modal=true"}>
      <Button
        color="white"
        aria-label="Open Menu"
        size="sm"
        className="!fixed bottom-4 right-4 flex p-6 items-center border rounded-full border-blue-gray-50"
      >
        <Icon className="h-7 w-7" />
      </Button>
    </Link>
  );
}
