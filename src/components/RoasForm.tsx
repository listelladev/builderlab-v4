"use client";

import { useEffect, useRef } from "react";

// ROASForm embed. The vendor ships a snippet that pushes a config object
// onto a global queue and appends its loader to <head> once; the loader
// then renders the form into the container by id.
//
// Wrapped in a component rather than dropped in as raw HTML because Next
// strips inline <script> from server-rendered JSX, and because the effect
// has to re-run the queue push on client-side navigation: the loader is
// only appended the first time, so arriving at /contact from another route
// would otherwise leave an empty container.
const FORM_ID = "a3a840-6e17a2-8ea4b1";
const CONTAINER_ID = `roasform-${FORM_ID}`;
const LOADER_SRC = "https://my.roasform.com/roasform-embed.js";

type RoasFormGlobal = { q: unknown[]; _l?: number };
declare global {
  interface Window {
    ROASForm?: RoasFormGlobal;
  }
}

export function RoasForm() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = window;
    w.ROASForm = w.ROASForm || { q: [] };
    w.ROASForm.q.push({
      formId: FORM_ID,
      mode: "inline",
      inheritBackground: false,
      container: `#${CONTAINER_ID}`,
    });
    if (!w.ROASForm._l) {
      w.ROASForm._l = 1;
      const s = document.createElement("script");
      s.src = LOADER_SRC;
      s.async = true;
      document.head.appendChild(s);
    }
    // The loader injects its own markup into the container; clear it on
    // unmount so a remount (client-side nav back to /contact) starts from
    // an empty host rather than stacking a second copy of the form.
    const host = hostRef.current;
    return () => {
      if (host) host.innerHTML = "";
    };
  }, []);

  return <div ref={hostRef} id={CONTAINER_ID} style={{ width: "100%", height: 600 }} />;
}
