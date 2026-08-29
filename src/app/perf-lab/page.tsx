import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CaseStudies } from "@/components/CaseStudies";
import { Creative } from "@/components/Creative";
import { Industries } from "@/components/Industries";
import { GrowthSystem } from "@/components/GrowthSystem";
import { Differentiator } from "@/components/Differentiator";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Apply } from "@/components/Apply";
import { Footer } from "@/components/Footer";
import { PerfModeProvider } from "@/components/PerfMode";

// Hidden A/B twin of the homepage, used to measure candidate performance
// changes against the real page on the same deploy rather than guessing at
// them. Identical section tree to app/page.tsx — the only difference is
// PerfModeProvider, which turns on:
//
//   1. CSS + IntersectionObserver reveals instead of framer-motion's
//      whileInView (Reveal.tsx)
//   2. two marquee copies instead of three (Creative.tsx)
//
// A third candidate — one measurement clone per review card instead of two
// — was tried and dropped: deriving the collapsed height instead of laying
// the truncated text out made collapsed cards 320px instead of 311px, so it
// was not the appearance-neutral change it looked like.
//
// noindex/nofollow so it cannot be picked up as duplicate content. Delete
// this route, PerfMode.tsx and the three `usePerf()` call sites once the
// comparison has been made.
export const metadata: Metadata = {
  title: "Perf lab",
  robots: { index: false, follow: false },
};

export default function PerfLab() {
  return (
    <PerfModeProvider>
      <Header />
      <main>
        <Hero />
        <CaseStudies />
        <Creative />
        <Industries />
        <GrowthSystem />
        <Differentiator />
        <Testimonials />
        <Faq />
        <Apply />
      </main>
      <Footer />
    </PerfModeProvider>
  );
}
