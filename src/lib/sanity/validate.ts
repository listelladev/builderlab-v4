import "server-only";
import { isRichHtmlEmpty } from "@/lib/html";

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4MB

export function slugify(input: string | null | undefined): string {
  return (input || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

type PortableTextBlock = {
  _type?: string;
  children?: { text?: string }[];
};

/** ~225 wpm, rounded up. Walks Portable-Text blocks and sums span text. */
export function estimateReadTimeMinutes(body: unknown): number {
  if (!Array.isArray(body)) return 1;
  let words = 0;
  for (const block of body as PortableTextBlock[]) {
    if (!block) continue;
    if (block._type === "block" && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (typeof child.text === "string") {
          words += child.text.trim().split(/\s+/).filter(Boolean).length;
        }
      }
    }
  }
  return Math.max(1, Math.ceil(words / 225));
}

export type BlogPostDraft = {
  title?: string;
  slug?: { current?: string };
  category?: { _ref?: string };
  author?: string;
  publishedAt?: string;
  featuredImage?: { asset?: unknown };
  excerpt?: string;
  body?: unknown[];
  bodyHtml?: string;
};

export function validateBlogPostForPublish(doc: BlogPostDraft): string[] {
  const errors: string[] = [];
  if (!doc.title || !doc.title.trim()) errors.push("Title is required before publishing.");
  if (!doc.slug || !doc.slug.current || !doc.slug.current.trim())
    errors.push("Slug is required before publishing.");
  if (!doc.category || !doc.category._ref) errors.push("Category is required before publishing.");
  if (!doc.author || !doc.author.trim()) errors.push("Author is required before publishing.");
  if (!doc.publishedAt) errors.push("Date published is required before publishing.");
  if (!doc.featuredImage || !doc.featuredImage.asset)
    errors.push("A featured image is required before publishing.");
  if (!doc.excerpt || !doc.excerpt.trim()) errors.push("Excerpt is required before publishing.");
  const hasBlocks = Array.isArray(doc.body) && doc.body.length > 0;
  if (!hasBlocks && isRichHtmlEmpty(doc.bodyHtml))
    errors.push("Article body is required before publishing.");
  return errors;
}
