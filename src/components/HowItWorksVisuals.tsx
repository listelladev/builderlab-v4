const landingPages = ["Bianchi Group", "Blackbriar Dev.", "Koze Design"];

export function PositioningVisual() {
  return (
    <div className="bg-[#161616] border border-white/5 rounded-2xl p-8 lg:p-10 h-full">
      <p className="text-sm text-white/50 mb-8">Market Positioning</p>
      <div className="relative aspect-square max-w-md mx-auto">
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          <div className="border-r border-b border-white/10" />
          <div className="border-b border-white/10" />
          <div className="border-r border-white/10" />
          <div />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 text-xs text-white/40 whitespace-nowrap">
          High value
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-xs text-white/40 whitespace-nowrap">
          Low value
        </div>
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 text-xs text-white/40 whitespace-nowrap"
          style={{
            writingMode: "vertical-rl",
            transform: "translate(-100%, -50%) rotate(180deg)",
          }}
        >
          Generalist
        </div>
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 text-xs text-white/40 whitespace-nowrap"
          style={{
            writingMode: "vertical-rl",
            transform: "translate(100%, -50%) rotate(180deg)",
          }}
        >
          Specialist
        </div>
        {[
          { top: "30%", left: "28%" },
          { top: "58%", left: "18%" },
          { top: "40%", left: "60%" },
          { top: "75%", left: "70%" },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-white/20 -translate-x-1/2 -translate-y-1/2"
            style={pos}
          />
        ))}
        <div className="absolute top-[8%] left-[88%] -translate-x-1/2 -translate-y-1/2">
          <div className="w-20 h-20 rounded-full bg-[#38B685] flex items-center justify-center text-[#08120E] font-bold text-sm shadow-[0_0_40px_rgba(56,182,133,0.6)]">
            You
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdsSystemVisual() {
  return (
    <div className="space-y-4">
      <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-5">
          <span className="text-sm font-semibold text-white/80">
            Meta Ads · Performance creative
          </span>
          <span className="text-[11px] sm:text-xs text-white/30">
            iterate frequently · creative testing
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { v: "v1", cost: "$680 / sale" },
            { v: "v2", cost: "$540 / sale" },
            { v: "★ Winner", cost: "$410 / sale", highlight: true },
          ].map((e) => (
            <div
              key={e.v}
              className={`rounded-xl p-4 text-center ${
                e.highlight
                  ? "bg-[#38B685]/10 border border-[#38B685]/40"
                  : "bg-white/5 border border-white/5"
              }`}
            >
              <p
                className={`text-sm font-semibold mb-1 ${
                  e.highlight ? "text-[#38B685]" : "text-white/70"
                }`}
              >
                {e.v}
              </p>
              <p className="text-xs text-white/50">{e.cost}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-5">
          <span className="text-sm font-semibold text-white/80">
            Google Ads · Intent capture
          </span>
          <span className="text-[11px] sm:text-xs text-white/30">high-intent search</span>
        </div>
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-black/50 mb-1">
              custom home builder near me
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-2 min-w-0">
              <span className="text-[11px] sm:text-xs text-black/40">Sponsored</span>
              <span className="text-xs sm:text-sm text-blue-600 break-words min-w-0">
                blackbriardevelopment.com
              </span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-black mb-1">
              Custom Homes Built Around Your Vision, Blackbriar Development
            </p>
            <p className="text-[11px] sm:text-xs text-black/60 leading-relaxed">
              From first sketch to final walkthrough. A dedicated design-build
              team with you from groundbreaking to handover.
            </p>
          </div>
        </div>
        <p className="text-sm text-[#38B685] mt-4 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38B685]" />
          Top-of-page on buying keywords
        </p>
      </div>
    </div>
  );
}

export function AdsSystemLandingPages() {
  return (
    <>
      <p className="text-sm text-white/40 mb-2">
        Both channels land on pages built to convert
      </p>
      <p className="text-sm text-[#38B685] font-medium mb-3">
        Landing pages we ship
      </p>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {landingPages.map((t) => (
          <div
            key={t}
            className="min-w-0 aspect-[3/4] bg-[#161616] rounded-xl border border-white/5 overflow-hidden flex flex-col"
          >
            <div className="h-5 sm:h-6 bg-white/5 flex items-center gap-1 px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
            <div className="flex-1 p-2 sm:p-3 flex flex-col justify-end">
              <span className="text-[10px] sm:text-xs text-white/50 leading-tight break-words">
                {t}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function OmnipresenceVisual() {
  return (
    <div className="space-y-4">
      <div className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden">
        <div className="h-6 bg-white/5 flex items-center gap-1 px-3">
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>
        <div className="p-6">
          <p className="text-sm font-semibold text-white/80 mb-1">
            Blackbriar Development
          </p>
          <p className="text-xs text-white/40 mb-5">
            Built to convert · optimised for search
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[70, 90, 55].map((h, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-lg"
                style={{ height: `${h * 0.6}px` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm font-semibold text-white/80">
            Local SEO · Rankings
          </span>
          <span className="text-xs text-white/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38B685] animate-pulse" />
            Tracking
          </span>
        </div>
        <div className="space-y-3">
          {[
            { term: "custom home builder [city]", rank: "#1" },
            { term: "luxury home builder near me", rank: "#2" },
            { term: "custom home design build", rank: "#3" },
          ].map((e) => (
            <div
              key={e.term}
              className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2.5"
            >
              <span className="text-sm text-white/70">{e.term}</span>
              <span className="text-sm font-semibold text-[#38B685]">
                {e.rank}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardVisual() {
  return (
    <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm font-semibold text-white/80">
          CRM · Synced live
        </span>
        <span className="text-xs text-white/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38B685] animate-pulse" />
          Live
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-5">
          <p className="text-xs text-white/40 mb-1">CAC</p>
          <p className="text-3xl font-bold text-white">$186</p>
          <p className="text-sm text-[#38B685] font-medium">↓ 24%</p>
        </div>
        <div className="bg-white/5 rounded-xl p-5">
          <p className="text-xs text-white/40 mb-1">ROI</p>
          <p className="text-3xl font-bold text-white">4.8×</p>
          <p className="text-sm text-[#38B685] font-medium">↑ 118%</p>
        </div>
      </div>
      <div className="bg-white/5 rounded-xl p-5 mb-4">
        <p className="text-xs text-white/40 mb-4">Revenue growth</p>
        <div className="flex items-end justify-between gap-2 h-32">
          {[40, 55, 50, 70, 85, 95].map((e, t) => (
            <div key={t} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-gradient-to-t from-[#38B685]/40 to-[#38B685] rounded-t"
                style={{ height: `${e}%` }}
              />
              <span className="text-xs text-white/30">M{t + 1}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {[
          { initials: "SK", channel: "Meta Ads", value: "$4,200" },
          { initials: "JT", channel: "Google Ads", value: "$3,800" },
          { initials: "MP", channel: "Mai P. · Meta Ads", value: "$5,100" },
        ].map((e) => (
          <div
            key={e.initials}
            className="flex items-center gap-3 bg-white/5 rounded-lg p-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#38B685]/20 text-[#38B685] text-xs font-bold flex items-center justify-center">
              {e.initials}
            </div>
            <span className="text-sm text-white/70 flex-1">{e.channel}</span>
            <span className="text-sm font-semibold text-white">
              {e.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardIntegrations() {
  return (
    <>
      <p className="text-sm text-white/40 mb-3">Works with</p>
      <div className="flex flex-wrap gap-3">
        {["HubSpot", "GoHighLevel", "Pipedrive", "Salesforce", "+ more"].map(
          (t) => (
            <span
              key={t}
              className="text-sm text-white/60 border border-white/10 px-4 py-2 rounded-lg"
            >
              {t}
            </span>
          )
        )}
      </div>
    </>
  );
}
