import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { sanityWriteClient } from "@/lib/sanity/client";
import { requireAuth } from "@/lib/sanity/auth";
import { slugify, estimateReadTimeMinutes, validateBlogPostForPublish } from "@/lib/sanity/validate";

const EDITABLE_FIELDS = [
  "title",
  "category",
  "author",
  "publishedAt",
  "featuredImage",
  "excerpt",
  "body",
  "readTimeOverride",
] as const;

type RouteContext = { params: Promise<{ id: string }> };

export const GET = requireAuth(async (_req: NextRequest, ctx: RouteContext) => {
  const { id } = await ctx.params;
  const client = sanityWriteClient();
  const post = await client.fetch(`*[_type == "blogPost" && _id == $id][0]{ ..., category-> }`, {
    id,
  });
  if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  return NextResponse.json({ post });
});

export const DELETE = requireAuth(async (_req: NextRequest, ctx: RouteContext) => {
  const { id } = await ctx.params;
  const client = sanityWriteClient();
  await client.delete(id);
  return NextResponse.json({ ok: true });
});

export const PATCH = requireAuth(async (req: NextRequest, ctx: RouteContext) => {
  const { id } = await ctx.params;
  const client = sanityWriteClient();
  const existing = await client.fetch(`*[_type == "blogPost" && _id == $id][0]`, { id });
  if (!existing) return NextResponse.json({ error: "Post not found." }, { status: 404 });

  const body = await req.json().catch(() => ({}));

  if (body.action === "unpublish") {
    const updated = await client.patch(id).set({ published: false }).commit();
    return NextResponse.json({ post: updated });
  }

  const patch: Record<string, unknown> = {};
  for (const key of EDITABLE_FIELDS) {
    if (key in body) patch[key] = body[key];
  }
  if ("category" in body) {
    patch.category = body.category ? { _type: "reference", _ref: body.category } : undefined;
  }

  // Slug is only touched when the admin explicitly sends one — editing the
  // title never silently overwrites a slug they customized.
  if (typeof body.slug === "string" && body.slug.trim()) {
    const newSlug = slugify(body.slug);
    const dup = await client.fetch(
      `*[_type == "blogPost" && slug.current == $slug && _id != $id][0]{_id}`,
      { slug: newSlug, id }
    );
    if (dup) {
      return NextResponse.json(
        { error: "That slug is already used by another post." },
        { status: 409 }
      );
    }
    patch.slug = { _type: "slug", current: newSlug };
  }

  const merged = { ...existing, ...patch } as {
    readTimeOverride?: number;
    body?: unknown[];
    published?: boolean;
  };
  merged.readTimeOverride =
    typeof merged.readTimeOverride === "number" && merged.readTimeOverride > 0
      ? merged.readTimeOverride
      : undefined;
  patch.readTime = merged.readTimeOverride ?? estimateReadTimeMinutes(merged.body);

  let publishedValue = existing.published;
  if (body.action === "publish" || body.published === true) {
    const errors = validateBlogPostForPublish(merged);
    if (errors.length) {
      return NextResponse.json({ error: errors[0], errors }, { status: 400 });
    }
    publishedValue = true;
  } else if (body.published === false) {
    publishedValue = false;
  }
  patch.published = publishedValue;

  const updated = await client.patch(id).set(patch).commit();
  return NextResponse.json({ post: updated });
});
