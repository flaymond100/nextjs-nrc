import "../globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Layout } from "@/components";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

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
