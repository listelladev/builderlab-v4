import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { navLinks, socialLinks } from "@/lib/data";
import { Logo } from "./Logo";

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
        <div className="absolute inset-0 bg-[#08120E]" />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] rounded-full blur-[180px] opacity-35"
          style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
        />
        {/* Desktop: full wordmark. Mobile: just the "B" mark, large, same
            4% opacity, wordmark reads as a wide strip that mostly wastes
            space on a narrow viewport, the mark alone reads better big. */}
        <div className="hidden lg:flex absolute inset-x-0 bottom-0 justify-center pointer-events-none select-none">
          <Image
            src="/images/footer-logo.webp"
            alt="Builderlab"
            width={1200}
            height={289}
            className="w-full max-w-[1200px] h-auto opacity-[0.04] brightness-0 invert"
          />
        </div>
        <div className="lg:hidden absolute inset-x-0 bottom-0 flex justify-end pointer-events-none select-none overflow-hidden">
          <Image
            src="/images/builderlab-mark.png"
            alt=""
            width={278}
            height={249}
            className="w-[100vw] max-w-none h-auto opacity-[0.04] brightness-0 invert translate-x-[15%]"
          />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] gap-x-8 gap-y-12 lg:gap-12 pb-12 border-b border-white/10">
            <div className="col-span-2 lg:col-span-1">
              <Logo />
              <p className="text-sm text-white/50 leading-relaxed max-w-[320px] mt-5 mb-7">
                We help custom home builders grow with marketing built
                specifically for the way homeowners search for, vet, and hire
                a builder.
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 bg-white hover:bg-[#38B685] text-black hover:text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-500 ease-out mb-7"
              >
                Schedule a call
                <span className="w-5 h-5 rounded-full bg-black group-hover:bg-white flex items-center justify-center group-hover:translate-x-1 transition-all duration-500 ease-out">
                  <ArrowRight className="w-3 h-3 text-white group-hover:text-[#38B685] transition-colors duration-500 ease-out" />
                </span>
              </Link>
              <div className="flex items-center gap-3">
                {socialLinks.map((s) => {
                  const Icon = socialIcons[s.label as keyof typeof socialIcons];
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="w-9 h-9 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/40 flex items-center justify-center transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-5">
                Company
              </h4>
              <ul className="space-y-3">
                {navLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-5">
                Connect with us
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:hello@builderlab.com"
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    hello@builderlab.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+18882440728"
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    +1 (888) 244-0728
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-6">
            <p className="text-sm text-white/40 text-left">
              © {new Date().getFullYear()} Builderlab. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
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
    </footer>
  );
}
