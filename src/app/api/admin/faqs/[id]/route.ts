import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { sanityWriteClient } from "@/lib/sanity/client";
import { requireAuth } from "@/lib/sanity/auth";

type RouteContext = { params: Promise<{ id: string }> };

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

export const GET = requireAuth(async (_req: NextRequest, ctx: RouteContext) => {
  const { id } = await ctx.params;
  const client = sanityWriteClient();
  const faq = await client.fetch(
    `*[_type == "faq" && _id == $id][0]{ _id, question, answer, order }`,
    { id }
  );
  if (!faq) return NextResponse.json({ error: "FAQ not found." }, { status: 404 });
  return NextResponse.json({ faq });
});

export const PATCH = requireAuth(async (req: NextRequest, ctx: RouteContext) => {
  const { id } = await ctx.params;
  const client = sanityWriteClient();
  const existing = await client.fetch(`*[_type == "faq" && _id == $id][0]._id`, { id });
  if (!existing) return NextResponse.json({ error: "FAQ not found." }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};

  if (typeof body.question === "string") {
    const question = body.question.trim();
    if (!question) {
      return NextResponse.json({ error: "A question is required." }, { status: 400 });
    }
    patch.question = question;
  }
  if (body.answer !== undefined) {
    const answer = toParagraphs(body.answer);
    if (!answer.length) {
      return NextResponse.json({ error: "An answer is required." }, { status: 400 });
    }
    patch.answer = answer;
  }

  const updated = await client.patch(id).set(patch).commit();
  return NextResponse.json({ faq: updated });
});

export const DELETE = requireAuth(async (_req: NextRequest, ctx: RouteContext) => {
  const { id } = await ctx.params;
  const client = sanityWriteClient();
  await client.delete(id);
  return NextResponse.json({ ok: true });
});
