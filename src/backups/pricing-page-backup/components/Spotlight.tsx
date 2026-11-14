"use client";

import { useRef, type ReactNode } from "react";

// A card surface with a soft green glow that follows the cursor. The glow is
// a single gradient layer driven by two CSS variables, so there is no React
// state or re-render on mouse move. It only exists on hover-capable devices;
// touch screens never fire mousemove and the overlay stays transparent.
export function Spotlight({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`group/spot relative flex flex-col overflow-hidden ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover/spot:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(56,182,133,0.14), transparent 60%)",
        }}
      />
      <div className="relative flex-1 flex flex-col">{children}</div>
    </div>
  );
}
