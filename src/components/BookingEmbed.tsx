"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

// LeadConnector booking calendar. form_embed.js listens for the iframe's
// resize messages and sets its height.
//
// The iframe is cross-origin, so the browser paints an empty box first and
// the widget's own app renders a beat after the document loads. To avoid
// that pop-in, the iframe stays invisible over a black placeholder (the
// widget's own background) and fades in once it has loaded; the placeholder
// fades out with it, since the widget leaves a transparent margin under its
// card. The fallback timer covers the case where the load event fires
// before hydration and React never sees it.
const CALENDAR_ID = "8Ft7wtCJn6cnlLlSWj9M";
// Give the widget's app a moment to render after its document loads.
const RENDER_DELAY_MS = 350;
const FALLBACK_MS = 4000;

export function BookingEmbed() {
  const [ready, setReady] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const fallback = window.setTimeout(() => setReady(true), FALLBACK_MS);
    return () => {
      window.clearTimeout(fallback);
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className="relative" style={{ minHeight: 670 }}>
      <div
        aria-hidden
        className={`absolute inset-0 bg-black flex items-center justify-center transition-opacity duration-500 ${
          ready ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <span className="w-6 h-6 rounded-full border-2 border-white/15 border-t-[#38B685] animate-spin" />
      </div>
      <iframe
        src={`https://api.leadconnectorhq.com/widget/booking/${CALENDAR_ID}`}
        allow="payment"
        onLoad={() => {
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setReady(true), RENDER_DELAY_MS);
        }}
        style={{
          width: "100%",
          border: "none",
          overflow: "hidden",
          minHeight: 670,
          display: "block",
          opacity: ready ? 1 : 0,
          transition: "opacity 600ms cubic-bezier(0.21, 0.5, 0.28, 1)",
        }}
        scrolling="no"
        id={`${CALENDAR_ID}_1793647157514`}
        title="Book a strategy call"
      />
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
    </div>
  );
}
