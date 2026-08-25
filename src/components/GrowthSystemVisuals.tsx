"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Handshake,
  Database,
  DollarSign,
  Heart,
  Lightbulb,
  Megaphone,
  MessageCircle,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Target,
  Users,
  Video,
} from "lucide-react";
import { featuredWebsites } from "@/lib/data";

const GREEN = "#38B685";
const ORANGE = "#F2994A";
const PINK = "#F472B6";
const BLUE = "#5CC8F2";
const YELLOW = "#F2C94C";

// Shared translucent-gradient card treatment: a faint tint of the stage's
// accent washed over a fully opaque base, instead of a flat charcoal fill —
// used for every "mini container" so each stage reads with a hint of its
// own color. The base color (last, non-transparent layer) must stay fully
// opaque: on mobile these cards stack directly on top of the timeline rail,
// and an actually-translucent rgba background lets that line show straight
// through the card.
function tintedCard(accent: string) {
  return {
    background: `linear-gradient(160deg, ${accent}22, transparent 55%), #0B0B0B`,
    borderColor: `${accent}33`,
  };
}

// ---------------------------------------------------------------------
// Step 1 — Strategy & Positioning: a hub-and-spoke diagram, not scattered
// decoration. Five inputs feed into the "You" node — a dashed line runs
// from each chip to the center, with a small pulse traveling that line to
// make the "these converge into your position" story legible at a
// glance. Chips keep their gentle float; the lines/pulses are what turn
// that float from noise into a diagram.
// ---------------------------------------------------------------------
// Five points evenly spaced around an ellipse (72° apart, starting at top
// center) so the chips read as one dispersed ring around "You" rather than
// two chips hugging the top edge and three crammed along the bottom. x/y
// are percentages within the box, used both to place each chip (via
// inline left/top + center translate) and to draw the connecting line/
// pulse to the center below.
const positioningChips: { label: string; accent: string; x: number; y: number }[] = [
  { label: "Ideal Client", accent: GREEN, x: 50, y: 16 },
  { label: "Offer", accent: BLUE, x: 88, y: 39.5 },
  { label: "Market Strategy", accent: PINK, x: 73.5, y: 77.5 },
  { label: "Positioning", accent: ORANGE, x: 26.5, y: 77.5 },
  { label: "Messaging", accent: YELLOW, x: 12, y: 39.5 },
];

// Only Positioning and Market Strategy get pushed further out at desktop
// widths — the "You" circle's absorb-ring pulse scales up to 1.7x its own
// size, and at desktop's larger circle that ring's edge was reaching past
// the mobile-tuned y=77.5 position into the bottom two pills. Pushing just
// those two down/out (not all five, and not on mobile, where the tighter
// box has no room to spare) clears the ring without redoing the mobile
// layout that was already tuned for its own constraints.
const desktopChipOverrides: Record<string, { x: number; y: number }> = {
  "Market Strategy": { x: 80, y: 86 },
  Positioning: { x: 20, y: 86 },
};

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

export function PositioningVisual() {
  const isDesktop = useIsDesktop();
  const chips = positioningChips.map((c) =>
    isDesktop && desktopChipOverrides[c.label]
      ? { ...c, ...desktopChipOverrides[c.label] }
      : c,
  );
  return (
    <div
      className="relative border rounded-2xl p-4 sm:p-8 lg:p-10 h-full min-h-[360px] overflow-hidden flex flex-col justify-center"
      style={tintedCard(GREEN)}
    >
      <p className="text-sm font-semibold text-white/80 mb-6 sm:mb-8 text-center">
        Five Inputs, One Clear Position
      </p>
      <div className="relative h-[220px] sm:h-[260px] shrink-0">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {chips.map((c) => (
            <line
              key={`${c.label}-line`}
              x1={c.x}
              y1={c.y}
              x2={50}
              y2={50}
              stroke={c.accent}
              strokeOpacity={0.3}
              strokeWidth={0.4}
              strokeDasharray="2 2"
            />
          ))}
        </svg>

        {/* Pulses render as HTML circles (fixed px size), not SVG circles
            inside the stretched viewBox above — a circle drawn in that
            non-uniformly-scaled coordinate space renders as an oval on any
            non-square box, which is every size this container appears at. */}
        {chips.map((c, i) => (
          <motion.div
            key={`${c.label}-pulse`}
            className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ background: c.accent }}
            animate={{
              left: [`${c.x}%`, "50%"],
              top: [`${c.y}%`, "50%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}

        {chips.map((c, i) => (
          // Outer div owns static position + centering translate (plain
          // CSS via Tailwind utilities); the inner motion.span owns only
          // the floating animation. Framer writes its own inline
          // `transform`, which would silently replace — not combine
          // with — a translate utility on the same element.
          <div
            key={c.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
          >
            <motion.span
              className="inline-flex items-center gap-0.5 sm:gap-1.5 text-[8px] sm:text-sm text-white/80 bg-white/5 border rounded-full px-1 py-0.5 sm:px-3.5 sm:py-2 whitespace-nowrap backdrop-blur-sm"
              style={{ borderColor: `${c.accent}55` }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4 + i * 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            >
              <span
                className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full shrink-0"
                style={{ background: c.accent }}
              />
              {c.label}
            </motion.span>
          </div>
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20">
            {/* One absorb ring per input, each in that input's color,
                timed just behind its line pulse so it reads as "the ring
                that just arrived is being pulled in and absorbed" rather
                than a generic glow. */}
            {chips.map((c, i) => (
              <motion.span
                key={`${c.label}-absorb`}
                className="absolute inset-0 rounded-full border-2 pointer-events-none"
                style={{ borderColor: c.accent }}
                animate={{ scale: [1.7, 1], opacity: [0, 0.9, 0] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  repeatDelay: positioningChips.length * 0.8 - 1.6,
                  delay: i * 0.8 + 2.2,
                  ease: "easeIn",
                }}
              />
            ))}
            <div className="absolute inset-0 rounded-full bg-[#38B685] overflow-hidden flex items-center justify-center shadow-[0_0_50px_rgba(56,182,133,0.55)]">
              {/* Rotating conic sweep of every input's color, clipped to
                  the circle and screen-blended so it reads as light being
                  emitted/churned from inside rather than a flat fill. */}
              <motion.div
                className="absolute -inset-3"
                style={{
                  background: `conic-gradient(from 0deg, ${GREEN}, ${BLUE}, ${ORANGE}, ${PINK}, ${YELLOW}, ${GREEN})`,
                  mixBlendMode: "screen",
                  opacity: 0.55,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              />
              <span className="relative z-10 text-[#08120E] font-bold text-sm">
                You
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Step 2 — Install Our Ads System: the richest, most active visual since
// this is the core offer. Three channel cards up top, creative engine
// items below with an animated upward flow into them.
// ---------------------------------------------------------------------
// Each channel gets a small mockup of what the ad actually looks like on
// that platform, not just a label — a feed post, a search result, a
// retargeting banner — so "Meta Ads / Google Ads / Retargeting" reads as
// three distinct things rather than three interchangeable boxes.
function MetaAdMockup() {
  return (
    <div className="h-full flex flex-col bg-[#0D1814] p-3 sm:p-4">
      <div className="flex items-center gap-2 mb-2.5 shrink-0">
        <div className="w-7 h-7 rounded-full bg-[#38B685]/20 flex items-center justify-center shrink-0">
          <Target className="w-3.5 h-3.5 text-[#38B685]" />
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-white truncate">
            Birch Hill Homes
          </p>
          <p className="text-[10px] sm:text-xs text-white/40">Sponsored</p>
        </div>
      </div>
      {/* An actual photo (not a flat gradient block) with a headline
          overlay, like a real ad creative would carry — that emptiness
          was what read as "missing something". flex-1 lets it fill
          whatever's left of the shared card height. */}
      <div className="relative flex-1 min-h-0 rounded-md overflow-hidden">
        <Image
          src="/images/meta-ad-mockup.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 260px, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/80 via-black/25 to-transparent">
          <p className="text-xs sm:text-sm font-semibold text-white leading-snug">
            Your Dream Home Starts Here
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-white/30 mt-2.5 shrink-0">
        <Heart className="w-4 h-4" />
        <MessageCircle className="w-4 h-4" />
        <Send className="w-4 h-4" />
      </div>
    </div>
  );
}

function GoogleAdMockup() {
  return (
    <div className="h-full flex flex-col justify-center bg-white p-4 sm:p-5">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-[10px] sm:text-xs font-bold text-black/50 border border-black/20 rounded px-1.5 leading-tight">
          Ad
        </span>
        <span className="text-xs sm:text-sm text-green-700 truncate">
          birchhillhomes.com
        </span>
      </div>
      <p className="text-sm sm:text-base font-semibold text-blue-700 mb-1.5 leading-snug">
        Custom Homes, Built Around You
      </p>
      <p className="text-xs sm:text-sm text-black/50 leading-snug">
        Calgary&apos;s trusted custom home builder. Get a free quote and
        see what&apos;s possible for your lot.
      </p>
    </div>
  );
}

function RetargetingMockup() {
  return (
    <div className="h-full flex flex-col justify-center bg-[#0D1814] p-4 sm:p-5">
      <p className="text-xs sm:text-sm text-white/40 mb-3 truncate">
        You visited birchhillhomes.com
      </p>
      {/* Stacked rather than side-by-side: this card is only ~1/3 of the
          row's width, and a side-by-side message + pill button ran out of
          room and got clipped by the card's own overflow-hidden edge. */}
      <div className="rounded-md bg-[#F2C94C]/10 border border-[#F2C94C]/30 p-3 sm:p-4">
        <p className="text-sm sm:text-base text-white font-medium leading-snug mb-3">
          Still thinking it over? Take another look before you decide.
        </p>
        <span className="inline-block text-xs sm:text-sm bg-[#F2C94C] text-black rounded-full px-3 py-1 font-semibold">
          See Homes
        </span>
      </div>
    </div>
  );
}

const adChannels = [
  { label: "Meta Ads", accent: GREEN, Mockup: MetaAdMockup },
  { label: "Google Ads", accent: BLUE, Mockup: GoogleAdMockup },
  { label: "Retargeting", accent: YELLOW, Mockup: RetargetingMockup },
];

export function AdsChannelsVisual() {
  return (
    // Stacked on mobile: at three-across on a narrow phone, the bigger
    // text these mockups now carry would overflow the fixed card height
    // and get clipped. Full-width single-column rows have room for it.
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-3">
      {adChannels.map((c, i) => (
        <div key={c.label} className="flex flex-col items-center">
          {/* Name sits above the connector now, not below the card, so the
              traveling pulse visibly lands ON the label before continuing
              into the card — the line reads as "feeding into Meta Ads"
              rather than pointing at empty space. */}
          <p className="text-xs sm:text-sm font-semibold text-white/70 mb-2">
            {c.label}
          </p>
          <div className="relative w-px h-4">
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(to bottom, ${c.accent}88, ${c.accent}88)` }}
            />
            <motion.span
              className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
              style={{ background: c.accent, top: 0 }}
              animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
              transition={{
                duration: 1.3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeIn",
              }}
            />
          </div>
          {/* All three mockups share this exact height so Meta/Google/
              Retargeting read as one consistent row of cards regardless of
              how much content each platform's ad format actually has. */}
          <motion.div
            className="relative w-full h-[230px] sm:h-[250px] rounded-xl border overflow-hidden cursor-default"
            style={{ borderColor: `${c.accent}40` }}
            whileHover={{ y: -3, boxShadow: `0 12px 32px -12px ${c.accent}66` }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <c.Mockup />
          </motion.div>
        </div>
      ))}
    </div>
  );
}

const creativeEngine = [
  {
    title: "Creative Strategy",
    body: "Hooks, angles, and offers mapped before a single frame is shot.",
    icon: Lightbulb,
  },
  {
    title: "Ad Scripting",
    body: "Scripts written to stop the scroll and build trust fast.",
    icon: Sparkles,
  },
  {
    title: "In-Person Video Shoot",
    body: "We fly out and film you on-site. Real trust beats stock footage.",
    icon: Video,
  },
  {
    title: "Optimization & Iteration",
    body: "Constant testing across creative, audiences, and offers.",
    icon: RefreshCw,
  },
];

export function CreativeEngineGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {creativeEngine.map((e) => (
        <motion.div
          key={e.title}
          className="rounded-xl p-4 sm:p-5 border cursor-default"
          style={tintedCard(YELLOW)}
          whileHover={{
            y: -4,
            borderColor: YELLOW,
            boxShadow: `0 16px 36px -16px ${YELLOW}66`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
            style={{ background: `${YELLOW}1A` }}
          >
            <e.icon className="w-4 h-4" style={{ color: YELLOW }} />
          </div>
          <p className="text-sm font-semibold text-white mb-1.5">{e.title}</p>
          <p className="text-xs text-white/50 leading-relaxed">{e.body}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------
// Step 3 — Optimize & Scale: a genuine loop, not a straight line — Ads
// feeds Revenue feeds back into Ads. Five nodes sit evenly around a
// circle; a bright segment continuously travels the ring, and each node
// glows for a moment right as the segment reaches it, then fades once it
// moves on.
// ---------------------------------------------------------------------
const revenueFlow = [
  { label: "Ads", icon: Megaphone },
  { label: "Leads", icon: Users },
  { label: "CRM", icon: Database },
  { label: "Sales", icon: Handshake },
  { label: "Revenue", icon: DollarSign },
];

const optimizationLabels = [
  "Lead Tracking",
  "Call Tracking",
  "Attribution",
  "Follow-Up",
  "Campaign Optimization",
  "Budget Scaling",
];

const LOOP_DURATION = 6; // seconds for one full trip around the ring
const LOOP_RADIUS = 40; // in the 0-100 viewBox

// Evenly spaced around the circle starting from the top (-90deg), matching
// the glow blob below, which also starts at the top of its rotation — so
// node 0 ("Ads") sits exactly where the glow begins.
function pointOnLoop(index: number, total: number) {
  const angle = (-90 + (360 / total) * index) * (Math.PI / 180);
  return {
    x: 50 + LOOP_RADIUS * Math.cos(angle),
    y: 50 + LOOP_RADIUS * Math.sin(angle),
  };
}

export function RevenueLoopVisual() {
  const total = revenueFlow.length;

  return (
    <motion.div
      className="rounded-2xl p-6 lg:p-8 border cursor-default"
      style={tintedCard(ORANGE)}
      whileHover={{
        y: -4,
        borderColor: ORANGE,
        boxShadow: `0 20px 50px -20px ${ORANGE}55`,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <div className="mb-6 text-center">
        <span className="text-sm font-semibold text-white/80">
          Revenue Feedback Loop
        </span>
      </div>

      <div className="relative aspect-square max-w-[280px] mx-auto">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" aria-hidden>
          <defs>
            {/* Actual Gaussian blur, not a drop-shadow — a drop-shadow
                leaves the original stroke crisp and just adds a soft copy
                behind it, which still reads as a solid line. Blurring the
                stroke itself is what turns it into a feathered glow with
                no hard edge anywhere. */}
            <filter id="loopGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.6" />
            </filter>
          </defs>
          {/* Thin static guide ring. */}
          <circle
            cx="50"
            cy="50"
            r={LOOP_RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={0.6}
          />
          <motion.circle
            cx="50"
            cy="50"
            r={LOOP_RADIUS}
            fill="none"
            stroke={ORANGE}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * LOOP_RADIUS * 0.07} ${2 * Math.PI * LOOP_RADIUS * 0.93}`}
            transform="rotate(-90 50 50)"
            filter="url(#loopGlow)"
            style={{ opacity: 0.85 }}
            animate={{ strokeDashoffset: [0, -2 * Math.PI * LOOP_RADIUS] }}
            transition={{ duration: LOOP_DURATION, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        {revenueFlow.map((s, i) => {
          const pt = pointOnLoop(i, total);
          const delay = (i / total) * LOOP_DURATION;
          return (
            <div
              key={s.label}
              className="absolute flex flex-col items-center"
              style={{
                left: `${pt.x}%`,
                top: `${pt.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Snappier than a slow fade: the node reacts the instant the
                  glow arrives — a quick brighten + scale pop — then eases
                  back down, so it reads as the node actively lighting up
                  rather than a gradual ambient shift. */}
              <motion.div
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0D1814] border flex items-center justify-center"
                animate={{
                  scale: [1, 1.16, 1],
                  color: [GREEN, ORANGE, GREEN],
                  borderColor: [`${GREEN}66`, ORANGE, `${GREEN}66`],
                  boxShadow: [
                    "0 0 0px rgba(242,153,74,0)",
                    "0 0 28px 4px rgba(242,153,74,0.95)",
                    "0 0 0px rgba(242,153,74,0)",
                  ],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: LOOP_DURATION - 0.6,
                  delay,
                  times: [0, 0.35, 1],
                  ease: ["easeOut", "easeIn"],
                }}
              >
                <s.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
              <span className="text-[11px] sm:text-xs text-white/60 mt-2 whitespace-nowrap">
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 justify-center pt-6 mt-6 border-t border-white/5">
        {optimizationLabels.map((l) => (
          <motion.span
            key={l}
            className="text-xs text-white/60 border border-white/10 px-3 py-1.5 rounded-full cursor-default"
            whileHover={{
              borderColor: ORANGE,
              color: "#fff",
              y: -2,
              boxShadow: `0 8px 20px -8px ${ORANGE}77`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------
// Step 4 — Own Your Market: three layered modules (Website, Search, AI
// Search) plus a Valiant-style floating stack of shipped landing pages.
// ---------------------------------------------------------------------
// Four pages of the same shipped site (Birch Hill Homes) — home, portfolio,
// a project detail page, and the custom-homes page — standing in for
// "landing pages, portfolio pages, location pages" without needing four
// different clients.
const birchHillPages = [
  { label: "Birch Hill Homes — Home", image: "/images/site-birchhill.jpeg" },
  { label: "Birch Hill Homes — Portfolio", image: "/images/site-birchhill-portfolio.jpeg" },
  { label: "Birch Hill Homes — Project Detail", image: "/images/site-birchhill-project.jpeg" },
  { label: "Birch Hill Homes — Custom Homes", image: "/images/site-birchhill-services.jpeg" },
];

// Shared hover treatment for the three Own Your Market cards: stroke color
// shifts to the section's pink accent and the card lifts slightly, matching
// the interaction every other "mini container" in this system already has.
const marketCardHover = {
  y: -4,
  borderColor: PINK,
  boxShadow: `0 20px 50px -20px ${PINK}55`,
};
const marketCardTransition = { type: "spring", stiffness: 300, damping: 22 } as const;

// Desktop/laptop-style browser mockup that swipe-slides through those four
// pages every 3s instead of a single static screenshot. The image keeps its
// own aspect-[16/10] box (not stretched to fill the row's height, which
// this grid's tallest sibling — Search or AI Search — otherwise sets) so
// object-cover doesn't crop into the page content to fill a taller box.
export function WebsiteModule() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % birchHillPages.length),
      3000,
    );
    return () => clearInterval(id);
  }, []);
  const page = birchHillPages[index];
  return (
    <motion.div
      className="rounded-2xl p-4 h-full flex flex-col border cursor-default"
      style={tintedCard(PINK)}
      whileHover={marketCardHover}
      transition={marketCardTransition}
    >
      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
        Website
      </p>
      <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0D0D0F]">
        <div className="h-6 bg-white/5 flex items-center gap-1.5 px-3">
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>
        <div className="relative aspect-[16/10] overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={page.label}
              className="absolute inset-0"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.6, ease: [0.21, 0.5, 0.28, 1] }}
            >
              <Image
                src={page.image}
                alt={page.label}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover object-top"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export function SearchModule() {
  return (
    <motion.div
      className="rounded-2xl p-4 h-full flex flex-col border cursor-default"
      style={tintedCard(PINK)}
      whileHover={marketCardHover}
      transition={marketCardTransition}
    >
      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
        Search
      </p>
      <div className="bg-white rounded-xl p-4 flex-1">
        <div className="flex items-center gap-2 mb-3 text-black/40">
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs sm:text-sm">
            custom home builder in Scottsdale
          </span>
        </div>
        <div className="border-t border-black/10 pt-3">
          <p className="text-[11px] text-green-700 mb-0.5">
            birchhillhomes.com
          </p>
          <p className="text-sm font-semibold text-blue-700 mb-1">
            Birch Hill Homes | Custom Homes, Scottsdale
          </p>
          <p className="text-[11px] text-black/60 leading-relaxed">
            Award-winning custom home builder serving Scottsdale and
            surrounding areas since 2011.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function AiSearchModule() {
  return (
    <motion.div
      className="rounded-2xl p-4 h-full flex flex-col border cursor-default"
      style={tintedCard(PINK)}
      whileHover={marketCardHover}
      transition={marketCardTransition}
    >
      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[#F472B6]" />
        AI Search
      </p>
      <div className="bg-[#0D0D0F] border border-white/10 rounded-xl p-4 flex-1">
        <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-3">
          &quot;Some of the top custom home builders in Scottsdale
          include&hellip;&quot;
        </p>
        <div className="flex items-center gap-2 bg-[#F472B6]/10 border border-[#F472B6]/30 rounded-lg px-3 py-2">
          <Target className="w-3.5 h-3.5 text-[#F472B6] shrink-0" />
          <span className="text-xs sm:text-sm text-white font-medium">
            Birch Hill Homes
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Valiant-style: a small title, three overlapping screenshots drifting
// gently up and down with drop shadows, each at a slightly different
// speed so they never sync into a single obvious loop. Birch Hill on the
// left, Alogla centered, Stately on the right.
const shippedPages = [
  featuredWebsites.find((s) => s.name === "Birch Hill Homes")!,
  featuredWebsites.find((s) => s.name === "Alogla Homes")!,
  featuredWebsites.find((s) => s.name === "Stately Homes")!,
];

export function LandingPagesFloat() {
  return (
    <div className="text-center">
      <p className="text-xs font-semibold text-[#F472B6] uppercase tracking-[0.2em] mb-4 sm:mb-6">
        Landing pages we ship
      </p>
      {/* Box height and top offsets are sized in px, not %, to hug the
          cluster tightly against the label above — the tallest card's own
          offset plus its rendered height is what sets the box height, so
          there's no leftover blank space above or below the images. The
          desktop box (sm:h-[350px]) has to clear the right/back card's own
          extent — top offset 36px + its ~278px rendered height at 58% of a
          768px-wide row — with room to spare, or that card clips the
          container's bottom edge. */}
      <div className="relative h-[150px] sm:h-[350px] max-w-3xl mx-auto">
        {shippedPages.map((p, i) => {
          const offsets = [
            "left-[4%] sm:left-[-14%] top-[14px] sm:top-[24px] rotate-[-6deg] z-10",
            "left-1/2 -translate-x-1/2 top-0 z-20",
            "right-[4%] sm:right-[-14%] top-[20px] sm:top-[36px] rotate-[6deg] z-10",
          ];
          // Center card (Alogla) skips the border — it reads as the "active"
          // page in front, so a stroke around it read like an accidental
          // outline rather than a deliberate one, unlike the two behind it.
          const border = i === 1 ? "" : "border border-white/10";
          return (
            <motion.div
              key={p.name}
              className={`absolute w-[58%] aspect-[16/10] rounded-xl overflow-hidden ${border} shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] ${offsets[i]}`}
              animate={{ y: [0, i % 2 === 0 ? -12 : 12, 0] }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            >
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(min-width: 640px) 50vw, 58vw"
                className="object-cover"
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
