import Image from "next/image";
import { marqueeLogos } from "@/lib/data";

export function MarqueeLogos() {
  return (
    <div className="relative z-10 w-full mt-6 sm:mt-16 overflow-x-hidden group">
      <div className="flex items-center animate-marquee gap-16 w-max py-4 group-hover:[animation-play-state:paused]">
        {[...marqueeLogos, ...marqueeLogos].map((logo, i) => (
          <div
            key={i}
            className="flex items-center justify-center shrink-0 opacity-20 hover:opacity-50 transition-opacity"
            style={{ height: 86 }}
          >
            <Image
              src={logo.src}
              alt=""
              width={280}
              height={logo.height}
              style={{ height: logo.height }}
              // Eager, not the default lazy: every logo starts off to the
              // right of the viewport in the scrolling track, so a lazy
              // loader treats it as off-screen and only fetches it once the
              // marquee has carried it into view — each one then pops in on
              // arrival instead of the strip reading as one continuous loop.
              // Seven small files, ~100KB in total; well worth loading up
              // front.
              loading="eager"
              // The tint classes are CSS filters, and the mobile rendering
              // profile in globals.css zeroes filters below 1024px — which
              // left these logos rendering in their source colours (dark on
              // dark). The `logo-tint-*` classes re-apply them there; they
              // are small images, nothing like the full-page glow layers
              // that profile exists to cut.
              className={`w-auto object-contain ${
                logo.filter === "detail"
                  ? "grayscale invert logo-tint-detail"
                  : "brightness-0 invert logo-tint-flat"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
