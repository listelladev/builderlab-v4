"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Minus, Plus } from "lucide-react";
import {
  accelerate,
  buildProposal,
  commitmentSavings,
  elite,
  terms,
  website,
  type InHouseTab,
  type TermId,
} from "@/lib/pricing";
import { AnimatedNumber } from "./AnimatedNumber";
import { InHouseDropdown } from "./InHouseDropdown";
import { Segmented } from "./Segmented";
import { Spotlight } from "./Spotlight";

const EASE = [0.21, 0.5, 0.28, 1] as const;

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

function ColumnLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
      <span>{children}</span>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

function FeatureList({
  items,
  tone,
  className = "",
}: {
  items: string[];
  tone: "solid" | "soft";
  className?: string;
}) {
  return (
    <ul className={`grid gap-x-8 gap-y-3.5 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
              tone === "solid" ? "bg-[#38B685]" : "bg-[#38B685]/15"
            }`}
          >
            <Check
              className={`w-3 h-3 ${tone === "solid" ? "text-[#08120E]" : "text-[#38B685]"}`}
              strokeWidth={3}
            />
          </span>
          <span className="text-sm text-white/80 leading-5">{item}</span>
        </li>
      ))}
    </ul>
  );
}

type DropdownControl = {
  openOffer: InHouseTab | null;
  onToggleOffer: (offer: InHouseTab) => void;
};

function AccelerateCard({
  term,
  openOffer,
  onToggleOffer,
}: { term: TermId } & DropdownControl) {
  const price = accelerate.prices[term];
  const months = term === "6mo" ? 6 : term === "12mo" ? 12 : 1;
  const savings = commitmentSavings(term);
  const label = terms.find((t) => t.id === term)!.label;

  return (
    <Spotlight className="grow shrink-0 rounded-2xl bg-gradient-to-br from-[#153F3A] to-[#0F1712] border border-[#38B685]/30">
      <div className="flex-1 flex flex-col p-6 sm:p-9 lg:p-10">
        <div className="lg:grid lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="flex flex-col lg:pr-14">
            <span className="text-[#38B685] text-sm font-semibold uppercase tracking-wider">
              {accelerate.tier}
            </span>
            <h3 className="mt-2 text-3xl sm:text-4xl font-medium text-white">
              {accelerate.name}
            </h3>

            <div className="mt-8 flex items-end flex-wrap gap-x-3">
              <AnimatedNumber
                value={price}
                className="text-5xl sm:text-6xl font-medium text-white tracking-tight tabular-nums leading-none"
              />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={term}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className="text-base text-white/60 leading-none pb-1"
                >
                  {label}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="mt-3 min-h-[1.5rem] text-sm">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={term}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="text-white/50"
                >
                  {term === "monthly" ? (
                    "Pay month to month"
                  ) : (
                    <>
                      About {money(Math.round(price / months))}/mo ·{" "}
                      <span className="text-[#38B685] font-medium">
                        Save {money(savings)} vs. paying monthly
                      </span>
                    </>
                  )}
                </motion.p>
              </AnimatePresence>
            </div>

            <span className="mt-5 self-start inline-flex px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70">
              {accelerate.minAdSpend}
            </span>
          </div>

          <div className="h-px bg-[#38B685]/20 my-7 lg:hidden" />

          <div className="lg:border-l lg:border-[#38B685]/20 lg:pl-14">
            <FeatureList
              items={accelerate.features}
              tone="solid"
              className="gap-y-4"
            />
          </div>
        </div>

        <div className="mt-auto pt-9">
          <InHouseDropdown
            open={openOffer === "accelerate"}
            onToggle={() => onToggleOffer("accelerate")}
            offer="accelerate"
          />
        </div>
      </div>
    </Spotlight>
  );
}

function AddOnToggle({
  selected,
  onToggle,
  name,
}: {
  selected: boolean;
  onToggle: () => void;
  name: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${selected ? "Remove" : "Add"} ${name} ${selected ? "from" : "to"} proposal`}
      onClick={onToggle}
      className={`w-full inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-colors ${
        selected
          ? "bg-[#38B685] border-[#38B685] text-[#08120E]"
          : "bg-white/5 border-white/10 text-white hover:border-[#38B685]/60 hover:text-[#38B685]"
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={selected ? "on" : "off"}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.18, ease: EASE }}
          className="flex"
        >
          {selected ? (
            <Check className="w-4 h-4" strokeWidth={3} />
          ) : (
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          )}
        </motion.span>
      </AnimatePresence>
      {selected ? "Added to proposal" : "Add to proposal"}
    </button>
  );
}

function AddOnCard({
  selected,
  onToggle,
  offer,
  openOffer,
  onToggleOffer,
  eyebrow,
  name,
  price,
  intro,
  features,
}: DropdownControl & {
  selected: boolean;
  onToggle: () => void;
  offer: InHouseTab;
  eyebrow?: string;
  name: string;
  price: ReactNode;
  intro?: string;
  features: string[];
}) {
  return (
    <Spotlight
      className={`grow shrink-0 rounded-2xl border transition-colors duration-300 ${
        selected
          ? "bg-[#38B685]/[0.06] border-[#38B685]/50"
          : "bg-white/[0.03] border-white/10"
      }`}
    >
      <div className="flex-1 flex flex-col p-6 sm:p-8">
        {eyebrow && (
          <span className="text-[#38B685] text-sm font-semibold uppercase tracking-wider">
            {eyebrow}
          </span>
        )}
        <h3
          className={`text-2xl sm:text-3xl font-medium text-white ${eyebrow ? "mt-2" : ""}`}
        >
          {name}
        </h3>

        <div className="mt-5">{price}</div>

        <div className="h-px bg-white/10 my-6" />

        {intro && <p className="text-sm font-medium text-white mb-4">{intro}</p>}
        <FeatureList items={features} tone="soft" />

        <div className="mt-auto pt-8 space-y-4">
          <InHouseDropdown
            open={openOffer === offer}
            onToggle={() => onToggleOffer(offer)}
            offer={offer}
          />
          <AddOnToggle selected={selected} onToggle={onToggle} name={name} />
        </div>
      </div>
    </Spotlight>
  );
}

function Proposal({
  term,
  withElite,
  withWebsite,
}: {
  term: TermId;
  withElite: boolean;
  withWebsite: boolean;
}) {
  const lines = buildProposal(term, withElite, withWebsite);

  return (
    <div className="bg-white/[0.05] border border-white/10 rounded-3xl px-6 py-8 sm:px-12 sm:py-12">
      <ul>
        <AnimatePresence initial={false}>
          {lines.map((line) => (
            <motion.li
              key={line.key}
              layout="position"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4 sm:gap-8 py-5 border-b border-white/10">
                <div className="min-w-0">
                  <p className="text-white font-medium leading-snug">{line.label}</p>
                  {line.note && (
                    <p className="mt-1 text-sm text-white/40">{line.note}</p>
                  )}
                </div>
                <p className="shrink-0 text-right text-white">
                  <AnimatedNumber
                    value={line.amount}
                    className="text-2xl sm:text-3xl font-medium tracking-tight tabular-nums"
                  />
                  {line.suffix && (
                    <span className="ml-1 text-sm text-white/50">{line.suffix}</span>
                  )}
                </p>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-6">
        <span className="text-sm text-white/50">{accelerate.minAdSpend}</span>
        <Link
          href="/contact"
          className="group inline-flex items-center justify-center gap-2 bg-white text-black px-7 py-4 rounded-full text-base font-semibold hover:scale-[1.03] transition-transform duration-500 ease-out shadow-[0_0_40px_rgba(56,182,133,0.35)]"
        >
          Book My Free Strategy Call
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500 ease-out" />
        </Link>
      </div>
    </div>
  );
}

type Notice = { kind: "added" | "removed"; name: string; n: number };

// Floating feedback pill shown when an add-on is toggled, so it is obvious
// what happened to the proposal.
//  - added: points at the proposal below and scrolls there on click. It clears
//    itself after a few seconds, or as soon as the proposal is on screen
//    (nothing left to point at).
//  - removed: a brief confirmation toast; it needs no action.
function ProposalNotice({
  notice,
  proposalVisible,
  onDismiss,
  onGo,
}: {
  notice: Notice | null;
  proposalVisible: boolean;
  onDismiss: () => void;
  onGo: () => void;
}) {
  const show = notice && (notice.kind === "removed" || !proposalVisible);

  // `n` changes on every toggle, so rapid add/remove restarts the timer.
  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(onDismiss, notice.kind === "added" ? 6000 : 2500);
    return () => window.clearTimeout(t);
  }, [notice, onDismiss]);

  const base =
    "fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-max max-w-[calc(100vw-2rem)] inline-flex items-center gap-2.5 rounded-full py-3 text-sm font-semibold";
  const motionProps = {
    initial: { opacity: 0, y: 24, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 24, scale: 0.95 },
    transition: { duration: 0.3, ease: EASE },
  };

  return (
    <AnimatePresence mode="wait">
      {show && notice.kind === "added" && (
        <motion.button
          key={`added-${notice.n}`}
          type="button"
          onClick={onGo}
          {...motionProps}
          className={`${base} bg-[#38B685] text-[#08120E] pl-5 pr-4 shadow-[0_10px_40px_-8px_rgba(56,182,133,0.6)]`}
        >
          Added! Scroll down to see your proposal
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-6 rounded-full bg-[#08120E] flex items-center justify-center shrink-0"
          >
            <ChevronDown className="w-4 h-4 text-[#38B685]" strokeWidth={3} />
          </motion.span>
        </motion.button>
      )}
      {show && notice.kind === "removed" && (
        <motion.div
          key={`removed-${notice.n}`}
          role="status"
          {...motionProps}
          className={`${base} bg-[#161616] border border-white/15 text-white pl-4 pr-5 shadow-[0_10px_40px_-8px_rgba(0,0,0,0.7)]`}
        >
          <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <Minus className="w-3.5 h-3.5 text-white/80" strokeWidth={3} />
          </span>
          {notice.name} removed from proposal
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PricingPlans() {
  const [term, setTerm] = useState<TermId>("monthly");
  const [withElite, setWithElite] = useState(false);
  const [withWebsite, setWithWebsite] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  // Only one "what this costs to build in-house" box open at a time, so the
  // cards never all stack tall; opening one closes the others.
  const [openOffer, setOpenOffer] = useState<InHouseTab | null>(null);
  const toggleOffer = (offer: InHouseTab) =>
    setOpenOffer((cur) => (cur === offer ? null : offer));
  const [proposalVisible, setProposalVisible] = useState(false);
  const proposalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = proposalRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setProposalVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const dismissNotice = useCallback(() => setNotice(null), []);

  // Adding points the visitor at the proposal; removing confirms it's gone.
  function toggleAddOn(
    current: boolean,
    set: (v: boolean) => void,
    name: string,
  ) {
    set(!current);
    setNotice((prev) => ({
      kind: current ? "removed" : "added",
      name,
      n: (prev?.n ?? 0) + 1,
    }));
  }

  return (
    <>
      <div className="flex flex-col items-center gap-3 mb-12 lg:mb-14">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          Choose your commitment
        </span>
        <Segmented
          options={terms}
          value={term}
          onChange={setTerm}
          layoutId="term-thumb"
          label="Commitment length"
        />
      </div>

      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <ColumnLabel>The core offer</ColumnLabel>
          <AccelerateCard term={term} openOffer={openOffer} onToggleOffer={toggleOffer} />
        </div>

        <div className="flex flex-col gap-4">
          <ColumnLabel>Add-ons</ColumnLabel>
          <div className="grid lg:grid-cols-2 gap-6">
            <AddOnCard
              selected={withElite}
              onToggle={() => toggleAddOn(withElite, setWithElite, elite.name)}
              offer="elite"
              openOffer={openOffer}
              onToggleOffer={toggleOffer}
              name={elite.name}
              features={elite.features}
              price={
                <>
                  <p className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-medium text-white tracking-tight tabular-nums">
                      {money(elite.addOnMonthly)}
                    </span>
                    <span className="text-base text-white/60">/mo add on</span>
                  </p>
                  <p className="mt-1.5 text-sm text-white/50">
                    <span className="text-white/80 font-medium">
                      {money(elite.monthly)}
                    </span>{" "}
                    - Monthly
                  </p>
                </>
              }
            />
            <AddOnCard
              selected={withWebsite}
              onToggle={() => toggleAddOn(withWebsite, setWithWebsite, website.name)}
              offer="website"
              openOffer={openOffer}
              onToggleOffer={toggleOffer}
              name={website.name}
              features={website.features}
              price={
                <p className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-medium text-white tracking-tight tabular-nums">
                    {money(website.price)}
                  </span>
                  <span className="text-base text-white/60">One Time</span>
                </p>
              }
            />
          </div>
        </div>
      </div>

      <ProposalNotice
        notice={notice}
        proposalVisible={proposalVisible}
        onDismiss={dismissNotice}
        onGo={() => {
          setNotice(null);
          proposalRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
      />

      <div ref={proposalRef} className="mt-24 lg:mt-32 scroll-mt-24">
        <div className="text-center mb-12">
          <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
            Your Proposal
          </span>
          <h2 className="text-[32px]/[1.15] sm:text-4xl lg:text-5xl font-medium text-white text-balance">
            Here&apos;s Exactly What You&apos;re Getting.
          </h2>
        </div>
        <Proposal term={term} withElite={withElite} withWebsite={withWebsite} />
      </div>
    </>
  );
}
