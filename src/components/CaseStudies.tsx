"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { caseStudies, type CaseStudy } from "@/lib/data";
import { Reveal } from "./Reveal";
import { AutoplayVideo } from "./AutoplayVideo";
import { SilentVideo } from "./SilentVideo";

function CaseCard({ item, withVideo }: { item: CaseStudy; withVideo?: boolean }) {
  // AutoplayVideo (Vimeo) stays gated to the middle copy only: its player
  // construction is staggered through a shared queue to avoid a real
  // cross-wiring bug when several instances of the same video ID start at
  // once (see AutoplayVideo's queueStart comment), so only ever mounting
  // one copy sidesteps that entirely. Plain <video> (SilentVideo) has no
  // such race, and lazy-loads on its own via IntersectionObserver, so
  // every tripled copy can render one, they just won't fetch anything
  // until scrolled near.
  const showVimeo = withVideo && item.vimeoId;
  const showSilentVideo = !!item.videoSrc;
  return (
    <article className="case-card shrink-0 w-[340px] sm:w-[380px] h-full flex flex-col bg-[#0D1814] border border-white/5 rounded-2xl overflow-hidden group">
      <div className="case-card__media relative h-52 shrink-0 bg-gradient-to-br from-[#15241E] to-[#0D1814] overflow-hidden">
        {showVimeo && <AutoplayVideo vimeoId={item.vimeoId!} />}
        {showSilentVideo && (
          <SilentVideo src={item.videoSrc!} fallbackSrc={item.videoFallbackSrc} />
        )}
        {!showVimeo && !showSilentVideo && item.image && (
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
        {!item.image && !item.video && !item.videoSrc && (
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

  // With only three literal copies rendered, scrolling far enough in either
  // direction eventually hits a real edge and just stops. To make it feel
  // endless, once the visible copy drifts into the first or third set this
  // silently snaps the scroll position back by exactly one copy's width,
  // landing on the same visual card in the middle set, so there's always
  // another two copies' worth of cards ahead to keep scrolling into.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const copyWidth = () => {
      const first = el.children[0] as HTMLElement | undefined;
      const secondCopyStart = el.children[caseStudies.length] as
        | HTMLElement
        | undefined;
      if (!first || !secondCopyStart) return 0;
      return secondCopyStart.offsetLeft - first.offsetLeft;
    };

    // Which real card is currently nearest the container's center, measured
    // straight off live DOM positions rather than comparing raw scrollLeft
    // against fixed pixel thresholds. The padding-driven initial scroll
    // offset doesn't land on a clean multiple of one copy's width, so a
    // fixed-threshold "safe zone" ends up asymmetric around the true
    // visual center — meaning a wrap-jump could fire mid-scroll, cutting
    // the native smooth-scroll animation off and leaving it parked at an
    // awkward halfway point between two cards. Nearest-card detection has
    // no such asymmetry: it only wraps once you've genuinely scrolled a
    // full copy away from center.
    const nearestIndex = () => {
      const containerCenter = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(el.children).forEach((child, i) => {
        const card = child as HTMLElement;
        const dist = Math.abs(
          card.offsetLeft + card.offsetWidth / 2 - containerCenter
        );
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      return best;
    };

    // Checking (and potentially correcting) on every scroll event, even
    // rAF-throttled, means it can run WHILE the native smooth-scroll from
    // an arrow click is still mid-flight. Forcing scrollLeft at that point
    // cancels the browser's in-progress scroll animation, but the new
    // position isn't necessarily a fully-snapped one — CSS scroll-snap
    // then has to pull it the rest of the way on the very next frame,
    // which is the "half scroll then a second jump" this was producing.
    // Debouncing to scroll-end instead means the correction only ever
    // runs once scrolling has genuinely settled at a real snap point, so
    // there's never a competing animation for it to interrupt.
    let settleTimeout = 0;
    const onScroll = () => {
      window.clearTimeout(settleTimeout);
      settleTimeout = window.setTimeout(() => {
        const width = copyWidth();
        if (!width) return;
        const idx = nearestIndex();
        let target: number | null = null;
        if (idx < caseStudies.length) target = el.scrollLeft + width;
        else if (idx >= caseStudies.length * 2) target = el.scrollLeft - width;
        if (target === null) return;
        el.style.scrollBehavior = "auto";
        el.style.scrollSnapType = "none";
        el.scrollLeft = target;
        void el.offsetHeight;
        el.style.scrollSnapType = "";
        el.style.scrollBehavior = "";
      }, 120);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(settleTimeout);
      el.removeEventListener("scroll", onScroll);
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
            What Happens When We Plug In.
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
