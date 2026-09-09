import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { sanityWriteClient } from "@/lib/sanity/client";
import { requireAuth } from "@/lib/sanity/auth";

// Splits a textarea value into paragraph strings (blank line = new
// paragraph), mirroring how the public FAQ section renders `answer`.
function toParagraphs(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((p) => String(p).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return [];
}

export const GET = requireAuth(async () => {
  const client = sanityWriteClient();
  const faqs = await client.fetch(
    `*[_type == "faq"] | order(order asc, _createdAt asc){ _id, question, answer, order }`
  );
  return NextResponse.json({ faqs });
});

export const POST = requireAuth(async (req: NextRequest) => {
  const client = sanityWriteClient();
  const body = await req.json().catch(() => ({}));

  const question = typeof body.question === "string" ? body.question.trim() : "";
  const answer = toParagraphs(body.answer);

  if (!question) {
    return NextResponse.json({ error: "A question is required." }, { status: 400 });
  }
  if (!answer.length) {
    return NextResponse.json({ error: "An answer is required." }, { status: 400 });
  }

  // Keep new entries at the end of the curated order.
  const maxOrder: number | null = await client.fetch(
    `math::max(*[_type == "faq"].order)`
  );
  const order = (typeof maxOrder === "number" ? maxOrder : 0) + 1;

  const created = await client.create({ _type: "faq", question, answer, order });
  return NextResponse.json({ faq: created }, { status: 201 });
});
