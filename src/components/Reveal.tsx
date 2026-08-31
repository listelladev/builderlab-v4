"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// CSS + IntersectionObserver reveals, as a progressive enhancement.
//
// The previous version server-rendered every wrapper at opacity 0 and
// relied on hydration + an observer callback to fade it in. On a desktop
// that window is imperceptible; on a real phone over cellular, hydrating
// the whole page takes long enough that a visitor who scrolls immediately
// sees blank containers popping in late — which reads as the page loading
// "blocky", and never reproduces in emulation because the host CPU
// hydrates too fast.
//
// So the SSR'd page is now fully visible with no classes applied. Once JS
// is running, each wrapper measures itself: only if it is still entirely
// below the viewport does it arm (hide) and register the observer that
// fades it in on entry — hiding something off-screen is invisible by
// definition. Anything already on screen, or reached before hydration,
// simply stays visible with no animation. The animation values themselves
// are unchanged (20% trigger, 24px rise, 0.7s, same easing, 0.12s
// stagger); styles live in globals.css (.rv-armed / .rv-group / .rv-item).
function useRevealOnce<T extends HTMLElement>(amount = 0.2) {
  const ref = useRef<T>(null);
  const [armed, setArmed] = useState(false);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Arm only what the visitor cannot currently see. A wrapper partially
    // on screen (or scrolled past before hydration) stays static — hiding
    // it now would be a visible flash.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setArmed(true);
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
  return { ref, armed, inView };
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
  const { ref, armed, inView } = useRevealOnce<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`${armed ? "rv-armed" : ""} ${inView ? "rv-in" : ""} ${className}`}
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
  const { ref, armed, inView } = useRevealOnce<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`rv-group ${armed ? "rv-armed" : ""} ${inView ? "rv-in" : ""} ${className}`}
    >
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
  // Hidden only while the parent group is armed; the per-item delay comes
  // from a :nth-child rule on the parent, so call sites need no changes.
  return <div className={`rv-item ${className}`}>{children}</div>;
}
