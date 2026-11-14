import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SectionGlow } from "@/components/SectionGlow";
import { Faq } from "@/components/Faq";
import { Apply } from "@/components/Apply";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { CompareTable } from "@/components/pricing/CompareTable";
import { Star } from "lucide-react";
import { getPricingFaqs } from "@/lib/faqs";

const TITLE = "Pricing | Builderlab";
const DESCRIPTION =
  "BuilderLab programs and pricing for custom home builders. Core, Scale and Elite growth programs, plus website and video add-ons.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/pricing",
    siteName: "Builderlab",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// Pricing FAQs are CMS-managed; re-fetch at most once a minute.
export const revalidate = 60;

export default async function PricingPage() {
  const faqs = await getPricingFaqs();

  return (
    <>
      <Header />
      <main>
        <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16 overflow-hidden">
          <SectionGlow
            positions={[
              "top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] blur-[160px] opacity-30",
            ]}
          />
          <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
            <Reveal>
              <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
                Programs &amp; Pricing
              </span>
              <h1 className="text-[38px]/[1.1] sm:text-4xl lg:text-6xl font-medium text-white mb-6 text-balance">
                Three ways to grow.
                <br />
                One goal: more builds.
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed text-balance">
                Clear, upfront pricing with no hidden fees or surprises. Whether
                you&apos;re building your first few homes or leading your market,
                there&apos;s a program built for where you are today.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="#packages"
                  className="inline-flex items-center justify-center bg-white text-black px-7 py-4 rounded-full text-base font-semibold hover:scale-[1.03] transition-transform duration-500 ease-out shadow-[0_0_40px_rgba(56,182,133,0.35)]"
                >
                  See the programs
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center border border-white/15 text-white px-7 py-4 rounded-full text-base font-semibold hover:border-white/40 hover:scale-[1.03] transition-[transform,border-color] duration-500 ease-out"
                >
                  Book My Free Strategy Call
                </a>
              </div>
              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-2.5 text-sm text-white/70">
                <span className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
                  ))}
                </span>
                <span>
                  <b className="text-white">35+</b> 5-Star Google Reviews · Trusted by{" "}
                  <b className="text-white">70+</b> home builders
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        <div className="relative">
          <div className="absolute inset-0 bg-[#08120E]" />
          <PricingPlans />
          <CompareTable />
        </div>

        <Faq
          items={faqs}
          id="pricing-faqs"
          eyebrow="Common questions"
          heading="Before you book a call."
        />
        <Apply
          eyebrow="Last step"
          subtext="Talk with a Growth Strategist. We'll look at your market and show you which program fits."
        />
      </main>
      <Footer />
    </>
  );
}
