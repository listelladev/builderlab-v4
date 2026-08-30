import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SectionGlow } from "@/components/SectionGlow";
import { TestimonialMedia } from "@/components/TestimonialMedia";
import { CaseStudyHero } from "@/components/case-study/CaseStudyHero";
import { CaseStudyStats } from "@/components/case-study/CaseStudyStats";
import { CaseStudyAbout } from "@/components/case-study/CaseStudyAbout";
import { CaseStudyWhatWeDid } from "@/components/case-study/CaseStudyWhatWeDid";
import { CaseStudyResults } from "@/components/case-study/CaseStudyResults";
import { caseStudies, getCaseStudy } from "@/lib/case-studies";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: `${study.name} | Case Studies | Builderlab`,
    description: study.tagline,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <>
      <Header />
      <main>
        <CaseStudyHero study={study} />
        <CaseStudyStats stats={study.stats} />
        <CaseStudyAbout name={study.name} about={study.about} />
        <CaseStudyWhatWeDid items={study.whatWeDid} />
        <CaseStudyResults
          results={study.results}
          image={study.resultsImage}
          name={study.name}
        />

        <section className="relative py-20 lg:py-28 overflow-hidden border-t border-white/5">
          <div className="absolute inset-0 bg-[#08120E]" />
          <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
            <TestimonialMedia
              image={study.resultsImage}
              quote={study.testimonial.quote}
              name={study.testimonial.name}
              role={study.testimonial.role}
            />
          </div>
        </section>

        <section className="relative py-20 lg:py-28 overflow-hidden">
          <SectionGlow
            positions={[
              "top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] blur-[160px] opacity-40",
            ]}
          />
          <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
            <Reveal>
              <h2 className="text-4xl lg:text-5xl font-medium text-white mb-6 text-balance">
                Ready for Results Like These?
              </h2>
              <a
                href="/contact"
                className="group inline-flex items-center gap-2 bg-white text-black px-7 py-4 rounded-full text-base font-semibold hover:scale-[1.03] transition-transform duration-500 ease-out shadow-[0_0_40px_rgba(56,182,133,0.25)]"
              >
                Book My Free Strategy Call
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500 ease-out" />
              </a>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
