import { withBasePath } from "@/lib/base-path";
const MAX_WIDTH = 1600;
const QUALITY = 0.82;

/**
 * Shrinks and re-encodes an image before upload. A cover straight off a phone
 * can be several megabytes, which is slow to store and pointless at the size
 * it is displayed; 1600px WebP is typically a few hundred kilobytes.
 *
 * Returns the original file when resizing would not help, or if anything goes
 * wrong — the server validates size and type regardless.
 */
export async function prepareImage(file: File): Promise<File> {
  /** Animated GIFs would lose their animation on a canvas round trip. */
  if (file.type === "image/gif") return file;
  if (!file.type.startsWith("image/")) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_WIDTH / bitmap.width);

    if (scale === 1 && file.size < 600_000) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", QUALITY),
    );
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${name}.webp`, { type: "image/webp" });
  } catch {
    return file;
  }
}

/** Posts to the upload endpoint and returns the stored URL. */
export async function uploadImage(file: File): Promise<string> {
  const prepared = await prepareImage(file);

  const body = new FormData();
  body.append("file", prepared);

  const response = await fetch(withBasePath("/api/upload"), { method: "POST", body });

  /** A failure can arrive without a JSON body, so never assume one. */
  const raw = await response.text();
  let parsed: { url?: string; error?: string } = {};
  try {
    parsed = raw ? JSON.parse(raw) : {};
  } catch {
    parsed = {};
  }

  if (!response.ok || !parsed.url) {
    throw new Error(parsed.error ?? `Upload failed (${response.status}). Please try again.`);
  }

  return parsed.url;
}
