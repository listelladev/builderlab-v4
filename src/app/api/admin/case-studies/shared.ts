import "server-only";
import { slugify } from "@/lib/sanity/validate";
import { sanitizeRichHtml, isRichHtmlEmpty } from "@/lib/html";

type SanityImageRef = { _type: "image"; asset: { _type: "reference"; _ref: string } };

function image(v: unknown): SanityImageRef | undefined {
  if (!v || typeof v !== "object") return undefined;
  const asset = (v as { asset?: { _ref?: string } }).asset;
  if (!asset || typeof asset._ref !== "string") return undefined;
  return { _type: "image", asset: { _type: "reference", _ref: asset._ref } };
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const key = () => Math.random().toString(36).slice(2, 10);

/**
 * Normalizes the editor payload into the stored document shape. Only keys
 * present in `body` are returned, so a PATCH can send a subset.
 */
export function readCaseStudyInput(body: Record<string, unknown>) {
  const patch: Record<string, unknown> = {};

  if ("name" in body) patch.name = str(body.name);
  if ("industry" in body) patch.industry = str(body.industry);
  if ("tagline" in body) patch.tagline = str(body.tagline);
  if ("slug" in body) {
    const s = slugify(str(body.slug));
    patch.slug = s ? { _type: "slug", current: s } : undefined;
  }
  if ("highlights" in body) {
    patch.highlights = Array.isArray(body.highlights)
      ? body.highlights.map(str).filter(Boolean).slice(0, 3)
      : [];
  }
  if ("heroImage" in body) patch.heroImage = image(body.heroImage);
  if ("resultsImage" in body) patch.resultsImage = image(body.resultsImage);
  if ("stats" in body) {
    patch.stats = Array.isArray(body.stats)
      ? body.stats
          .map((s) => {
            const o = (s || {}) as Record<string, unknown>;
            const value = typeof o.value === "number" ? o.value : Number(o.value);
            return {
              _key: typeof o._key === "string" && o._key ? o._key : key(),
              label: str(o.label),
              value: Number.isFinite(value) ? value : 0,
              prefix: str(o.prefix),
              suffix: str(o.suffix),
            };
          })
          .filter((s) => s.label)
          .slice(0, 4)
      : [];
  }
  if ("aboutHtml" in body) patch.aboutHtml = sanitizeRichHtml(body.aboutHtml);
  if ("resultsHtml" in body) patch.resultsHtml = sanitizeRichHtml(body.resultsHtml);
  if ("whatWeDid" in body) {
    patch.whatWeDid = Array.isArray(body.whatWeDid)
      ? body.whatWeDid
          .map((w) => {
            const o = (w || {}) as Record<string, unknown>;
            return {
              _key: typeof o._key === "string" && o._key ? o._key : key(),
              title: str(o.title),
              description: str(o.description),
            };
          })
          .filter((w) => w.title || w.description)
      : [];
  }
  if ("testimonialQuote" in body) patch.testimonialQuote = str(body.testimonialQuote);
  if ("testimonialName" in body) patch.testimonialName = str(body.testimonialName);
  if ("testimonialRole" in body) patch.testimonialRole = str(body.testimonialRole);
  if ("sortOrder" in body) {
    const n = Number(body.sortOrder);
    patch.sortOrder = Number.isFinite(n) ? n : 0;
  }
  return patch;
}

export function validateCaseStudyForPublish(doc: Record<string, unknown>): string[] {
  const errors: string[] = [];
  if (!str(doc.name)) errors.push("Name is required before publishing.");
  const slug = doc.slug as { current?: string } | undefined;
  if (!slug || !slug.current) errors.push("Slug is required before publishing.");
  if (!str(doc.industry)) errors.push("Industry is required before publishing.");
  if (!str(doc.tagline)) errors.push("Tagline is required before publishing.");
  if (!image(doc.heroImage)) errors.push("A hero image is required before publishing.");
  const highlights = Array.isArray(doc.highlights) ? doc.highlights.filter(Boolean) : [];
  if (highlights.length === 0) errors.push("At least one highlight is required before publishing.");
  if (isRichHtmlEmpty(doc.aboutHtml)) errors.push("The About section is required before publishing.");
  if (isRichHtmlEmpty(doc.resultsHtml)) errors.push("The Results section is required before publishing.");
  return errors;
}
