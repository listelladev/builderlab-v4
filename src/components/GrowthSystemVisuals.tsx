"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SilentVideo } from "./SilentVideo";
import {
  Handshake,
  Database,
  DollarSign,
  Lightbulb,
  Megaphone,
  MessageCircle,
  RefreshCw,
  Search,
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
// Step 2 — Install Our Ads System: three phone-tall panels that share one
// height — the ad creative as a muted autoplaying video, the lead-capture
// form as a 3-slide mock that swipes on its own, and the CRM follow-up as
// an iPhone lock-screen notification that slides in, holds, then eases
// back out on a loop (reverses rather than snapping back).
// ---------------------------------------------------------------------

// 1. High-Performance Creative — the same ad reel used in the "stop the
// scroll" Creative section (Ad 7), served as adaptive Bunny Stream HLS
// through SilentVideo: muted, looped, viewport-gated, and paused when
// off-screen. The raw master (builderlab.b-cdn.net/7.mp4) is 335MB and
// crashed iOS Safari when loaded directly.
const CREATIVE_REEL_SRC =
  "https://vz-8f67defd-6ab.b-cdn.net/381cb534-83fc-405f-9eff-cac17eb1e7ff/playlist.m3u8";

function VideoCreativeMockup() {
  return (
    <div className="relative h-full w-full bg-black">
      <SilentVideo
        src={CREATIVE_REEL_SRC}
        poster="/images/creative-posters/7.jpg"
        label="BuilderLab ad creative"
      />
    </div>
  );
}

// 2. Lead Capture Form — three non-interactive slides rebuilt from a real
// Meta lead form (question cards, radio rows, Continue button). They swipe
// automatically every few seconds, same slide treatment as Own Your
// Market's website mock.
function FormCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-3 space-y-2 shadow-[0_1px_4px_rgba(0,0,0,0.12)]">
      {children}
    </div>
  );
}

function FormQuestion({ children }: { children: ReactNode }) {
  return (
    <p className="text-[12px] sm:text-[13px] font-bold text-[#1c2b33] leading-snug">
      {children}
    </p>
  );
}

function FormOption({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-black/15 bg-white px-3 py-2">
      <span className="text-[11.5px] sm:text-[12.5px] text-black/75 leading-snug">
        {label}
      </span>
      <span className="w-4 h-4 rounded-full border border-black/30 shrink-0" />
    </div>
  );
}

function FormContinue() {
  return (
    <div className="rounded-md bg-[#1877F2] py-2.5 text-center text-[12.5px] font-semibold text-white">
      Continue
    </div>
  );
}

const leadFormSlides = [
  <div key="s1" className="flex flex-col gap-2.5">
    <p className="px-2 text-center text-[14px] sm:text-[15px] font-medium leading-snug text-[#1c2b33]/70">
      Fill out a few quick details to schedule your complimentary Design &amp;
      Build Consultation.
    </p>
    <FormCard>
      <FormQuestion>What are you interested in?</FormQuestion>
      <FormOption label="Custom Home" />
      <FormOption label="Full Home Remodel" />
      <FormOption label="Other" />
    </FormCard>
    <FormContinue />
  </div>,
  <div key="s2" className="flex flex-col gap-2.5">
    <FormCard>
      <FormQuestion>What is your estimated timeline to start?</FormQuestion>
      <FormOption label="ASAP" />
      <FormOption label="1-6 months" />
      <FormOption label="6-12 months" />
      <FormOption label="12+ months" />
    </FormCard>
    <FormContinue />
  </div>,
  <div key="s3" className="flex flex-col gap-2.5">
    <FormCard>
      <FormQuestion>Do you currently own land or a lot?</FormQuestion>
      <FormOption label="Yes, I have land" />
      <FormOption label="I'm in the process of purchasing" />
      <FormOption label="No, I do not have land" />
    </FormCard>
    <FormContinue />
  </div>,
];

function LeadFormMockup() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % leadFormSlides.length),
      3200,
    );
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#EBEDF0]">
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0 flex flex-col justify-center overflow-hidden p-3.5"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.6, ease: [0.21, 0.5, 0.28, 1] }}
        >
          {leadFormSlides[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// 3. Automated CRM Follow-Up — an iPhone lock screen that sits dimmed,
// then a text slides up and the screen lights up as it "arrives", holds,
// and eases back down before coming up again a couple of seconds later.
// The phone is zoomed in and pushed down so the panel clips off roughly
// its bottom half, and a faded site photo sits behind it under a black wash.
const FOLLOWUP_LOOP = 5.5;
// Both tracks start and end on the same state — screen dark, banner gone —
// so the loop point is invisible: the dim overlay returns all the way to
// its initial 0.6 as the banner fades, then holds there through the
// repeatDelay before the next arrival, rather than ending bright and
// snapping dark.
const FOLLOWUP_BASE = {
  duration: FOLLOWUP_LOOP,
  repeat: Infinity,
  repeatDelay: 1.6,
} as const;

function PhoneFollowUpMockup() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* Faded site photo behind the phone, under a black wash. */}
      <Image
        src="/images/meta-ad-mockup.webp"
        alt=""
        fill
        sizes="(min-width: 1024px) 380px, 100vw"
        className="object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/45 to-black/65" />

      {/* Titanium frame: a dark rounded shell with the screen inset a few
          px inside it, plus a hairline highlight so the edge catches light
          against the bright photo behind it. */}
      <div className="absolute left-1/2 top-20 h-[175%] w-[280px] -translate-x-1/2 rounded-[3rem] bg-gradient-to-b from-[#141416] via-[#050506] to-black p-[5px] shadow-[0_24px_70px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
        <div className="relative h-full w-full overflow-hidden rounded-[2.65rem] bg-black ring-1 ring-black/80">
        {/* Layered so the wallpaper reads as depth rather than a flat
            gradient: a green base, a bright top-left bloom, and a deeper
            green glow low-right. */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c3b33] via-[#0f231d] to-[#060b09]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 55% at 25% 8%, rgba(96,208,166,0.38), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 50% at 80% 55%, rgba(56,182,133,0.24), transparent 65%)",
          }}
        />
        {/* Screen sits dim, then lifts toward full brightness as the
            message lands, then dims again — in step with the banner. */}
        <motion.div
          className="absolute inset-0 bg-black"
          animate={{ opacity: [0.6, 0.6, 0.12, 0.12, 0.6] }}
          transition={{
            ...FOLLOWUP_BASE,
            times: [0, 0.12, 0.32, 0.74, 0.98],
            ease: "easeInOut",
          }}
        />
        <div className="absolute left-1/2 top-3 h-4 w-16 -translate-x-1/2 rounded-full bg-black/85" />
        <div className="absolute inset-x-0 top-12 text-center text-white">
          <p className="text-[10px] font-medium text-white/70">
            Thursday, August 27
          </p>
          <p className="text-[44px] font-semibold leading-none tracking-tight">
            9:41
          </p>
        </div>
        <motion.div
          className="absolute inset-x-4 top-[17%]"
          animate={{ y: [44, 0, 0, 44], opacity: [0, 1, 1, 0] }}
          transition={{
            ...FOLLOWUP_BASE,
            times: [0, 0.16, 0.66, 0.86],
            ease: [0.21, 0.5, 0.28, 1],
          }}
        >
          <div className="rounded-2xl bg-white/90 p-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md">
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#38B685]">
                <MessageCircle className="h-3 w-3 text-white" />
              </span>
              <span className="text-[9.5px] font-semibold uppercase tracking-wide text-black/55">
                Messages
              </span>
              <span className="ml-auto text-[9.5px] text-black/40">now</span>
            </div>
            <p className="text-[12px] font-semibold text-black/90">BuilderLab</p>
            <p className="text-[12px] leading-snug text-black/70">
              Still thinking it over? Take another look before you decide.
            </p>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}

const adChannels = [
  { label: "High-Performance Creative", accent: GREEN, Mockup: VideoCreativeMockup },
  { label: "Lead Capture Form", accent: BLUE, Mockup: LeadFormMockup },
  { label: "Automated CRM Follow-Up", accent: YELLOW, Mockup: PhoneFollowUpMockup },
];

export function AdsChannelsVisual() {
  return (
    // Stacked on mobile: three phone-tall panels side by side don't fit a
    // narrow screen, full-width single-column rows do.
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-3">
      {adChannels.map((c, i) => (
        <div key={c.label} className="flex flex-col items-center">
          {/* Name sits above the connector so the traveling pulse visibly
              lands ON the label before continuing into the card. */}
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
          {/* All three share this height so the video, the form slides, and
              the phone read as one row of equal-height panels. */}
          <motion.div
            className="relative w-full h-[440px] sm:h-[520px] rounded-xl border overflow-hidden cursor-default"
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
    title: "On Site Video Shoot",
    body: "We send a local videographer to capture you and your projects in action. Real content built to earn trust.",
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
          style={tintedCard(GREEN)}
          whileHover={{
            y: -4,
            borderColor: GREEN,
            boxShadow: `0 16px 36px -16px ${GREEN}66`,
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
      style={tintedCard(GREEN)}
      whileHover={{
        y: -4,
        borderColor: GREEN,
        boxShadow: `0 20px 50px -20px ${GREEN}55`,
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
  { label: "Website — 1", image: "/images/website-slider/1.jpeg" },
  { label: "Website — 2", image: "/images/website-slider/2.jpeg" },
  { label: "Website — 3", image: "/images/website-slider/3.jpeg" },
  { label: "Website — 4", image: "/images/website-slider/4.jpeg" },
  { label: "Website — 5", image: "/images/website-slider/5.jpeg" },
  { label: "Website — 6", image: "/images/website-slider/6.jpeg" },
];

// Shared hover treatment for the three Own Your Market cards: green stroke
// + lift, matching every other "mini container" in this system. The pink
// stays only on the inner accents (AI Search highlight, the section
// heading), not the card chrome.
const marketCardHover = {
  y: -4,
  borderColor: GREEN,
  boxShadow: `0 20px 50px -20px ${GREEN}55`,
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
      style={tintedCard(GREEN)}
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
      style={tintedCard(GREEN)}
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
            custom home builder in Roseville, CA
          </span>
        </div>
        <div className="border-t border-black/10 pt-3">
          <p className="text-[11px] text-green-700 mb-0.5">
            bianchigroupdevelopers.com
          </p>
          <p className="text-sm font-semibold text-blue-700 mb-1">
            Bianchi Group Developers | Custom Homes, Roseville, CA
          </p>
          <p className="text-[11px] text-black/60 leading-relaxed">
            Bianchi Group Developers is a full-service design and build firm
            specializing in luxury custom homes and development in
            Roseville, CA, and across Northern ...
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
      style={tintedCard(GREEN)}
      whileHover={marketCardHover}
      transition={marketCardTransition}
    >
      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[#F472B6]" />
        AI Search
      </p>
      <div className="bg-[#0D0D0F] border border-white/10 rounded-xl p-4 flex-1">
        <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-3">
          &quot;Some of the top custom home builders in Roseville, CA
          include&hellip;&quot;
        </p>
        <div className="flex items-center gap-2 bg-[#F472B6]/10 border border-[#F472B6]/30 rounded-lg px-3 py-2">
          <Target className="w-3.5 h-3.5 text-[#F472B6] shrink-0" />
          <span className="text-xs sm:text-sm text-white font-medium">
            Bianchi Group Developers
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
        High-Converting Websites
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
