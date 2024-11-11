import "../globals.css";
import type { Metadata } from "next";
import { Layout } from "@/components";

export const metadata: Metadata = {
  title: "Trainings",
  description:
    "Choose the most suitable progam for you - running training, cycling training or triathlon training.",
  alternates: {
    canonical: `https://www.nrc-team.com/trainings`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
