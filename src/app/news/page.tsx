"use client";
// components
import { Navbar, Footer } from "@/components";
import { NewsList } from "@/components/news-list";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@material-tailwind/react";
import { NavigationLink } from "@/components/navigation-link";

export default function NewsPage() {
  const { isAdmin } = useAdmin();

  return (
    <>
      <Navbar />
      <section className="container mx-auto px-4 py-6 md:py-12 min-h-[calc(100vh-400px)]">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <div className="flex-1 hidden md:block"></div>
            <h1 className="flex-1 leter-spacing-1 text-3xl md:text-5xl font-bold">
              News
            </h1>
            <div className="flex-1 flex justify-center md:justify-end w-full md:w-auto">
              {isAdmin && (
                <NavigationLink href="/news/create">
                  <Button
                    style={{ background: "#37007d" }}
                    placeholder={""}
                    color="gray"
                    size="sm"
                    className="w-full md:w-auto"
                  >
                    Create News
                  </Button>
                </NavigationLink>
              )}
            </div>
          </div>
          <p className="leter-spacing-1 text-base md:text-xl max-w-3xl mx-auto px-2">
            Stay updated with the latest news and updates from NRC International Team
          </p>
        </div>
        <NewsList />
      </section>
      <Footer />
    </>
  );
}

