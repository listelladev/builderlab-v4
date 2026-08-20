import type { LegalDoc } from "@/lib/legal";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SectionGlow } from "./SectionGlow";

export function LegalContent({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <Header />
      <main>
        <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
          <SectionGlow
            positions={[
              "top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] blur-[160px] opacity-25",
              "bottom-0 right-1/4 w-[500px] h-[400px] blur-[150px] opacity-20",
            ]}
          />
          {/* No scroll-triggered Reveal here: a document this long would
              need ~20% of its own (huge) height inside the viewport before
              the fade-in ever fires, which server-renders as invisible
              (opacity: 0 is in the initial HTML) and stays that way for
              most of the scroll, reading as a blank/slow-loading page. */}
          <div className="relative z-10 max-w-[805px] mx-auto px-6 lg:px-0 text-left">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 text-balance">
              {doc.title}
            </h1>
            <p className="text-sm text-white/40 mb-14">
              Effective Date: {doc.effectiveDate}
              <br />
              Company: {doc.company}
              <br />
              Contact: {doc.contact}
            </p>

            <p className="text-white/60 leading-relaxed mb-4">{doc.intro}</p>

            {doc.blocks.map((block, i) => {
              if (block.type === "heading") {
                return (
                  <h2
                    key={i}
                    className="text-2xl font-bold text-white mt-12 mb-4"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "subheading") {
                return (
                  <h3
                    key={i}
                    className="text-lg font-semibold text-white mt-6 mb-2"
                  >
                    {block.text}
                  </h3>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={i} className="mb-4 space-y-2">
                    {block.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-white/60 leading-relaxed"
                      >
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#38B685] mt-2.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="text-white/60 leading-relaxed mb-4">
                  {block.text}
                </p>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
