import Image from "next/image";
import { footerServices, partnerLogos } from "@/lib/data";

export function Footer() {
  return (
    <footer className="relative pt-20 pb-8 overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[#08120E]" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[160px] opacity-30"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] rounded-full blur-[180px] opacity-35"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {footerServices.map((s) => (
            <span
              key={s}
              className="text-sm text-white/40 border border-white/5 rounded-full px-4 py-2"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
            Official partners
          </p>
          <div className="group/partners flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
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
                  width={120}
                  height={48}
                  className="h-9 w-auto object-contain"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="relative flex justify-center mb-8 pointer-events-none select-none">
          <Image
            src="/images/footer-logo.webp"
            alt="Builderlab"
            width={1200}
            height={289}
            className="w-full max-w-[1200px] h-auto opacity-[0.08] brightness-0 invert"
          />
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-3 pt-8 border-t border-white/10">
          <p className="text-sm text-white/40 text-center md:text-left">
            © {new Date().getFullYear()} Builderlab. All rights reserved.
          </p>
          <p className="text-sm text-white/40 text-center md:absolute md:left-1/2 md:-translate-x-1/2">
            Growth partner for custom home builders.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-xs text-white/30 hover:text-white/50 transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-xs text-white/30 hover:text-white/50 transition-colors"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
