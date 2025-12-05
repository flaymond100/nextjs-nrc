import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - NRC International Team",
  description: "Create your account and join NRC International Team",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

