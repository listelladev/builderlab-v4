"use client";

import type HlsJs from "hls.js";
import { useEffect, useRef, useState } from "react";
import { useFirstInteraction } from "./PerfMode";

// How far outside the viewport a card starts fetching and playing. Small
// enough that a wall of these isn't decoding a screenful of frames nobody
// can see, large enough that a card is already running by the time it
// scrolls in, rather than popping from poster to video in front of you.
const MARGIN_PX = 300;

// Plain, ambient background video for a thumbnail: autoplays muted and
// looped with no sound, so unlike a real player it needs no click-to-unmute
// affordance at all, just native <video> + object-cover.
//
// Two things this component owns, both of which used to be handled badly:
//
// 1. WHEN TO FETCH. Gating loads on IntersectionObserver alone left cards
//    that were already on screen at page load sitting blank until the
//    visitor interacted with the page — the observer's first callback
//    batch, on an element whose ancestor has a CSS animation (transform)
//    already running on it, doesn't reliably fire until the next forced
//    layout (a click, a scroll, a resize). The workaround for that was an
//    `eager` prop, set on every copy in the initial viewport, which
//    skipped the observer entirely. But the marquee renders three copies
//    of all twelve cards, so "every copy in the initial viewport" meant a
//    dozen full-resolution clips fetching and decoding at once on load,
//    including ones parked well off the side of the screen.
//
//    Reading the element's own rect synchronously on mount answers "am I
//    visible right now?" directly, with no dependence on a callback that
//    may not have fired, and leaves the observer to handle only what it is
//    genuinely good at: later scrolling. The rect check doubles as a
//    display:none test — an element in a breakpoint-hidden subtree
//    measures 0x0, so it never loads at all.
//
// 2. WHEN TO STOP. Playback used to start and then never stop, so every
//    video that had ever been on screen kept decoding for the rest of the
//    session. Scrolling past a wall of these left the CPU and GPU working
//    on frames nobody could see for as long as the tab stayed open. The
//    observer now pauses on exit and resumes on re-entry.
export function SilentVideo({
  src,
  label,
  randomizeStart,
  poster,
}: {
  /** HLS playlist URL (Bunny Stream serves .m3u8, not a plain file). */
  src: string;
  /** Accessible name — these carry no visible caption of their own. */
  label?: string;
  /** Jump to a random point in the clip before playing, instead of always
   * starting at 0:00 — so a wall of these autoplaying side by side doesn't
   * read as a dozen copies of the same video all ticking in lockstep. */
  randomizeStart?: boolean;
  /** Static frame shown in place of the raw dark background while the
   * source is still buffering, so there's something that already looks
   * like the video instead of a blank card. */
  poster?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<HlsJs | null>(null);
  // Every clip (and the hls.js chunk the non-iOS path pulls) holds until the
  // visitor has actually touched the page — same reasoning as the Wistia
  // hold in CaseStudies: a human scrolling here has always gestured first,
  // so they see identical behavior; a gesture-less programmatic scroll
  // stays on the posters.
  const ready = useFirstInteraction();
  const [active, setActive] = useState(false);
  // Live in-view state, kept in a ref rather than state because the load
  // effect below has to read it at the moment it runs, not at the moment it
  // was scheduled — see the note there.
  const inView = useRef(false);
  // Whether the randomized seek has already been applied to this element.
  // Without this, every pause/resume cycle would re-seek and the clip would
  // visibly jump to a different moment each time the card scrolled back in.
  const seeked = useRef(false);

  // Initial visibility, measured off layout rather than waited for — note 1.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const onScreen =
      r.width > 0 &&
      r.height > 0 &&
      r.top < window.innerHeight + MARGIN_PX &&
      r.bottom > -MARGIN_PX &&
      r.left < window.innerWidth + MARGIN_PX &&
      r.right > -MARGIN_PX;
    if (onScreen) {
      inView.current = true;
      setActive(true);
    }
  }, []);

  // Start on approach, pause on exit — notes 1 and 2. On a card that hasn't
  // loaded yet, play()/pause() here are no-ops on a source-less element;
  // the effect below does the real work once `active` has flipped.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          setActive(true);
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: `${MARGIN_PX}px` },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The actual attach-and-play only happens once `active` flips, so this
  // cannot run any earlier than the commit that first sets it.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !active || !ready) return;

    // Capped at 70% of duration, not the full clip — landing a few seconds
    // before the loop point reads as "video is about to end/stutter"
    // rather than genuinely mid-content, and duration isn't known until
    // loadedmetadata fires, so the seek has to happen in that handler
    // rather than synchronously here.
    const onLoadedMetadata = () => {
      if (randomizeStart && !seeked.current && el.duration > 0) {
        seeked.current = true;
        el.currentTime = Math.random() * el.duration * 0.7;
      }
    };
    el.addEventListener("loadedmetadata", onLoadedMetadata);

    // Bunny Stream serves an HLS playlist, not a single playable file — a
    // plain <source src> can't demux that. Safari/iOS play .m3u8 natively
    // off `src`, so they're left alone; everywhere else needs hls.js to
    // pull the segments in and feed them to the element via MediaSource.
    // `cancelled` guards the dynamic import below: a card can scroll out
    // and unmount while the hls.js chunk is still in flight, and attaching a
    // player to a detached element leaks a decoder that nothing will pause.
    let cancelled = false;
    if (el.canPlayType("application/vnd.apple.mpegurl")) {
      el.src = src;
    } else {
      // Imported here rather than at module scope so the ~600KB hls.js
      // bundle is fetched only by browsers that actually need it, and only
      // once a card is genuinely in view — it used to be part of the
      // homepage's initial JS for every visitor, iOS included, where it is
      // dead weight because the branch above handles playback natively.
      import("hls.js").then(({ default: Hls }) => {
        if (cancelled || !Hls.isSupported()) return;
        // Resolution is already decided by `src` (callers point at one
        // rendition playlist, not the master — see Creative.tsx), because
        // iOS takes the native branch above and never reaches this code
        // at all, so a player-side level cap would fix nothing where it
        // actually matters. What is left to tune is buffering: these are
        // ambient loops that pause the moment they leave the viewport, so
        // the default runway buffers far more of each clip than a passing
        // card ever plays.
        const hls = new Hls({ maxBufferLength: 10, backBufferLength: 10 });
        hls.attachMedia(el);
        hls.loadSource(src);
        hlsRef.current = hls;
      });
    }

    // Guarded on still-being-in-view, because activation and exit can
    // interleave: a card that enters and leaves during one fast scroll gets
    // its observer entry (setActive) and its observer exit (pause) both
    // before React commits and runs this effect. An unconditional play()
    // here would then restart a video the observer had already stopped,
    // and nothing would ever pause it again — leaving it decoding
    // off-screen for the rest of the session, which is the exact failure
    // this component exists to prevent.
    if (inView.current) el.play().catch(() => {});
    return () => {
      cancelled = true;
      el.removeEventListener("loadedmetadata", onLoadedMetadata);
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [active, ready, randomizeStart, src]);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload={active && ready ? "auto" : "none"}
      poster={poster}
      aria-label={label}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
    />
  );
}
