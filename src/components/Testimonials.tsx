"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Star } from "lucide-react";
import { testimonials } from "@/lib/data";
import { Reveal, StaggerGroup, StaggerItem } from "./Reveal";

const VISIBLE_COUNT = 6;
const EASE = [0.21, 0.5, 0.28, 1] as const;
// Collapsed shows a character-sliced preview ending in "…" with "Read
// More" inline as part of that same last line. Clicking it smoothly
// animates the box open to fit the full review, capped at EXPANDED_CAP so
// one very long review doesn't blow the card out — past that cap it
// scrolls internally instead. Both the collapsed and expanded target
// heights come from hidden clones of the exact real markup (quote marks
// and button included), measured live at the card's actual rendered
// width — not a hardcoded pixel guess. A fixed COLLAPSED_H constant used
// to clip the Read More button on mobile: the same 280-character preview
// wraps to more lines in mobile's single narrower column than in
// desktop's wider 3-column grid, so a height tuned against desktop ran
// short on mobile.
const TRUNCATE_AT = 280;
const EXPANDED_CAP = 320;
const FALLBACK_COLLAPSED_H = 168;

type Testimonial = (typeof testimonials)[number];

function ReviewCard({ r }: { r: Testimonial }) {
  const paragraphs = Array.isArray(r.text) ? r.text : [r.text];
  const flatText = paragraphs.join(" ");
  const overflows = flatText.length > TRUNCATE_AT;
  const [expanded, setExpanded] = useState(false);
  const [naturalHeight, setNaturalHeight] = useState<number | null>(null);
  const [collapsedHeight, setCollapsedHeight] = useState<number | null>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const collapsedMeasureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (measureRef.current) setNaturalHeight(measureRef.current.scrollHeight);
    if (collapsedMeasureRef.current) {
      setCollapsedHeight(collapsedMeasureRef.current.scrollHeight);
    }
  }, []);

  const expandedTarget = Math.min(naturalHeight ?? EXPANDED_CAP, EXPANDED_CAP);
  const needsScroll = (naturalHeight ?? Infinity) > EXPANDED_CAP;
  const collapsedTarget = collapsedHeight ?? FALLBACK_COLLAPSED_H;

  return (
    <div className="group h-full bg-[#0D1814] border border-white/5 rounded-2xl p-6 flex flex-col transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(56,182,133,0.25)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5 bg-black/30 border border-white/10 rounded-md pl-2 pr-3 py-1">
          <Image
            src="/images/verified.svg"
            alt=""
            width={16}
            height={16}
            className="w-4 h-4 shrink-0"
          />
          <span className="text-xs text-white leading-none">Verified</span>
        </div>
        <div className="flex gap-0.5 ml-auto">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
          ))}
        </div>
      </div>
      <div className="relative mb-5">
        {/* Off-screen, same width, exact same markup as the real expanded
            content below (quote marks + Show Less button included) — only
            here so its scrollHeight gives the open animation a real,
            accurate pixel target. */}
        <div
          ref={measureRef}
          className="absolute inset-x-0 top-0 -z-10 invisible space-y-3 pr-1"
          aria-hidden
        >
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed">
              {i === 0 && "“"}
              {p}
              {i === paragraphs.length - 1 && "” "}
              {i === paragraphs.length - 1 && (
                <span className="font-semibold">Show less</span>
              )}
            </p>
          ))}
        </div>
        {/* Same idea, but for the collapsed preview — measured separately
            since it's a different (shorter, truncated) block of markup
            than the expanded clone above, and wraps differently at every
            card width. */}
        {overflows && (
          <p
            ref={collapsedMeasureRef}
            className="absolute inset-x-0 top-0 -z-10 invisible text-sm leading-relaxed pr-1"
            aria-hidden
          >
            &ldquo;
            {flatText.slice(0, TRUNCATE_AT).trimEnd()}
            {"… "}
            <span className="font-semibold">Read More</span>
          </p>
        )}

        <motion.div
          animate={{ height: expanded ? expandedTarget : collapsedTarget }}
          transition={{ duration: 0.35, ease: EASE }}
          className={`pr-1 ${expanded && needsScroll ? "overflow-y-auto" : "overflow-hidden"}`}
        >
          {expanded ? (
            <div className="space-y-3">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-white/70 text-sm leading-relaxed">
                  {i === 0 && "“"}
                  {p}
                  {i === paragraphs.length - 1 && "” "}
                  {i === paragraphs.length - 1 && (
                    <button
                      onClick={() => setExpanded(false)}
                      className="font-semibold text-[#38B685] hover:text-white transition-colors"
                    >
                      Show less
                    </button>
                  )}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-white/70 text-sm leading-relaxed">
              &ldquo;
              {overflows ? flatText.slice(0, TRUNCATE_AT).trimEnd() : flatText}
              {overflows ? "… " : "”"}
              {overflows && (
                <button
                  onClick={() => setExpanded(true)}
                  className="font-semibold text-[#38B685] hover:text-white transition-colors"
                >
                  Read More
                </button>
              )}
            </p>
          )}
        </motion.div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#38B685]/15 text-[#38B685] text-sm font-bold flex items-center justify-center transition-colors duration-500 group-hover:bg-[#38B685] group-hover:text-[#08120E]">
          {r.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{r.name}</p>
          <p className="text-xs text-white/40">{r.date}</p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const [expanded, setExpanded] = useState(false);
  const visible = testimonials.slice(0, VISIBLE_COUNT);
  const rest = testimonials.slice(VISIBLE_COUNT);

  return (
    <section id="reviews" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#08120E]" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[150px] opacity-25"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[600px] h-[500px] rounded-full blur-[160px] opacity-30"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-[500px] h-[400px] rounded-full blur-[150px] opacity-20"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
            What our partners say
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white text-balance mb-4">
            Don&apos;t Take Our Word For It.
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            Real reviews from the custom home builders we&apos;ve helped
            grow. 30+ five-star ratings on Google.
          </p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((t, i) => (
            <StaggerItem key={i}>
              <ReviewCard r={t} />
            </StaggerItem>
          ))}
        </StaggerGroup>

        {rest.length > 0 && (
          <>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-5">
                    {rest.map((t, i) => (
                      <ReviewCard key={i} r={t} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center mt-10">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/25 transition-colors text-sm font-semibold"
              >
                {expanded ? "See less" : "Show more"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
