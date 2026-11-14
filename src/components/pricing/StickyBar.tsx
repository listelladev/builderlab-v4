"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// A sticky header row whose rounded top corners square off while it is stuck
// under the site header, and round again once it settles back into place.
// A zero-height sentinel sits where the bar starts; once that scrolls up past
// the header line, the bar is stuck.
export function StickyBar({
  children,
  className = "",
  top = 64,
}: {
  children: ReactNode;
  className?: string;
  /** Height of the fixed site header, in px (Tailwind `top-16`). */
  top?: number;
}) {
  const sentinel = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < top + 1),
      { rootMargin: `-${top + 1}px 0px 0px 0px` },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [top]);

  return (
    <>
      <div ref={sentinel} aria-hidden />
      <div
        style={{ top }}
        className={`sticky transition-[border-radius] duration-300 ease-out ${
          stuck ? "rounded-t-none" : "rounded-t-3xl"
        } ${className}`}
      >
        {children}
      </div>
    </>
  );
}
