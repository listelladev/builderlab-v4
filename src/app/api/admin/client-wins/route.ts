import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { sanityWriteClient } from "@/lib/sanity/client";
import { requireAuth } from "@/lib/sanity/auth";

export const GET = requireAuth(async () => {
  const client = sanityWriteClient();
  const wins = await client.fetch(`*[_type == "clientWin"] | order(_createdAt desc)`);
  return NextResponse.json({ wins });
});

export const POST = requireAuth(async (req: NextRequest) => {
  const client = sanityWriteClient();
  const body = await req.json().catch(() => ({}));

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const date = typeof body.date === "string" ? body.date.trim() : "";
  const image = body.image && body.image.asset ? body.image : undefined;

  if (!image) {
    return NextResponse.json({ error: "An image is required." }, { status: 400 });
  }

  const created = await client.create({
    _type: "clientWin",
    image,
    date,
    name,
  });
  return NextResponse.json({ win: created }, { status: 201 });
});
