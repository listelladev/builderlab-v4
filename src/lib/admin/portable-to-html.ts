"use client";

// One-way migration helper: turns a legacy Portable-Text article body (the
// format the old block-based editor stored) into the HTML the WYSIWYG
// editor works with. Runs client-side the first time an old post is opened
// for editing; saving then stores the HTML and retires the block array.

import { blockToHtml, escapeHtml } from "@/lib/admin/richtext";
import { imageUrl } from "@/lib/sanity/image";
import type { BodyBlock, PortableTextBlock } from "@/lib/blog";

export function portableTextToHtml(body: BodyBlock[] | null | undefined): string {
  if (!Array.isArray(body)) return "";
  let out = "";
  let i = 0;
  while (i < body.length) {
    const b = body[i];
    if (!b) {
      i += 1;
      continue;
    }
    if (b._type === "image") {
      const src = imageUrl(b, 1600);
      if (src) {
        out += `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(b.alt || "")}"><figcaption>${escapeHtml(
          b.caption || ""
        )}</figcaption></figure>`;
      }
      i += 1;
      continue;
    }
    if (b._type === "block" && b.listItem) {
      const tag = b.listItem === "number" ? "ol" : "ul";
      let items = "";
      while (
        i < body.length &&
        body[i]._type === "block" &&
        (body[i] as PortableTextBlock).listItem === b.listItem
      ) {
        items += `<li><p>${blockToHtml(body[i] as PortableTextBlock)}</p></li>`;
        i += 1;
      }
      out += `<${tag}>${items}</${tag}>`;
      continue;
    }
    if (b._type === "block") {
      const html = blockToHtml(b);
      const style = b.style || "normal";
      if (style === "h2") out += `<h2>${html}</h2>`;
      else if (style === "h3") out += `<h3>${html}</h3>`;
      else if (style === "blockquote") out += `<blockquote><p>${html}</p></blockquote>`;
      else out += `<p>${html}</p>`;
      i += 1;
      continue;
    }
    i += 1;
  }
  return out;
}
