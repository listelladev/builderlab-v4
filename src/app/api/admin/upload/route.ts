import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { sanityWriteClient } from "@/lib/sanity/client";
import { requireAuth } from "@/lib/sanity/auth";
import { MAX_IMAGE_BYTES } from "@/lib/sanity/validate";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export const POST = requireAuth(async (req: NextRequest) => {
  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Could not read the uploaded file." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "That image is larger than the 4 MB per-image limit. Please upload a smaller file." },
      { status: 413 }
    );
  }

  if (file.type && !ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Please upload a JPG, PNG, WEBP, GIF, or AVIF image." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const client = sanityWriteClient();
  const asset = await client.assets.upload("image", buffer, {
    filename: file.name || "upload",
    contentType: file.type || "image/jpeg",
  });

  const alt = form.get("alt");

  return NextResponse.json(
    {
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: typeof alt === "string" && alt ? alt : undefined,
      },
      asset: { _id: asset._id, url: asset.url },
    },
    { status: 201 }
  );
});
