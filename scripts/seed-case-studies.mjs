// One-off: moves the three hand-written case studies (formerly a static
// array in src/lib/case-studies.ts) into the CMS as `caseStudy` documents,
// uploading their images from /public/images as Sanity assets. Safe to
// re-run — deterministic ids, created only if missing.
//
//   node scripts/seed-case-studies.mjs
import fs from "node:fs";
import path from "node:path";
import { writeClient } from "./sanity-env.mjs";

const client = writeClient();
const items = JSON.parse(fs.readFileSync(new URL("./data/case-studies.json", import.meta.url), "utf8"));

const assetCache = new Map();
async function uploadLocalImage(publicPath) {
  if (assetCache.has(publicPath)) return assetCache.get(publicPath);
  const file = path.resolve(process.cwd(), "public", publicPath.replace(/^\//, ""));
  const buffer = fs.readFileSync(file);
  const asset = await client.assets.upload("image", buffer, { filename: path.basename(file) });
  const ref = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  assetCache.set(publicPath, ref);
  console.log(`  uploaded ${publicPath} -> ${asset._id}`);
  return ref;
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const para = (s) => `<p>${esc(s)}</p>`;
const key = (i) => `k${i}${Math.random().toString(36).slice(2, 8)}`;

let created = 0;
for (const [index, c] of items.entries()) {
  const _id = `caseStudy-${c.slug}`;
  const existing = await client.fetch(`*[_id == $id][0]._id`, { id: _id });
  if (existing) {
    console.log(`skip   ${_id} (exists)`);
    continue;
  }
  console.log(`create ${_id}`);
  const heroImage = await uploadLocalImage(c.heroImage);
  const resultsImage = await uploadLocalImage(c.resultsImage);
  const doc = {
    _id,
    _type: "caseStudy",
    name: c.name,
    slug: { _type: "slug", current: c.slug },
    industry: c.industry,
    tagline: c.tagline,
    highlights: c.highlights,
    heroImage,
    stats: c.stats.map((s, i) => ({ _key: key(i), label: s.label, value: s.value, prefix: s.prefix || "", suffix: s.suffix || "" })),
    aboutHtml: para(c.about),
    whatWeDid: c.whatWeDid.map((w, i) => ({ _key: key(i), title: w.title, description: w.description })),
    resultsHtml: para(c.results),
    resultsImage,
    testimonialQuote: c.testimonial?.quote || "",
    testimonialName: c.testimonial?.name || "",
    testimonialRole: c.testimonial?.role || "",
    sortOrder: index + 1,
    published: true,
  };
  await client.createIfNotExists(doc);
  created += 1;
}
console.log(`done: ${created} created, ${items.length - created} already present`);
