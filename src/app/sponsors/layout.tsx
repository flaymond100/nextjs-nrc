import "../globals.css";
import type { Metadata } from "next";
import { Layout } from "@/components";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "We’re incredibly grateful for the support of our amazing sponsors. Their contributions empower our team to train harder, race faster, and bring the cycling community together. Thank you for being part of our journey.",
  alternates: {
    canonical: `https://www.nrc-team.com/sponsors`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
