"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { faqs, partnerLogos } from "@/lib/data";
import { Reveal } from "./Reveal";

function FaqItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
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
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-white/60 leading-relaxed pr-12">{faq.a}</p>
      </div>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState(-1);

  return (
    <section id="faqs" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#08120E]" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full blur-[150px] opacity-25"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full blur-[140px] opacity-20"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />
      <div className="relative z-10 max-w-[900px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-14">
          <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
            FAQs
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white text-balance">
            Before you apply.
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

        {/* Lives here, under the last FAQ item, rather than as its own
            section between the Apply CTA and the footer, that spot made its
            spacing depend on two unrelated sections' own padding stacking
            together unevenly. Here it's just one more block inside a
            section with fixed, self-contained spacing. */}
        <div className="mt-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-8">
            Official partners
          </p>
          <div className="group/partners grid grid-cols-2 justify-items-center items-center gap-x-12 gap-y-10 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-10 sm:gap-y-6">
            {partnerLogos.map((p) => (
              <a
                key={p.alt}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-100 transition-opacity duration-300 group-hover/partners:opacity-40 hover:!opacity-100"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  style={{ height: p.displayHeight }}
                  className="w-auto object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
