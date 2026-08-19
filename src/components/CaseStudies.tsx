"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { caseStudies, type CaseStudy } from "@/lib/data";
import { Reveal } from "./Reveal";
import { AutoplayVideo } from "./AutoplayVideo";

function CaseCard({ item, withVideo }: { item: CaseStudy; withVideo?: boolean }) {
  const showVideo = withVideo && item.vimeoId;
  return (
    <article className="case-card shrink-0 w-[340px] sm:w-[380px] h-full flex flex-col bg-[#0D1814] border border-white/5 rounded-2xl overflow-hidden group">
      <div className="case-card__media relative h-52 shrink-0 bg-gradient-to-br from-[#15241E] to-[#0D1814] overflow-hidden">
        {showVideo && <AutoplayVideo vimeoId={item.vimeoId!} />}
        {!showVideo && item.image && (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        )}
        {item.video && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-[#38B685] transition-colors">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </div>
            <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {item.duration}
            </span>
            <span className="absolute bottom-3 left-3 text-white/70 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38B685] animate-pulse" />
              Click for sound
            </span>
          </div>
        )}
        {!item.image && !item.video && (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white/20">{item.name}</span>
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-bold text-[#38B685] tabular-nums">
            {item.stat}
          </span>
          <span className="text-sm text-white/50">{item.statLabel}</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-4">{item.name}</h3>
        <ul className="space-y-2">
          {item.bullets.map((b, i) => (
            <li key={i} className="text-sm text-white/60 leading-5 flex items-start gap-2">
              <span className="text-[#38B685] shrink-0 h-5 flex items-center">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

// Render three copies back-to-back so there's always real content (not
// blank padding) to either side of the centered card, then start the view
// scrolled into the middle copy. This keeps every card scroll-snapped to
// the viewport's center, aligned with the heading and arrows, while
// still showing neighboring cards peeking on both edges, edge-to-edge.
const tripledCaseStudies = [...caseStudies, ...caseStudies, ...caseStudies];

export function CaseStudies() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]") as HTMLElement | null;
    if (!card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0");
    const unit = card.offsetWidth + gap;
    el.scrollBy({ left: dir * unit, behavior: "smooth" });
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const center = () => {
      const middleCard = el.children[caseStudies.length] as
        | HTMLElement
        | undefined;
      if (!middleCard) return;
      const target =
        middleCard.offsetLeft +
        middleCard.offsetWidth / 2 -
        el.clientWidth / 2;
      // scroll-snap-type fights a synchronous scrollLeft assignment and
      // silently resets it back to 0, disable it just for this jump.
      el.style.scrollBehavior = "auto";
      el.style.scrollSnapType = "none";
      el.scrollLeft = target;
      void el.offsetHeight; // force layout before restoring snap
      el.style.scrollSnapType = "";
      el.style.scrollBehavior = "";
    };

    const raf = requestAnimationFrame(() => requestAnimationFrame(center));
    window.addEventListener("resize", center);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", center);
    };
  }, []);

  return (
    <section id="cases" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#08120E]" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[160px] opacity-30"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-25 -translate-y-1/2"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-25 -translate-y-1/2"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-12">
          <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
            Case studies
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white text-balance">
            What happens when we plug in.
          </h2>
        </Reveal>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex items-stretch gap-[100vw] sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 scrollbar-hide"
        >
          {tripledCaseStudies.map((c, i) => (
            <div key={i} data-card className="flex snap-center">
              <CaseCard
                item={c}
                withVideo={
                  i >= caseStudies.length && i < caseStudies.length * 2
                }
              />
            </div>
          ))}
        </div>
        <div className="relative z-10 flex justify-center gap-3 mt-8">
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="w-11 h-11 rounded-full border border-white/10 text-white/70 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="w-11 h-11 rounded-full border border-white/10 text-white/70 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <div className="relative z-10 text-center mt-12">
          <a
            href="/contact"
            className="group inline-flex items-center gap-2 bg-white text-black px-7 py-4 rounded-full text-base font-semibold hover:scale-[1.03] transition-transform duration-500 ease-out"
          >
            Book My Free Strategy Call
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500 ease-out" />
          </a>
        </div>
      </div>
    </section>
  );
}
