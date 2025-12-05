import { Metadata } from "next";

export const metadata: Metadata = {
  title: "News | NRC International Team",
  description:
    "Stay updated with the latest news and updates from NRC International Team. Read about our races, events, team updates, and cycling community news.",
  openGraph: {
    title: "News | NRC International Team",
    description:
      "Stay updated with the latest news and updates from NRC International Team.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.nrc-team.com"}/news`,
    siteName: "NRC International Team",
    type: "website",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.nrc-team.com"}/news`,
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

