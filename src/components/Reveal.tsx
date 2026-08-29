"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// CSS + IntersectionObserver reveals. These replaced framer-motion's
// whileInView wholesale after the /perf-lab A/B: the trigger point (20%
// visible, once), the 24px rise, the 0.7s duration, the easing and the
// 0.12s stagger are the exact values the framer versions used — verified
// header-by-header at a reading-pace scroll before the swap — and dropping
// framer from these wrappers keeps its runtime out of every section that
// only ever needed an entrance fade. The styles live in globals.css
// (.rv / .rv-group / .rv-item).

// Mirrors framer's `viewport={{ once: true, amount: 0.2 }}`: fires at 20%
// visible and then stops observing, so nothing re-animates on the way back
// up.
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

export function StaggerGroup({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref} className={`rv-group ${inView ? "rv-in" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  // The per-item delay comes from a :nth-child rule on the parent rather
  // than an index prop, so call sites need no changes.
  return <div className={`rv-item ${className}`}>{children}</div>;
}
