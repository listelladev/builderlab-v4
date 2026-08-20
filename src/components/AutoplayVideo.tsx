"use client";

import { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";
import { motion, AnimatePresence } from "framer-motion";

// Vimeo's iframe always letterboxes the video to its native aspect ratio
// inside whatever box it's given, "background" mode only strips chrome
// and autoplays, it does NOT crop to cover. To get true cover-fill (like
// object-fit: cover) we size the iframe to the video's own aspect ratio,
// scaled up until it's the smallest box that still overflows the
// container in both dimensions, then center it and let the container's
// overflow:hidden clip the excess, the same math background-size: cover
// does.
//
// The ResizeObserver below watches the CONTAINER, not the iframe, an
// earlier version watched the iframe's own style changes to reapply this
// and, with several instances mounted on the same page, produced a real
// feedback loop that froze the tab. Observing the container is safe: it
// only fires when the container's own box actually changes size, and
// applyCover never writes to that.
function applyCover(container: HTMLDivElement, videoAspect: number) {
  const iframe = container.querySelector("iframe");
  if (!iframe) return;
  const { clientWidth: cw, clientHeight: ch } = container;
  if (!cw || !ch) return;

  const containerAspect = cw / ch;
  let w: number;
  let h: number;
  if (videoAspect > containerAspect) {
    h = ch;
    w = ch * videoAspect;
  } else {
    w = cw;
    h = cw / videoAspect;
  }

  iframe.style.cssText = `position:absolute;top:50%;left:50%;width:${w}px;height:${h}px;max-width:none;border:0;pointer-events:none;transform:translate(-50%,-50%);`;
}

// Only one of these should ever be audible at once. Unmuting a video
// claims exclusive "audio ownership" module-wide, if another instance
// already holds it, that instance is forced back to muted first, so the
// most recently unmuted video always wins instead of overlapping sound
// with whichever was unmuted before it.
export type AudioOwner = { mute: () => void };
let currentAudioOwner: AudioOwner | null = null;
export function claimAudio(owner: AudioOwner) {
  if (currentAudioOwner && currentAudioOwner !== owner) {
    currentAudioOwner.mute();
  }
  currentAudioOwner = owner;
}
export function releaseAudio(owner: AudioOwner) {
  if (currentAudioOwner === owner) currentAudioOwner = null;
}

// Constructing several Vimeo players at the exact same instant, especially
// ones sharing the same video ID, as several placeholder reels here do,
// can cross-wire their postMessage handshake and leave one stuck blank.
// Deferring construction until each card scrolls into view avoided that,
// but reads as "the videos won't load." Instead, every instance starts
// immediately on mount; only the actual `new Player(...)` call is queued
// through here one at a time, ~150ms apart, imperceptible in aggregate,
// but enough that they never race.
let startQueue: Promise<void> = Promise.resolve();
function queueStart(fn: () => void) {
  startQueue = startQueue.then(
    () =>
      new Promise<void>((resolve) => {
        // If fn() throws (e.g. constructing a Player against a container
        // that's momentarily display:none behind a responsive breakpoint)
        // the try/catch keeps that failure local to this one instance.
        // without it, an uncaught throw here would leave the chain
        // permanently rejected, silently stopping every video queued
        // after it from ever constructing its player at all.
        try {
          fn();
        } catch {
          // swallow, this instance just doesn't get a player
        } finally {
          setTimeout(resolve, 150);
        }
      })
  );
}

export function AutoplayVideo({
  vimeoId,
  mobileHintPosition = "bottom-left",
}: {
  vimeoId: string;
  /** Where the static "Tap for sound" hint sits on mobile, defaults to
   * bottom-left, but cards with their own bottom-anchored caption (like
   * the Creative reels) need it up out of the way instead. */
  mobileHintPosition?: "bottom-left" | "top-right";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [muted, setMuted] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const ownerRef = useRef<AudioOwner>({ mute: () => {} });

  // Set up once on mount rather than during render, the closure doesn't
  // need to change between renders anyway, since playerRef.current and
  // setMuted are both read/called fresh, not captured.
  useEffect(() => {
    ownerRef.current.mute = () => {
      playerRef.current?.setVolume(0).catch(() => {});
      setMuted(true);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const owner = ownerRef.current;
    if (!container) return;
    let cancelled = false;
    let raf = 0;
    let settleTimeouts: number[] = [];
    let videoAspect = 16 / 9;
    const apply = () => applyCover(container, videoAspect);

    window.addEventListener("resize", apply);

    // A ResizeObserver on the CONTAINER (never the iframe) catches every
    // case a one-shot check can miss, e.g. this card sitting inside a
    // horizontal scroller/carousel whose layout settles a beat after
    // mount. It's safe against the feedback loop an earlier version hit:
    // that loop came from observing the iframe itself, which our own
    // writes then re-triggered. Observing the container only fires on
    // its own box size changing, and applyCover never touches that.
    const ro = new ResizeObserver(apply);
    ro.observe(container);

    queueStart(() => {
      if (cancelled) return;

      const player = new Player(container, {
        id: Number(vimeoId),
        autoplay: true,
        muted: true,
        loop: true,
        controls: false,
        background: true,
      });
      playerRef.current = player;

      // Cover-fit as soon as the iframe lands in the DOM, using the 16:9
      // fallback, don't wait on ready(). Applying immediately means this
      // instance is at least correctly covered even if ready() never
      // settles; the block below just refines it once real dimensions
      // (or failure) are known.
      const applyAsSoonAsMounted = () => {
        if (cancelled) return;
        if (container.querySelector("iframe")) {
          apply();
        } else {
          raf = requestAnimationFrame(applyAsSoonAsMounted);
        }
      };
      applyAsSoonAsMounted();

      // Belt-and-braces: reapply a few more times over the next second.
      // Covers the case where the very first measurement landed on a
      // container whose layout (width/height from a flex/scroll-snap
      // ancestor) hadn't fully settled yet, the ResizeObserver above
      // should already catch that, but this costs nothing and guarantees
      // it self-heals even if a particular browser doesn't fire it.
      settleTimeouts = [100, 300, 600, 1000].map((ms) =>
        window.setTimeout(apply, ms)
      );

      player
        .ready()
        .then(async () => {
          if (cancelled) return;
          try {
            const [w, h] = await Promise.all([
              player.getVideoWidth(),
              player.getVideoHeight(),
            ]);
            if (w && h) videoAspect = w / h;
          } catch {
            // fall back to the 16:9 default
          }
          if (cancelled) return;
          apply();
        })
        .catch(() => {
          // A player destroyed before it finished readying (e.g. React
          // Strict Mode's dev-only double-mount, or a postMessage handshake
          // that never resolved) rejects with "Unknown player. Probably
          // unloaded.", the immediate 16:9 cover-fit above already
          // covers this case, so there's nothing further to size.
        });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      settleTimeouts.forEach(window.clearTimeout);
      ro.disconnect();
      window.removeEventListener("resize", apply);
      releaseAudio(owner);
      playerRef.current?.destroy().catch(() => {});
    };
  }, [vimeoId]);

  const handleClick = () => {
    const player = playerRef.current;
    if (!player) return;
    // Update immediately so the click always feels like it did something
    //, the Vimeo API calls below are best-effort and fired without
    // blocking on them, since an unresolved postMessage handshake (the
    // same one that can leave sizing unset) would otherwise silently
    // swallow an awaited call and the button would look dead.
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (nextMuted) {
      player.setVolume(0).catch(() => {});
      releaseAudio(ownerRef.current);
    } else {
      // The background-mode player is already autoplaying/looping, calling
      // play() again never resolves on this player type, so just unmute
      // and restart the timestamp instead of re-triggering playback.
      player.setVolume(1).catch(() => {});
      player.setCurrentTime(0).catch(() => {});
      // Claim exclusive audio, forces whichever other instance was
      // previously unmuted back to muted, so sound never overlaps.
      claimAudio(ownerRef.current);
    }
  };

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const hintPositionClass =
    mobileHintPosition === "top-right" ? "top-3 right-3" : "bottom-3 left-3";

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      aria-label={muted ? "Click for sound" : "Mute"}
      className="absolute inset-0 w-full h-full cursor-pointer overflow-hidden"
    >
      <div ref={containerRef} className="absolute inset-0 overflow-hidden" />
      {/* Desktop: tooltip trails the cursor on hover. */}
      <AnimatePresence>
        {hovering && muted && (
          <motion.span
            className="hidden sm:flex pointer-events-none absolute z-10 text-white text-xs font-medium bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 items-center gap-1.5 whitespace-nowrap"
            style={{ left: pos.x, top: pos.y }}
            initial={{ opacity: 0, scale: 0.8, x: 16, y: 16 }}
            animate={{ opacity: 1, scale: 1, x: 16, y: 16 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              opacity: { duration: 0.25 },
              scale: { duration: 0.25 },
              x: { type: "spring", stiffness: 150, damping: 20 },
              y: { type: "spring", stiffness: 150, damping: 20 },
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#38B685] animate-pulse" />
            Click for sound
          </motion.span>
        )}
      </AnimatePresence>

      {/* Mobile: no hover, so show a low-opacity static hint on the thumbnail instead. */}
      {muted && (
        <span
          className={`flex sm:hidden pointer-events-none absolute z-10 ${hintPositionClass} opacity-50 text-white text-xs font-medium bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 items-center gap-1.5 whitespace-nowrap`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#38B685] animate-pulse" />
          Tap for sound
        </span>
      )}
    </button>
  );
}
