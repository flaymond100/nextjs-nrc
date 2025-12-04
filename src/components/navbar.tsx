"use client";
import React from "react";
import {
  Navbar as MTNavbar,
  Collapse,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useNavigation } from "@/contexts/navigation-context";
import { AvatarDropdown } from "./avatar-dropdown";
import { NavigationLink } from "./navigation-link";

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
    name: "Team",
    href: "/cycling-team",
  },
  {
    name: "Calendar",
    href: "/calendar",
  },
  {
    name: "Partners",
    href: "/partners",
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
  if (!href || href === "#") {
    return (
      <li>
        <span className="flex items-center gap-2 text-lg text-black">
          {children}
        </span>
      </li>
    );
  }

  return (
    <li>
      <NavigationLink
        href={href}
        scroll={true}
        className="flex items-center gap-2 text-lg text-black"
      >
        {children}
      </NavigationLink>
    </li>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const { setNavigating } = useNavigation();

  function handleOpen() {
    setOpen((cur) => !cur);
  }

  const handleLogin = () => {
    router.push(`${pathname}?login=true`);
  };

  const handleSignUp = () => {
    setNavigating(true);
    router.push("/register");
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // Only set navigating if we're not already on the home page
      if (pathname !== "/") {
        setNavigating(true);
        router.push("/");
      } else {
        // If already on home, refresh to clear auth state
        // Don't set navigating since we're not changing routes
        router.refresh();
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Ensure navigation state is reset even if there's an error
      setNavigating(false);
    }
  };

  const handleProfile = () => {
    setNavigating(true);
    router.push("/profile");
  };

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
      <div className="container mx-auto flex items-center justify-between relative">
        {/* Logo - Left */}
        <NavigationLink href="/" className="flex-shrink-0">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/NRC-2.png`}
            alt="favicon Nrc Team"
            width={80}
            height={45}
          />
        </NavigationLink>

        {/* Desktop Navigation Menu - Centered */}
        <ul className="absolute left-1/2 transform -translate-x-1/2 hidden items-center gap-8 lg:flex">
          {NAV_MENU.map(({ name, href }) => (
            <NavItem key={name} href={href}>
              {name}
            </NavItem>
          ))}
        </ul>

        {/* Desktop: Avatar/Login buttons - Right */}
        <div className="hidden items-center gap-2 lg:flex ml-auto">
          {!loading && (
            <>
              {user ? (
                <AvatarDropdown
                  onProfileClick={handleProfile}
                  onLogoutClick={handleLogout}
                />
              ) : (
                !pathname?.startsWith("/register") && (
                  <>
                    <Button
                      style={{ background: "#37007d" }}
                      placeholder={""}
                      color="gray"
                      onClick={handleLogin}
                    >
                      Login
                    </Button>
                    <Button
                      style={{ background: "#f06723" }}
                      placeholder={""}
                      color="gray"
                      onClick={handleSignUp}
                    >
                      Sign Up
                    </Button>
                  </>
                )
              )}
            </>
          )}
        </div>

        {/* Mobile: Avatar/Login buttons - Center */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 lg:hidden">
          {!loading && (
            <>
              {user ? (
                <AvatarDropdown
                  onProfileClick={handleProfile}
                  onLogoutClick={handleLogout}
                />
              ) : (
                !pathname?.startsWith("/register") && (
                  <>
                    <Button
                      style={{ background: "#37007d" }}
                      placeholder={""}
                      color="gray"
                      size="sm"
                      onClick={handleLogin}
                    >
                      Login
                    </Button>
                    <Button
                      style={{ background: "#f06723" }}
                      placeholder={""}
                      color="gray"
                      size="sm"
                      onClick={handleSignUp}
                    >
                      Sign Up
                    </Button>
                  </>
                )
              )}
            </>
          )}
        </div>

        {/* Hamburger Menu - Right */}
        <IconButton
          placeholder={""}
          variant="text"
          color="gray"
          aria-label="Open Menu"
          onClick={handleOpen}
          className="flex-shrink-0 inline-block lg:hidden"
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
          {/* Removed auth buttons from mobile menu since they're now in the header */}
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
