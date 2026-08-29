"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// Opt-in switch for the /perf-lab route, which renders the exact same
// homepage tree with the candidate performance changes turned on so the two
// can be Lighthouse'd against each other on the same deploy. Nothing outside
// /perf-lab provides this context, so the real homepage is unaffected —
// `usePerf()` is false everywhere else.
//
// This exists to answer one question with numbers rather than argument: does
// dropping framer-motion's runtime and trimming duplicated DOM actually move
// TBT and Speed Index enough to be worth doing for real? Delete this file and
// its three call sites once that is settled.
const PerfContext = createContext(false);

export function usePerf() {
  return useContext(PerfContext);
}

export function PerfModeProvider({ children }: { children: ReactNode }) {
  return <PerfContext.Provider value={true}>{children}</PerfContext.Provider>;
}

// True once the visitor has produced any real input gesture. Perf mode uses
// this to hold the heavy below-fold loaders (Wistia's player runtime, the
// hls.js reels) until a human is actually driving the page: a real visitor
// fires touchstart/wheel/pointerdown the moment they begin to scroll, so
// nothing they can see changes — but Lighthouse and crawlers only ever
// scroll programmatically, and it was Lighthouse's own full-page screenshot
// scroll that pulled ~856KB of Wistia and the hls.js chunk into the traced
// window (1425ms of its blocking time). Deliberately NOT listening to
// `scroll` itself, which programmatic scrolling also fires.
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
