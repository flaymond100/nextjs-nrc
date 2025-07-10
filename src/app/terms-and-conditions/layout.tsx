import "../globals.css";
import type { Metadata } from "next";
import { Layout } from "@/components";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and Conditions of Ventro Coaching.",
  alternates: {
    canonical: `https://www.nrc-team.com/terms-and-conditions`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
