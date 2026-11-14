// Replaces every pricing-page FAQ in the CMS with scripts/data/pricing-faqs.json
// (in that order). Writes a JSON backup of the old documents first.
//
//   node scripts/replace-pricing-faqs.mjs <backup-file.json>
import fs from "node:fs";
import { writeClient, slugify } from "./sanity-env.mjs";

const backupPath = process.argv[2];
if (!backupPath) throw new Error("Pass a backup file path.");
const client = writeClient();
const items = JSON.parse(
  fs.readFileSync(new URL("./data/pricing-faqs.json", import.meta.url), "utf8")
);

const old = await client.fetch(`*[_type == "faq" && page == "pricing"]`);
fs.writeFileSync(backupPath, JSON.stringify(old, null, 2));
console.log(`backed up ${old.length} docs -> ${backupPath}`);

const tx = client.transaction();
for (const d of old) tx.delete(d._id);
items.forEach((f, i) =>
  tx.createOrReplace({
    _id: `faq-pricing-${slugify(f.question)}`,
    _type: "faq",
    question: f.question,
    answer: Array.isArray(f.answer) ? f.answer : [f.answer],
    order: i + 1,
    page: "pricing",
  })
);
await tx.commit();

const now = await client.fetch(
  `*[_type == "faq" && page == "pricing"] | order(order asc) { order, question, "drafts": count(*[_id == "drafts." + ^._id]) }`
);
console.log(now);
