import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { sanityWriteClient } from "@/lib/sanity/client";
import { requireAuth } from "@/lib/sanity/auth";
import { slugify, validateBlogPostForPublish } from "@/lib/sanity/validate";
import { sanitizeRichHtml, estimateReadTimeFromHtml } from "@/lib/html";

export const GET = requireAuth(async () => {
  const client = sanityWriteClient();
  const posts = await client.fetch(
    `*[_type == "blogPost"] | order(_createdAt desc) { ..., category-> }`
  );
  return NextResponse.json({ posts });
});

export const POST = requireAuth(async (req: NextRequest) => {
  const client = sanityWriteClient();
  const body = await req.json().catch(() => ({}));

  const title = typeof body.title === "string" ? body.title.trim() : "";
  let slug =
    typeof body.slug === "string" && body.slug.trim() ? slugify(body.slug) : slugify(title);

  if (slug) {
    const dup = await client.fetch(`*[_type == "blogPost" && slug.current == $slug][0]{_id}`, {
      slug,
    });
    if (dup) {
      let n = 2;
      let candidate = `${slug}-${n}`;
      while (await client.fetch(`*[_type == "blogPost" && slug.current == $s][0]{_id}`, { s: candidate })) {
        n += 1;
        candidate = `${slug}-${n}`;
      }
      slug = candidate;
    }
  }

  const bodyHtml = sanitizeRichHtml(body.bodyHtml);
  const readTimeOverride =
    typeof body.readTimeOverride === "number" && body.readTimeOverride > 0
      ? body.readTimeOverride
      : undefined;

  const doc = {
    _type: "blogPost",
    title,
    slug: slug ? { _type: "slug", current: slug } : undefined,
    category: body.category ? { _type: "reference", _ref: body.category } : undefined,
    author: typeof body.author === "string" ? body.author.trim() : "",
    publishedAt: body.publishedAt || undefined,
    featuredImage: body.featuredImage || undefined,
    excerpt: typeof body.excerpt === "string" ? body.excerpt.trim() : "",
    bodyHtml,
    readTimeOverride,
    readTime: readTimeOverride ?? estimateReadTimeFromHtml(bodyHtml),
    published: false,
  };

  if (body.published === true) {
    const errors = validateBlogPostForPublish(doc);
    if (errors.length) {
      return NextResponse.json({ error: errors[0], errors }, { status: 400 });
    }
    doc.published = true;
  }

  const created = await client.create(doc);
  return NextResponse.json({ post: created }, { status: 201 });
});
