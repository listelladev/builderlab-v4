import { Target, Megaphone, LayoutTemplate, Database, type LucideIcon } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "../Reveal";
import type { CaseStudyWork } from "@/lib/case-studies";

const ICONS: LucideIcon[] = [Target, Megaphone, LayoutTemplate, Database];

export function CaseStudyWhatWeDid({ items }: { items: CaseStudyWork[] }) {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 bg-[#08120E]" />
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <Reveal className="max-w-2xl mb-14">
          <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
            What we did
          </span>
          <h2 className="text-[32px]/[1.15] sm:text-4xl lg:text-5xl font-semibold sm:font-bold text-white text-balance">
            The System We Installed.
          </h2>
        </Reveal>

        <div className="relative">
          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {items.map((item, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <StaggerItem key={item.title}>
                  <div className="group h-full bg-transparent border border-white/10 hover:border-[#38B685]/40 rounded-2xl p-8 transition-colors duration-500">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="shrink-0 w-11 h-11 rounded-lg bg-[#38B685]/10 border border-[#38B685]/20 flex items-center justify-center group-hover:bg-[#38B685]/20 transition-colors duration-500">
                        <Icon className="w-5 h-5 text-[#38B685]" />
                      </div>
                      <h3 className="text-lg font-bold text-white transition-[font-size] duration-300 ease-out group-hover:text-[22px]">
                        {item.title}
                      </h3>
                    </div>
                    <div className="h-px bg-white/10 mb-6" />
                    <p className="text-sm text-white/60 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="h-px bg-white/10 mt-6" />
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>

          {/* Desktop only: a badge sitting on the seam where all four cards
              meet, tying the 2x2 grid together as one connected system. */}
          <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-20 h-20 rounded-full bg-[#0D1814] border border-white/10 items-center justify-center">
            {/* Rendered as a mask rather than <Image> so the mark fills with
                the site's exact brand green, regardless of the source
                PNG's own pixel color. */}
            <div
              className="w-9 h-9 bg-[#38B685]"
              style={{
                WebkitMaskImage: "url(/images/builderlab-mark.png)",
                maskImage: "url(/images/builderlab-mark.png)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
