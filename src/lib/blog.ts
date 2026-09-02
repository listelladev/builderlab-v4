import "server-only";
import { sanityReadClient } from "@/lib/sanity/client";
import type { SanityImage } from "@/lib/sanity/image";

export type PortableTextSpan = {
  _type: "span";
  _key: string;
  text: string;
  marks?: string[];
};

export type PortableTextMarkDef = {
  _type: "link";
  _key: string;
  href: string;
};

export type PortableTextBlock = {
  _type: "block";
  _key: string;
  style?: "normal" | "h2" | "h3" | "blockquote";
  listItem?: "bullet" | "number";
  level?: number;
  markDefs?: PortableTextMarkDef[];
  children: PortableTextSpan[];
};

export type PortableTextImageBlock = SanityImage & {
  _type: "image";
  _key: string;
};

export type BodyBlock = PortableTextBlock | PortableTextImageBlock;

export type BlogPost = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: number;
  readTimeOverride?: number;
  featuredImage: SanityImage;
  /** Legacy Portable-Text body (posts written before the WYSIWYG editor). */
  body?: BodyBlock[];
  /** Sanitized HTML from the WYSIWYG editor. Preferred when present. */
  bodyHtml?: string;
  categoryName: string;
};

const POST_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  author,
  featuredImage,
  publishedAt,
  readTime,
  readTimeOverride,
  body,
  bodyHtml,
  "categoryName": category->name
}`;

export async function getBlogPosts(): Promise<BlogPost[]> {
  return sanityReadClient.fetch(
    `*[_type == "blogPost" && published == true] | order(publishedAt desc) ${POST_PROJECTION}`
  );
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const post = await sanityReadClient.fetch(
    `*[_type == "blogPost" && published == true && slug.current == $slug][0] ${POST_PROJECTION}`,
    { slug }
  );
  return post || null;
}

export { displayReadTime, formatBlogDate } from "./blog-format";
