"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Star } from "lucide-react";
import { testimonials } from "@/lib/data";
import { Reveal, StaggerGroup, StaggerItem } from "./Reveal";

const VISIBLE_COUNT = 6;
// Mobile stacks the grid to one column, so six cards is a long scroll
// before the visitor reaches anything else. Three is the collapsed count
// there; from md up (two and three columns) the full six still show.
//
// Done by hiding the extras in CSS rather than slicing the array against a
// media query, so the server and the hydrating client always render the
// same markup — a JS-measured breakpoint would render six on the server
// and then drop to three on the client, which shows up as a visible jump.
const MOBILE_VISIBLE_COUNT = 3;
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
// The cap (and the internal scroll past it) only applies from md up, where
// cards sit three across and one novel-length review would stretch its
// whole row. Mobile is a single column, so an expanded card can simply be
// as tall as its text — scrolling inside a card on a touchscreen fights
// the page's own scroll.
const EXPANDED_CAP = 320;
const FALLBACK_COLLAPSED_H = 168;

// Same useSyncExternalStore pattern as Creative's useTapToPause: matchMedia
// is an external store, and the value only picks the expand animation's
// pixel target, so the server snapshot (false = mobile-first) has nothing
// visible to disagree with.
const DESKTOP_GRID = "(min-width: 768px)";
function useDesktopGrid() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(DESKTOP_GRID);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(DESKTOP_GRID).matches,
    () => false,
  );
}

type Testimonial = (typeof testimonials)[number];

// Distinct gradient per reviewer so the initials avatars read as different
// people at a glance rather than one repeated green chip. Assigned by the
// reviewer's position in the list (not a name hash — that clustered several
// names onto the same few colours), and ordered so adjacent cards never
// share a hue family; with 10 entries a colour can't recur inside a screen.
const AVATAR_GRADIENTS = [
  "from-violet-400 to-violet-700",
  "from-orange-400 to-orange-600",
  "from-sky-400 to-blue-600",
  "from-rose-400 to-pink-600",
  "from-teal-400 to-cyan-600",
  "from-amber-300 to-yellow-500",
  "from-fuchsia-500 to-purple-700",
  "from-lime-400 to-green-600",
  "from-red-500 to-rose-700",
  "from-indigo-400 to-blue-700",
];

// Hand-picked gradients for specific reviewers; everyone else falls back to
// the position-based cycle above.
const AVATAR_GRADIENT_OVERRIDES: Record<string, string> = {
  "Vlad Voskoboinikov": "from-red-500 to-yellow-400",
};

function avatarGradient(name: string, index: number) {
  return (
    AVATAR_GRADIENT_OVERRIDES[name] ??
    AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]
  );
}

function ReviewCard({ r, index }: { r: Testimonial; index: number }) {
  const paragraphs = Array.isArray(r.text) ? r.text : [r.text];
  const flatText = paragraphs.join(" ");
  const overflows = flatText.length > TRUNCATE_AT;
  const [expanded, setExpanded] = useState(false);
  const [naturalHeight, setNaturalHeight] = useState<number | null>(null);
  const [collapsedHeight, setCollapsedHeight] = useState<number | null>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const collapsedMeasureRef = useRef<HTMLDivElement>(null);

  // A ResizeObserver rather than a measure-once-on-mount effect: on mobile
  // the 4th-6th cards mount inside a `hidden md:block` wrapper, and an
  // element inside display:none measures scrollHeight 0 — a height the
  // animation would then treat as the real collapsed/expanded target,
  // leaving the quote invisible after "Show more" reveals the card. The
  // observer fires again the moment the clones get real boxes (and on any
  // later width change, e.g. rotation), so the stored heights always come
  // from an actually-laid-out card. Zero-height readings are ignored for
  // the same reason.
  useEffect(() => {
    const measure = () => {
      const n = measureRef.current?.scrollHeight ?? 0;
      if (n > 0) setNaturalHeight(n);
      const c = collapsedMeasureRef.current?.scrollHeight ?? 0;
      if (c > 0) setCollapsedHeight(c);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (measureRef.current) ro.observe(measureRef.current);
    if (collapsedMeasureRef.current) ro.observe(collapsedMeasureRef.current);
    return () => ro.disconnect();
  }, []);

  const isDesktopGrid = useDesktopGrid();
  const expandedTarget = isDesktopGrid
    ? Math.min(naturalHeight ?? EXPANDED_CAP, EXPANDED_CAP)
    : (naturalHeight ?? EXPANDED_CAP);
  const needsScroll =
    isDesktopGrid && (naturalHeight ?? Infinity) > EXPANDED_CAP;
  const collapsedTarget = collapsedHeight ?? FALLBACK_COLLAPSED_H;

  return (
    // Glass treatment, same as the hero's reviews pill: a white sheen
    // pooling from the top inside edge plus a brighter inset hairline on the
    // top rim. Done as a background-image + inset shadow rather than overlay
    // elements — border-radius clips backgrounds on its own, so the card
    // needs no overflow-hidden and no extra DOM, and the panel stays
    // transparent (the sheen fades out by ~70% down).
    <div
      className="group h-full bg-white/[0.06] backdrop-blur-md max-lg:backdrop-blur-none border border-white/5 rounded-2xl p-6 flex flex-col transition-transform duration-300 ease-out hover:-translate-y-1"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 42%, transparent 70%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.20)",
      }}
    >
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

        {overflows ? (
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
        ) : (
          // Short reviews never truncate, so there is nothing to animate
          // between — but they used to render inside the same animated box,
          // whose height fell back to a hardcoded 168px whenever nothing had
          // been measured (the collapsed clone only exists for overflowing
          // text). A two-line review sat in that full-size box with dead
          // space under it, which mobile's single column made obvious. A
          // plain paragraph just takes the height of its own text.
          <p className="text-white/70 text-sm leading-relaxed">
            &ldquo;{flatText}&rdquo;
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradient(
            r.name,
            index,
          )} text-white text-sm font-bold flex items-center justify-center`}
        >
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
          <h2 className="text-[32px]/[1.15] sm:text-4xl lg:text-5xl font-medium text-white text-balance mb-4">
            Don&apos;t Take Our Word For It.
          </h2>
          <p className="text-base sm:text-lg text-white/60 leading-relaxed">
            Real reviews from the custom home builders we&apos;ve helped
            grow. 35+ five-star ratings on Google.
          </p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((t, i) => (
            <StaggerItem
              key={i}
              className={
                !expanded && i >= MOBILE_VISIBLE_COUNT ? "hidden md:block" : ""
              }
            >
              <ReviewCard r={t} index={i} />
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
                      <ReviewCard key={i} r={t} index={VISIBLE_COUNT + i} />
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
