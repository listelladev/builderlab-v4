import Image from "next/image";
import { Reveal } from "../Reveal";
import { SectionGlow } from "../SectionGlow";

export function CaseStudyResults({
  results,
  image,
  name,
}: {
  results: string;
  image: string;
  name: string;
}) {
  return (
    <section className="relative py-14 lg:py-20 overflow-hidden">
      <SectionGlow
        positions={[
          "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] blur-[160px] opacity-25",
        ]}
      />
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <Reveal className="bg-[#0D1814] border border-white/5 rounded-2xl overflow-hidden grid lg:grid-cols-2 lg:min-h-[630px]">
          <div className="relative aspect-[4/3] lg:aspect-auto h-full">
            <Image
              src={image}
              alt={`${name} results`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="p-8 lg:p-10 flex flex-col justify-center">
            <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
              The impact
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
              What Changed.
            </h2>
            <p className="text-lg text-white/60 leading-relaxed">{results}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
