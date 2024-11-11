import "../../globals.css";
import type { Metadata } from "next";
import { Layout } from "@/components";
export const metadata: Metadata = {
  title: "Running Trainings",
  description: "Running training plans.",
  alternates: {
    canonical: `https://www.nrc-team.com/trainings/running-trainings`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
