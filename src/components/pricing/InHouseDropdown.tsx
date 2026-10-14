"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, Minus, Plus } from "lucide-react";
import { inHouse, type InHouseTab } from "@/lib/pricing";

const EASE = [0.21, 0.5, 0.28, 1] as const;

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

// "What this costs to build in-house": a closed-by-default dropdown that sits
// inside a pricing card. Opened, it lists the hires you would need to replace
// the offer, their total, and what the offer costs instead. Open state is
// owned by the parent so only one dropdown is open at a time.
export function InHouseDropdown({
  offer,
  open,
  onToggle,
}: {
  offer: InHouseTab;
  open: boolean;
  onToggle: () => void;
}) {
  const data = inHouse[offer];
  const total = data.roles.reduce((sum, r) => sum + r.cost, 0);
  const ours = data.ours.amount;
  const saved = total - ours;
  const pct = Math.round((saved / total) * 100);
  const suffix = data.cadence === "mo" ? "/mo" : "";

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3.5 text-left"
      >
        <Lightbulb className="w-4 h-4 shrink-0 text-white/60" />
        <span className="flex-1 text-center text-[12px] sm:text-sm font-semibold text-white min-[360px]:whitespace-nowrap">
          What this costs to build in‑house
        </span>
        <span className="shrink-0 text-[#38B685]">
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 px-4 pt-2 pb-5">
              <ul>
                {data.roles.map((r) => (
                  <li
                    key={r.role}
                    className="flex items-start justify-between gap-4 py-3 border-b border-dashed border-white/10"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-white/80 leading-snug">{r.role}</p>
                      <p className="mt-0.5 text-xs text-white/40 leading-snug">
                        {r.covers}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm text-white tabular-nums">
                      {money(r.cost)}
                      {suffix}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-1 border-t-2 border-[#38B685] pt-3.5 flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-white">
                  Total if hired separately
                </span>
                <span className="text-sm font-semibold text-white tabular-nums">
                  {money(total)}
                  {suffix}
                </span>
              </div>

              <div className="mt-3.5 border-t border-dashed border-[#38B685]/60 pt-3.5 space-y-3">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-white/70">{data.ours.label}</span>
                  <span className="text-white tabular-nums">
                    {money(ours)}
                    {suffix}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-semibold text-[#38B685]">You save</span>
                  <span className="font-semibold text-white tabular-nums text-right">
                    {money(saved)}
                    {suffix} - {pct}% less
                  </span>
                </div>
              </div>

              <p className="mt-4 text-[11px] text-white/30 leading-snug">
                In-house figures are estimates for illustration. Actual costs
                vary by market.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
