"use client";

import { useState } from "react";
import { Clapperboard, PenLine, Scissors, Smartphone } from "lucide-react";
import { Reveal } from "./Reveal";
import { SilentVideo } from "./SilentVideo";

const BUNNY_BASE = "https://BuilderLab.b-cdn.net/";

// Order matters here — these are 1.mp4 through 12.mp4 on the CDN, and need
// to stay in that exact numeric order (not alphabetical, which would sort
// "10.mp4" before "2.mp4"). Posters are frames pulled locally from each
// clip (ffmpeg, ~2-5s in) since these are raw, un-transcoded masters with
// no server-side thumbnail of their own — see SilentVideo's `poster` prop.
const reels: { src: string; label: string; poster: string }[] = Array.from(
  { length: 12 },
  (_, i) => ({
    src: `${BUNNY_BASE}${i + 1}.mp4`,
    label: `Ad ${i + 1}`,
    poster: `/images/creative-posters/${i + 1}.jpg`,
  }),
);

function ReelCard({
  c,
  widthClassName = "w-[230px] sm:w-[260px]",
  eager,
}: {
  c: (typeof reels)[number];
  widthClassName?: string;
  eager?: boolean;
}) {
  return (
    <div className={`relative shrink-0 ${widthClassName}`}>
      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 bg-[#0D1814]">
        <SilentVideo
          src={c.src}
          label={c.label}
          poster={c.poster}
          randomizeStart
          eager={eager}
        />
      </div>
    </div>
  );
}

// Auto-scrolls just like the desktop marquee, just faster: on a narrow
// viewport only one card is visible at a time (vs. several on desktop), so
// the same duration would read as sluggish. Desktop pauses on :hover, which
// doesn't exist on touch, so here a tap toggles a paused state instead —
// tap once to freeze on the card you want to look at, tap again to resume.
function MobileReels() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="sm:hidden relative" onClick={() => setPaused((p) => !p)}>
      <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-[#08120E] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-[#08120E] to-transparent pointer-events-none" />
      <div
        className="flex animate-marquee-mobile gap-4 w-max"
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {/* Only the first (leftmost, on-screen-at-load) copy is eager — the
            other two exist purely so the marquee has content to scroll into
            once it's been running a while, and share the same src, so by
            the time a visitor scrolls that far the browser's cache already
            has the eager copy's bytes. */}
        {[...reels, ...reels, ...reels].map((r, i) => (
          <ReelCard
            key={i}
            c={r}
            widthClassName="w-[62vw] max-w-[280px]"
            eager={i < reels.length}
          />
        ))}
      </div>
    </div>
  );
}

export function Creative() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden border-y border-white/5">
      {/* Dark charcoal variant: near-black base (vs. the lighter #08120E
          used elsewhere) with a cooler, muted teal-green accent instead of
          the site's usual bright #38B685, so alternating sections read as
          genuinely darker rather than just a repeat of the same glow. The
          base carries a slight green cast rather than true neutral black,
          and a third glow sits off to the side — the original two both sit
          dead center top/bottom, leaving the section's sides flat. */}
      <div className="absolute inset-0 bg-[#060A08]" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-[150px] opacity-20"
        style={{ background: "radial-gradient(ellipse, #2E7D64, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[130px] opacity-15"
        style={{ background: "radial-gradient(ellipse, #2E7D64, transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 right-[8%] -translate-y-1/2 w-[450px] h-[450px] blur-[140px] opacity-[0.08]"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 60%)" }}
      />

      <Reveal className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 text-center mb-14">
        <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
          Our creative
        </span>
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
          Creative That Stops the Scroll.
        </h2>
        <p className="text-lg lg:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
          Disruptive, scroll-stopping ads that build trust. Scripted, edited,
          and produced in-house.
        </p>
      </Reveal>

      <div className="relative z-10 mb-12 sm:mb-0">
        <MobileReels />
      </div>

      <div className="hidden sm:block relative z-10 marquee-pause">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#08120E] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#08120E] to-transparent pointer-events-none" />
        <div className="flex animate-marquee-slow gap-5 w-max">
          {[...reels, ...reels, ...reels].map((r, i) => (
            <ReelCard key={i} c={r} eager={i < reels.length} />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-white/50 mt-12 px-6">
          {[
            { icon: Smartphone, label: "Meta Ads" },
            { icon: PenLine, label: "Scripted" },
            { icon: Scissors, label: "Edited" },
            { icon: Clapperboard, label: "Produced in-house" },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full transition-all duration-300 hover:border-[#38B685]/60 hover:shadow-[0_0_18px_rgba(56,182,133,0.35)]"
            >
              <Icon className="w-4 h-4 text-[#38B685] shrink-0" />
              <span className="whitespace-nowrap">{label}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
