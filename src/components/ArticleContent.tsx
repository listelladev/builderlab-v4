import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { imageUrl } from "@/lib/sanity/image";
import type { BodyBlock, PortableTextBlock, PortableTextSpan } from "@/lib/blog";

function renderSpans(children: PortableTextSpan[], markDefs: PortableTextBlock["markDefs"]) {
  return children.map((span, i) => {
    let node: ReactNode = span.text;
    for (const mark of [...(span.marks || [])].reverse()) {
      if (mark === "strong") {
        node = <strong key={`${span._key}-strong`}>{node}</strong>;
      } else if (mark === "em") {
        node = <em key={`${span._key}-em`}>{node}</em>;
      } else {
        const def = markDefs?.find((d) => d._key === mark);
        if (def) {
          node = (
            <Link
              key={span._key}
              href={def.href}
              className="text-[#38B685] underline underline-offset-4 decoration-[#38B685]/40 hover:decoration-[#38B685] transition-colors"
              target={def.href.startsWith("/") ? undefined : "_blank"}
              rel={def.href.startsWith("/") ? undefined : "noopener"}
            >
              {node}
            </Link>
          );
        }
      }
    }
    return <span key={span._key || i}>{node}</span>;
  });
}

/** Portable Text body blocks -> article JSX. Groups consecutive list-item blocks into one <ul>/<ol>. */
export function ArticleContent({ body }: { body: BodyBlock[] }) {
  if (!Array.isArray(body)) return null;

  const nodes: ReactNode[] = [];
  let i = 0;
  while (i < body.length) {
    const block = body[i];

    if (block._type === "image") {
      const src = imageUrl(block, 1200);
      if (src) {
        nodes.push(
          <Reveal key={block._key}>
            <figure className="mt-10 mb-10">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/5">
                <Image
                  src={src}
                  alt={block.alt || ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 980px"
                />
              </div>
              {block.caption && (
                <figcaption className="text-sm text-white/40 mt-3 text-center">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          </Reveal>
        );
      }
      i += 1;
      continue;
    }

    if (block._type === "block" && block.listItem) {
      const tag = block.listItem === "number" ? "ol" : "ul";
      const items: PortableTextBlock[] = [];
      while (
        i < body.length &&
        body[i]._type === "block" &&
        (body[i] as PortableTextBlock).listItem === block.listItem
      ) {
        items.push(body[i] as PortableTextBlock);
        i += 1;
      }
      const Tag = tag;
      const listStyle = tag === "ol" ? "list-decimal" : "list-disc";
      nodes.push(
        <Reveal key={block._key}>
          <Tag className={`${listStyle} marker:text-[#38B685] space-y-3 mt-6 pl-5`}>
            {items.map((item) => (
              <li key={item._key} className="text-base text-white/70 leading-relaxed">
                {renderSpans(item.children, item.markDefs)}
              </li>
            ))}
          </Tag>
        </Reveal>
      );
      continue;
    }

    if (block._type === "block") {
      const style = block.style || "normal";
      const content = renderSpans(block.children, block.markDefs);
      if (style === "h2") {
        nodes.push(
          <Reveal key={block._key}>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mt-14 mb-5">{content}</h2>
          </Reveal>
        );
      } else if (style === "h3") {
        nodes.push(
          <Reveal key={block._key}>
            <h3 className="text-xl font-bold text-white mt-10 mb-4">{content}</h3>
          </Reveal>
        );
      } else if (style === "blockquote") {
        nodes.push(
          <Reveal key={block._key}>
            <blockquote className="border-l-2 border-[#38B685] pl-5 mt-6 text-base text-white/70 italic leading-relaxed">
              {content}
            </blockquote>
          </Reveal>
        );
      } else {
        nodes.push(
          <Reveal key={block._key}>
            <p className="text-base text-white/70 leading-relaxed mt-6">{content}</p>
          </Reveal>
        );
      }
      i += 1;
      continue;
    }

    i += 1;
  }

  return <div>{nodes}</div>;
}
