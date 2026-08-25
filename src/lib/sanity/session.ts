import "server-only";
import crypto from "node:crypto";

export const SESSION_COOKIE_NAME = "builderlab_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

function b64url(input: string) {
  return Buffer.from(input).toString("base64url");
}

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not configured.");
  return secret;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

/** Build a signed `payload.signature` session token. */
export function createSessionToken(): string {
  const payload = b64url(JSON.stringify({ admin: true, exp: Date.now() + MAX_AGE_SECONDS * 1000 }));
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

/** Verify a session token; returns true/false. Constant-time signature compare. */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== "string" || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  let expected: string;
  try {
    expected = sign(payload);
  } catch {
    return false;
  }

  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return Boolean(data.admin) && typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export const SESSION_COOKIE_MAX_AGE = MAX_AGE_SECONDS;
