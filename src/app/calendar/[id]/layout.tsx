import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Race Details - NRC International Team",
  description: "View race details and participants",
};

export default function RaceDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

