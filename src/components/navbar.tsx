import React from "react";
import {
  Navbar as MTNavbar,
  Collapse,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_MENU = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Our Trainings",
    href: "/plans",
  },
  {
    name: "Plans & Pricing",
    href: "/pricing",
  },
  {
    name: "Our Trainers",
    href: "/trainers",
  },
  {
    name: "About Us",
    href: "/about-us",
  },
  // {
  //   name: "Blog",
  //   href: "/blog",
  // },
];

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
}

function NavItem({ children, href }: NavItemProps) {
  return (
    <li>
      <Link
        href={href || "#"}
        scroll={true}
        // target={href ? "_blank" : "_self"}
        className="flex items-center gap-2 font-bold text-black"
      >
        {children}
      </Link>
    </li>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  function handleOpen() {
    setOpen((cur) => !cur);
  }

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpen(false)
    );
  }, []);

  return (
    <MTNavbar
      placeholder={""}
      shadow={false}
      fullWidth
      style={{ borderBottom: " 0.5px solid rgb(55, 0, 125)" }}
      className="border-0 sticky top-0 z-50"
    >
      <div className="container mx-auto flex items-center justify-between">
        <a href="/">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/NRC-2.png`}
            alt="favicon Nrc Team"
            width={80}
            height={45}
          />
        </a>
        <ul className="ml-10 hidden items-center gap-8 lg:flex">
          {NAV_MENU.map(({ name, href }) => (
            <NavItem key={name} href={href}>
              {name}
            </NavItem>
          ))}
        </ul>
        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/get-started">
            <Button
              style={{ background: "#37007d" }}
              placeholder={""}
              color="gray"
            >
              Get Started
            </Button>
          </Link>
        </div>
        <IconButton
          placeholder={""}
          variant="text"
          color="gray"
          aria-label="Open Menu"
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden"
        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={open}>
        <div className="container mx-auto mt-3 border-t border-gray-200 px-2 pt-4">
          <ul className="flex flex-col gap-4">
            {NAV_MENU.map(({ name, href }) => (
              <NavItem key={name} href={href}>
                {name}
              </NavItem>
            ))}
          </ul>
          <div className="mt-6 mb-4 flex items-center gap-2">
            <Link aria-label="open-contact-modal" href="/get-started">
              <Button style={{ background: "#37007d" }} placeholder={""}>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
