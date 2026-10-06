/**
 * Downscales and re-encodes an image in the browser before upload,
 * so Storage serves small files instead of full-size phone photos.
 * GIFs (possibly animated) and SVGs are returned unchanged.
 * @param file - The image file selected by the user
 * @param maxDimension - Maximum width/height in pixels
 * @param quality - Encoder quality between 0 and 1
 * @returns The resized file, or the original if resizing fails or doesn't help
 */
export async function resizeImage(
  file: File,
  maxDimension: number,
  quality: number = 0.82
): Promise<File> {
  if (file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(
      1,
      maxDimension / Math.max(bitmap.width, bitmap.height)
    );
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    // Safari can't encode WebP and silently falls back to PNG, so check the result type
    let blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality)
    );
    if (!blob || blob.type !== "image/webp") {
      // JPEG has no alpha channel; paint transparent areas white instead of black
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality)
      );
    }

    if (!blob || blob.size >= file.size) return file;

    const ext = blob.type === "image/webp" ? "webp" : "jpg";
    const baseName = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${baseName}.${ext}`, { type: blob.type });
  } catch (error) {
    console.warn("Image resize failed, uploading original:", error);
    return file;
  }
}
