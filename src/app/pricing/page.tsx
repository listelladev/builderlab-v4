import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SectionGlow } from "@/components/SectionGlow";
import { Faq } from "@/components/Faq";
import { Apply } from "@/components/Apply";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { getPricingFaqs } from "@/lib/faqs";

const TITLE = "Pricing | Builderlab";
const DESCRIPTION =
  "Accelerate is our core growth system for custom home builders. Add SEO & AI Search Ranking, or a custom Website Build. See exactly what's included and what it costs.";

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
                Pricing
              </span>
              <h1 className="text-[38px]/[1.1] sm:text-4xl lg:text-6xl font-medium text-white mb-6 text-balance">
                Your investment, laid out.
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed text-balance">
                One core offer, two add-ons, and no guessing. See what&apos;s
                included and what it costs.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="relative pt-10 pb-24 lg:pt-14 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[#08120E]" />
          <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-10">
            <PricingPlans />
          </div>
        </section>

        <Faq
          items={faqs}
          id="pricing-faqs"
          eyebrow="FAQs"
          heading="Pricing Questions."
        />
        <Apply />
      </main>
      <Footer />
    </>
  );
}
