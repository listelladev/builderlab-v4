"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Minus, Plus, Star } from "lucide-react";
import {
  addOns,
  buildProposal,
  plans,
  plansFootNote,
  termById,
  terms,
  type AddOn,
  type AddOnId,
  type Plan,
  type PlanId,
  type TermId,
} from "@/lib/pricing";
import { AnimatedNumber } from "./AnimatedNumber";
import { InHouseDropdown } from "./InHouseDropdown";
import { Segmented } from "./Segmented";
import { Spotlight } from "./Spotlight";

const EASE = [0.21, 0.5, 0.28, 1] as const;

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

const eyebrowCls =
  "inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4";
const h2Cls =
  "text-[32px]/[1.15] sm:text-4xl lg:text-5xl font-medium text-white text-balance";
const ledeCls =
  "mt-4 text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed text-balance";

function SectionHead({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
}) {
  return (
    <div className="text-center mb-12 lg:mb-14">
      <span className={eyebrowCls}>{eyebrow}</span>
      <h2 className={h2Cls}>{title}</h2>
      {lede && <p className={ledeCls}>{lede}</p>}
    </div>
  );
}

function FeatureList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`grid gap-x-8 gap-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-px w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-[#38B685]/15">
            <Check className="w-3 h-3 text-[#38B685]" strokeWidth={3} />
          </span>
          <span className="text-sm text-white/80 leading-5">{item}</span>
        </li>
      ))}
    </ul>
  );
}

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-[transform,background-color,border-color,color] duration-500 ease-out hover:scale-[1.03]";
const btnWhite = `${btnBase} bg-white text-black shadow-[0_0_40px_rgba(56,182,133,0.35)]`;
const btnGhost = `${btnBase} border border-white/15 text-white hover:border-white/40`;

// ---------------------------------------------------------------------------
// Program cards. On desktop the three cards share one grid and each card is a
// subgrid, so every row (price, button, roadmap steps, "Everything in...")
// lines up across all three no matter how the copy wraps.
//   7 header rows + 5 roadmap rows (title + 4 steps) + label + features + foot
// ---------------------------------------------------------------------------

const subgrid15 = "lg:grid lg:grid-cols-[minmax(0,1fr)] lg:grid-rows-subgrid lg:row-span-15";

function PlanCard({
  plan,
  term,
  openOffer,
  onToggleOffer,
  onChoose,
}: {
  plan: Plan;
  term: TermId;
  openOffer: PlanId | null;
  onToggleOffer: (id: PlanId) => void;
  onChoose: () => void;
}) {
  const t = termById(term);
  const featured = plan.featured;

  return (
    <Spotlight
      className={`rounded-3xl border ${subgrid15} ${
        featured
          ? "bg-gradient-to-br from-[#153F3A] to-[#0F1712] border-[#38B685]/45 shadow-[0_0_60px_rgba(56,182,133,0.15)]"
          : "bg-white/[0.03] border-white/10"
      }`}
      innerClassName={`flex-1 flex flex-col ${subgrid15} p-6 sm:p-8 lg:p-7`}
    >
      {featured && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-br from-[#FFD54F] to-[#FFB300] px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#1A1300] shadow-[0_4px_18px_rgba(255,179,0,0.35)]">
          <Star className="w-3 h-3 fill-current" strokeWidth={0} />
          Most Popular
        </span>
      )}

      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
        {plan.tier}
      </span>
      <h3 className="mt-2 text-3xl sm:text-4xl font-medium text-white">{plan.name}</h3>
      <p className="mt-3 text-sm font-medium text-[#38B685]">{plan.forWho}</p>
      <p className="mt-2 text-sm text-white/60 leading-relaxed">{plan.tagline}</p>

      <p className="mt-7 flex items-baseline gap-1.5">
        <span className="text-5xl font-medium text-white tracking-tight tabular-nums leading-none">
          {money(plan.monthly)}
        </span>
        <span className="text-base text-white/50">/month</span>
      </p>
      <div className="mt-2 mb-6 min-h-[1.5rem] text-sm">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={term}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: EASE }}
            className={
              t.setupFee ? "text-white/60" : "text-[#38B685] font-semibold inline-flex items-center gap-1.5"
            }
          >
            {!t.setupFee && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
            {t.setupCopy}
          </motion.p>
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={onChoose}
        className={`w-full mb-7 ${featured ? btnWhite : btnGhost}`}
      >
        {plan.cta}
      </button>

      {/* 90-day roadmap */}
      <div className="mb-6 rounded-2xl border border-[#38B685]/20 bg-[#38B685]/[0.06] px-5 pt-5 pb-1 lg:grid lg:grid-cols-[minmax(0,1fr)] lg:grid-rows-subgrid lg:row-span-5">
        <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#38B685]">
          90-Day Roadmap
        </h4>
        <ol className="lg:contents">
          {plan.roadmap.map((step) => (
            <li
              key={step.when}
              className="relative pl-6 pb-4 before:absolute before:left-0 before:top-[5px] before:w-2.5 before:h-2.5 before:rounded-full before:bg-[#38B685] before:shadow-[0_0_0_4px_rgba(56,182,133,0.18)] not-last:after:absolute not-last:after:left-1 not-last:after:top-[19px] not-last:after:-bottom-0.5 not-last:after:w-0.5 not-last:after:bg-[#38B685]/30"
            >
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#38B685]">
                {step.when}
              </span>
              <span className="mt-0.5 block text-[15px] font-semibold text-white leading-snug">
                {step.title}
              </span>
              <span className="mt-1 block text-[13px] text-white/60 leading-snug">{step.body}</span>
            </li>
          ))}
        </ol>
      </div>

      <p className="mb-2 text-lg font-semibold text-white">{plan.includesLabel}</p>

      <div className="flex flex-col">
        {plan.groups.map((g) => (
          <div key={g.title} className="py-5 border-t border-white/5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              {g.title}
            </h4>
            <p className="mt-2 mb-4 text-sm text-white/60 leading-snug">{g.desc}</p>
            <FeatureList items={g.items} />
          </div>
        ))}
      </div>

      <div className="mt-auto pt-2">
        <InHouseDropdown
          offer={plan.id}
          open={openOffer === plan.id}
          onToggle={() => onToggleOffer(plan.id)}
        />
      </div>
    </Spotlight>
  );
}

// ---------------------------------------------------------------------------
// Add-ons
// ---------------------------------------------------------------------------

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
      aria-label={`${selected ? "Remove" : "Add"} ${name} ${selected ? "from" : "to"} my program`}
      onClick={onToggle}
      className={`w-full inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3.5 text-sm font-semibold transition-colors ${
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
      {selected ? "Added to My Program" : "Add to My Program"}
    </button>
  );
}

function AddOnCard({
  addOn,
  selected,
  onToggle,
}: {
  addOn: AddOn;
  selected: boolean;
  onToggle: () => void;
}) {
  const head = (
    <>
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#38B685]">
        Add-on
      </span>
      <h3 className="mt-2 text-2xl sm:text-3xl font-medium text-white">{addOn.name}</h3>
      <p className={`mt-2 mb-5 text-sm text-white/60 leading-relaxed ${addOn.wide ? "" : "lg:min-h-[2.75rem]"}`}>
        {addOn.desc}
      </p>
      <p className="mb-6 flex items-baseline gap-1.5">
        <span className="text-4xl font-medium text-white tracking-tight tabular-nums">
          {money(addOn.price)}
        </span>
        <span className="text-base text-white/50">one time</span>
      </p>
    </>
  );

  return (
    <Spotlight
      className={`rounded-3xl border transition-colors duration-300 ${addOn.wide ? "lg:col-span-2" : ""} ${
        selected ? "bg-[#38B685]/[0.06] border-[#38B685]/50" : "bg-white/[0.03] border-white/10"
      }`}
    >
      {addOn.wide ? (
        <div className="flex-1 flex flex-col lg:flex-row lg:items-center gap-0 lg:gap-12 p-6 sm:p-8">
          <div className="flex flex-col lg:w-[340px] lg:shrink-0">
            {head}
            <div className="hidden lg:block">
              <AddOnToggle selected={selected} onToggle={onToggle} name={addOn.name} />
            </div>
          </div>
          <FeatureList items={addOn.features} className="flex-1 lg:grid-cols-2 gap-y-3.5" />
          <div className="mt-8 lg:hidden">
            <AddOnToggle selected={selected} onToggle={onToggle} name={addOn.name} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col p-6 sm:p-8">
          {head}
          <FeatureList items={addOn.features} className="mb-8" />
          <div className="mt-auto">
            <AddOnToggle selected={selected} onToggle={onToggle} name={addOn.name} />
          </div>
        </div>
      )}
    </Spotlight>
  );
}

// ---------------------------------------------------------------------------
// Your Proposal
// ---------------------------------------------------------------------------

function Proposal({
  term,
  planId,
  addOnIds,
}: {
  term: TermId;
  planId: PlanId;
  addOnIds: AddOnId[];
}) {
  const { lines, monthly, oneTime, adSpend } = buildProposal(term, planId, addOnIds);

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
                  {line.note && <p className="mt-1 text-sm text-white/40">{line.note}</p>}
                </div>
                <p className="shrink-0 text-right text-white">
                  {line.display ? (
                    <span className="text-2xl sm:text-3xl font-medium tracking-tight text-[#38B685]">
                      {line.display}
                    </span>
                  ) : (
                    <AnimatedNumber
                      value={line.amount}
                      className="text-2xl sm:text-3xl font-medium tracking-tight tabular-nums"
                    />
                  )}
                  {line.suffix && <span className="ml-1 text-sm text-white/50">{line.suffix}</span>}
                </p>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="mt-1 border-t-2 border-[#38B685] pt-5 space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-white font-semibold">Monthly program fee</span>
          <span className="text-white">
            <AnimatedNumber
              value={monthly}
              className="text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums"
            />
            <span className="ml-1 text-sm text-white/50">/mo</span>
          </span>
        </div>
        <AnimatePresence initial={false}>
          {oneTime > 0 && (
            <motion.div
              key="one-time"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-white/70">One-time total</span>
                <AnimatedNumber
                  value={oneTime}
                  className="text-xl sm:text-2xl font-medium text-white tracking-tight tabular-nums"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-8">
        <p className="text-sm text-white/50 leading-relaxed">
          Recommended ad spend:{" "}
          <span className="text-white/80 font-medium whitespace-nowrap">{adSpend}</span>
          <span className="block">Paid directly to Meta and Google.</span>
        </p>
        <Link href="/contact" className={`group shrink-0 ${btnWhite} px-7 py-4 text-base`}>
          Book My Free Strategy Call
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500 ease-out" />
        </Link>
      </div>
    </div>
  );
}

type Notice = { kind: "added" | "removed"; name: string; n: number };

// Floating feedback pill shown when a program or add-on is picked, so it is
// obvious what happened to the proposal.
//  - added: points at the proposal below and scrolls there on click. It clears
//    itself after a few seconds, or as soon as the proposal is on screen.
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
          {notice.name} added! See your proposal
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

// ---------------------------------------------------------------------------
// The interactive middle of the page: commitment toggle, programs, terms,
// add-ons and the proposal they all feed.
// ---------------------------------------------------------------------------

export function PricingPlans() {
  const [term, setTerm] = useState<TermId>("12mo");
  const [planId, setPlanId] = useState<PlanId>("scale");
  const [addOnIds, setAddOnIds] = useState<AddOnId[]>([]);
  const [notice, setNotice] = useState<Notice | null>(null);
  // Only one in-house dropdown open at a time so the cards never all stack tall.
  const [openOffer, setOpenOffer] = useState<PlanId | null>(null);
  const toggleOffer = (id: PlanId) => setOpenOffer((cur) => (cur === id ? null : id));
  const [proposalVisible, setProposalVisible] = useState(false);
  const proposalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = proposalRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setProposalVisible(entry.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const dismissNotice = useCallback(() => setNotice(null), []);
  const notify = (kind: Notice["kind"], name: string) =>
    setNotice((prev) => ({ kind, name, n: (prev?.n ?? 0) + 1 }));

  function choosePlan(plan: Plan) {
    setPlanId(plan.id);
    notify("added", plan.name);
  }

  // The two websites are alternatives: adding one swaps out the other.
  function toggleAddOn(a: AddOn) {
    const on = addOnIds.includes(a.id);
    setAddOnIds((cur) =>
      on
        ? cur.filter((id) => id !== a.id)
        : [
            ...cur.filter(
              (id) => !a.group || addOns.find((x) => x.id === id)?.group !== a.group,
            ),
            a.id,
          ],
    );
    notify(on ? "removed" : "added", a.name);
  }

  return (
    <>
      {/* Programs */}
      <section id="packages" className="relative pt-10 pb-24 lg:pt-14 lg:pb-32 scroll-mt-20">
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col items-center gap-3 mb-14">
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

          <div className="grid gap-10 max-w-[560px] mx-auto lg:max-w-none lg:grid-cols-3 lg:gap-x-5 lg:gap-y-0">
            {plans.map((p) => (
              <PlanCard
                key={p.id}
                plan={p}
                term={term}
                openOffer={openOffer}
                onToggleOffer={toggleOffer}
                onChoose={() => choosePlan(p)}
              />
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-white/50 text-balance">{plansFootNote}</p>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {terms.map((t) => (
              <div key={t.id} className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
                <span className="inline-block rounded-full bg-[#38B685]/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#38B685]">
                  {t.tag}
                </span>
                <h4 className="mt-3 text-xl font-medium text-white">{t.label}</h4>
                <p className="mt-1.5 font-semibold text-white">
                  {t.setupFee ? `${money(t.setupFee)} one-time setup` : "No setup fee"}
                </p>
                <p className="mt-1.5 text-sm text-white/60 leading-relaxed">{t.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="relative pb-24 lg:pb-32">
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-10">
          <SectionHead
            eyebrow="Add-ons"
            title="Need something extra?"
            lede="Add these to any program. They're one-time projects, so you pay once and own the result."
          />
          <div className="grid gap-6 max-w-[560px] mx-auto lg:max-w-[960px] lg:grid-cols-2">
            {addOns.map((a) => (
              <AddOnCard
                key={a.id}
                addOn={a}
                selected={addOnIds.includes(a.id)}
                onToggle={() => toggleAddOn(a)}
              />
            ))}
          </div>
        </div>
      </section>

      <ProposalNotice
        notice={notice}
        proposalVisible={proposalVisible}
        onDismiss={dismissNotice}
        onGo={() => {
          setNotice(null);
          proposalRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
      />

      {/* Proposal */}
      <section className="relative pb-24 lg:pb-32">
        <div ref={proposalRef} className="relative z-10 max-w-[960px] mx-auto px-6 lg:px-10 scroll-mt-24">
          <SectionHead eyebrow="Your Proposal" title={<>Here&apos;s Exactly What You&apos;re Getting.</>} />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
            <Segmented
              options={plans.map((p) => ({ id: p.id, label: p.name }))}
              value={planId}
              onChange={setPlanId}
              layoutId="proposal-plan-thumb"
              label="Program"
            />
            <Segmented
              options={terms.map((t) => ({ id: t.id, label: t.label }))}
              value={term}
              onChange={setTerm}
              layoutId="proposal-term-thumb"
              label="Commitment length"
            />
          </div>
          <Proposal term={term} planId={planId} addOnIds={addOnIds} />
        </div>
      </section>
    </>
  );
}
