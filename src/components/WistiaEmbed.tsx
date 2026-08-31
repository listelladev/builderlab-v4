"use client";

import { useEffect, useRef } from "react";

// wistia-player exposes both `poster` (a custom thumbnail image, overriding
// Wistia's own auto-generated video-frame swatch) and `fit-strategy="cover"`
// (crops to fill the box instead of letterboxing/pillarboxing to fit it) as
// first-class attributes — confirmed against the player's own reflected
// properties and its rendered <video>'s computed object-fit, in both the
// poster and the actually-playing state. No shadow-DOM overrides needed,
// and no custom play-button facade either: Wistia's own poster + play
// button already trigger real playback on a single click, so a wrapper
// component with its own play button had to be removed, since clicking it
// only unmounted-and-remounted the player, which put Wistia's play button
// right back where it started instead of starting playback.
// A <video poster> is a plain fetch, so it never goes through next/image
// the way a <Image> would — these posters were being served at their
// full source size (up to 2050px wide) into a card that is 288px on
// mobile and 380px on desktop. Lighthouse costed the largest single one
// at 354KB of waste. Routing them through the optimizer endpoint by hand
// gets the same resize/format negotiation an <Image> would: 1080 is a
// default deviceSize, and still covers the widest card at 3x DPR, so
// nothing is visibly softer.
function optimized(src: string, width = 1080, quality = 75) {
  if (!src.startsWith("/")) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

export function WistiaEmbed({
  mediaId,
  poster,
  autoplay,
}: {
  mediaId: string;
  poster: string;
  /** Set when the player is mounted by a click, so playback starts on the
   * same gesture that mounted it — otherwise the visitor's tap only swaps
   * the facade for the player and they have to press play a second time. */
  autoplay?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  // Playback is started through the player's own API once the custom
  // element has upgraded, rather than with an `autoplay` attribute: the
  // attribute asks for sound-on autoplay, which browsers refuse, and Wistia
  // surfaces that refusal as an uncaught MediaError with no <video> ever
  // created (reproduced in real Chrome, not just headless). Calling play()
  // after the click rides the page's sticky user activation instead, so the
  // single press that mounted the player also starts it.
  useEffect(() => {
    if (!autoplay) return;
    let cancelled = false;
    customElements
      .whenDefined("wistia-player")
      .then(() => {
        if (cancelled) return;
        const el = ref.current as (HTMLElement & { play?: () => void }) | null;
        el?.play?.();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [autoplay]);

  return (
    <wistia-player
      ref={ref}
      media-id={mediaId}
      poster={optimized(poster)}
      fit-strategy="cover"
      aspect="1.7777777777777777"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
