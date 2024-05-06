import "../globals.css";
import type { Metadata } from "next";
import { Layout } from "@/components";

export const metadata: Metadata = {
  title: "Trainers",
  description:
    "Meet our coaching team to help you reach your maximal potential.",
  alternates: {
    canonical: `https://www.nrc-team.com/trainers`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
