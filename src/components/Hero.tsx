import type { CSSProperties } from "react";
import { ArrowRight, Star } from "lucide-react";
import { GoogleLogo } from "./GoogleLogo";
import { MarqueeLogos } from "./MarqueeLogos";

// Entrance motion lives in globals.css (.hero-in) rather than framer-motion.
// Every element below used to be a motion.* with `initial={{ opacity: 0 }}`,
// so the hero painted nothing until React had hydrated: Lighthouse measured
// the <h1> as the LCP element at 5.4s on mobile, 4757ms of which was pure
// "render delay" waiting on JavaScript. A CSS animation on server-rendered
// markup starts at first paint instead. Durations, offsets and easings here
// are the exact values the framer transitions used, so the motion is
// unchanged — framer's "easeOut" is cubic-bezier(0,0,.58,1) and its default
// tween ease is cubic-bezier(.42,0,.58,1).
//
// With the motion.* wrappers gone, nothing in this section needs the client,
// so it no longer ships as client JS at all.
const EASE_OUT = "cubic-bezier(0,0,.58,1)";
const EASE_DEFAULT = "cubic-bezier(.42,0,.58,1)";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 sm:pt-36 lg:pt-44 pb-16 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Bright, localised mint pool behind the LEFT portion of the review
            pill. Kept tight and punchy so its falloff edge lands mid-pill —
            that light/dark seam is what the glass picks up and reflects. */}
        <div
          className="absolute top-[3%] left-[32%] -translate-x-1/2 w-[440px] h-[300px] rounded-full blur-[90px] opacity-[0.34]"
          style={{
            background:
              "radial-gradient(ellipse at center, #7FE9C6, transparent 72%)",
          }}
        />
        {/* Soft mid-green just off to the right, a shade deeper — gives the
            right half of the pill a different hue to sit over. */}
        <div
          className="absolute top-[2%] left-[62%] -translate-x-1/2 w-[520px] h-[380px] rounded-full blur-[120px] opacity-[0.13]"
          style={{
            background:
              "radial-gradient(ellipse at center, #2E9E73, transparent 78%)",
          }}
        />
        <div
          className="absolute top-[-16%] left-[-26%] w-[820px] h-[660px] rounded-full blur-[120px] opacity-[0.13]"
          style={{
            background:
              "radial-gradient(ellipse at center, #2E9E73, transparent 80%)",
          }}
        />
        <div
          className="absolute top-[30%] right-[-16%] w-[820px] h-[660px] rounded-full blur-[120px] opacity-[0.14]"
          style={{
            background:
              "radial-gradient(ellipse at center, #2E9E73, transparent 80%)",
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
        <div
          className="hero-in relative inline-flex items-center gap-2.5 rounded-full px-4 py-[11px] mb-10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12),inset_0_1px_0_rgba(255,255,255,0.1),0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden"
          style={
            {
              background:
                "linear-gradient(100deg, rgba(255,255,255,0.08), rgba(255,255,255,0.028))",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              "--hero-from-y": "-16px",
              "--hero-dur": "0.6s",
              "--hero-ease": EASE_OUT,
            } as CSSProperties
          }
        >
          <GoogleLogo />
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-[#FFC107] text-[#FFC107]" />
            ))}
          </div>
          <span className="text-xs sm:text-sm text-white/80">
            <b className="text-white">35+</b> 5-Star Google Reviews
          </span>
        </div>

        <h1
          className="hero-in hero-in-instant text-[38px] sm:text-[58px] lg:text-[76px] font-semibold text-white leading-[1.06] tracking-tight text-balance"
          style={
            {
              "--hero-from-y": "28px",
              "--hero-dur": "0.8s",
              "--hero-delay": "0.1s",
            } as CSSProperties
          }
        >
          The growth partner for custom home builders.
        </h1>

        <p
          className="hero-in mt-8 text-base sm:text-lg lg:text-xl text-white/65 max-w-[748px] leading-relaxed"
          style={
            {
              "--hero-from-y": "20px",
              "--hero-dur": "0.7s",
              "--hero-delay": "0.25s",
            } as CSSProperties
          }
        >
          We craft <b className="text-white font-semibold">scroll-stopping ads</b> proven
          to land projects. Positioning you as the builder everyone recognizes.
          Delivering leads your team will love.
        </p>

        <a
          href="/contact"
          className="hero-in group mt-12 inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full text-base font-semibold hover:scale-[1.03] transition-transform duration-500 ease-out shadow-[0_0_50px_rgba(56,182,133,0.25)]"
          style={
            {
              "--hero-from-y": "20px",
              "--hero-dur": "0.7s",
              "--hero-delay": "0.4s",
            } as CSSProperties
          }
        >
          Book My Free Strategy Call
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500 ease-out" />
        </a>

        <p
          className="hero-in mt-14 text-xs uppercase tracking-[0.15em] sm:tracking-[0.25em] text-white/40 whitespace-nowrap"
          style={
            {
              "--hero-dur": "0.8s",
              "--hero-delay": "0.6s",
              "--hero-ease": EASE_DEFAULT,
            } as CSSProperties
          }
        >
          Trusted By <b className="text-white/60">70+</b> Home Builders
        </p>
      </div>

      <MarqueeLogos />
    </section>
  );
}
