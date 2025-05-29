import "../globals.css";
import type { Metadata } from "next";
import { Layout } from "@/components";

export const metadata: Metadata = {
  title: "Social Rides",
  description: "Join us for an open group ride in Leipzig! 🚴‍♀️",
  alternates: {
    canonical: `https://www.nrc-team.com/social-rides`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
