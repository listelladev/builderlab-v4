"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, X } from "lucide-react";
import { accelerateLite, afterProgram } from "@/lib/pricing";

const EASE = [0.21, 0.5, 0.28, 1] as const;

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

// "Not ready for the full investment?": a deliberately quiet text link under
// the Accelerate card's in-house dropdown. It opens the downsell package so
// it can be pulled up on a sales call without competing with the main offer.
// Open state is owned by the parent so it shares the one-open-at-a-time rule
// with the in-house dropdowns.
export function DownsellDropdown({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const lite = accelerateLite;
  const savings = lite.monthly * 6 - lite.payInFull;

  return (
    <div>
      <div className="flex justify-center">
        <button
          type="button"
          aria-expanded={open}
          onClick={onToggle}
          className="group inline-flex items-center gap-1.5 py-1 text-sm text-white/45 hover:text-white/80 transition-colors"
        >
          <span className="underline decoration-white/20 underline-offset-4 group-hover:decoration-white/50">
            Not ready for the full investment?
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="flex"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pt-5">
              <div className="rounded-xl border border-white/10 bg-black/20 p-5 sm:p-7">
                <div className="text-center">
                  <h4 className="text-2xl sm:text-3xl font-medium text-white">
                    {lite.name}
                  </h4>
                  <span className="mt-3 inline-flex px-3 py-1 rounded-full border border-[#38B685]/40 bg-[#38B685]/10 text-[11px] font-semibold uppercase tracking-wider text-[#38B685]">
                    {lite.badge}
                  </span>
                  <p className="mt-3 text-sm text-white/50 max-w-md mx-auto leading-relaxed text-balance">
                    {lite.intro}
                  </p>
                </div>

                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                      Monthly
                    </p>
                    <p className="mt-3 flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-medium text-white tracking-tight tabular-nums">
                        {money(lite.monthly)}
                      </span>
                      <span className="text-sm text-white/50">/mo</span>
                    </p>
                    <p className="mt-1.5 text-xs text-white/40">6-month program</p>
                  </div>
                  <div className="rounded-xl border border-[#38B685]/40 bg-[#38B685]/[0.08] p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#38B685]">
                        Pay In Full
                      </p>
                      <span className="inline-flex px-2.5 py-0.5 rounded-full border border-[#38B685]/40 text-[11px] font-semibold uppercase tracking-wider text-[#38B685]">
                        Save {money(savings)}
                      </span>
                    </div>
                    <p className="mt-3 text-3xl sm:text-4xl font-medium text-white tracking-tight tabular-nums">
                      {money(lite.payInFull)}
                    </p>
                    <p className="mt-1.5 text-xs text-white/40">All 6 months, paid upfront</p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-white/40 text-center">{afterProgram}</p>

                <div className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
                      Included
                    </p>
                    <ul className="space-y-2.5">
                      {lite.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#38B685]/15 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-[#38B685]" strokeWidth={3} />
                          </span>
                          <span className="text-sm text-white/80 leading-5">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="sm:border-l sm:border-white/10 sm:pl-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
                      Not included
                    </p>
                    <ul className="space-y-2.5">
                      {lite.notIncluded.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                            <X className="w-3 h-3 text-white/40" strokeWidth={3} />
                          </span>
                          <span className="text-sm text-white/35 leading-5">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
