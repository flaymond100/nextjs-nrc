"use client";
import { Link } from "react-router-dom";
import { useNavigation } from "@/contexts/navigation-context";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavigationLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  onClick?: () => void;
}

export function NavigationLink({
  href,
  children,
  className,
  target,
  onClick,
}: NavigationLinkProps) {
  const { setNavigating } = useNavigation();
  const pathname = usePathname();

  const handleClick = () => {
    const currentPath = pathname?.replace(/\/$/, "") || "";
    const targetPath = href.replace(/\/$/, "");

    if (currentPath !== targetPath) {
      setNavigating(true);
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <Link to={href} className={className} target={target} onClick={handleClick}>
      {children}
    </Link>
  );
}

