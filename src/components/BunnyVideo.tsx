"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { claimAudio, releaseAudio, type AudioOwner } from "./AutoplayVideo";

// Bunny.net serves plain mp4 files, so unlike the Vimeo-backed
// AutoplayVideo this needs none of that component's iframe cover-fit
// math, native <video> + object-cover already does that. It shares the
// same module-level "only one video audible at once" audio ownership so
// unmuting a Bunny reel also silences any Vimeo player elsewhere on the
// page, and vice versa.
export function BunnyVideo({
  src,
  mobileHintPosition = "bottom-left",
}: {
  src: string;
  mobileHintPosition?: "bottom-left" | "top-right";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const ownerRef = useRef<AudioOwner>({ mute: () => {} });

  useEffect(() => {
    ownerRef.current.mute = () => {
      const v = videoRef.current;
      if (v) v.muted = true;
      setMuted(true);
    };
  }, []);

  useEffect(() => {
    const owner = ownerRef.current;
    return () => releaseAudio(owner);
  }, []);

  const handleClick = () => {
    const v = videoRef.current;
    if (!v) return;
    const nextMuted = !muted;
    setMuted(nextMuted);
    v.muted = nextMuted;
    if (nextMuted) {
      releaseAudio(ownerRef.current);
    } else {
      v.currentTime = 0;
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
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
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

      {/* Once unmuted, a low-opacity "mute" hint fades in at the top-right
          corner (both breakpoints) so it's clear a second click/tap turns
          the sound back off. */}
      <AnimatePresence>
        {!muted && (
          <motion.span
            className="pointer-events-none absolute z-10 top-3 right-3 text-white text-xs font-medium bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="hidden sm:inline">Click to mute</span>
            <span className="sm:hidden">Tap to mute</span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
