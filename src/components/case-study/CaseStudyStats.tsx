import { Reveal, StaggerGroup, StaggerItem } from "../Reveal";
import { CountUp } from "../CountUp";
import { SectionGlow } from "../SectionGlow";
import type { CaseStudyStat } from "@/lib/case-studies";

export function CaseStudyStats({ stats }: { stats: CaseStudyStat[] }) {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden border-y border-white/5">
      <SectionGlow
        positions={[
          "top-0 right-0 w-[600px] h-[600px] blur-[160px] opacity-30",
          "bottom-0 left-0 w-[500px] h-[500px] blur-[150px] opacity-25",
          "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] blur-[150px] opacity-15",
        ]}
      />
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-14">
          <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
            The results
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white text-balance">
            Numbers that speak for themselves.
          </h2>
        </Reveal>

        <StaggerGroup className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="group bg-[#0D1814] hover:bg-[#15241E] transition-colors duration-700 ease-out p-8 lg:p-10 h-full text-center cursor-default">
                <p className="text-4xl lg:text-5xl font-bold text-[#38B685] tabular-nums mb-2 transition-transform duration-700 ease-out group-hover:scale-105">
                  {stat.prefix}
                  <CountUp value={stat.value} />
                  {stat.suffix}
                </p>
                <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors duration-700 ease-out">
                  {stat.label}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
