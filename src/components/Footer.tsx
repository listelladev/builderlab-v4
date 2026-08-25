import Image from "next/image";
import Link from "next/link";
import { footerServices, partnerLogos, socialLinks } from "@/lib/data";

// lucide-react dropped brand icons, so these three are plain inline SVGs.
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-8.2h2.75l.41-3.19h-3.16V7.6c0-.92.26-1.55 1.58-1.55h1.68V3.19C15.98 3.13 15.06 3 13.98 3c-2.24 0-3.78 1.37-3.78 3.88v2.73H7.44v3.19h2.76V21h3.3z" />
    </svg>
  );
}
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 8.5H3.56V20.5H6.94V8.5Z" />
      <path d="M5.25 7.06a1.94 1.94 0 1 0 0-3.88 1.94 1.94 0 0 0 0 3.88Z" />
      <path d="M9.75 8.5h3.24v1.64h.05c.45-.85 1.56-1.75 3.22-1.75 3.44 0 4.08 2.27 4.08 5.22v6.89h-3.38v-6.11c0-1.46-.03-3.33-2.03-3.33-2.04 0-2.35 1.59-2.35 3.23v6.21H9.75V8.5Z" />
    </svg>
  );
}
function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12s0-3.2-.41-4.7a2.78 2.78 0 0 0-1.94-1.97C18.13 5 12 5 12 5s-6.13 0-7.65.33a2.78 2.78 0 0 0-1.94 1.97C2 8.8 2 12 2 12s0 3.2.41 4.7a2.78 2.78 0 0 0 1.94 1.97C5.87 19 12 19 12 19s6.13 0 7.65-.33a2.78 2.78 0 0 0 1.94-1.97C22 15.2 22 12 22 12Z" />
      <path d="M10 15.2 15.5 12 10 8.8v6.4Z" fill="#08120E" />
    </svg>
  );
}

const socialIcons = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  LinkedIn: LinkedinIcon,
  YouTube: YoutubeIcon,
};

export function Footer() {
  return (
    <footer className="relative pt-16 pb-8 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[#060A08]" />
        {/* Glow lives behind the menu columns only now, the lower
            wordmark block below gets its own flat solid backdrop so its
            fade-to-transparent gradient dissolves into a uniform color
            instead of the uneven glow bleeding through it. */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] rounded-full blur-[180px] opacity-35"
          style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
        />

        {/* Services pills + partner logos, moved down from the Apply
            section's CTA so they read as part of the footer instead of
            trailing off the bottom of the "Ready to Get More Builds?" card.
            Sits above the wordmark block below (not overlapping it) with
            its own bottom margin doing the separation. */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="-mx-6 sm:hidden relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-r from-[#060A08] to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-l from-[#060A08] to-transparent pointer-events-none" />
            <div className="flex animate-marquee-mobile gap-3 w-max">
              {[...footerServices, ...footerServices, ...footerServices].map((s, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/50 whitespace-nowrap transition-all duration-300 hover:border-[#38B685] hover:text-[#38B685] hover:shadow-[0_0_18px_rgba(56,182,133,0.35)]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden sm:flex flex-wrap justify-center gap-3">
            {footerServices.map((s) => (
              <span
                key={s}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/50 transition-all duration-300 hover:border-[#38B685] hover:text-[#38B685] hover:shadow-[0_0_18px_rgba(56,182,133,0.35)]"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-8">
              Official partners
            </p>
            <div className="group/partners grid grid-cols-2 justify-items-center items-center gap-x-12 gap-y-10 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-10 sm:gap-y-6">
              {partnerLogos.map((p) => (
                <a
                  key={p.alt}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-100 transition-opacity duration-300 group-hover/partners:opacity-40 hover:!opacity-100"
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={p.width}
                    height={p.height}
                    style={{ height: p.displayHeight }}
                    className="w-auto object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Own flat-color block, separate from the glow behind the menu
            columns above, so the wordmark's fade gradient dissolves into
            a uniform backdrop instead of the uneven glow showing through
            it. Desktop: wordmark text only (icon cropped out of the
            source asset — see footer-wordmark.webp), stretched via
            w-full to the same 1200px footprint the icon+text combo used
            to fill, so the lettering reads noticeably larger now that it
            has the icon's former width to itself. Mobile: just the "B"
            mark, large, wordmark reads as a wide strip that mostly
            wastes space on a narrow viewport, the mark alone reads
            better big. Both sit above the menu columns (not overlapping
            them) and are mask-faded top-to-bottom via a mask-image on the
            image itself — true alpha transparency, not a background-color
            overlay trying to color-match whatever's behind it (the glow
            above bleeds unevenly across the width, so a flat-color overlay
            never matched it cleanly at the seam). */}
        <div className="relative mt-6">
          {/* Fades in from transparent rather than a flat rectangle, a
              hard-edged solid block here reads as a visible seam against
              the glow bleeding down from the menu section above it. */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 0px, #060A08 160px)" }}
          />
          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
            {/* Faded via mask-image directly on the image — true alpha
                transparency that dissolves the letters to nothing by ~70%
                down, rather than a background-colored rectangle laid on top
                trying to match whatever's behind it (which never lined up
                cleanly against the uneven glow bleeding down from above). */}
            {/* Same wordmark asset at every breakpoint now — mobile used to
                get just the cropped "B" mark instead, which read as a
                different (smaller, less deliberate) logo treatment than
                desktop rather than the same brand mark scaled down. */}
            <div className="relative pointer-events-none select-none">
              <div className="flex justify-center">
                <Image
                  src="/images/footer-wordmark.webp"
                  alt="Builderlab"
                  width={844}
                  height={289}
                  className="w-full max-w-[1200px] h-auto opacity-[0.08] brightness-0 invert"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 0%, black 30%, transparent 70%)",
                    maskImage:
                      "linear-gradient(to bottom, black 0%, black 30%, transparent 70%)",
                  }}
                />
              </div>
            </div>

            <p className="-mt-6 lg:-mt-28 text-center text-sm sm:text-base text-white leading-relaxed max-w-md mx-auto">
              Where home builders thrive.
            </p>

            <div className="border-t border-white/10 mt-8" />

            {/* Three-column grid rather than flex justify-between: with two
                unequal-width siblings (copyright text vs. terms/privacy
                links), a flex row centers nothing — it only pushes the
                icons toward whichever side has less content. A dedicated
                center column keeps the icon cluster genuinely centered on
                the section regardless of how wide the text on either side
                is. Mobile stacks all three, icons still first for visual
                priority, each centered on its own row. */}
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-5 pt-6 pb-2">
              <p className="text-sm text-white/40 text-center md:text-left order-2 md:order-1">
                © {new Date().getFullYear()} Builderlab. All rights reserved.
              </p>
              <div className="flex items-center justify-center gap-3 order-1 md:order-2">
                {socialLinks.map((s) => {
                  const Icon = socialIcons[s.label as keyof typeof socialIcons];
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="w-9 h-9 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-[#38B685]/60 hover:bg-[#38B685]/10 hover:-translate-y-0.5 flex items-center justify-center transition-all duration-300"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
              <div className="flex items-center justify-center md:justify-end gap-4 order-3">
                <Link
                  href="/terms-conditions"
                  className="text-xs text-white/30 hover:text-white/50 transition-colors"
                >
                  Terms
                </Link>
                <Link
                  href="/privacy-policy"
                  className="text-xs text-white/30 hover:text-white/50 transition-colors"
                >
                  Privacy
                </Link>
              </div>
            </div>
          </div>
        </div>
    </footer>
  );
}
