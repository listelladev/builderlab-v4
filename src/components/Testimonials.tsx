"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, ChevronDown, Star } from "lucide-react";
import { testimonials } from "@/lib/data";
import { Reveal, StaggerGroup, StaggerItem } from "./Reveal";

const VISIBLE_COUNT = 6;

type Testimonial = (typeof testimonials)[number];

function ReviewCard({ r }: { r: Testimonial }) {
  return (
    <div className="group h-full bg-[#0D1814] border border-white/5 rounded-2xl p-6 flex flex-col transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(56,182,133,0.25)]">
      <div className="flex items-center gap-2 mb-4">
        <BadgeCheck className="w-4 h-4 text-[#38B685]" />
        <span className="text-xs text-white/40">Verified</span>
        <div className="flex gap-0.5 ml-auto">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
          ))}
        </div>
      </div>
      <p className="text-white/70 text-sm leading-relaxed flex-1 mb-5">
        &quot;{r.text}&quot;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#38B685]/15 text-[#38B685] text-sm font-bold flex items-center justify-center transition-colors duration-500 group-hover:bg-[#38B685] group-hover:text-[#08120E]">
          {r.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{r.name}</p>
          {r.company && <p className="text-xs text-white/40">{r.company}</p>}
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const [expanded, setExpanded] = useState(false);
  const visible = testimonials.slice(0, VISIBLE_COUNT);
  const rest = testimonials.slice(VISIBLE_COUNT);

  return (
    <section id="reviews" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#08120E]" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[150px] opacity-25"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[600px] h-[500px] rounded-full blur-[160px] opacity-30"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-[500px] h-[400px] rounded-full blur-[150px] opacity-20"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
            What our partners say
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white text-balance mb-4">
            Don&apos;t Take Our Word for It.
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            Real reviews from the custom home builders we&apos;ve helped
            grow. 50+ five-star ratings on Google.
          </p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((t, i) => (
            <StaggerItem key={i}>
              <ReviewCard r={t} />
            </StaggerItem>
          ))}
        </StaggerGroup>

        {rest.length > 0 && (
          <>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-5">
                    {rest.map((t, i) => (
                      <ReviewCard key={i} r={t} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center mt-10">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/25 transition-colors text-sm font-semibold"
              >
                {expanded ? "See less" : "Show more"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
