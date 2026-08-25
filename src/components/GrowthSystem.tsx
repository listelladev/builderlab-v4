"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import {
  PositioningVisual,
  AdsChannelsVisual,
  CreativeEngineGrid,
  RevenueLoopVisual,
  WebsiteModule,
  SearchModule,
  AiSearchModule,
  LandingPagesFloat,
} from "./GrowthSystemVisuals";

const EASE = [0.21, 0.5, 0.28, 1] as const;
const GREEN = "#38B685";
const YELLOW = "#F2C94C";
const ORANGE = "#F2994A";
const PINK = "#F472B6";
// Mirrors each stage's accent, weighted so green (step 1) holds more of the
// gradient's top before handing off to yellow (step 2), orange (step 3),
// and pink (step 4) — matching the left-edge hover highlight per card.
const RAIL_GRADIENT = `linear-gradient(to bottom, ${GREEN} 0%, ${GREEN} 20%, ${YELLOW} 40%, ${ORANGE} 70%, ${PINK} 100%)`;
// Mobile's stops are tuned separately from desktop's: the mobile rail runs
// through 4 stacked cards of very different heights (measured node centers
// at ~0%, 14%, 54%, 72% of the rail), nothing like desktop's evenly-spread
// nodes — reusing the desktop gradient put the pink/orange handoff mid-way
// through node 2's card and the pink/green handoff mid-way through node
// 3's, instead of each node arriving in its own color.
const RAIL_GRADIENT_MOBILE = `linear-gradient(to bottom, ${GREEN} 0%, ${GREEN} 8%, ${YELLOW} 14%, ${YELLOW} 44%, ${ORANGE} 54%, ${ORANGE} 64%, ${PINK} 72%, ${PINK} 100%)`;

const stages = [
  {
    n: "01",
    title: "Strategy & Positioning",
    accent: GREEN,
    body: "Every builder says they do quality work. Before we turn on traffic, we get clear on who you're for, what makes you different, and how you talk about it.",
    tags: ["Ideal client", "Offer", "Positioning", "Messaging", "Market strategy"],
    visual: "positioning",
  },
  {
    n: "02",
    title: "Install Our Ads System",
    accent: YELLOW,
    body: "We generate leads on Meta Ads through scroll-stopping creative that builds trust, and capture intent on Google Ads from people already searching for a builder. Retargeting keeps you top of mind until they're ready.",
    tags: ["Creative strategy", "Ad scripting", "In-person video shoot", "Optimization & iteration"],
    visual: "ads",
  },
  {
    n: "03",
    title: "Optimize & Scale",
    accent: ORANGE,
    body: "Once the machine is producing leads, we track what's actually creating revenue, not just clicks, and push harder on what works.",
    tags: ["Lead tracking", "Call tracking", "Attribution", "Budget scaling"],
    visual: "scale",
  },
  {
    n: "04",
    title: "Own Your Market",
    accent: PINK,
    body: "Once your paid acquisition engine is working, we expand your presence everywhere homeowners research and evaluate builders.",
    tags: ["High-converting websites", "SEO & organic search", "AI search visibility"],
    visual: "market",
  },
];

function Tag({ label, accent }: { label: string; accent: string }) {
  return (
    <motion.span
      className="inline-flex items-center gap-1.5 text-sm text-white/70 bg-white/5 border border-white/10 px-3.5 py-2 rounded-full cursor-default"
      whileHover={{
        borderColor: accent,
        color: "#fff",
        y: -2,
        boxShadow: `0 8px 24px -10px ${accent}88`,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: accent }} />
      {label}
    </motion.span>
  );
}

function StepVisual({ visual }: { visual: string }) {
  if (visual === "positioning") return <PositioningVisual />;
  if (visual === "ads") return <CreativeEngineGrid />;
  return <RevenueLoopVisual />;
}

// Own Your Market's three modules run full-width beneath the body copy
// and tags instead of living in a separate right-hand column, so they read
// as one row that follows the text rather than a sidebar next to it.
function MarketModulesRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
      <WebsiteModule />
      <SearchModule />
      <AiSearchModule />
    </div>
  );
}

function StepExtra({ visual }: { visual: string }) {
  if (visual === "ads")
    return (
      <div className="mt-10 pt-8 border-t border-white/5">
        <AdsChannelsVisual />
      </div>
    );
  if (visual === "market")
    return (
      <div className="mt-10 pt-8 border-t border-white/5">
        <LandingPagesFloat />
      </div>
    );
  return null;
}

function StepCardBody({ step }: { step: (typeof stages)[number] }) {
  // Steps 1, 2, and 3 already show these exact labels in their visual (the
  // floating chips, the creative-engine cards, the loop's own label row),
  // so repeating them as a tag row underneath the body copy would just be
  // the same words twice in the same card.
  const showTags =
    step.visual !== "positioning" &&
    step.visual !== "ads" &&
    step.visual !== "scale";
  // Steps 1-3's text runs shorter than their visual (the diagram, the
  // creative-engine grid, the loop), so it's vertically centered against
  // it, with the visual living beside the text in a second column. Step 4's
  // three modules run full-width below the text instead, so it skips the
  // two-column split entirely.
  const isMarket = step.visual === "market";
  return (
    <div>
      {isMarket ? (
        <div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            {step.title}
          </h3>
          <p className="text-sm sm:text-base text-white/60 leading-relaxed mb-6">
            {step.body}
          </p>
          {showTags && (
            <div className="flex flex-wrap gap-2">
              {step.tags.map((t) => (
                <Tag key={t} label={t} accent={step.accent} />
              ))}
            </div>
          )}
          <MarketModulesRow />
        </div>
      ) : (
        // Steps 1-3 never show tags (showTags is always false here — this
        // branch only ever renders for positioning/ads/scale), so the body
        // paragraph has nothing after it but the grid gap. A trailing mb-6
        // on top of that gap made the space below the text roughly double
        // the card's own top padding, which is what read as "top-aligned"
        // rather than centered against the visual below. gap-6 on mobile
        // (vs the wider gap-10 desktop needs to separate the two columns)
        // matches the card's p-6 top padding so the text block sits with
        // even space above and below it.
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              {step.title}
            </h3>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed">
              {step.body}
            </p>
          </div>
          <StepVisual visual={step.visual} />
        </div>
      )}
      <StepExtra visual={step.visual} />
    </div>
  );
}

function NumberNode({
  n,
  accent,
  active,
  size,
  nodeRef,
}: {
  n: string;
  accent: string;
  active: boolean;
  size: "sm" | "lg";
  nodeRef: (el: HTMLDivElement | null) => void;
}) {
  const dims = size === "lg" ? "w-12 h-12 lg:w-16 lg:h-16" : "w-12 h-12";
  return (
    <div ref={nodeRef} className={`relative ${dims}`}>
      <span
        className={`absolute inset-0 rounded-full border-2 animate-ping-slow transition-all duration-500 ${
          active ? "opacity-70 scale-110" : "opacity-40"
        }`}
        style={{ borderColor: accent }}
      />
      <div
        className={`absolute inset-0 rounded-full border-2 flex items-center justify-center font-bold text-base lg:text-xl transition-all duration-500 ${
          active ? "text-[#050706]" : "text-white"
        }`}
        style={{
          borderColor: accent,
          background: active ? accent : "#0A0A0A",
          boxShadow: active
            ? `0 0 45px ${accent}CC`
            : `0 0 30px ${accent}73`,
        }}
      >
        {n}
      </div>
    </div>
  );
}

function Step({
  step,
  index,
  active,
  isLast,
  mobileNodeRef,
  desktopNodeRef,
}: {
  step: (typeof stages)[number];
  index: number;
  active: boolean;
  isLast: boolean;
  mobileNodeRef: (el: HTMLDivElement | null) => void;
  desktopNodeRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div className="group relative">
      {/* Mobile: number centered above the card, rendered immediately (no
          scroll-triggered fade) so a fast scroll can't outpace the timeline
          fill and leave a visible gap before the card appears. */}
      <div className={`lg:hidden flex flex-col items-center ${isLast ? "pb-0" : "pb-10"}`}>
        <div className="relative z-20 mb-6">
          <NumberNode
            n={step.n}
            accent={step.accent}
            active={active}
            size="sm"
            nodeRef={mobileNodeRef}
          />
        </div>
        <motion.div
          className="relative w-full border rounded-2xl p-6 overflow-hidden"
          style={{
            background: `linear-gradient(160deg, ${step.accent}22, transparent 55%), #0B0B0B`,
            borderColor: `${step.accent}33`,
          }}
          whileHover={{
            y: -4,
            borderColor: step.accent,
            boxShadow: `0 20px 50px -20px ${step.accent}55`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          {/* Top bar, not left — on mobile the numbered node sits above the
              card (the rail runs straight down through the stack), so a
              left-edge accent bar had nothing to connect to. A top bar reads
              as "this card continues from the node above it" instead. */}
          <div
            className={`absolute top-0 inset-x-0 h-1 transition-opacity duration-300 ${
              active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            style={{ background: step.accent }}
          />
          <StepCardBody step={step} />
        </motion.div>
      </div>

      {/* Desktop: the rail's numbers live in a fixed 64px-wide left rail
          (w-16 lg:w-16 track), the card sits beside it. Both the rail line
          and every node share that same track, so they're always
          perfectly concentric regardless of card height. */}
      <motion.div
        className={`hidden lg:grid grid-cols-[4rem_1fr] gap-8 ${isLast ? "pb-0" : "pb-14"}`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, delay: index * 0.05, ease: EASE }}
      >
        <div className="relative z-20 pt-8 flex justify-center">
          <NumberNode
            n={step.n}
            accent={step.accent}
            active={active}
            size="lg"
            nodeRef={desktopNodeRef}
          />
        </div>
        <motion.div
          className="relative border rounded-2xl p-10 overflow-hidden"
          style={{
            background: `linear-gradient(160deg, ${step.accent}22, transparent 55%), #0B0B0B`,
            borderColor: `${step.accent}33`,
          }}
          whileHover={{
            y: -4,
            borderColor: step.accent,
            boxShadow: `0 20px 50px -20px ${step.accent}55`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div
            className={`absolute left-0 inset-y-0 w-1 transition-opacity duration-300 ${
              active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            style={{ background: step.accent }}
          />
          <StepCardBody step={step} />
        </motion.div>
      </motion.div>
    </div>
  );
}

type NodePair = { mobile: HTMLDivElement | null; desktop: HTMLDivElement | null };

function visibleEl(pair: NodePair | undefined) {
  if (!pair) return null;
  if (pair.mobile && pair.mobile.offsetHeight > 0) return pair.mobile;
  if (pair.desktop && pair.desktop.offsetHeight > 0) return pair.desktop;
  return null;
}

export function GrowthSystem() {
  const railRef = useRef<HTMLDivElement>(null);
  const fillRefMobile = useRef<HTMLDivElement>(null);
  const fillRefDesktop = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<NodePair[]>([]);
  const [activeCount, setActiveCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.6", "end 0.4"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  // Revealing the fill via scaleY (as before) doesn't just clip the rail —
  // it visually squashes the whole gradient into whatever fraction is
  // currently filled, so the color sitting at any fixed node position kept
  // drifting through the entire gradient as the user scrolled (a growing
  // fill's leading edge was always ~pink, the gradient's last stop,
  // regardless of which node it was passing). clip-path reveals the same
  // full-height, unscaled gradient instead, so each pixel's color is fixed
  // and a node lines up with the same color at any scroll position.
  const fillClip = useTransform(fill, (v) => `inset(0px 0px ${(1 - v) * 100}% 0px)`);

  useMotionValueEvent(scrollYProgress, "change", () => {
    const fillEl =
      (fillRefMobile.current?.offsetHeight ?? 0) > 0
        ? fillRefMobile.current
        : fillRefDesktop.current;
    if (!fillEl) return;
    // With the reveal now done via clip-path instead of scaleY, the rail
    // div's own getBoundingClientRect() always reports its full, unclipped
    // extent — it no longer shrinks with `fill` the way a scaleY transform
    // did. Reconstruct the current "fill line" position from that full
    // rect plus the fill fraction instead of reading it off a distorted box.
    const railRect = fillEl.getBoundingClientRect();
    const fillBottom = railRect.top + fill.get() * railRect.height;
    let count = 0;
    for (const pair of nodeRefs.current) {
      const node = visibleEl(pair);
      if (!node) continue;
      const rect = node.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      if (center <= fillBottom) count++;
    }
    setActiveCount((prev) => (prev === count ? prev : count));
  });

  return (
    <section id="system" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Dark charcoal variant with a cooler teal-green accent, alternating
          against the brighter #38B685 glow sections above and below. The
          base carries a slight green cast rather than true neutral black,
          and a third glow sits mid-left — the original two both anchor to
          an edge (top-center, bottom-right), leaving the section's left
          side flat across its full height. */}
      <div className="absolute inset-0 bg-[#060A08]" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[160px] opacity-15"
        style={{ background: "radial-gradient(ellipse, #2E7D64, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[500px] rounded-full blur-[150px] opacity-10"
        style={{ background: "radial-gradient(ellipse, #F472B6, transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 left-[8%] -translate-y-1/2 w-[450px] h-[450px] blur-[140px] opacity-[0.08]"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 60%)" }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
            How it works
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
            The Builderlab Growth System&trade;
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            One connected system, not four isolated tactics. Strategy feeds
            creative. Creative feeds leads. Leads feed revenue. Revenue funds
            omnipresence.
          </p>
        </motion.div>

        <div ref={railRef} className="relative">
          {/* Desktop rail: centered under the 4rem-wide number column so it
              runs directly through every node's center. */}
          <div className="hidden lg:block absolute left-8 top-14 bottom-14 w-0.5 -translate-x-1/2 rounded-full bg-white/10" />
          <motion.div
            ref={fillRefDesktop}
            className="hidden lg:block absolute left-8 top-14 bottom-14 w-0.5 -translate-x-1/2 rounded-full"
            style={{
              clipPath: fillClip,
              background: RAIL_GRADIENT,
              boxShadow: "0 0 14px rgba(56,182,133,0.7)",
            }}
          />

          {/* Mobile rail (centered, threads behind the stacked cards) */}
          <div className="lg:hidden absolute left-1/2 top-6 bottom-6 w-0.5 -translate-x-1/2 rounded-full bg-white/10" />
          <motion.div
            ref={fillRefMobile}
            className="lg:hidden absolute left-1/2 top-6 bottom-6 w-0.5 -translate-x-1/2 rounded-full"
            style={{
              clipPath: fillClip,
              background: RAIL_GRADIENT_MOBILE,
              boxShadow: "0 0 14px rgba(56,182,133,0.7)",
            }}
          />

          {stages.map((step, i) => (
            <Step
              key={step.n}
              step={step}
              index={i}
              active={i < activeCount}
              isLast={i === stages.length - 1}
              mobileNodeRef={(el) => {
                nodeRefs.current[i] = { ...nodeRefs.current[i], mobile: el };
              }}
              desktopNodeRef={(el) => {
                nodeRefs.current[i] = { ...nodeRefs.current[i], desktop: el };
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
