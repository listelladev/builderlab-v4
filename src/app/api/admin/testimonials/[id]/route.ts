import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { sanityWriteClient } from "@/lib/sanity/client";
import { requireAuth } from "@/lib/sanity/auth";
import { readTestimonialInput } from "../shared";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = requireAuth(async (_req: NextRequest, ctx: RouteContext) => {
  const { id } = await ctx.params;
  const client = sanityWriteClient();
  const testimonial = await client.fetch(`*[_type == "testimonial" && _id == $id][0]`, { id });
  if (!testimonial) return NextResponse.json({ error: "Review not found." }, { status: 404 });
  return NextResponse.json({ testimonial });
});

export const PATCH = requireAuth(async (req: NextRequest, ctx: RouteContext) => {
  const { id } = await ctx.params;
  const client = sanityWriteClient();
  const existing = await client.fetch(`*[_type == "testimonial" && _id == $id][0]`, { id });
  if (!existing) return NextResponse.json({ error: "Review not found." }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const { fields, errors } = readTestimonialInput({ ...existing, ...body });
  if (errors.length) {
    return NextResponse.json({ error: errors[0], errors }, { status: 400 });
  }
  const updated = await client.patch(id).set(fields).commit();
  return NextResponse.json({ testimonial: updated });
});

export const DELETE = requireAuth(async (_req: NextRequest, ctx: RouteContext) => {
  const { id } = await ctx.params;
  const client = sanityWriteClient();
  await client.delete(id);
  return NextResponse.json({ ok: true });
});
