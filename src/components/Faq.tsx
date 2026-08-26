"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { faqs } from "@/lib/data";
import { Reveal } from "./Reveal";

function FaqItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: { q: string; a: string | string[] };
  isOpen: boolean;
  onToggle: () => void;
}) {
  const paragraphs = Array.isArray(faq.a) ? faq.a : [faq.a];
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="text-lg font-semibold text-white group-hover:text-[#38B685] transition-colors">
          {faq.q}
        </span>
        <span
          className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-300 ${
            isOpen
              ? "bg-[#38B685] border-[#38B685] text-[#08120E]"
              : "border-white/10 text-white/60"
          }`}
        >
          {isOpen ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[1000px] pb-5" : "max-h-0"
        }`}
      >
        <div className="space-y-3 pr-12">
          {paragraphs.map((p) => (
            <p key={p} className="text-white/60 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState(-1);

  return (
    <section id="faqs" className="relative py-24 lg:py-32 overflow-hidden scroll-mt-20">
      {/* A hint of green in the base itself (not neutral near-black) plus a
          third, off-center glow — the original two glows both sit dead
          center top/bottom, so most of the section's width reads as flat
          color with nothing happening off to the sides. */}
      <div className="absolute inset-0 bg-[#060A08]" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full blur-[150px] opacity-15"
        style={{ background: "radial-gradient(ellipse, #2E7D64, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full blur-[140px] opacity-10"
        style={{ background: "radial-gradient(ellipse, #2E7D64, transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 right-[8%] w-[400px] h-[400px] blur-[130px] opacity-[0.08]"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 60%)" }}
      />
      <div className="relative z-10 max-w-[900px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-14">
          <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
            FAQs
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white text-balance">
            Before You Apply.
          </h2>
        </Reveal>

        <div>
          {faqs.map((faq, i) => (
            <FaqItem
              key={faq.q}
              faq={faq}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
