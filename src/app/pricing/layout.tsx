import "../globals.css";
import type { Metadata } from "next";
import { Layout } from "@/components";

export const metadata: Metadata = {
  title: "Plans and Pricing",
  description:
    "Choose the plan that suits your goals and embark on your journey to a healthier, more active you with the International NRC Team.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
