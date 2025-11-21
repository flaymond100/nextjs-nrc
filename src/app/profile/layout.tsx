import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - NRC International Team",
  description: "Manage your rider profile information",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

