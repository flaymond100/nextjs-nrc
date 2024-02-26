import "./globals.css";
import type { Metadata } from "next";
import { Questrial } from "next/font/google";
import { Layout, FixedPlugin } from "@/components";
import Modal from "@/components/modal";

const roboto = Questrial({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NRC Team",
  description:
    "Introducing Tailwind Campaign Page, an all-inclusive and visually captivating campaign landing page template built on the foundation of Tailwind CSS and Material Tailwind.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={roboto.className}>
        <Layout>
          {children}
          <Modal />
          <FixedPlugin />
        </Layout>
      </body>
    </html>
  );
}
