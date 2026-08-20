import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CaseStudies } from "@/components/CaseStudies";
import { Creative } from "@/components/Creative";
import { Industries } from "@/components/Industries";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturedWebsites } from "@/components/FeaturedWebsites";
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
        <HowItWorks />
        <FeaturedWebsites />
        <Differentiator />
        <Testimonials />
        <Faq />
        <Apply />
      </main>
      <Footer />
    </>
  );
}
