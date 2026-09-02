// Loads .env.local (never committed) and returns a write-capable Sanity
// client for the one-off seed scripts in this folder.
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

export function loadEnv() {
  const file = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}

export function writeClient() {
  loadEnv();
  const projectId = process.env.SANITY_API_PROJECT_ID;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !token) {
    throw new Error("Set SANITY_API_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local first.");
  }
  return createClient({
    projectId,
    dataset: process.env.SANITY_API_DATASET || "production",
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
    perspective: "raw",
  });
}

export function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}
