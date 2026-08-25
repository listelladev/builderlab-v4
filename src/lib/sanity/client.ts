import "server-only";
import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_API_PROJECT_ID;
const dataset = process.env.SANITY_API_DATASET || "production";
const apiVersion = "2024-01-01";

/** Read-only client. Used by public pages (server-rendered) and the admin dashboard's list views. */
export const sanityReadClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
  perspective: "published",
});

let _writeClient: ReturnType<typeof createClient> | null = null;

/**
 * Server-only write client. Every call site must already be gated by
 * requireAuth() — never import this from a public read path.
 */
export function sanityWriteClient() {
  if (_writeClient) return _writeClient;

  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !token) {
    throw new Error(
      "Sanity is not configured. Set SANITY_API_PROJECT_ID and SANITY_API_WRITE_TOKEN."
    );
  }

  _writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: "raw",
  });
  return _writeClient;
}
