import "../globals.css";
import type { Metadata } from "next";
import { redirect, usePathname } from "next/navigation";

export const metadata: Metadata = {
  title: "Plans and Pricing",
  description:
    "Choose the plan that suits your goals and embark on your journey to a healthier, more active you with the International NRC Team.",
  alternates: {
    canonical: `https://www.nrc-team.com/personal-coaching`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  redirect("https://ventrocycling.com/plans-and-pricing/");
  return null;
}
