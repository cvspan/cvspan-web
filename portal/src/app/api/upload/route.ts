import { activeUserId } from "@/lib/session";
import { db } from "@/db";
import { media } from "@/db/schema";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function POST(request: Request) {
  const userId = await activeUserId();
  if (!userId) return Response.json({ error: "Unauthorised" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "No file received" }, { status: 400 });
  }

  if (!ALLOWED.includes(file.type)) {
    return Response.json(
      { error: "Use a JPG, PNG, WebP, GIF or AVIF image" },
      { status: 415 },
    );
  }

  if (file.size > MAX_BYTES) {
    return Response.json({ error: "Images must be 5MB or smaller" }, { status: 413 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  try {
    const [row] = await db
      .insert(media)
      .values({
        filename: file.name,
        contentType: file.type,
        size: bytes.byteLength,
        data: bytes,
        uploadedById: userId,
      })
      .returning({ id: media.id });

    /** Callers only ever see the URL, so moving to object storage later is a
     *  change to this handler alone. */
    return Response.json({ url: `/api/media/${row.id}` });
  } catch (error) {
    /** Without this, a storage failure returns an empty 500 and the client
     *  has nothing to show the person. */
    console.error("Upload failed", error);
    return Response.json({ error: "Could not store the image. Try again." }, { status: 500 });
  }
}
