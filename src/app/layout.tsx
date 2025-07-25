import "./globals.css";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { Layout } from "@/components";
import Modal from "@/components/modal";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import Scroll from "@/components/scroll";
import { GoogleAnalytics } from "@next/third-parties/google";

const rubik = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  title: "NRC International Team",
  description:
    "NRC International Team is amatuer cycling team based in Leipzig, Germany. We bring together dedicated cyclists of all levels to train, race, and progress as a team.",
  openGraph: {
    url: "https://www.nrc-team.com",
    title: "NRC International Team",
    description:
      "NRC International Team is amatuer cycling team based in Leipzig, Germany. We bring together dedicated cyclists of all levels to train, race, and progress as a team.",
    images: [
      {
        url: "https://firebasestorage.googleapis.com/v0/b/nrc-team.appspot.com/o/files%2FNRC-Logo-Transparent.png?alt=media&token=1d22df1e-b692-4edc-bc27-fec3cdefe29c",
        width: 800,
        height: 600,
        alt: "NRC International Team Logo",
      },
    ],
    type: "website",
    locale: "en",
    siteName: "NRC International Team",
  },
  alternates: {
    canonical: `https://www.nrc-team.com`,
  },
};

const schema = {
  "@context": "http://schema.org",
  "@type": "SportsTeam",
  name: "NRC International Team",
  email: "contact@nrc-team.com",
  coach: "Konstantin Garbar",
  start_url: "/",
  founder: "Konstantin Garbar",
  url: "https://www.nrc-team.com",
  logo: "https://firebasestorage.googleapis.com/v0/b/nrc-team.appspot.com/o/files%2FNRC-Logo-Transparent.png?alt=media&token=1d22df1e-b692-4edc-bc27-fec3cdefe29c",
  keywords:
    "Cycling, Cycling team, cycling team leipzig, Germany, Leipzig, amateur cycling team Leipzig, international cycling club Germany, cycling team Leipzig Germany, road cycling team Leipzig, social cycling rides Leipzig, amateur road racing Germany, cycling community Leipzig, NRC International cycling, join cycling club Leipzig, race and train cycling team",
  sport: "cycling",
  slogan: "We're here to help you achieve your goals.",
  description:
    "NRC International Team is amatuer cycling team based in Leipzig, Germany. We bring together dedicated cyclists of all levels to train, race, and progress as a team.",
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
    <html lang="en">
      <head>
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
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="title" content="NRC International Team" />
        <meta name="city" content="Leipzig" />
        <meta name="country" content="Germany" />
        <meta name="page-topic" content="Sport" />
        <meta name="identifier-URL" content="https://nrc-team.com/" />
        <meta
          property="description"
          content="NRC International Team is amatuer cycling team based in Leipzig, Germany. We bring together dedicated cyclists of all levels to train, race, and progress as a team."
        />
        <meta
          name="keywords"
          content="Cycling, Cycling team, cycling team leipzig, Germany, Leipzig, amateur cycling team Leipzig, international cycling club Germany, cycling team Leipzig Germany, road cycling team Leipzig, social cycling rides Leipzig, amateur road racing Germany, cycling community Leipzig, NRC International cycling, join cycling club Leipzig, race and train cycling team"
        />
        <meta name="robots" content="all" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body className={rubik.className}>
        <Layout>
          <Scroll />
          <Toaster position="top-right" />
          {children}
          <Suspense fallback={<>modal</>}>
            <Modal />
          </Suspense>
        </Layout>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_MEASUREMENT_ID!} />
    </html>
  );
}
