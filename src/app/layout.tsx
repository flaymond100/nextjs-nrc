import "./globals.css";
import type { Metadata } from "next";
import { Questrial } from "next/font/google";
import { Layout, FixedPlugin } from "@/components";
import Modal from "@/components/modal";
import { Toaster } from "react-hot-toast";
import { Suspense, useCallback, useEffect } from "react";
import Scroll from "@/components/scroll";
import { GoogleAnalytics } from "@next/third-parties/google";

const roboto = Questrial({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  openGraph: {
    title: "NRC Team",
    siteName: "NRC Team",
    type: "website",
    emails: "contact@nrc-team.com",
    url: "https://www.nrc-team.com",
    locale: "en",
    description:
      "Individual training plans for triathlon, cycling and running.",
    images: {
      width: "500",
      height: "500",
      url: "https://firebasestorage.googleapis.com/v0/b/nrc-team.appspot.com/o/files%2Ffavicon.ico?alt=media&token=05c556ea-e2ff-4626-af20-69506cdea62b",
    },
  },
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
      </head>
      <body className={roboto.className}>
        <Suspense fallback={"Loading..."}>
          <Layout>
            <Scroll />
            <Toaster position="top-right" />
            {children}
            <Modal />
            <FixedPlugin />
          </Layout>
        </Suspense>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_MEASUREMENT_ID!} />
    </html>
  );
}
