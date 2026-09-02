import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { sanityWriteClient } from "@/lib/sanity/client";
import { requireAuth } from "@/lib/sanity/auth";
import { readCaseStudyInput, validateCaseStudyForPublish } from "../shared";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = requireAuth(async (_req: NextRequest, ctx: RouteContext) => {
  const { id } = await ctx.params;
  const client = sanityWriteClient();
  const caseStudy = await client.fetch(`*[_type == "caseStudy" && _id == $id][0]`, { id });
  if (!caseStudy) return NextResponse.json({ error: "Case study not found." }, { status: 404 });
  return NextResponse.json({ caseStudy });
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
  const existing = await client.fetch(`*[_type == "caseStudy" && _id == $id][0]`, { id });
  if (!existing) return NextResponse.json({ error: "Case study not found." }, { status: 404 });

  const body = await req.json().catch(() => ({}));

  if (body.action === "unpublish") {
    const updated = await client.patch(id).set({ published: false }).commit();
    return NextResponse.json({ caseStudy: updated });
  }

  const patch = readCaseStudyInput(body);

  const newSlug = (patch.slug as { current?: string } | undefined)?.current;
  if ("slug" in patch) {
    if (!newSlug) {
      delete patch.slug;
    } else {
      const dup = await client.fetch(
        `*[_type == "caseStudy" && slug.current == $slug && _id != $id][0]{_id}`,
        { slug: newSlug, id }
      );
      if (dup) {
        return NextResponse.json(
          { error: "That slug is already used by another case study." },
          { status: 409 }
        );
      }
    }
  }

  const merged = { ...existing, ...patch };
  let publishedValue = Boolean(existing.published);
  if (body.action === "publish" || body.published === true) {
    const errors = validateCaseStudyForPublish(merged);
    if (errors.length) {
      return NextResponse.json({ error: errors[0], errors }, { status: 400 });
    }
    publishedValue = true;
  } else if (body.published === false) {
    publishedValue = false;
  }
  patch.published = publishedValue;

  const unset = Object.keys(patch).filter((k) => patch[k] === undefined);
  for (const k of unset) delete patch[k];
  let tx = client.patch(id).set(patch);
  if (unset.length) tx = tx.unset(unset);
  const updated = await tx.commit();
  return NextResponse.json({ caseStudy: updated });
});
