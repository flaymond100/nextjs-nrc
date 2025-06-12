import "../../globals.css";
import type { Metadata } from "next";
import { Layout } from "@/components";

export const metadata: Metadata = {
  title: "Triathlon Trainings",
  description: "Triathlon training plans.",
  alternates: {
    canonical: `https://www.nrc-team.com/trainings/triathlon-trainings`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
