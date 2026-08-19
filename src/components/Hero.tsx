"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { GoogleLogo } from "./GoogleLogo";
import { MarqueeLogos } from "./MarqueeLogos";

const EASE = [0.21, 0.5, 0.28, 1] as const;

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-10%] left-[-12%] w-[800px] h-[640px] rounded-full blur-[120px] opacity-[0.16]"
          style={{
            background:
              "radial-gradient(ellipse at center, #38B685, transparent 80%)",
          }}
        />
        <div
          className="absolute top-[22%] right-[-12%] w-[800px] h-[640px] rounded-full blur-[120px] opacity-[0.16]"
          style={{
            background:
              "radial-gradient(ellipse at center, #38B685, transparent 80%)",
          }}
        />
        <div
          className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 w-[170%] max-w-[2000px] h-[50vh] rounded-full blur-[130px] opacity-[0.14]"
          style={{
            background:
              "radial-gradient(ellipse at center, #38B685, transparent 80%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center flex flex-col items-center">
        <motion.div
          className="inline-flex items-center gap-2.5 bg-[#161616] border border-white/10 rounded-full px-4 py-2 mb-10 backdrop-blur-sm"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <GoogleLogo />
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
            ))}
          </div>
          <span className="text-sm text-white/80">
            <b className="text-white">53+</b> 5-Star Google Reviews
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.06] tracking-tight text-balance"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
        >
          The growth partner for{" "}
          <em className="not-italic text-[#38B685]">
            high-value service businesses.
          </em>
        </motion.h1>

        <motion.p
          className="mt-8 text-lg lg:text-xl text-white/65 max-w-xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
        >
          We craft <b className="text-white font-semibold">scroll-stopping ads</b>.
          Drive demand on <b className="text-white font-semibold">Meta Ads</b>.
          Capture intent on <b className="text-white font-semibold">Google Ads</b>.
          Build pages that convert. And deliver leads your sales team will love.
        </motion.p>

        <motion.a
          href="/contact"
          className="group mt-12 inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full text-base font-semibold hover:scale-[1.03] transition-transform duration-500 ease-out shadow-[0_0_50px_rgba(56,182,133,0.25)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
        >
          Book My Free Strategy Call
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500 ease-out" />
        </motion.a>

        <motion.p
          className="mt-14 text-xs uppercase tracking-[0.25em] text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Trusted by <b className="text-white/60">100+</b> custom home builders
        </motion.p>
      </div>

      <MarqueeLogos />
    </section>
  );
}
