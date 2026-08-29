import { ArrowRight, Compass, PhoneCall, Search, Star } from "lucide-react";
import { GoogleLogo } from "./GoogleLogo";
import { Reveal } from "./Reveal";

const points = [
  {
    icon: PhoneCall,
    title: "Speak With A Growth Strategist",
    body: "No fluff. No BS. Just a real conversation with someone who understands builders and what it takes to generate a consistently full pipeline.",
  },
  {
    icon: Search,
    title: "Get A Free Strategy & Audit",
    body: "We'll look at your current marketing, bottlenecks, and biggest growth opportunities, then show you where we believe BuilderLab can make the biggest impact.",
  },
  {
    icon: Compass,
    title: "Walk Away With a Clear Plan",
    body: "Whether we work together or not, you'll leave knowing what's holding back your growth, where the opportunities are, and what to do next.",
  },
];

export function Apply() {
  return (
    <section id="apply" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#08120E]" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[150px] opacity-50"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-[500px] h-[400px] rounded-full blur-[140px] opacity-30"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full blur-[160px] opacity-25"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />

      {/* Outer card matches the FAQ section's width above it, but the
          card's actual content (reviews line, headline, point cards,
          button) stays pinned to its original ~522px measure via the
          inner max-w wrapper below, centered with extra breathing room on
          either side rather than stretching to fill the wider card. */}
      <div className="relative z-10 max-w-[900px] mx-auto px-6 lg:px-10">
        <Reveal className="bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-3xl px-8 py-12 sm:px-12 sm:py-16 text-center">
          <div className="max-w-[522px] mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-2.5 mb-6">
              <div className="flex items-center gap-2.5">
                <GoogleLogo />
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
                  ))}
                </div>
              </div>
              <span className="text-sm text-white/70">
                <b className="text-white">35+</b> 5-Star Google Reviews
              </span>
            </div>

            <h2 className="text-[32px]/[1.15] sm:text-4xl lg:text-5xl font-bold text-white mb-10 text-balance">
              Ready To Get More Builds?
            </h2>

            <div className="space-y-4 mb-10">
              {points.map((p) => (
                <div
                  key={p.title}
                  className="flex flex-col items-center text-center gap-3 sm:flex-row sm:items-start sm:text-left sm:gap-4 bg-white/[0.03] border border-white/5 rounded-2xl p-5"
                >
                  <span className="shrink-0 w-10 h-10 rounded-full bg-[#38B685]/15 flex items-center justify-center">
                    <p.icon className="w-5 h-5 text-[#38B685]" />
                  </span>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{p.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://go.builderlab.com/application"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full inline-flex items-center justify-center gap-2 bg-[#38B685] text-black py-5 rounded-full text-lg font-bold hover:scale-[1.02] transition-transform duration-500 ease-out"
            >
              Start My Application
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-500 ease-out" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
