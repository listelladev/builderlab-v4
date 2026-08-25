"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { steps } from "@/lib/data";
import {
  PositioningVisual,
  AdsSystemVisual,
  AdsSystemLandingPages,
  OmnipresenceVisual,
  DashboardVisual,
  DashboardIntegrations,
} from "./HowItWorksVisuals";

const EASE = [0.21, 0.5, 0.28, 1] as const;

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-white/70 bg-white/5 border border-white/10 px-3.5 py-2 rounded-full">
      <CheckCircle2 className="w-3.5 h-3.5 text-[#38B685]" />
      {label}
    </span>
  );
}

function StepVisual({ visual }: { visual: string }) {
  if (visual === "positioning") return <PositioningVisual />;
  if (visual === "ads") return <AdsSystemVisual />;
  if (visual === "omnipresence") return <OmnipresenceVisual />;
  return <DashboardVisual />;
}

function StepExtra({ visual }: { visual: string }) {
  if (visual === "ads") return <AdsSystemLandingPages />;
  if (visual === "dashboard") return <DashboardIntegrations />;
  return null;
}

function StepCardBody({ step }: { step: (typeof steps)[number] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
      <div>
        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
          {step.title}
        </h3>
        <p className="text-sm sm:text-base text-white/60 leading-relaxed mb-6">
          {step.body}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {step.tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
        <StepExtra visual={step.visual} />
      </div>
      <StepVisual visual={step.visual} />
    </div>
  );
}

function NumberNode({
  n,
  active,
  size,
  nodeRef,
}: {
  n: string;
  active: boolean;
  size: "sm" | "lg";
  nodeRef: (el: HTMLDivElement | null) => void;
}) {
  const dims = size === "lg" ? "w-12 h-12 lg:w-16 lg:h-16" : "w-12 h-12";
  return (
    <div ref={nodeRef} className={`relative ${dims}`}>
      <span
        className={`absolute inset-0 rounded-full border-2 border-[#38B685] animate-ping-slow transition-all duration-500 ${
          active ? "opacity-70 scale-110" : "opacity-40"
        }`}
      />
      <div
        className={`absolute inset-0 rounded-full border-2 border-[#38B685] flex items-center justify-center font-bold text-base lg:text-xl transition-all duration-500 ${
          active
            ? "bg-[#38B685] text-[#08120E] shadow-[0_0_45px_rgba(56,182,133,0.8)]"
            : "bg-[#08120E] text-[#38B685] shadow-[0_0_30px_rgba(56,182,133,0.45)]"
        }`}
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
  step: (typeof steps)[number];
  index: number;
  active: boolean;
  isLast: boolean;
  mobileNodeRef: (el: HTMLDivElement | null) => void;
  desktopNodeRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div className="group relative">
      {/* Mobile: number centered above the card, line runs centered behind.
          No scroll-triggered fade-in here, on a fast scroll the timeline
          fill outpaces a delayed entrance animation, leaving a visible gap
          before the number/card appears. Rendered immediately instead.
          Spacing is index-driven rather than `last:pb-0`, since this div is
          always the second (i.e. locally "last") child of its own .group
          wrapper regardless of which Step it belongs to, so `:last-child`
          would zero out every step's padding, not just the final one. */}
      <div className={`lg:hidden flex flex-col items-center ${isLast ? "pb-0" : "pb-10"}`}>
        <div className="relative z-20 mb-6">
          <NumberNode
            n={step.n}
            active={active}
            size="sm"
            nodeRef={mobileNodeRef}
          />
        </div>
        <motion.div
          className="relative w-full bg-[#161616] border border-white/5 rounded-2xl p-6 group-hover:border-[#38B685]/40 transition-colors duration-300 overflow-hidden"
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div className="absolute left-0 inset-y-0 w-1 bg-[#38B685] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <StepCardBody step={step} />
        </motion.div>
      </div>

      {/* Desktop: number on the left rail, card indented beside it. */}
      <motion.div
        className={`hidden lg:block relative pl-24 ${isLast ? "pb-0" : "pb-14"}`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, delay: index * 0.05, ease: EASE }}
      >
        <div className="absolute left-0 top-0 z-20">
          <NumberNode
            n={step.n}
            active={active}
            size="lg"
            nodeRef={desktopNodeRef}
          />
        </div>
        <div className="absolute top-8 left-16 w-8 h-px bg-gradient-to-r from-[#38B685]/60 to-transparent" />
        <motion.div
          className="relative bg-[#161616] border border-white/5 rounded-2xl p-10 group-hover:border-[#38B685]/40 transition-colors duration-300 overflow-hidden"
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div className="absolute left-0 inset-y-0 w-1 bg-[#38B685] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <StepCardBody step={step} />
        </motion.div>
      </motion.div>
    </div>
  );
}

// Nodes and rail bars are duplicated for mobile/desktop layouts (number
// above the card vs. beside it) but only one set is ever visible at a
// time via CSS. To keep the scroll-linked "active" detection correct
// regardless of breakpoint, we track both refs per step and, at measure
// time, use whichever one actually has layout (offsetHeight > 0).
type NodePair = { mobile: HTMLDivElement | null; desktop: HTMLDivElement | null };

function visibleEl(pair: NodePair | undefined) {
  if (!pair) return null;
  if (pair.mobile && pair.mobile.offsetHeight > 0) return pair.mobile;
  if (pair.desktop && pair.desktop.offsetHeight > 0) return pair.desktop;
  return null;
}

export function HowItWorks() {
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

  useMotionValueEvent(scrollYProgress, "change", () => {
    const fillEl =
      (fillRefMobile.current?.offsetHeight ?? 0) > 0
        ? fillRefMobile.current
        : fillRefDesktop.current;
    if (!fillEl) return;
    const fillBottom = fillEl.getBoundingClientRect().bottom;
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
      <div className="absolute inset-0 bg-[#08120E]" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[160px] opacity-25"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[500px] rounded-full blur-[150px] opacity-20"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="inline-flex items-center text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4 px-4 py-1.5 rounded-full border border-[#38B685]/40">
            How it works
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
            Builderlab Growth System&trade;
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Installed in 21 days. Built to dominate your industry, double
            your revenue, and earn the kind of trust that compounds.
          </p>
        </motion.div>

        <div ref={railRef} className="relative">
          {/* Desktop rail (left-aligned) */}
          <div className="hidden lg:block absolute left-8 top-6 bottom-6 w-0.5 -translate-x-1/2 rounded-full bg-white/10" />
          <motion.div
            ref={fillRefDesktop}
            className="hidden lg:block absolute left-8 top-6 bottom-6 w-0.5 -translate-x-1/2 rounded-full bg-[#38B685] origin-top shadow-[0_0_14px_rgba(56,182,133,0.7)]"
            style={{ scaleY: fill }}
          />

          {/* Mobile rail (centered, threads behind the stacked cards) */}
          <div className="lg:hidden absolute left-1/2 top-6 bottom-6 w-0.5 -translate-x-1/2 rounded-full bg-white/10" />
          <motion.div
            ref={fillRefMobile}
            className="lg:hidden absolute left-1/2 top-6 bottom-6 w-0.5 -translate-x-1/2 rounded-full bg-[#38B685] origin-top shadow-[0_0_14px_rgba(56,182,133,0.7)]"
            style={{ scaleY: fill }}
          />

          {steps.map((step, i) => (
            <Step
              key={step.n}
              step={step}
              index={i}
              active={i < activeCount}
              isLast={i === steps.length - 1}
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
