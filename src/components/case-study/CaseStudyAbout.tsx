import { Reveal } from "../Reveal";

export function CaseStudyAbout({
  name,
  about,
}: {
  name: string;
  about: string;
}) {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[#08120E]" />
      <div className="relative z-10 max-w-[900px] mx-auto px-6 lg:px-10 text-center">
        <Reveal>
          <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
            About {name}
          </span>
          <p className="text-xl lg:text-2xl text-white/80 leading-relaxed text-balance">
            {about}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
