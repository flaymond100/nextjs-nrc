import "../globals.css";
import type { Metadata } from "next";
import { Layout } from "@/components";

export const metadata: Metadata = {
  title: "Cycling Team",
  description:
    "Join our international cycling team from any part of the world.",
  alternates: {
    canonical: `https://www.nrc-team.com/cycling-team`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
