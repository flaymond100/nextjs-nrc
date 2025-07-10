import "../globals.css";
import type { Metadata } from "next";
import { Layout } from "@/components";

export const metadata: Metadata = {
  title: "NRC International Team",
  description:
    "Ventro Coaching is a community of athletes from all corners of the globe, united by a shared love for endurance sports and become healthier people. Choose your path.",
  alternates: {
    canonical: `https://www.nrc-team.com/home`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
