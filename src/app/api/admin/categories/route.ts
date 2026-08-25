import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { sanityWriteClient } from "@/lib/sanity/client";
import { requireAuth } from "@/lib/sanity/auth";
import { slugify } from "@/lib/sanity/validate";

export const GET = requireAuth(async () => {
  const client = sanityWriteClient();
  const categories = await client.fetch(`*[_type == "blogCategory"] | order(name asc)`);
  return NextResponse.json({ categories });
});

export const POST = requireAuth(async (req: NextRequest) => {
  const client = sanityWriteClient();
  const body = await req.json().catch(() => ({}));
  const name = (body && body.name ? String(body.name) : "").trim();
  if (!name) {
    return NextResponse.json({ error: "Category name is required." }, { status: 400 });
  }
  const slug = slugify(name);
  const dup = await client.fetch(`*[_type == "blogCategory" && slug.current == $slug][0]`, {
    slug,
  });
  if (dup) {
    return NextResponse.json(
      { error: "A category with this name already exists.", category: dup },
      { status: 409 }
    );
  }
  const created = await client.create({
    _type: "blogCategory",
    name,
    slug: { _type: "slug", current: slug },
  });
  return NextResponse.json({ category: created }, { status: 201 });
});
