import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CaseStudy } from "@/lib/case-studies";

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="group relative block aspect-[4/5] bg-[#161616] border border-white/5 hover:border-[#38B685]/40 rounded-2xl overflow-hidden transition-colors duration-700 ease-out"
    >
      {/* Image: sized to fill the whole card at all times so it never
          re-crops mid-hover, only the visible portion is masked with
          clip-path, which animates as a single compositor-driven property.
          That's what keeps the reveal to one continuous motion instead of
          the two-stage stutter a layout-based height transition produced. */}
      <div className="absolute inset-0 overflow-hidden [clip-path:inset(0_0_32%_0)] group-hover:[clip-path:inset(0_0_0%_0)] transition-[clip-path] duration-700 ease-out">
        <Image
          src={study.heroImage}
          alt={study.name}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
      </div>

      <span className="absolute top-4 left-4 z-10 text-xs font-semibold uppercase tracking-wider text-white/80 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
        {study.industry}
      </span>

      {/* Scrim: invisible at rest (the panel below is already solid), fades
          in with the image growth so the overlaid text stays legible. */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none" />

      <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
        <h3 className="text-xl lg:text-2xl font-bold text-white group-hover:text-[#38B685] transition-colors duration-700 ease-out mb-3">
          {study.name}
        </h3>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#38B685] group-hover:text-white transition-colors duration-700 ease-out">
          View case study
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500 ease-out" />
        </span>
      </div>
    </Link>
  );
}
