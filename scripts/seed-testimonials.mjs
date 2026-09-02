// One-off: copies the homepage reviews that used to live in src/lib/data.ts
// into the CMS as `testimonial` documents. Safe to re-run — documents get a
// deterministic id and are only created if missing, so later edits made in
// the admin are never overwritten.
//
//   node scripts/seed-testimonials.mjs
import fs from "node:fs";
import { writeClient, slugify } from "./sanity-env.mjs";

const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];

function isoDate(label, index) {
  // "August 2026" -> 2026-08-DD. Reviews that share a month keep their
  // original hand-curated order by taking a descending day of month.
  const [monthName, year] = label.trim().split(/\s+/);
  const month = MONTHS.indexOf(monthName.toLowerCase()) + 1;
  const day = Math.max(1, 28 - index);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function splitName(full) {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

const client = writeClient();
const items = JSON.parse(fs.readFileSync(new URL("./data/testimonials.json", import.meta.url), "utf8"));

let created = 0;
for (const [index, t] of items.entries()) {
  const { firstName, lastName } = splitName(t.name);
  const doc = {
    _id: `testimonial-${slugify(t.name)}`,
    _type: "testimonial",
    firstName,
    lastName,
    date: isoDate(t.date, index),
    text: Array.isArray(t.text) ? t.text.join("\n\n") : t.text,
  };
  const existing = await client.fetch(`*[_id == $id][0]._id`, { id: doc._id });
  if (existing) {
    console.log(`skip   ${doc._id} (exists)`);
    continue;
  }
  await client.createIfNotExists(doc);
  created += 1;
  console.log(`create ${doc._id}  ${doc.date}`);
}
console.log(`done: ${created} created, ${items.length - created} already present`);
