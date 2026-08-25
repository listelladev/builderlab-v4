import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { sanityWriteClient } from "@/lib/sanity/client";
import { requireAuth } from "@/lib/sanity/auth";
import { slugify } from "@/lib/sanity/validate";

type RouteContext = { params: Promise<{ id: string }> };

export const PATCH = requireAuth(async (req: NextRequest, ctx: RouteContext) => {
  const { id } = await ctx.params;
  const client = sanityWriteClient();
  const body = await req.json().catch(() => ({}));
  const name = (body && body.name ? String(body.name) : "").trim();
  if (!name) {
    return NextResponse.json({ error: "Category name is required." }, { status: 400 });
  }
  const slug = slugify(name);
  const dup = await client.fetch(
    `*[_type == "blogCategory" && slug.current == $slug && _id != $id][0]`,
    { slug, id }
  );
  if (dup) {
    return NextResponse.json(
      { error: "A category with this name already exists." },
      { status: 409 }
    );
  }
  const updated = await client
    .patch(id)
    .set({ name, slug: { _type: "slug", current: slug } })
    .commit();
  return NextResponse.json({ category: updated });
});

export const DELETE = requireAuth(async (_req: NextRequest, ctx: RouteContext) => {
  const { id } = await ctx.params;
  const client = sanityWriteClient();
  const inUse = await client.fetch(`count(*[_type == "blogPost" && category._ref == $id])`, {
    id,
  });
  if (inUse > 0) {
    return NextResponse.json(
      { error: "This category is used by existing blog posts and can't be deleted." },
      { status: 409 }
    );
  }
  await client.delete(id);
  return NextResponse.json({ ok: true });
});
