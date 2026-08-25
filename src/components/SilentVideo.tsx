"use client";

import { useEffect, useRef, useState } from "react";

// Plain, ambient background video for a thumbnail: autoplays muted and
// looped with no sound, so unlike AutoplayVideo/BunnyVideo it needs no
// click-to-unmute affordance at all, just native <video> + object-cover.
//
// `eager` skips lazy-loading entirely and starts fetching immediately on
// mount. Pass it for copies that are actually visible in the initial
// viewport — IntersectionObserver's first callback batch, on an element
// whose ancestor has a CSS animation (transform) already running on it,
// doesn't reliably fire until the next forced layout (a click, a scroll,
// a resize). That's what caused cards already on screen at page load to
// sit blank until the visitor interacted with the page: the observer was
// gating perfectly visible elements behind a signal that hadn't fired yet.
// Skipping the observer for those removes that dependency outright.
//
// Non-eager copies (this carousel renders three back-to-back copies of
// every card for the infinite-scroll illusion) still lazy-load on
// intersection — they share the same src as an eager copy elsewhere on the
// page, so by the time a visitor has scrolled the marquee far enough to
// reach one, the browser's HTTP cache almost always already has the bytes
// from the eager copy's fetch, and it loads instantly rather than
// re-downloading.
export function SilentVideo({
  src,
  fallbackSrc,
  label,
  randomizeStart,
  eager,
  poster,
}: {
  src: string;
  /** Optional second <source>, tried if the browser can't play `src`. */
  fallbackSrc?: string;
  /** Accessible name — these carry no visible caption of their own. */
  label?: string;
  /** Jump to a random point in the clip before playing, instead of always
   * starting at 0:00 — so a wall of these autoplaying side by side doesn't
   * read as a dozen copies of the same video all ticking in lockstep. */
  randomizeStart?: boolean;
  /** Skip lazy-loading and start fetching immediately — see file comment. */
  eager?: boolean;
  /** Static frame shown in place of the raw dark background while the
   * (often tens-of-MB) source is still buffering — these clips are full
   * 1080x1920 masters served with no server-side resizing/transcoding, so
   * on a slow connection there can be a real multi-second gap before the
   * first frame paints. A poster fills that gap with something that
   * already looks like the video instead of a blank card. */
  poster?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(!!eager);

  useEffect(() => {
    if (eager) return;
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !visible) return;

    // Capped at 70% of duration, not the full clip — landing a few seconds
    // before the loop point reads as "video is about to end/stutter"
    // rather than genuinely mid-content, and duration isn't known until
    // loadedmetadata fires, so the seek has to happen in that handler
    // rather than synchronously here.
    const onLoadedMetadata = () => {
      if (randomizeStart && el.duration > 0) {
        el.currentTime = Math.random() * el.duration * 0.7;
      }
    };
    if (randomizeStart) {
      el.addEventListener("loadedmetadata", onLoadedMetadata);
    }
    el.load();
    el.play().catch(() => {});
    return () => el.removeEventListener("loadedmetadata", onLoadedMetadata);
  }, [visible, randomizeStart]);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "none"}
      poster={poster}
      aria-label={label}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
    >
      {visible && <source src={src} type="video/mp4" />}
      {visible && fallbackSrc && <source src={fallbackSrc} type="video/mp4" />}
    </video>
  );
}
