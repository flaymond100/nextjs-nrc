import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar - NRC International Team",
  description: "View upcoming events and training sessions",
};

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

