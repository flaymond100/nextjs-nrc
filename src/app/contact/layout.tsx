import "../globals.css";
import type { Metadata } from "next";
import { Layout } from "@/components";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach out to Ventro Coaching and we will contact you back shortly.",
  alternates: {
    canonical: `https://www.nrc-team.com/contact-us`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
