"use client";

import { useState, useSyncExternalStore } from "react";
import { Clapperboard, PenLine, Scissors, Smartphone } from "lucide-react";
import { GridOverlay } from "./GridOverlay";
import { Reveal } from "./Reveal";
import { SilentVideo } from "./SilentVideo";

// Bunny Stream library 736885 ("BuilderLab"). These used to be raw,
// un-transcoded masters served straight off a storage zone
// (BuilderLab.b-cdn.net/1.mp4 .. 12.mp4) — 1.1GB total, fetched in full by
// every visitor. They're now Stream-encoded HLS assets instead, ~180MB
// combined across every generated rendition, delivered adaptively.
//
// GUIDs are the video IDs Stream assigned on upload; order here just keeps
// the numbering matching each video's "Ad N" title in the library, not
// anything the player depends on. Posters are still frames pulled locally
// from each original clip (ffmpeg, ~2-5s in), kept separate from Stream's
// own auto-generated thumbnails — see SilentVideo's `poster` prop.
const STREAM_CDN = "https://vz-8f67defd-6ab.b-cdn.net";
const REEL_GUIDS = [
  "fbe44624-8f14-4f20-9646-1d540e5110b6", // Ad 1
  "aa82e2b5-6b94-4ddc-befb-09b8735439df", // Ad 2
  "51dd2b32-40a9-4319-95ce-2ebc77c3810c", // Ad 3
  "842f2212-5ee5-4798-9794-d480d88ed916", // Ad 4
  "c7daaec1-7f8f-4271-a159-434e315db420", // Ad 5
  "20712420-15e0-4d1d-97a1-1729372ec9fd", // Ad 6
  "381cb534-83fc-405f-9eff-cac17eb1e7ff", // Ad 7
  "62b53079-fdc1-47eb-b49c-14218ce8b2ed", // Ad 8
  "f80ac889-5094-4e8d-b60e-efe831d834e5", // Ad 9
  "e335e09b-49ac-4335-bcf9-b0c4d1cfdbac", // Ad 10
  "ffd52111-f848-42a1-91cb-105d9a559758", // Ad 11
  "32adff00-140a-4b81-945a-31cab60eda2d", // Ad 12
];

const reels: { src: string; label: string; poster: string }[] = REEL_GUIDS.map(
  (guid, i) => ({
    src: `${STREAM_CDN}/${guid}/playlist.m3u8`,
    label: `Ad ${i + 1}`,
    poster: `/images/creative-posters/${i + 1}.jpg`,
  }),
);

function ReelCard({ c }: { c: (typeof reels)[number] }) {
  return (
    <div className="relative shrink-0 w-[62vw] max-w-[280px] sm:w-[230px] md:w-[260px]">
      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 bg-[#0D1814]">
        <SilentVideo
          src={c.src}
          label={c.label}
          poster={c.poster}
          randomizeStart
        />
      </div>
    </div>
  );
}

// One marquee, sized and paced by CSS at each breakpoint, rather than two
// separate mobile/desktop trees.
//
// Rendering both meant every card existed twice in the DOM, and a
// breakpoint-hidden card is not a free card: `display: none` stops it
// painting, but it does not stop the component mounting, and it does not
// exempt a <video> from either preload or playback. So the hidden layout
// was quietly fetching and decoding its own full set of clips alongside
// the visible one — double the network, double the video decode, for a set
// of frames that could never appear on screen.
//
// Pause behaviour is keyed to input type, not viewport width: pointers get
// :hover (pure CSS, in globals.css, behind `@media (hover: hover)`), touch
// gets tap-to-toggle. The `(hover: hover)` guard matters — on iOS a tap
// leaves a sticky :hover on whatever it landed on, which would otherwise
// freeze the marquee with no obvious way to start it again.
const HOVERLESS = "(hover: none)";

// matchMedia is an external store, so it's read through
// useSyncExternalStore rather than copied into state from an effect: that
// version re-renders once after mount for no reason and trips
// react-hooks/set-state-in-effect. getServerSnapshot returns false so the
// server render and the hydrating client render agree, and the value only
// decides whether an onClick handler is attached — there is nothing to
// flash or reflow if it resolves differently a tick later.
function useTapToPause() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(HOVERLESS);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(HOVERLESS).matches,
    () => false,
  );
}

function Reels() {
  const [paused, setPaused] = useState(false);
  const tapToPause = useTapToPause();

  return (
    <div
      className="relative z-10 mb-12 sm:mb-0 marquee-pause"
      onClick={tapToPause ? () => setPaused((p) => !p) : undefined}
    >
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 z-10 bg-gradient-to-r from-[#08120E] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 z-10 bg-gradient-to-l from-[#08120E] to-transparent pointer-events-none" />
      <div
        className="flex animate-marquee-slow gap-4 sm:gap-5 w-max"
        // Set only when actually paused: an inline `running` would outrank
        // the :hover rule in globals.css and kill hover-to-pause outright.
        style={paused ? { animationPlayState: "paused" } : undefined}
      >
        {[...reels, ...reels, ...reels].map((r, i) => (
          <ReelCard key={i} c={r} />
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
      <GridOverlay />

      <Reveal className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 text-center mb-14">
        <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
          Our creative
        </span>
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
          Creative That Stops The Scroll.
        </h2>
        <p className="text-lg lg:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
          Disruptive ads engineered to earn attention and trust. Scripted, edited,
          and produced in-house.
        </p>
      </Reveal>

      <Reels />

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
