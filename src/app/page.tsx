import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CaseStudies } from "@/components/CaseStudies";
import { Creative } from "@/components/Creative";
import { Industries } from "@/components/Industries";
// Old timeline-style "how it works" section — kept as a backup, not
// rendered. Replaced below by GrowthSystem per the client's new brief.
// import { HowItWorks } from "@/components/HowItWorks";
import { GrowthSystem } from "@/components/GrowthSystem";
// "Websites That Convert" slider — hidden per client request, not deleted.
// import { FeaturedWebsites } from "@/components/FeaturedWebsites";
import { Differentiator } from "@/components/Differentiator";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Apply } from "@/components/Apply";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CaseStudies />
        <Creative />
        <Industries />
        <GrowthSystem />
        {/* <FeaturedWebsites /> */}
        <Differentiator />
        <Testimonials />
        <Faq />
        <Apply />
      </main>
      <Footer />
    </>
  );
}
