"use client";

import { useEffect, useRef, useState } from "react";

// Plain, ambient background video for a thumbnail: autoplays muted and
// looped with no sound, so unlike AutoplayVideo/BunnyVideo it needs no
// click-to-unmute affordance at all, just native <video> + object-cover.
//
// Loading is deferred until the card is actually near the viewport. This
// carousel renders three back-to-back copies of every card for the
// infinite-scroll illusion, so without this every instance (including the
// two copies not currently in view) would start fetching and decoding its
// own multi-MB mp4 immediately on mount. `preload="none"` plus a source
// that isn't attached until intersection keeps the two idle copies inert
// until the visitor actually scrolls to them, at which point playback
// starts, instead of showing blank/placeholder video area.
export function SilentVideo({
  src,
  fallbackSrc,
}: {
  src: string;
  /** Optional second <source>, tried if the browser can't play `src`. */
  fallbackSrc?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !visible) return;
    el.load();
    el.play().catch(() => {});
  }, [visible]);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="none"
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
    >
      {visible && <source src={src} type="video/mp4" />}
      {visible && fallbackSrc && <source src={fallbackSrc} type="video/mp4" />}
    </video>
  );
}
