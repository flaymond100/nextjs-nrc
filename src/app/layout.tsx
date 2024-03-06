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
  title: "NRC Team",
  description:
    "NRC Team is a community of athletes from all corners of the globe, we provide individual training plans for triathlon, cycling and running.",
  alternates: {
    canonical: `https://www.nrc-team.com`,
  },
};

const schema = {
  "@context": "http://schema.org",
  "@type": "SportsTeam",
  name: "NRC Team",
  email: "contact@nrc-team.com",
  coach: "Konstantin Garbar",
  start_url: "/",
  founder: "Konstantin Garbar",
  url: "https://www.nrc-team.com",
  logo: "https://firebasestorage.googleapis.com/v0/b/nrc-team.appspot.com/o/files%2FNRC_logo_web.jpg?alt=media&token=f9e70e4f-8c1b-4ecb-85d3-0a1b6df10aea",
  keywords:
    "Traithlon, Traithlon Coach, Traithlon Coaching, Cycling, Cycling Coaching, Germany, Berlin, Leipzig, Best Cycling Coach, Best Triathlon Coach, Training Camps, Racing, Triathlon, Cycling Germany, Triathlon Germany, Best Coach Germany, Best Coach Dubai, Trainin Plans, Triathlon Training Plan, Individual Triathlon Training Plan, Triathlon Training Plan, Ironman, Half Ironman, Sprint Triathlon, Bikes, Hour Record, Indoor Training, Zwift, Wahoo, Today's Plan, Training Peaks",
  sport: "triathlon",
  slogan: "We're here to help you achieve your goals.",
  description:
    "NRC Team is a community of athletes from all corners of the globe, we provide individual training plans for triathlon, cycling and running.",
  sameAs: [
    "https://twitter.com/nrc_tri_team",
    "https://www.facebook.com/nrcinternation",
    "https://www.instagram.com/nrc.int.team",
    "https://www.strava.com/clubs/nrc-tri-team",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" prefix="og: http://ogp.me/ns#">
      <head>
        <link
          rel="shortcut icon"
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/favicon.ico`}
        />
        <link rel="canonical" href="https://www.nrc-team.com" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
        <meta
          property="title"
          content="NRC Team - Running, Cycling and Triathlon Trainings"
        />
        <meta
          property="description"
          content="NRC Team is a community of athletes from all corners of the globe, we connect people and provide individual training plans for triathlon, cycling and running."
        />
        <meta
          property="image"
          content="https://firebasestorage.googleapis.com/v0/b/nrc-team.appspot.com/o/files%2FNRC_logo_web.jpg?alt=media&token=f9e70e4f-8c1b-4ecb-85d3-0a1b6df10aea"
        />
        <meta
          property="og:title"
          content="NRC Team - Running, Cycling and Triathlon Trainings"
        />
        <meta property="og:url" content="https://www.nrc-team.com" />
        <meta
          property="og:description"
          content="NRC Team is a community of athletes from all corners of the globe, we connect people and provide individual training plans for triathlon, cycling and running."
        />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/nrc-team.appspot.com/o/files%2FNRC_logo_web.jpg?alt=media&token=f9e70e4f-8c1b-4ecb-85d3-0a1b6df10aea"
        />
        <meta property="og:site_name" content="NRC Team" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en" />
        <meta
          name="keywords"
          content="Traithlon, Traithlon Coach, Traithlon Coaching, Cycling, Cycling Coaching, Germany, Berlin, Leipzig, Best Cycling Coach, Best Triathlon Coach, Endurance Sport, Training Camps, Racing, Triathlon, Cycling Germany, Triathlon Germany, Best Coach Germany, Best Coach Dubai, Trainin Plans, Triathlon Training Plan, Individual Triathlon Training Plan, Triathlon Training Plan, Ironman, Half Ironman, Sprint Triathlon, Bikes, Hour Record, Indoor Training, Zwift, Wahoo, Today's Plan, Training Peaks"
        />
        <meta name="robots" content="all" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
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
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_MEASUREMENT_ID!} />
    </html>
  );
}
