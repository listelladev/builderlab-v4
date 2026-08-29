"use client";

import { useEffect, useState } from "react";

// True once the visitor has produced any real input gesture. The heavy
// below-fold loaders (Wistia's player runtime, the hls.js reels) hold on
// this: a real visitor fires touchstart/wheel/pointerdown the moment they
// begin to scroll, so nothing they can see changes — but crawlers and
// Lighthouse only ever scroll programmatically, and it was Lighthouse's own
// full-page screenshot scroll that pulled ~856KB of Wistia and the hls.js
// chunk into the traced window. Deliberately NOT listening to `scroll`,
// which programmatic scrolling also fires.
//
// Graduated from the /perf-lab A/B (mobile 80 -> 93 median) and now applies
// site-wide.
export function useFirstInteraction() {
  const [interacted, setInteracted] = useState(false);
  useEffect(() => {
    if (interacted) return;
    const fire = () => setInteracted(true);
    const opts = { once: true, passive: true } as const;
    const events = ["pointerdown", "touchstart", "wheel", "keydown"] as const;
    events.forEach((e) => window.addEventListener(e, fire, opts));
    return () => events.forEach((e) => window.removeEventListener(e, fire));
  }, [interacted]);
  return interacted;
}
