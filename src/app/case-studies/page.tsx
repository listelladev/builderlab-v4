import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/Reveal";
import { SectionGlow } from "@/components/SectionGlow";
import { caseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case Studies | Builderlab",
  description:
    "Real results from the custom home builders we've helped grow. See how we've turned referral-only builders into predictable growth engines.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
          <SectionGlow
            positions={[
              "top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] blur-[160px] opacity-30",
            ]}
          />
          <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
            <Reveal>
              <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
                Case studies
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 text-balance">
                What happens when we plug in.
              </h1>
              <p className="text-lg lg:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                Real custom home builders, real numbers. Here&apos;s what the
                Builderlab Growth System looks like once it&apos;s actually
                installed.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="relative pt-8 pb-24 lg:pt-10 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[#08120E]" />
          <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
            <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies.map((study) => (
                <StaggerItem key={study.slug}>
                  <CaseStudyCard study={study} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
