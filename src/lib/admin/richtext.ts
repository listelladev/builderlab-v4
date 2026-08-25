"use client";

// Minimal Portable-Text-style (de)serializer for the blog article block
// editor. Only semantic marks are supported — no raw HTML/CSS ever reaches
// the stored content.

import type {
  PortableTextBlock,
  PortableTextMarkDef,
  PortableTextSpan,
} from "@/lib/blog";

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function escapeHtml(str: string | null | undefined) {
  return String(str || "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );
}

const BLOCK_LEVEL_TAGS = new Set(["div", "p", "li", "ul", "ol", "blockquote", "h1", "h2", "h3", "h4", "h5", "h6"]);

function inlineToSpans(el: Node, markDefs: PortableTextMarkDef[]): PortableTextSpan[] {
  const spans: PortableTextSpan[] = [];
  let sawBlockBoundary = false;

  function walk(node: Node, marks: string[]) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent) {
        spans.push({ _type: "span", _key: uid(), text: node.textContent, marks: [...marks] });
      }
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    let nextMarks = marks;
    if (tag === "b" || tag === "strong") nextMarks = [...marks, "strong"];
    else if (tag === "i" || tag === "em") nextMarks = [...marks, "em"];
    else if (tag === "a") {
      const href = el.getAttribute("href") || "";
      const key = "link-" + uid();
      markDefs.push({ _type: "link", _key: key, href });
      nextMarks = [...marks, key];
    } else if (tag === "br") {
      spans.push({ _type: "span", _key: uid(), text: "\n", marks: [...marks] });
      return;
    } else if (BLOCK_LEVEL_TAGS.has(tag)) {
      // Browsers wrap each Enter-created line in its own <div>/<p> inside a
      // contenteditable. Without a separator here, consecutive lines would
      // serialize as one run-on word.
      if (sawBlockBoundary && spans.length) {
        spans.push({ _type: "span", _key: uid(), text: "\n", marks: [] });
      }
      sawBlockBoundary = true;
    }
    node.childNodes.forEach((child) => walk(child, nextMarks));
  }

  el.childNodes.forEach((child) => walk(child, []));
  if (!spans.length) spans.push({ _type: "span", _key: uid(), text: "", marks: [] });
  return spans;
}

export function htmlToInline(el: HTMLElement): { markDefs: PortableTextMarkDef[]; children: PortableTextSpan[] } {
  const markDefs: PortableTextMarkDef[] = [];
  const children = inlineToSpans(el, markDefs);
  return { markDefs, children };
}

function spanToHtml(span: PortableTextSpan, markDefs?: PortableTextMarkDef[]) {
  let html = escapeHtml(span.text).replace(/\n/g, "<br>");
  (span.marks || []).forEach((m) => {
    if (m === "strong") html = "<strong>" + html + "</strong>";
    else if (m === "em") html = "<em>" + html + "</em>";
    else {
      const def = (markDefs || []).find((d) => d._key === m);
      if (def && def._type === "link") html = `<a href="${escapeHtml(def.href)}">${html}</a>`;
    }
  });
  return html;
}

export function blockToHtml(block: PortableTextBlock) {
  if (!block || block._type !== "block") return "";
  return (block.children || []).map((s) => spanToHtml(s, block.markDefs)).join("");
}
