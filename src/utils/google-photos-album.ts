import { supabase } from "./supabase";

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

const EMPTY: GooglePhotosAlbum = { coverImage: null, images: [] };

export const getGooglePhotosAlbum = async (
  shareUrl: string,
  albumTitle: string,
): Promise<GooglePhotosAlbum> => {
  try {
    const { data, error } = await supabase.functions.invoke<GooglePhotosAlbum>(
      "google-photos-album",
      { body: { shareUrl, albumTitle } },
    );
    if (error || !data) {
      console.error("google-photos-album invocation failed:", error);
      return EMPTY;
    }
    return data;
  } catch (error) {
    console.error("Failed to fetch Google Photos album:", error);
    return EMPTY;
  }
};
