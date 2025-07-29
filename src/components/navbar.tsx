import React from "react";
import {
  Navbar as MTNavbar,
  Collapse,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV_MENU = [
  {
    name: "Home",
    href: "/",
  },
  // {
  //   name: "Trainings",
  //   href: "/trainings",
  // },
  {
    name: "Cycling Team",
    href: "/cycling-team",
  },
  {
    name: "Social Rides",
    href: "/social-rides",
  },
  {
    name: "Coaching",
    href: "/coaching",
  },
  {
    name: "Sponsors",
    href: "/sponsors",
  },
  // {
  //   name: "Our Trainers",
  //   href: "/trainers",
  // },
  // {
  //   name: "About Us",
  //   href: "/about-us",
  // },
  {
    name: "Contact",
    href: "/contact",
  },
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
        className="flex items-center gap-2 text-lg  text-black"
      >
        {children}
      </Link>
    </li>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const scrollToStripeTable = () => {
    const element = document.getElementById("stripe-pricing");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(() => setOpen(false), 700);
  };
  function handleOpen() {
    setOpen((cur) => !cur);
  }
  const pathname = usePathname();

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
        <Link href="/">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/NRC-2.png`}
            alt="favicon Nrc Team"
            width={80}
            height={45}
          />
        </Link>
        <ul className="ml-10 hidden items-center gap-8 lg:flex">
          {NAV_MENU.map(({ name, href }) => (
            <NavItem key={name} href={href}>
              {name}
            </NavItem>
          ))}
        </ul>
        <div className="hidden items-center gap-2 lg:flex">
          {pathname === "/trainings/running-trainings/" ||
          pathname === "/trainings/triathlon-trainings/" ||
          pathname === "/cycling-team/" ||
          pathname === "/social-rides/" ||
          pathname === "/trainings/cycling-trainings/" ? (
            <Link
              target="_blank"
              href="https://docs.google.com/forms/d/e/1FAIpQLSe4vxuCkdCzWaMv8SQ60IAqyzCsAsdA5Hhq6ZePYL-J9I7T0g/viewform?usp=sf_link"
            >
              <Button
                style={{ background: "#37007d" }}
                placeholder={""}
                color="gray"
              >
                Join Team
              </Button>
            </Link>
          ) : (
            <Link
              target="_blank"
              href="https://docs.google.com/forms/d/e/1FAIpQLSe4vxuCkdCzWaMv8SQ60IAqyzCsAsdA5Hhq6ZePYL-J9I7T0g/viewform?usp=sf_link"
            >
              <Button
                style={{ background: "#37007d" }}
                placeholder={""}
                color="gray"
                onClick={scrollToStripeTable}
              >
                Join Team
              </Button>
            </Link>
          )}
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
            {pathname === "/trainings/running-trainings/" ||
            pathname === "/trainings/triathlon-trainings/" ||
            pathname === "/trainings/cycling-trainings/" ? (
              <Link
                target="_blank"
                href="https://docs.google.com/forms/d/e/1FAIpQLSe4vxuCkdCzWaMv8SQ60IAqyzCsAsdA5Hhq6ZePYL-J9I7T0g/viewform?usp=sf_link"
              >
                <Button
                  style={{ background: "#37007d" }}
                  placeholder={""}
                  color="gray"
                >
                  Get Started
                </Button>
              </Link>
            ) : (
              <Link
                target="_blank"
                href="https://docs.google.com/forms/d/e/1FAIpQLSe4vxuCkdCzWaMv8SQ60IAqyzCsAsdA5Hhq6ZePYL-J9I7T0g/viewform?usp=sf_link"
              >
                <Button
                  style={{ background: "#37007d" }}
                  placeholder={""}
                  color="gray"
                  onClick={scrollToStripeTable}
                >
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
