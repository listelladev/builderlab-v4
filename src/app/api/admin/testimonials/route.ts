import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { sanityWriteClient } from "@/lib/sanity/client";
import { requireAuth } from "@/lib/sanity/auth";
import { readTestimonialInput } from "./shared";

export const GET = requireAuth(async () => {
  const client = sanityWriteClient();
  const testimonials = await client.fetch(
    `*[_type == "testimonial"] | order(date desc, _createdAt desc)`
  );
  return NextResponse.json({ testimonials });
});

export const POST = requireAuth(async (req: NextRequest) => {
  const client = sanityWriteClient();
  const body = await req.json().catch(() => ({}));
  const { fields, errors } = readTestimonialInput(body);
  if (errors.length) {
    return NextResponse.json({ error: errors[0], errors }, { status: 400 });
  }
  const created = await client.create({ _type: "testimonial", ...fields });
  return NextResponse.json({ testimonial: created }, { status: 201 });
});
