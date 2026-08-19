import { ArrowRight, Check, X } from "lucide-react";
import { comparisonRows } from "@/lib/data";
import { Reveal } from "./Reveal";
import { Logo } from "./Logo";

export function Differentiator() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 bg-[#08120E]" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full blur-[150px] opacity-30"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />

      <div className="relative max-w-[1100px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-16">
          <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
            Why Builderlab
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white text-balance">
            Not all growth partners are built the same.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Reveal className="bg-gradient-to-br from-[#153F3A] to-[#0F1712] border border-[#38B685]/30 rounded-2xl p-8 lg:p-10 transition-transform duration-300 hover:-translate-y-1">
            <Logo className="h-8" />
            <div className="h-px bg-[#38B685]/20 my-6" />
            <ul className="space-y-4">
              {comparisonRows.builderlab.map((row) => (
                <li key={row} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#38B685] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#08120E]" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-white/80">{row}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="bg-[#161616] border border-white/5 rounded-2xl p-8 lg:p-10 transition-transform duration-300 hover:-translate-y-1">
            <span className="text-2xl font-bold tracking-tight text-white/40">
              Other agencies
            </span>
            <div className="h-px bg-white/10 my-6" />
            <ul className="space-y-4">
              {comparisonRows.others.map((row) => (
                <li key={row} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-white/40" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-white/40">{row}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="text-center">
          <a
            href="/contact"
            className="group inline-flex items-center gap-2 bg-white text-black px-7 py-4 rounded-full text-base font-semibold hover:scale-[1.03] transition-transform duration-500 ease-out shadow-[0_0_40px_rgba(56,182,133,0.35)]"
          >
            Book My Free Strategy Call
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500 ease-out" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
