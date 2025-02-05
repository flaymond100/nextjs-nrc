import "../../globals.css";
import type { Metadata } from "next";
import { Layout } from "@/components";

export const metadata: Metadata = {
  title: "Cycling Team Roster",
  description: "Meet our riders.",
  alternates: {
    canonical: `https://www.nrc-team.com/cycling-team/roster`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
