export interface GooglePhotosAlbumImage {
  id: string;
  fullImageUrl: string;
  thumbnailUrl: string;
  alt: string;
}

export interface GooglePhotosAlbum {
  coverImage: string | null;
  images: GooglePhotosAlbumImage[];
}

const GOOGLE_PHOTOS_IMAGE_PATTERN =
  /https:\/\/lh3\.googleusercontent\.com\/pw\/[^"'\\\s)<]+/g;

const cleanImageUrl = (value: string) =>
  value.replace(/[);,]+$/g, "").replace(/\\u003d/g, "=");

const getBaseImageUrl = (value: string) => {
  const cleanUrl = cleanImageUrl(value);
  const equalsIndex = cleanUrl.indexOf("=");

  if (equalsIndex === -1) {
    return cleanUrl;
  }

  return cleanUrl.slice(0, equalsIndex);
};

const unique = <T>(values: T[]) => Array.from(new Set(values));

export const getGooglePhotosAlbum = async (
  shareUrl: string,
  albumTitle: string
): Promise<GooglePhotosAlbum> => {
  try {
    const response = await fetch(shareUrl, {
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`Album request failed with status ${response.status}`);
    }

    const html = await response.text();
    const matches = html.match(GOOGLE_PHOTOS_IMAGE_PATTERN) || [];
    const baseImageUrls = unique(
      matches
        .map(getBaseImageUrl)
        .filter((url) => url.includes("/pw/") && !url.includes("/a/"))
    );

    const images = baseImageUrls.slice(0, 60).map((baseUrl, index) => ({
      id: `${index + 1}`,
      fullImageUrl: `${baseUrl}=w1600`,
      thumbnailUrl: `${baseUrl}=w900`,
      alt: `${albumTitle} photo ${index + 1}`,
    }));

    return {
      coverImage: images[0]?.thumbnailUrl || null,
      images,
    };
  } catch (error) {
    console.error("Failed to parse Google Photos album:", error);

    return {
      coverImage: null,
      images: [],
    };
  }
};
