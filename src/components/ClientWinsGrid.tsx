import { Star } from "lucide-react";
import { imageUrl } from "@/lib/sanity/image";
import type { ClientWin } from "@/lib/client-wins";

function ClientWinCard({ win }: { win: ClientWin }) {
  const src = imageUrl(win.image, 640);
  return (
    <div className="break-inside-avoid mb-6 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={win.image?.alt || win.name || ""} className="w-full h-auto block" />
      )}
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-white">{win.name}</p>
          {win.date && <p className="text-xs text-white/40 mt-0.5">{win.date}</p>}
        </div>
        <div className="flex gap-0.5 shrink-0">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ClientWinsGrid({ wins }: { wins: ClientWin[] }) {
  if (wins.length === 0) {
    return (
      <p className="text-center text-white/40 text-sm py-16">
        No client wins yet — check back soon.
      </p>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      {wins.map((win) => (
        <ClientWinCard key={win._id} win={win} />
      ))}
    </div>
  );
}
