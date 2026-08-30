import { builderTypes } from "@/lib/data";
import { Reveal, StaggerGroup, StaggerItem } from "./Reveal";

export function Industries() {
  return (
    <section id="capabilities" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#08120E]" />
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[160px] opacity-30"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-25"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[150px] opacity-15"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <Reveal className="max-w-3xl mx-auto mb-16 text-center">
          <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
            Who this is for
          </span>
          <h2 className="text-[32px]/[1.15] sm:text-4xl lg:text-5xl font-medium text-white mb-6 text-balance">
            We Partner With Established Builders Ready To Grow.
          </h2>
          <p className="text-base sm:text-lg text-white/60 leading-relaxed">
            Your clients don&apos;t decide to build a home overnight. They
            don&apos;t impulse buy. They research. They compare. They ask
            around. And they choose the builder they trust most. We make
            sure that builder is you.
          </p>
        </Reveal>

        <StaggerGroup className="relative grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden">
          {/* One shared animated layer spanning every cell, on mobile the
              cells themselves are transparent, so this reads as a single
              continuous gradient flowing behind the whole stack rather than
              six separate animations resetting independently. */}
          <div className="sm:hidden absolute inset-0 z-0 animate-gradient-flow pointer-events-none" />
          {builderTypes.map((ind) => (
            <StaggerItem key={ind.num}>
              <div className="relative z-10 bg-transparent sm:bg-[#0D1814] p-8 lg:p-10 hover:bg-[#15241E] transition-colors duration-700 ease-out group cursor-default h-full border-b border-white/10 last:border-b-0 sm:border-b-0 text-center">
                <span className="text-[#38B685] text-sm font-mono mb-4 block">
                  {ind.num}
                </span>
                <h3 className="text-xl lg:text-2xl font-medium text-white group-hover:text-[#38B685] transition-colors duration-700 ease-out">
                  {ind.name}
                </h3>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
