export interface GalleryEvent {
  slug: string;
  title: string;
  dateLabel: string;
  location: string;
  description: string;
  shareUrl: string;
  coverImage: string;
}

export const galleryEvents: GalleryEvent[] = [
  {
    slug: "kriterium-des-rsv-speiche-leipzig-2026",
    title: "Kriterium des RSV Speiche e.V. Leipzig 2026",
    dateLabel: "March 2026",
    location: "Leipzig, Germany",
    description:
      "First race of the season. A shared race-weekend and team moments album published through Google Photos.",
    shareUrl:
      "https://photos.google.com/share/AF1QipPn1tnGNOFWTvhVgii13i_kpmq2MI8Yz3ih06TO2UxYFEYQnPU98-uveLJMRv9wNw?pli=1&key=SWdZS1JVZHk0REtfeDBrNGgwNHRuYjFIRm5Cdmx3",
    coverImage:
      "/image/gallery-alte-messe-2026.jpg",
  },
];

export const getGalleryEventBySlug = (slug: string) =>
  galleryEvents.find((event) => event.slug === slug);
