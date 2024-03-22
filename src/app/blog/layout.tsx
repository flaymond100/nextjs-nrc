import { Layout } from "@/components";

export const metadata = {
  title: "Blog",
  description: "Posts and tips, mostly about software.",
  alternates: {
    canonical: "https://maxleiter.com/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
