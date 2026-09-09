"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { FeaturedWebsite } from "@/lib/data";

// Landscape image card: no under-card text, no corner tag, no image zoom on
// hover. Instead a "View website" pill trails the cursor across the card,
// eased so it lags a beat behind the pointer.
export function WebsiteCard({ site }: { site: FeaturedWebsite }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Soft spring = the "lagging behind" follow. Low stiffness / higher mass
  // so the pill eases toward the pointer rather than snapping to it.
  const springX = useSpring(x, { stiffness: 140, damping: 20, mass: 0.7 });
  const springY = useSpring(y, { stiffness: 140, damping: 20, mass: 0.7 });

  function handleMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }

  function handleEnter(e: React.MouseEvent) {
    // Seed the position before showing, so it doesn't fly in from the
    // corner on the first frame.
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    }
    setHovered(true);
  }

  return (
    <a
      ref={ref}
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setHovered(false)}
      className="group relative block aspect-[16/10] overflow-hidden rounded-2xl border border-white/5 bg-[#161616]"
    >
      <Image
        src={site.image}
        alt={site.name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />

      {/* Dark gradient rising from the bottom so the name stays legible. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

      <h3 className="absolute bottom-0 left-0 p-6 lg:p-7 text-xl lg:text-2xl font-medium text-white text-balance">
        {site.name}
      </h3>

      {/* Cursor-trailing label. Outer element carries the framer transform
          (moves to the pointer); inner span centres itself on that point. */}
      <motion.span
        aria-hidden
        style={{ x: springX, y: springY }}
        className="pointer-events-none absolute left-0 top-0 z-10"
      >
        <span
          className={`-translate-x-1/2 -translate-y-1/2 block whitespace-nowrap text-xs font-semibold text-white transition-opacity duration-300 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          View website
        </span>
      </motion.span>
    </a>
  );
}
