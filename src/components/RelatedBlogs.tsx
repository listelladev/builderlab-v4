"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { BlogCard } from "./BlogCard";
import type { BlogPost } from "@/lib/blog";

export function RelatedBlogs({
  current,
  posts,
}: {
  current: string;
  posts: BlogPost[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const related = posts.filter((p) => p.slug !== current).slice(0, 6);

  const scroll = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]") as HTMLElement | null;
    if (!card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0");
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: "smooth" });
  };

  if (related.length === 0) return null;

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[#08120E]" />
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-10 gap-4">
          <Reveal>
            <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
              More from the blog
            </span>
            <h2 className="text-[32px]/[1.15] sm:text-3xl lg:text-4xl font-bold text-white text-balance">
              Related Articles.
            </h2>
          </Reveal>
          <div className="hidden sm:flex gap-3 shrink-0">
            <button
              onClick={() => scroll(-1)}
              aria-label="Previous"
              className="w-11 h-11 rounded-full border border-white/10 text-white/70 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Next"
              className="w-11 h-11 rounded-full border border-white/10 text-white/70 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-6 overflow-x-auto snap-x scroll-smooth pb-2 scrollbar-hide"
        >
          {related.map((post) => (
            <div
              key={post.slug}
              data-card
              className="snap-start shrink-0 w-[85%] sm:w-[46%] lg:w-[31.5%]"
            >
              <BlogCard post={post} />
            </div>
          ))}
        </div>

        {/* Mobile: swipe still works, but tappable arrows underneath give
            an explicit way to scroll too, mirrored below the desktop
            pair that sits up by the heading. */}
        <div className="flex sm:hidden justify-center gap-3 mt-6">
          <button
            onClick={() => scroll(-1)}
            aria-label="Previous"
            className="w-11 h-11 rounded-full border border-white/10 text-white/70 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Next"
            className="w-11 h-11 rounded-full border border-white/10 text-white/70 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
