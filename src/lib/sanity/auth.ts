import "server-only";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./session";

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE_NAME)?.value);
}

/** Wrap a Route Handler so it 401s unless the signed admin session cookie is valid. */
export function requireAuth<T extends (req: NextRequest, ctx: never) => Promise<Response>>(
  handler: T
): T {
  return (async (req: NextRequest, ctx: never) => {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }
    return handler(req, ctx);
  }) as T;
}
