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

const NAV_MENU = [
  // {
  //   name: "Home",
  //   href: "/",
  // },

  {
    name: "Personal Coaching",
    href: "/personal-coaching",
  },
  {
    name: "Team Coaching",
    href: "/cycling-team",
  },
  {
    name: "FTP Calculator",
    href: "/ftp-calculator",
  },
  // {
  //   name: "Our Trainers",
  //   href: "/trainers",
  // },
  {
    name: "About Us",
    href: "/about-us",
  },
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
        className="flex items-center text-xl gap-2 font-normal text-white pb-1 hover:text-[#ecd06f] transition-all duration-300 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#ecd06f] after:transition-all duration-300 hover:after:w-full"
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
      shadow={true}
      fullWidth
      style={{
        backgroundColor: open ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(1px)",
        transition: "background-color 0.3s, backdrop-filter 0.3s",
      }}
      className="border-0 absolute top-0 z-50 w-full"
    >
      <div className="container max-w-full mx-auto flex items-center justify-between  ">
        <Link href="/">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/black-logo.png`}
            alt="favicon Ventro Coaching"
            width={400}
            height={50}
          />
        </Link>
        <ul className="ml-10 hidden items-center gap-8 lg:flex">
          {NAV_MENU.map(({ name, href }) => (
            <NavItem key={name} href={href}>
              {name}
            </NavItem>
          ))}
        </ul>
        <IconButton
          placeholder={""}
          variant="text"
          color="white"
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
              <Link href="/personal-coaching">
                <Button style={{ background: "#ecd06f" }} placeholder={""}>
                  Get Started
                </Button>
              </Link>
            ) : (
              <Button
                style={{ background: "#ecd06f" }}
                placeholder={""}
                onClick={scrollToStripeTable}
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
