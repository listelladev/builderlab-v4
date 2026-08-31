import Image from "next/image";
import type { CaseStudy } from "@/lib/case-studies";

// Detail pages still exist and will be relinked once their content is
// updated — for now the collection cards render as plain, non-clickable
// panels (no <Link>, no "View case study" CTA).
export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <div className="group relative block aspect-[4/5] bg-[#161616] border border-white/5 rounded-2xl overflow-hidden transition-colors duration-700 ease-out">
      {/* Image: height-animated (not clip-path) so object-cover recomputes
          its crop for the frame's actual current size, at rest that's the
          56% visible frame, composed properly for that shape, rather than
          the crop for a full-height image with the bottom portion just
          masked off, which reads as over-zoomed. */}
      <div className="absolute inset-x-0 top-0 h-[56%] group-hover:h-full overflow-hidden transition-[height] duration-700 ease-out">
        <Image
          src={study.heroImage}
          alt={study.name}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
      </div>

      <span className="absolute top-4 left-4 z-10 text-xs font-semibold uppercase tracking-wider text-white/80 bg-black/50 backdrop-blur-sm max-lg:backdrop-blur-none px-3 py-1.5 rounded-full">
        {study.industry}
      </span>

      {/* Scrim: invisible at rest (the panel below is already solid), fades
          in with the image growth so the overlaid text stays legible. */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none" />

      <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
        <h3 className="text-xl lg:text-2xl font-medium text-white group-hover:text-[#38B685] transition-colors duration-700 ease-out mb-3">
          {study.name}
        </h3>
        <ul className="mb-4 space-y-1.5">
          {study.highlights.map((h) => (
            <li
              key={h}
              className="flex items-center gap-2 text-sm text-white/70 whitespace-nowrap overflow-hidden text-ellipsis"
            >
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#38B685]" />
              <span className="overflow-hidden text-ellipsis">{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
