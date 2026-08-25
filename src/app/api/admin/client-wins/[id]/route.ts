import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { sanityWriteClient } from "@/lib/sanity/client";
import { requireAuth } from "@/lib/sanity/auth";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = requireAuth(async (_req: NextRequest, ctx: RouteContext) => {
  const { id } = await ctx.params;
  const client = sanityWriteClient();
  const win = await client.fetch(`*[_type == "clientWin" && _id == $id][0]`, { id });
  if (!win) return NextResponse.json({ error: "Client win not found." }, { status: 404 });
  return NextResponse.json({ win });
});

export const PATCH = requireAuth(async (req: NextRequest, ctx: RouteContext) => {
  const { id } = await ctx.params;
  const client = sanityWriteClient();
  const existing = await client.fetch(`*[_type == "clientWin" && _id == $id][0]`, { id });
  if (!existing) return NextResponse.json({ error: "Client win not found." }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};
  if (typeof body.name === "string") patch.name = body.name.trim();
  if (typeof body.date === "string") patch.date = body.date.trim();
  if (body.image && body.image.asset) patch.image = body.image;

  const updated = await client.patch(id).set(patch).commit();
  return NextResponse.json({ win: updated });
});

export const DELETE = requireAuth(async (_req: NextRequest, ctx: RouteContext) => {
  const { id } = await ctx.params;
  const client = sanityWriteClient();
  await client.delete(id);
  return NextResponse.json({ ok: true });
});
