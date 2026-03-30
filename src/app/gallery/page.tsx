import Link from "next/link";
import { Footer, Navbar } from "@/components";
import { galleryEvents } from "@/utils/gallery-events";

export const dynamic = "force-static";
export const dynamicParams = false;

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(240,103,35,0.14),_transparent_32%),linear-gradient(180deg,_#fff8f1_0%,_#ffffff_48%,_#f4f4f8_100%)]">
        <section className="container mx-auto px-4 pt-16 pb-8 sm:pt-20 sm:pb-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f06723]">
              NRC Gallery
            </p>
            <h1 className="mt-4 text-4xl font-bold text-gray-900 sm:text-5xl">
              Event albums collected in one place.
            </h1>
            <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
              Browse event albums and open a dedicated page for each ride,
              weekend, or team moment.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16 sm:pb-20">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {galleryEvents.map((event) => (
              <Link
                key={event.slug}
                href={`/gallery/${event.slug}`}
                className="group overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_24px_80px_-32px_rgba(24,24,27,0.28)] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#ece7e1]">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                    <span>{event.dateLabel}</span>
                    <span>{event.location}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {event.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {event.description}
                    </p>
                  </div>
                  <div className="inline-flex items-center rounded-full bg-[#37007d] px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-[#4a1099]">
                    Open album
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
