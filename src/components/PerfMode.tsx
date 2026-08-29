"use client";

import { createContext, useContext, type ReactNode } from "react";

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
