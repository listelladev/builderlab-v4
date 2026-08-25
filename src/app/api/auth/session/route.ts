import "server-only";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/sanity/auth";

export async function GET() {
  return NextResponse.json({ authenticated: await isAuthenticated() });
}
