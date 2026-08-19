import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "../Reveal";
import { SectionGlow } from "../SectionGlow";
import type { CaseStudy } from "@/lib/case-studies";

export function CaseStudyHero({ study }: { study: CaseStudy }) {
  return (
    <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
      <SectionGlow
        positions={[
          "top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] blur-[160px] opacity-30",
        ]}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <Reveal className="mb-8">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-[#38B685] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All case studies
          </Link>
        </Reveal>

        <Reveal delay={0.05} className="max-w-3xl mb-12">
          <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
            {study.industry}
          </span>
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 text-balance leading-tight">
            {study.name}
          </h1>
          <p className="text-lg lg:text-xl text-white/60 leading-relaxed">
            {study.tagline}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="relative aspect-[16/8] rounded-2xl overflow-hidden border border-white/5">
          <Image
            src={study.heroImage}
            alt={study.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </Reveal>
      </div>
    </section>
  );
}
