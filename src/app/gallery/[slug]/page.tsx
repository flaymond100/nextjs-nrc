import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Navbar } from "@/components";
import { galleryEvents, getGalleryEventBySlug } from "@/utils/gallery-events";
import { getGooglePhotosAlbum } from "@/utils/google-photos-album";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return galleryEvents.map((event) => ({
    slug: event.slug,
  }));
}

export default async function GalleryAlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getGalleryEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const album = await getGooglePhotosAlbum(event.shareUrl, event.title);
  const coverImage = event.coverImage;

  console.log(coverImage);
  return (
    <>
      <Navbar />
      <main className="bg-[linear-gradient(180deg,_#f8f5ff_0%,_#ffffff_34%,_#f8fafc_100%)]">
        <section className="container mx-auto px-4 pt-14 pb-10 sm:pt-20">
          <Link
            href="/gallery"
            className="inline-flex items-center rounded-full border border-[#37007d]/20 bg-white px-4 py-2 text-sm font-semibold text-[#37007d] transition-colors hover:border-[#37007d]"
          >
            Back to events
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f06723]">
                {event.dateLabel}
              </p>
              <h1 className="mt-4 text-4xl font-bold text-gray-900 sm:text-5xl">
                {event.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
                {event.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-600">
                <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-black/5">
                  {event.location}
                </span>
                <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-black/5">
                  {album.images.length} photos found
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-black/5 bg-white p-3 shadow-[0_32px_90px_-34px_rgba(55,0,125,0.38)]">
              <div className="aspect-[4/3] overflow-hidden rounded-[24px] bg-[#ede7ff]">
                <img
                  src={coverImage}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16 sm:pb-20">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-black/5 bg-white/80 px-5 py-4 backdrop-blur">
            <p className="text-sm text-gray-600">
              Find pictures in the original album.
            </p>
            <a
              href={event.shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-[#f06723] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d85a1c]"
            >
              Open in Google Photos
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
