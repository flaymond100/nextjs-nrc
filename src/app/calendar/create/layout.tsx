import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Race - NRC International Team",
  description: "Create a new race event",
};

export default function CreateRaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

