"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Play, Search, Smartphone } from "lucide-react";
import { Reveal } from "./Reveal";
import { AutoplayVideo } from "./AutoplayVideo";

const reels: {
  image: string;
  label: string;
  platform: "Meta Ads" | "Google Ads";
  hook: string;
  vimeoId?: string;
}[] = [
  {
    image: "/images/case-nhfa.png",
    label: "NHFA",
    platform: "Meta Ads",
    hook: "Get certified in 12 months",
    vimeoId: "1205386331",
  },
  {
    image: "/images/case-insight.png",
    label: "Insight Blinds",
    platform: "Meta Ads",
    hook: "Premium shutters, installed",
  },
  {
    image: "/images/case-toptier.png",
    label: "Mat's Doors",
    platform: "Google Ads",
    hook: "Doors built to last",
    vimeoId: "1205386331",
  },
  {
    image: "/images/case-concrete.png",
    label: "Iconic Concrete",
    platform: "Meta Ads",
    hook: "From cracked to flawless",
  },
  {
    image: "/images/case-mowman.png",
    label: "Local Mow Man",
    platform: "Google Ads",
    hook: "Lawns done right",
    vimeoId: "1205386331",
  },
];

function ReelCard({
  c,
  withVideo,
  widthClassName = "w-[230px] sm:w-[260px]",
}: {
  c: (typeof reels)[number];
  withVideo?: boolean;
  widthClassName?: string;
}) {
  const showVideo = withVideo && c.vimeoId;
  return (
    <div className={`relative shrink-0 ${widthClassName} group`}>
      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 bg-[#0D1814]">
        {showVideo ? (
          <AutoplayVideo vimeoId={c.vimeoId!} mobileHintPosition="top-right" />
        ) : (
          <Image
            src={c.image}
            alt={c.label}
            fill
            className="object-cover"
            sizes="260px"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1 pointer-events-none">
          {c.platform === "Meta Ads" ? (
            <Smartphone className="w-3 h-3 text-[#38B685]" />
          ) : (
            <Search className="w-3 h-3 text-[#38B685]" />
          )}
          <span className="text-[11px] font-semibold text-white/90">
            {c.platform}
          </span>
        </div>
        {!showVideo && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#38B685]/20 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 p-3 pointer-events-none">
          <p className="text-xs text-[#38B685] font-semibold mb-0.5">
            {c.label}
          </p>
          <p className="text-sm font-semibold text-white leading-tight">
            {c.hook}
          </p>
        </div>
      </div>
    </div>
  );
}

// The auto-scrolling marquee is a nice showcase on desktop, but on mobile
// there's no way to pause it to actually look at one, a swipe still has
// to fight the animation. So mobile gets its own controlled, one-at-a-time
// carousel instead: real (not tripled) list, native scroll-snap, plus tap
// arrows, no auto-play.
function MobileReels() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-reel]") as HTMLElement | null;
    if (!card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0");
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: "smooth" });
  };

  return (
    <div className="sm:hidden">
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 scrollbar-hide"
      >
        {reels.map((r, i) => (
          <div key={i} data-reel className="snap-center shrink-0 w-[78vw] max-w-[320px]">
            <ReelCard c={r} withVideo widthClassName="w-full" />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-3 mt-6">
        <button
          onClick={() => scroll(-1)}
          aria-label="Previous"
          className="w-11 h-11 rounded-full border border-white/10 text-white/70 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Next"
          className="w-11 h-11 rounded-full border border-white/10 text-white/70 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function Creative() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 bg-[#08120E]" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-[150px] opacity-45"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[130px] opacity-30"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />

      <Reveal className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 text-center mb-14">
        <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
          Our creative
        </span>
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
          Creative that stops the scroll.
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
        <div className="flex animate-marquee-slow gap-5 w-max py-2">
          {[...reels, ...reels, ...reels].map((r, i) => (
            <ReelCard key={i} c={r} withVideo={i < reels.length} />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="flex flex-wrap justify-center gap-3 text-sm text-white/50 mt-12 px-6">
          <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full transition-all duration-300 hover:border-[#38B685]/60 hover:shadow-[0_0_18px_rgba(56,182,133,0.35)]">
            <Smartphone className="w-4 h-4 text-[#38B685]" /> Meta Ads
          </span>
          <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full transition-all duration-300 hover:border-[#38B685]/60 hover:shadow-[0_0_18px_rgba(56,182,133,0.35)]">
            <Search className="w-4 h-4 text-[#38B685]" /> Google Ads
          </span>
          <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full transition-all duration-300 hover:border-[#38B685]/60 hover:shadow-[0_0_18px_rgba(56,182,133,0.35)]">
            <Play className="w-4 h-4 text-[#38B685]" /> Scripted, edited &amp;
            produced in-house
          </span>
        </div>
      </div>
    </section>
  );
}
