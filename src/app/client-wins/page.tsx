import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SectionGlow } from "@/components/SectionGlow";
import { ClientWinsGrid } from "@/components/ClientWinsGrid";
import { getClientWins } from "@/lib/client-wins";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Client Wins | Builderlab",
  description:
    "Real testimonials from the custom home builders we've helped grow.",
};

export default async function ClientWinsPage() {
  const wins = await getClientWins();

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
                Client wins
              </span>
              <h1 className="text-[38px]/[1.1] sm:text-4xl lg:text-6xl font-bold text-white mb-6 text-balance">
                Real Builders, Real Results.
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                Trusted by <b className="text-white font-semibold">100+</b>{" "}
                custom home builders. Here&apos;s what they have to say.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="relative pt-8 pb-24 lg:pt-10 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[#08120E]" />
          <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
            <ClientWinsGrid wins={wins} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
