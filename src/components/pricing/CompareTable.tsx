import { Check, Minus } from "lucide-react";
import { compare, plans, type CompareCell } from "@/lib/pricing";
import { StickyBar } from "./StickyBar";

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

// Scale is the featured program; its column is tinted all the way down.
const HI = 1;
const hi = (i: number) => (i === HI ? "bg-[#38B685]/[0.08]" : "");

function Cell({ value }: { value: CompareCell }) {
  if (value === true)
    return (
      <span className="inline-flex w-5 h-5 rounded-full bg-[#38B685]/15 items-center justify-center">
        <Check className="w-3 h-3 text-[#38B685]" strokeWidth={3} />
        <span className="sr-only">Included</span>
      </span>
    );
  if (value === false)
    return (
      <>
        <Minus className="inline w-4 h-4 text-white/25" />
        <span className="sr-only">Not included</span>
      </>
    );
  return <span className="text-white/80">{value}</span>;
}

// Phones: same data, but each feature's label sits on its own line above the
// three values, so all three programs fit on screen without sideways scrolling.
function MobileCompare() {
  const cols = "grid grid-cols-3";
  const valueRow = (cells: CompareCell[]) => (
    <div className={`${cols} mt-2`}>
      {cells.map((c, i) => (
        <div key={i} className={`py-1.5 text-center text-[13px] leading-snug ${hi(i)} rounded-md`}>
          <Cell value={c} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="md:hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <StickyBar className={`${cols} z-10 border-b border-white/10 bg-[#0C1612]/95 backdrop-blur`}>
        {plans.map((p, i) => (
          <div key={p.id} className={`px-1 py-4 text-center ${hi(i)}`}>
            <span className="block text-base font-semibold text-white">{p.name}</span>
            <span className="block mt-0.5 text-xs font-medium text-white/50">
              {money(p.monthly)}/mo
            </span>
          </div>
        ))}
      </StickyBar>

      <div className="px-4 py-4 border-b border-white/5">
        <p className="text-sm text-white/60">Best for</p>
        {valueRow(compare.bestFor)}
      </div>

      {compare.groups.map((g) => (
        <div key={g.title}>
          <p className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#38B685] bg-white/[0.02] border-b border-white/5">
            {g.title}
          </p>
          {g.rows.map((r) => (
            <div key={r.label} className="px-4 py-4 border-b border-white/5 last:border-b-0">
              <p className="text-sm text-white/60">{r.label}</p>
              {valueRow(r.cells)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function CompareTable() {
  return (
    <section className="relative pb-24 lg:pb-32">
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-12 lg:mb-14">
          <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
            Side by side
          </span>
          <h2 className="text-[32px]/[1.15] sm:text-4xl lg:text-5xl font-medium text-white text-balance">
            Which program is right for you?
          </h2>
        </div>

        <MobileCompare />

        <div className="hidden md:block overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.03]">
          <table className="w-full min-w-[680px] border-collapse text-sm sm:text-[15px]">
            <thead>
              <tr className="border-b border-white/5">
                <th scope="col" className="px-5 py-5 text-left">
                  <span className="sr-only">Feature</span>
                </th>
                {plans.map((p, i) => (
                  <th key={p.id} scope="col" className={`px-5 py-5 text-center ${hi(i)}`}>
                    <span className="block text-lg font-semibold text-white">{p.name}</span>
                    <span className="block mt-0.5 text-[13px] font-medium text-white/50">
                      {money(p.monthly)}/mo
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="px-5 py-4 text-left text-white/60">Best for</td>
                {compare.bestFor.map((v, i) => (
                  <td key={v} className={`px-5 py-4 text-center text-white/80 ${hi(i)}`}>
                    {v}
                  </td>
                ))}
              </tr>
              {compare.groups.map((g) => [
                <tr key={g.title} className="border-b border-white/5">
                  <td
                    colSpan={4}
                    className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#38B685] bg-white/[0.02]"
                  >
                    {g.title}
                  </td>
                </tr>,
                ...g.rows.map((r) => (
                  <tr key={`${g.title}-${r.label}`} className="border-b border-white/5 last:border-b-0">
                    <td className="px-5 py-4 text-left text-white/60">{r.label}</td>
                    {r.cells.map((c, i) => (
                      <td key={i} className={`px-5 py-4 text-center ${hi(i)}`}>
                        <Cell value={c} />
                      </td>
                    ))}
                  </tr>
                )),
              ])}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
