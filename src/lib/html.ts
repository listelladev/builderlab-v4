import "server-only";
import sanitizeHtml from "sanitize-html";

// Rich-text bodies (blog articles, case-study copy) are authored in the
// admin's WYSIWYG editor and stored as HTML. Everything that reaches the
// content lake goes through this allow-list first, so the stored markup can
// only ever contain the handful of semantic tags the public templates know
// how to style — no inline styles, scripts, iframes, or stray classes.

const ALLOWED_TAGS = [
  "p",
  "h2",
  "h3",
  "blockquote",
  "ul",
  "ol",
  "li",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "a",
  "br",
  "hr",
  "figure",
  "img",
  "figcaption",
];

export function sanitizeRichHtml(input: unknown): string {
  if (typeof input !== "string") return "";
  const clean = sanitizeHtml(input, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesAppliedToAttributes: ["href", "src"],
    transformTags: {
      // External links open in a new tab; site-relative ones stay put.
      a: (tagName, attribs) => {
        const href = attribs.href || "";
        const external = /^https?:\/\//i.test(href);
        const next: Record<string, string> = { href };
        if (external) {
          next.target = "_blank";
          next.rel = "noopener";
        }
        return { tagName, attribs: next };
      },
    },
  });
  return clean.trim();
}

/** Plain text of a rich HTML string (tags stripped, whitespace collapsed). */
export function richHtmlToText(html: unknown): string {
  if (typeof html !== "string" || !html) return "";
  const text = sanitizeHtml(html.replace(/<\/(p|li|h2|h3|blockquote|figcaption|div)>/gi, " "), {
    allowedTags: [],
    allowedAttributes: {},
  });
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** True when the HTML carries no visible content (no text and no image). */
export function isRichHtmlEmpty(html: unknown): boolean {
  if (typeof html !== "string") return true;
  if (/<img\b/i.test(html)) return false;
  return richHtmlToText(html).length === 0;
}

/** ~225 wpm, rounded up, from the HTML's visible text. */
export function estimateReadTimeFromHtml(html: unknown): number {
  const words = richHtmlToText(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 225));
}
