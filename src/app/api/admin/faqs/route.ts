import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { sanityWriteClient } from "@/lib/sanity/client";
import { requireAuth } from "@/lib/sanity/auth";
import { faqPageFilter, type FaqPage } from "@/lib/faqs";

// Homepage FAQs and pricing-page FAQs are the same document type, scoped by
// an optional `page` field. `?page=pricing` (GET) / `page: "pricing"` (POST)
// select the pricing list; anything else is the homepage list.
function pageOf(value: unknown): FaqPage {
  return value === "pricing" ? "pricing" : "home";
}

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

export const GET = requireAuth(async (req: NextRequest) => {
  const client = sanityWriteClient();
  const page = pageOf(req.nextUrl.searchParams.get("page"));
  const faqs = await client.fetch(
    `*[_type == "faq" && ${faqPageFilter(page)}] | order(order asc, _createdAt asc){ _id, question, answer, order }`
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

  // Keep new entries at the end of their own list's curated order.
  const page = pageOf(body.page);
  const maxOrder: number | null = await client.fetch(
    `math::max(*[_type == "faq" && ${faqPageFilter(page)}].order)`
  );
  const order = (typeof maxOrder === "number" ? maxOrder : 0) + 1;

  // Homepage FAQs carry no `page` field, exactly as before.
  const created = await client.create({
    _type: "faq",
    question,
    answer,
    order,
    ...(page === "pricing" ? { page } : {}),
  });
  return NextResponse.json({ faq: created }, { status: 201 });
});
