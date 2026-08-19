import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import type { BlogBlock } from "@/lib/blog";

export function ArticleContent({ body }: { body: BlogBlock[] }) {
  return (
    <div>
      {body.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <Reveal key={i}>
                <h2 className="text-2xl lg:text-3xl font-bold text-white mt-14 mb-5">
                  {block.text}
                </h2>
              </Reveal>
            );
          case "h3":
            return (
              <Reveal key={i}>
                <h3 className="text-xl font-bold text-white mt-10 mb-4">
                  {block.text}
                </h3>
              </Reveal>
            );
          case "p":
            return (
              <Reveal key={i}>
                <p className="text-base text-white/70 leading-relaxed mt-6">
                  {block.text}
                </p>
              </Reveal>
            );
          case "p-link":
            return (
              <Reveal key={i}>
                <p className="text-base text-white/70 leading-relaxed mt-6">
                  {block.before}{" "}
                  <Link
                    href={block.href}
                    className="text-[#38B685] underline underline-offset-4 decoration-[#38B685]/40 hover:decoration-[#38B685] transition-colors"
                  >
                    {block.linkText}
                  </Link>
                  {block.after}
                </p>
              </Reveal>
            );
          case "list":
            return (
              <Reveal key={i}>
                <ul className="list-disc marker:text-[#38B685] space-y-3 mt-6 pl-5">
                  {block.items.map((item, j) => (
                    <li
                      key={j}
                      className="text-base text-white/70 leading-relaxed"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          case "image":
            return (
              <Reveal key={i}>
                <figure className="mt-10 mb-10">
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/5">
                    <Image
                      src={block.src}
                      alt={block.alt}
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
          default:
            return null;
        }
      })}
    </div>
  );
}
