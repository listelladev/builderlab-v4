"use client";

import { motion, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePerf } from "./PerfMode";

const EASE = [0.21, 0.5, 0.28, 1] as const;

// Shared one-shot visibility hook for the CSS variants below. Mirrors
// framer's `viewport={{ once: true, amount: 0.2 }}`: fires at 20% visible and
// then stops observing, so nothing re-animates on the way back up.
function useInViewOnce<T extends HTMLElement>(amount = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: amount },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);
  return { ref, inView };
}

function RevealCss({
  children,
  delay,
  y,
  className,
}: {
  children: ReactNode;
  delay: number;
  y: number;
  className: string;
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`rv ${inView ? "rv-in" : ""} ${className}`}
      style={
        {
          "--rv-y": `${y}px`,
          "--rv-delay": `${delay}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const perf = usePerf();
  if (perf) {
    return (
      <RevealCss delay={delay} y={y} className={className}>
        {children}
      </RevealCss>
    );
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

function StaggerGroupCss({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`rv-group ${inView ? "rv-in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function StaggerGroup({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const perf = usePerf();
  if (perf) {
    return <StaggerGroupCss className={className}>{children}</StaggerGroupCss>;
  }
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const perf = usePerf();
  // The per-item delay comes from a :nth-child rule on the parent rather than
  // an index prop, so this stays a drop-in swap with no call-site changes.
  if (perf) {
    return <div className={`rv-item ${className}`}>{children}</div>;
  }
  return (
    <motion.div className={className} variants={staggerChild}>
      {children}
    </motion.div>
  );
}
