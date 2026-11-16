import { uploadImage } from "./image";

/** Profile photos are shown small, so 512px is plenty and keeps the upload to tens of kilobytes. */
const SIZE = 512;

/**
 * Crops the middle square of a photo, scales it down to `size` (512px by default) and uploads it, so a portrait or
 * landscape picture fills the round avatar without being squashed. Returns the stored path.
 */
export async function uploadAvatar(file: File, size = SIZE): Promise<string> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    throw new Error("Choose a JPG, PNG or WebP photo.");
  }

  let prepared = file;
  try {
    const bitmap = await createImageBitmap(file);
    const side = Math.min(bitmap.width, bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = Math.min(size, side);

    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(
        bitmap,
        (bitmap.width - side) / 2,
        (bitmap.height - side) / 2,
        side,
        side,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      bitmap.close();
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
      if (blob) prepared = new File([blob], "avatar.webp", { type: "image/webp" });
    }
  } catch {
    /* Fall back to the original; the server still checks type and size. */
  }

  return uploadImage(prepared);
}
