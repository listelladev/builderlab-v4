"use client";

import { motion } from "framer-motion";

// Pill-style single-choice control. The green thumb is one shared element
// (`layoutId`) that slides between options rather than each option fading its
// own background, which is what makes switching feel physical.
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  layoutId,
  label,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  layoutId: string;
  label: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex max-w-full p-1 rounded-full bg-white/5 border border-white/10"
    >
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.id)}
            className={`relative rounded-full px-4 sm:px-6 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
              active ? "text-[#08120E]" : "text-white/60 hover:text-white"
            }`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-[#38B685]"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
