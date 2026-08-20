"use client";

import { useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { featuredWebsites, type FeaturedWebsite } from "@/lib/data";
import { Reveal } from "./Reveal";

const COUNT = featuredWebsites.length;
const START_INDEX = featuredWebsites.findIndex(
  (f) => f.name === "Birch Hill Homes"
);

// Shortest signed distance (in card-widths) from card `i` to the focused
// `index`, wrapped around the circle rather than measured along the raw
// array — e.g. with 6 cards, the card one before index 0 is distance -1,
// not -5. This is the one thing that made every earlier version of this
// carousel fragile: those all tried to derive "how far is this card from
// center" from actual scroll position (tripled DOM copies, wrap-jumping
// scrollLeft to fake infinity, IntersectionObserver polling). All of that
// is gone — position is just this formula, and clicking an arrow is
// nothing more than incrementing/decrementing `index`. No scroll
// container, no snap, no jump, so there's nothing left to desync.
function circularOffset(i: number, index: number) {
  let raw = (((i - index) % COUNT) + COUNT) % COUNT; // normalize to [0, COUNT)
  if (raw > COUNT / 2) raw -= COUNT; // shortest path, range (-COUNT/2, COUNT/2]
  return raw;
}

// Every card shares the same base CSS position (centered via left-1/2 +
// negative margin), so unlike a flex/scroll layout where neighbors start
// out naturally spread apart, `x` here has to supply the ENTIRE
// separation, not just nudge cards closer together. It's expressed as a
// percentage of the card's own width (CSS/Framer resolve `x: "N%"`
// against the element's own rendered size), which is what keeps the
// spacing correct at every breakpoint without measuring the DOM.
function coverflowStyle(offset: number) {
  if (offset === 0) {
    return {
      x: "0%",
      rotateY: 0,
      scale: 1,
      opacity: 1,
      filter: "brightness(1)",
      zIndex: 30,
      pointerEvents: "auto" as const,
    };
  }
  const dir = Math.sign(offset);
  const abs = Math.min(Math.abs(offset), 3);
  const rotate = -dir * Math.min(25 + (abs - 1) * 8, 45);
  const scale = Math.max(0.7, 0.85 - (abs - 1) * 0.08);
  const xPercent = dir * Math.min(92 + (abs - 1) * 55, 220);
  const opacity = abs === 1 ? 0.55 : abs === 2 ? 0.25 : 0;
  return {
    x: `${xPercent}%`,
    rotateY: rotate,
    scale,
    opacity,
    filter: "brightness(0.55)",
    zIndex: Math.max(0, 30 - abs * 10),
    pointerEvents: (abs > 2 ? "none" : "auto") as "none" | "auto",
  };
}

function SiteCard({
  item,
  offset,
  instant,
}: {
  item: FeaturedWebsite;
  offset: number;
  // True for the one card that just wrapped from the far/invisible side
  // to the near/visible side (or vice versa) on this click. Animating
  // that transition normally would tween its transform smoothly across
  // every position in between, which is what read as "a card sliding
  // across the stack" — since it's crossing between the invisible
  // antipodal slot and a barely-visible near slot, skipping the tween
  // for just this one update makes it teleport in a single frame
  // instead, imperceptible rather than a visible sweep.
  instant?: boolean;
}) {
  const { zIndex, pointerEvents, ...animate } = coverflowStyle(offset);

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
      className="group absolute top-0 left-1/2 w-[80vw] ml-[-40vw] sm:w-[560px] sm:ml-[-280px] lg:w-[720px] lg:ml-[-360px] aspect-[16/10] rounded-2xl overflow-hidden"
      style={{ zIndex, pointerEvents }}
      animate={animate}
      transition={instant ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image
        src={item.image}
        alt={item.name}
        fill
        sizes="(min-width: 1024px) 720px, (min-width: 640px) 560px, 80vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8 sm:py-6">
        <span className="text-lg sm:text-2xl font-bold text-white text-balance">
          {item.name}
        </span>
        {/* Mobile: plain text + arrow underneath the title, no pill/circle
            background so it doesn't compete with the title for width. */}
        <span className="sm:hidden inline-flex items-center gap-1.5 text-[10px] font-semibold text-white group-hover:text-[#38B685] transition-colors duration-500 ease-out">
          View Site
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-500 ease-out" />
        </span>
        {/* Desktop: full pill button beside the title. */}
        <span className="hidden sm:inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-white bg-white/10 backdrop-blur px-4 py-2.5 rounded-full group-hover:bg-[#38B685] transition-colors duration-500 ease-out">
          View Site
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:translate-x-1 transition-all duration-500 ease-out">
            <ArrowRight className="w-3 h-3 text-white group-hover:text-[#38B685] transition-colors duration-500 ease-out" />
          </span>
        </span>
      </div>
    </motion.a>
  );
}

type CarouselState = { offsets: number[]; wrapped: number | null };

export function FeaturedWebsites() {
  const [{ offsets, wrapped }, setState] = useState<CarouselState>(() => ({
    offsets: featuredWebsites.map((_, i) => circularOffset(i, START_INDEX)),
    wrapped: null,
  }));

  // Shifts every card's offset by one step (all continuous, no jumps) and
  // only wraps the single card that would fall outside the visible
  // (-2..3] range back around, since that's exactly the invisible/barely-
  // visible antipodal card. Marking it `wrapped` tells SiteCard to skip
  // the tween for that one update — see the comment on SiteCard.
  const step = (forward: boolean) => {
    const shift = forward ? -1 : 1;
    setState(({ offsets }) => {
      let wrappedIndex: number | null = null;
      const next = offsets.map((o, i) => {
        let v = o + shift;
        if (v > 3) {
          v -= COUNT;
          wrappedIndex = i;
        } else if (v < -2) {
          v += COUNT;
          wrappedIndex = i;
        }
        return v;
      });
      return { offsets: next, wrapped: wrappedIndex };
    });
  };

  const next = () => step(true);
  const prev = () => step(false);

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const SWIPE_DISTANCE = 60;
    const SWIPE_VELOCITY = 400;
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) {
      next();
    } else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) {
      prev();
    }
  };

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#0B1613]" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full blur-[160px] opacity-20"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-12">
          <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
            Websites We&apos;ve Built
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white text-balance">
            Websites That Convert.
          </h2>
        </Reveal>
      </div>

      <div className="relative">
        <div className="relative h-[50vw] sm:h-[350px] lg:h-[450px]">
          <motion.div
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            style={{ touchAction: "pan-y", perspective: "1400px", transformStyle: "preserve-3d" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
          >
            {featuredWebsites.map((item, i) => (
              <SiteCard
                key={item.name}
                item={item}
                offset={offsets[i]}
                instant={wrapped === i}
              />
            ))}
          </motion.div>
        </div>

        <div className="relative z-10 flex justify-center gap-3 mt-8">
          <button
            onClick={prev}
            aria-label="Previous website"
            className="w-11 h-11 rounded-full border border-white/10 text-white/70 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next website"
            className="w-11 h-11 rounded-full border border-white/10 text-white/70 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
