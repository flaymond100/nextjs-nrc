import "./globals.css";
import type { Metadata } from "next";
import { Questrial } from "next/font/google";
import { Layout, FixedPlugin } from "@/components";
import Modal from "@/components/modal";
import { Toaster } from "react-hot-toast";
import { useCallback, useEffect } from "react";
import Scroll from "@/components/scroll";

const roboto = Questrial({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NRC Team",
  description:
    "NRC Team is a community of athletes from all corners of the globe, we provide individual training plans for triathlon, cycling and running.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="shortcut icon"
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/favicon.ico`}
        />
        <link rel="canonical" href="https://www.nrc-team.com" />
        <meta
          name="keywords"
          content="Traithlon, Traithlon Coach, Traithlon Coaching, Cycling, Cycling Coaching, Germany, Berlin, Leipzig, Best Cycling Coach, Best Triathlon Coach, Endurance Sport, Training Camps, Racing, Triathlon, Cycling Germany, Triathlon Germany, Best Coach Germany, Best Coach Dubai, Trainin Plans, Triathlon Training Plan, Individual Triathlon Training Plan, Triathlon Training Plan, Ironman, Half Ironman, Sprint Triathlon, Bikes, Hour Record, Indoor Training, Zwift, Wahoo, Today's Plan, Training Peaks"
        />
        <meta name="robots" content="all" />
        <meta
          property="og:title"
          content="NRC Team - Training Plans for Triathlon, Cycling and Running"
        />
        <meta
          property="og:description"
          content="NRC Team is a community of athletes from all corners of the globe, we provide individual training plans for triathlon, cycling and running."
        />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/favicon.ico`}
        />
        <meta property="og:site_name" content="NRC Team" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en" />
      </head>
      <body className={roboto.className}>
        <Layout>
          <Scroll />
          <Toaster position="top-right" />
          {children}
          <Modal />
          <FixedPlugin />
        </Layout>
      </body>
    </html>
  );
}
