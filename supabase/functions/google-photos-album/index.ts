// deno-lint-ignore-file no-explicit-any
//
// Edge Function: scrape a Google Photos shared album server-side.
//
// Browsers can't fetch photos.google.com directly (no CORS headers), so this
// function runs the scrape in the Supabase Deno runtime and returns the
// resulting image URLs as JSON.
//
// Invoke from the SPA:
//   supabase.functions.invoke('google-photos-album', {
//     body: { shareUrl, albumTitle }
//   })
//
// Deploy:
//   supabase functions deploy google-photos-album --no-verify-jwt
//
// The function is read-only against a public URL, so no JWT verification is
// required.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const JSON_HEADERS = {
  ...CORS_HEADERS,
  "Content-Type": "application/json",
};

const GOOGLE_PHOTOS_IMAGE_PATTERN =
  /https:\/\/lh3\.googleusercontent\.com\/pw\/[^"'\\\s)<]+/g;

const cleanImageUrl = (value: string) =>
  value.replace(/[);,]+$/g, "").replace(/\\u003d/g, "=");

const getBaseImageUrl = (value: string) => {
  const cleanUrl = cleanImageUrl(value);
  const eq = cleanUrl.indexOf("=");
  return eq === -1 ? cleanUrl : cleanUrl.slice(0, eq);
};

const unique = <T>(values: T[]) => Array.from(new Set(values));

interface RequestBody {
  shareUrl?: string;
  albumTitle?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "method not allowed" }),
      { status: 405, headers: JSON_HEADERS },
    );
  }

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return new Response(
      JSON.stringify({ error: "invalid JSON body" }),
      { status: 400, headers: JSON_HEADERS },
    );
  }

  const { shareUrl, albumTitle } = body;
  if (!shareUrl || !albumTitle) {
    return new Response(
      JSON.stringify({ error: "shareUrl and albumTitle are required" }),
      { status: 400, headers: JSON_HEADERS },
    );
  }

  try {
    const upstream = await fetch(shareUrl);
    if (!upstream.ok) {
      return new Response(
        JSON.stringify({ coverImage: null, images: [] }),
        { headers: JSON_HEADERS },
      );
    }

    const html = await upstream.text();
    const matches = html.match(GOOGLE_PHOTOS_IMAGE_PATTERN) || [];
    const baseImageUrls = unique(
      matches
        .map(getBaseImageUrl)
        .filter((url) => url.includes("/pw/") && !url.includes("/a/")),
    );

    const images = baseImageUrls.slice(0, 60).map((baseUrl, index) => ({
      id: `${index + 1}`,
      fullImageUrl: `${baseUrl}=w1600`,
      thumbnailUrl: `${baseUrl}=w900`,
      alt: `${albumTitle} photo ${index + 1}`,
    }));

    return new Response(
      JSON.stringify({
        coverImage: images[0]?.thumbnailUrl ?? null,
        images,
      }),
      { headers: JSON_HEADERS },
    );
  } catch (error) {
    console.error("google-photos-album error:", error);
    return new Response(
      JSON.stringify({ coverImage: null, images: [] }),
      { status: 500, headers: JSON_HEADERS },
    );
  }
});
