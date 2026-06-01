import { Button } from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";
import { ChatBubbleOvalLeftEllipsisIcon as Icon } from "@heroicons/react/24/solid";
export function FixedPlugin() {
  const pathname = useLocation().pathname;

  return (
    <Link aria-label="open-contact-modal" to={pathname + "?modal=true"}>
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
