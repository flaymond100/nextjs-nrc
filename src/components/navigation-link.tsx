"use client";
import Link from "next/link";
import { useNavigation } from "@/contexts/navigation-context";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavigationLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  scroll?: boolean;
  target?: string;
  onClick?: () => void;
}

export function NavigationLink({
  href,
  children,
  className,
  scroll,
  target,
  onClick,
}: NavigationLinkProps) {
  const { setNavigating } = useNavigation();
  const pathname = usePathname();

  const handleClick = () => {
    // Normalize paths for comparison (remove trailing slashes)
    const currentPath = pathname?.replace(/\/$/, "") || "";
    const targetPath = href.replace(/\/$/, "");
    
    // Only set navigating if we're actually navigating to a different route
    if (currentPath !== targetPath) {
      setNavigating(true);
    }
    
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link
      href={href}
      className={className}
      scroll={scroll}
      target={target}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}

