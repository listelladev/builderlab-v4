import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WebsiteCard } from "@/components/WebsiteCard";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/Reveal";
import { SectionGlow } from "@/components/SectionGlow";
import { featuredWebsites } from "@/lib/data";

export const metadata: Metadata = {
  title: "Websites | Builderlab",
  description:
    "High-converting websites we've designed and built for custom home builders.",
};

export default function WebsitesPage() {
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
                Websites
              </span>
              <h1 className="text-[38px]/[1.1] sm:text-4xl lg:text-6xl font-medium text-white mb-6 text-balance">
                Websites that convert.
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                A look at the sites we&apos;ve designed and built for custom home
                builders.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="relative pt-8 pb-24 lg:pt-10 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[#08120E]" />
          <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
            <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredWebsites.map((site) => (
                <StaggerItem key={site.url}>
                  <WebsiteCard site={site} />
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
