// One-off: copies the homepage FAQs that live in src/lib/data.ts into the
// CMS as `faq` documents, in their current order. Safe to re-run — each
// document gets a deterministic id and is only created if missing, so
// later edits made in the admin are never overwritten.
//
//   node scripts/seed-faqs.mjs
import fs from "node:fs";
import { writeClient, slugify } from "./sanity-env.mjs";

const client = writeClient();
const items = JSON.parse(
  fs.readFileSync(new URL("./data/faqs.json", import.meta.url), "utf8")
);

let created = 0;
for (const [index, f] of items.entries()) {
  const doc = {
    _id: `faq-${slugify(f.question)}`,
    _type: "faq",
    question: f.question,
    answer: Array.isArray(f.answer) ? f.answer : [f.answer],
    order: index + 1,
  };
  const existing = await client.fetch(`*[_id == $id][0]._id`, { id: doc._id });
  if (existing) {
    console.log(`skip   ${doc._id} (exists)`);
    continue;
  }
  await client.createIfNotExists(doc);
  created += 1;
  console.log(`create ${doc._id}  (order ${doc.order})`);
}
console.log(`done: ${created} created, ${items.length - created} already present`);
