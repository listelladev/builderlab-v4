"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { videoTestimonials, type VideoTestimonial } from "@/lib/data";
import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";
import { WistiaEmbed } from "./WistiaEmbed";

function CaseCard({
  item,
  onPlay,
}: {
  item: VideoTestimonial;
  onPlay: () => void;
}) {
  // The player mounts on click, not on approach.
  //
  // Measured on a throttled iPhone profile against production: Wistia's
  // runtime was responsible for every long frame on the page. Scrolling the
  // homepage produced 607ms of long tasks (single tasks up to 178ms), a p99
  // frame of 142ms and 13 janky frames; with Wistia blocked the same scroll
  // ran 0 long tasks, a p99 of 14.9ms and no janky frames — better than the
  // reference site we benchmark against. Blocking the video CDN instead
  // changed nothing, so this was the whole of it.
  //
  // Mounting on approach meant every card scrolled past paid that cost for a
  // video almost nobody plays. The card now shows its poster with a play
  // button until tapped; the tap both mounts the player and starts it (see
  // WistiaEmbed's `autoplay`), so it still takes a single press — the
  // failure mode of an earlier facade was a button that only swapped itself
  // for Wistia's own button and needed a second press.
  const [playing, setPlaying] = useState(false);

  return (
    <article className="case-card shrink-0 w-[288px] sm:w-[380px] h-full flex flex-col bg-white/[0.06] backdrop-blur-md max-lg:backdrop-blur-none border border-white/5 rounded-2xl overflow-hidden shadow-[0_24px_48px_-20px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-out group-hover:-translate-y-1">
      {/* aspect-video (not a fixed h-52) so the box's own aspect always
          matches the player's native 16:9 — nothing needs to crop/cover to
          fill it, it just already fits. */}
      <div className="case-card__media relative aspect-video shrink-0 bg-gradient-to-br from-[#15241E] to-[#0D1814] overflow-hidden">
        {playing ? (
          <WistiaEmbed mediaId={item.wistiaId} poster={item.poster} autoplay />
        ) : (
          <button
            type="button"
            onClick={() => {
              onPlay();
              setPlaying(true);
            }}
            aria-label={`Play ${item.name}'s testimonial`}
            className="absolute inset-0 w-full h-full cursor-pointer"
          >
            {/* Decorative — the button's aria-label and the card's own <h3>
                already name the client. */}
            <Image
              src={item.poster}
              alt=""
              fill
              sizes="380px"
              className="object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/55 backdrop-blur-[2px] max-lg:backdrop-blur-none ring-1 ring-white/25 transition-transform duration-300 ease-out group-hover:scale-105">
                <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6 fill-white" aria-hidden>
                  <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      {/* Glass treatment on the body rather than the <article>: the card's
          own top edge sits behind the video/poster, so a sheen there would
          never be seen. Pooling it from the top of the text area puts the
          highlight where the card actually reads as a surface. */}
      <div
        className="p-6 flex-1 flex flex-col"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 42%, transparent 70%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16)",
        }}
      >
        <div className="mb-3">
          <div className="text-[52px] sm:text-[58px] leading-none font-bold text-[#38B685] tabular-nums">
            {item.statPrefix}
            <CountUp value={item.statValue} />
            {item.statSuffix}
          </div>
          <div className="text-sm text-white/60">{item.statLabel}</div>
        </div>
        <h3 className="text-2xl sm:text-lg font-medium text-white mb-3">{item.name}</h3>
        <p className="text-sm text-white/60 leading-relaxed">
          &ldquo;{item.blurb}&rdquo;
        </p>
      </div>
    </article>
  );
}

// Render three copies back-to-back so there's always real content (not
// blank padding) to either side of the centered card, then start the view
// scrolled into the middle copy. This keeps every card scroll-snapped to
// the viewport's center, aligned with the heading and arrows, while
// still showing neighboring cards peeking on both edges, edge-to-edge.
const tripledTestimonials = [...videoTestimonials, ...videoTestimonials, ...videoTestimonials];

export function CaseStudies() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // The player runtime is fetched the first time a visitor actually plays a
  // testimonial. It used to load when the section came into view, which
  // meant everyone who scrolled past paid for it.
  const [playerScriptWanted, setPlayerScriptWanted] = useState(false);


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
      const middleCard = el.children[videoTestimonials.length] as
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
      const secondCopyStart = el.children[videoTestimonials.length] as
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
        if (idx < videoTestimonials.length) target = el.scrollLeft + width;
        else if (idx >= videoTestimonials.length * 2) target = el.scrollLeft - width;
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
    <section
      ref={sectionRef}
      id="cases"
      className="relative pt-24 pb-24 lg:pt-32 lg:pb-32 overflow-hidden"
    >
      {/* Registers the <wistia-player> custom element globally — loaded
          once here rather than per-embed, even though every card is
          tripled for the carousel's infinite-scroll illusion.
          
          Rendered only once the section is within a viewport of being
          reached. Even on lazyOnload this ran on every visit to the
          homepage, and Lighthouse costed it at 856KB and ~2.5s of script
          bootup on mobile (publicApi.js was being pulled once per player)
          — all of it for a section most visitors have not scrolled to yet.
          Cards keep showing the same poster the player itself would show
          until it arrives, so nothing looks different, it just stops
          competing with hydration for the main thread. */}
      {playerScriptWanted && (
        <Script src="https://fast.wistia.com/player.js" strategy="lazyOnload" />
      )}
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
            What our clients say
          </span>
          <h2 className="text-[32px]/[1.15] sm:text-4xl lg:text-5xl font-medium text-white text-balance">
            What Happens When We Plug In.
          </h2>
        </Reveal>
      </div>

      <div className="relative">
        {/* Edge fade is a mask on the scroller itself (not overlay divs), so
            it hugs the cards' real height — no clipping above/below them —
            and the fade width stays inside the peek zone without reaching
            over the centred card. */}
        <div
          ref={scrollerRef}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pt-4 pb-20 -mb-16 scrollbar-hide [--edge-fade:28px] sm:[--edge-fade:64px]"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, #000 var(--edge-fade), #000 calc(100% - var(--edge-fade)), transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, #000 var(--edge-fade), #000 calc(100% - var(--edge-fade)), transparent)",
          }}
        >
          {tripledTestimonials.map((c, i) => (
            <div key={i} data-card className="group flex snap-center">
              <CaseCard item={c} onPlay={() => setPlayerScriptWanted(true)} />
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
