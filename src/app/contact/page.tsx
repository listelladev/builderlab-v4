import type { Metadata } from "next";
import { Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SectionGlow } from "@/components/SectionGlow";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Builderlab",
  description:
    "Speak directly with a Growth Strategist. No sales reps, no middlemen, just a clear plan to grow your business.",
};

const points = [
  {
    icon: MessageCircle,
    title: "Speak directly with a Growth Strategist",
    body: "No account managers, no handoffs. You'll talk to the person actually running your account.",
  },
  {
    icon: ShieldCheck,
    title: "Get a free strategy audit",
    body: "We'll review your current marketing, positioning, and growth opportunities, free, no sales pitch.",
  },
  {
    icon: Mail,
    title: "We reply within 24 hours",
    body: "Every enquiry gets a real response, fast. Not an autoresponder and a week of silence.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
          <SectionGlow
            positions={[
              "top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] blur-[160px] opacity-40",
              "bottom-0 left-1/4 w-[500px] h-[400px] blur-[150px] opacity-20",
              "bottom-0 right-1/4 w-[500px] h-[400px] blur-[160px] opacity-20",
            ]}
          />

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <Reveal>
                  <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
                    Get in touch
                  </span>
                  <h1 className="text-[38px]/[1.1] sm:text-4xl lg:text-6xl font-medium text-white mb-6 text-balance">
                    Ready to grow?
                  </h1>
                  <p className="text-base sm:text-lg text-white/60 leading-relaxed max-w-lg">
                    No sales reps. No middlemen. Tell us a bit about your
                    business and we&apos;ll be in touch within 24 hours to
                    schedule your free strategy call.
                  </p>
                </Reveal>

                <div className="mt-12 space-y-6">
                  {points.map((p, i) => (
                    <Reveal key={p.title} delay={0.1 + i * 0.05}>
                      <div className="flex gap-4">
                        <div className="shrink-0 w-11 h-11 rounded-full border border-[#38B685]/40 bg-[#161616] flex items-center justify-center">
                          <p.icon className="w-5 h-5 text-[#38B685]" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium mb-1">
                            {p.title}
                          </h3>
                          <p className="text-sm text-white/50 leading-relaxed">
                            {p.body}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>

                <Reveal delay={0.3} className="mt-12 pt-8 border-t border-white/10">
                  <p className="text-sm text-white/40 mb-1">
                    Prefer email?
                  </p>
                  <a
                    href="mailto:info@builderlab.com"
                    className="text-lg text-white hover:text-[#38B685] transition-colors font-semibold"
                  >
                    info@builderlab.com
                  </a>
                </Reveal>
              </div>

              <Reveal delay={0.15}>
                <div className="bg-[#161616] border border-white/5 rounded-2xl p-8 lg:p-10">
                  <ContactForm />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
