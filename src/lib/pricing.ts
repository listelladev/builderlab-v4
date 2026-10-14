// Everything the /pricing page says, in one place. Offer names, prices and
// feature wording are taken verbatim from the pricing sheet — edit here, not
// in the components.

export type TermId = "monthly" | "6mo" | "12mo";

export const terms: { id: TermId; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "6mo", label: "6 Months" },
  { id: "12mo", label: "12 Months" },
];

export const accelerate = {
  tier: "Tier 1",
  name: "Accelerate",
  prices: { monthly: 2800, "6mo": 14000, "12mo": 28000 } as Record<TermId, number>,
  features: [
    "Meta Ads System",
    "Retargeting Campaign",
    "On-Site Video Shoot (2x/Yr)",
    "Video Scripting & Editing",
    "New Monthly Video Ads",
    "BuilderLab CRM",
    "Lead Follow-Up Automations",
    "Dedicated Growth Advisor",
    "Monthly Analytics + Reporting",
  ],
  minAdSpend: "Min Ad Spend - $2,500/mo",
};

export const elite = {
  tier: "Tier 2",
  name: "Elite",
  // "$2,000/mo add on" — what Elite costs on top of a committed Accelerate.
  addOnMonthly: 2000,
  // "$4,500 - Monthly" — Elite when paid month to month.
  monthly: 4500,
  intro: "Everything in Accelerate, plus:",
  features: [
    "SEO (Search Engine Optimization)",
    "AEO (AI Engine Optimization)",
    "GMB (Google Business Profile) Management",
  ],
};

export const website = {
  name: "Website Build",
  price: 3500,
  features: [
    "Custom Built Website",
    "Strategy Deep Dive",
    "Custom Design",
    "Copy & Content Writing",
    "Premium Hosting, Security, & Support",
  ],
};

/** Savings of a 6/12-month commitment against paying Accelerate monthly. */
export function commitmentSavings(term: TermId): number {
  if (term === "monthly") return 0;
  const months = term === "6mo" ? 6 : 12;
  return accelerate.prices.monthly * months - accelerate.prices[term];
}

export type ProposalLine = {
  key: string;
  label: string;
  note?: string;
  amount: number;
  suffix: string;
};

/**
 * The line items for the "Your Proposal" receipt.
 *
 * Elite on a month-to-month term is the one place two sheet prices meet:
 * Accelerate ($2,800) + the Elite add-on ($2,000) does not equal the
 * "$4,500 - Monthly" Elite price, so on that term it is quoted as a single
 * $4,500/mo line rather than summing the two. On 6/12 months the add-on is
 * quoted as its own +$2,000/mo line.
 */
export function buildProposal(
  term: TermId,
  withElite: boolean,
  withWebsite: boolean,
): ProposalLine[] {
  const lines: ProposalLine[] = [];

  if (term === "monthly") {
    lines.push(
      withElite
        ? {
            key: "core",
            label: `${accelerate.tier} - ${accelerate.name} + ${elite.tier} - ${elite.name}`,
            note: "Monthly",
            amount: elite.monthly,
            suffix: "/mo",
          }
        : {
            key: "core",
            label: `${accelerate.tier} - ${accelerate.name}`,
            note: "Monthly",
            amount: accelerate.prices.monthly,
            suffix: "/mo",
          },
    );
  } else {
    lines.push({
      key: "core",
      label: `${accelerate.tier} - ${accelerate.name}`,
      note: term === "6mo" ? "6 Months" : "12 Months",
      amount: accelerate.prices[term],
      suffix: "",
    });
    if (withElite) {
      lines.push({
        key: "elite",
        label: `${elite.tier} - ${elite.name}`,
        note: "Add on",
        amount: elite.addOnMonthly,
        suffix: "/mo",
      });
    }
  }

  if (withWebsite) {
    lines.push({
      key: "website",
      label: website.name,
      note: "One Time",
      amount: website.price,
      suffix: "",
    });
  }

  return lines;
}

// ---------------------------------------------------------------------------
// "What this costs to build in-house" — shown as a dropdown inside each card.
//
// PLACEHOLDER ESTIMATES — these are illustrative market-rate figures, not
// numbers from the pricing sheet. Replace them with figures you are happy to
// stand behind in front of a client. `covers` lists the offer line items each
// hire would have to replace.
// ---------------------------------------------------------------------------

export type InHouseTab = "accelerate" | "elite" | "website";

export type InHouseRole = { role: string; covers: string; cost: number };

export const inHouse: Record<
  InHouseTab,
  {
    tabLabel: string;
    cadence: "mo" | "one-time";
    roles: InHouseRole[];
    // What the in-house total is compared against.
    ours: { label: string; amount: number };
  }
> = {
  accelerate: {
    tabLabel: "Accelerate",
    cadence: "mo",
    roles: [
      {
        role: "Paid Social Media Buyer",
        covers: "Meta Ads System · Retargeting Campaign",
        cost: 5500,
      },
      {
        role: "Video Producer & Editor",
        covers: "Video Scripting & Editing · New Monthly Video Ads",
        cost: 5000,
      },
      {
        role: "Videographer",
        covers: "On-Site Video Shoot (2x/Yr)",
        cost: 1000,
      },
      {
        role: "CRM & Automation Specialist",
        covers: "BuilderLab CRM · Lead Follow-Up Automations",
        cost: 4500,
      },
      {
        role: "Marketing Strategist",
        covers: "Dedicated Growth Advisor",
        cost: 7000,
      },
      {
        role: "Data Analyst",
        covers: "Monthly Analytics + Reporting",
        cost: 2500,
      },
    ],
    ours: { label: "Our Accelerate package", amount: accelerate.prices.monthly },
  },
  elite: {
    tabLabel: "Elite",
    cadence: "mo",
    roles: [
      {
        role: "SEO Specialist",
        covers: "SEO (Search Engine Optimization)",
        cost: 4000,
      },
      {
        role: "Content & AEO Strategist",
        covers: "AEO (AI Engine Optimization)",
        cost: 3000,
      },
      {
        role: "Local Listings Manager",
        covers: "GMB (Google Business Profile) Management",
        cost: 1200,
      },
    ],
    ours: { label: "Our Elite add-on", amount: elite.addOnMonthly },
  },
  website: {
    tabLabel: "Website Build",
    cadence: "one-time",
    roles: [
      { role: "Strategist", covers: "Strategy Deep Dive", cost: 1500 },
      { role: "UX / UI Designer", covers: "Custom Design", cost: 4000 },
      { role: "Web Developer", covers: "Custom Built Website", cost: 6000 },
      {
        role: "Copywriter",
        covers: "Copy & Content Writing",
        cost: 2500,
      },
      {
        role: "Hosting & Security",
        covers: "Premium Hosting, Security, & Support (first year)",
        cost: 1200,
      },
    ],
    ours: { label: "Our Website Build", amount: website.price },
  },
};

// ---------------------------------------------------------------------------
// Pricing-page FAQs. Managed in the admin (Pricing FAQs); this list is the
// fallback shown until the CMS has any, and the source for
// scripts/seed-pricing-faqs.mjs.
// ---------------------------------------------------------------------------

export const pricingFaqs: { q: string; a: string | string[] }[] = [
  {
    q: "What's included in Accelerate?",
    a: "Accelerate is the core offer: a Meta Ads System, a Retargeting Campaign, an On-Site Video Shoot (2x/Yr), Video Scripting & Editing, New Monthly Video Ads, the BuilderLab CRM, Lead Follow-Up Automations, a Dedicated Growth Advisor, and Monthly Analytics + Reporting.",
  },
  {
    q: "What's the difference between monthly, 6 months and 12 months?",
    a: "It's the same system either way. Monthly is $2,800. Committing to 6 months is $14,000 and 12 months is $28,000, which saves you $2,800 and $5,600 compared with paying month to month.",
  },
  {
    q: "Does ad spend come out of my package fee?",
    a: "No. Your package covers our work: the strategy, creative, video, CRM, automations, and reporting. Ad spend is what goes into running the ads themselves, and it's separate from your BuilderLab investment.",
  },
  {
    q: "How much should I budget for ad spend on top of the package?",
    a: "Accelerate has a minimum ad spend of $2,500/mo. Your ideal budget depends on your market, goals, and how fast you want to grow, and we'll walk through the numbers with you before you commit.",
  },
  {
    q: "What do Elite and the Website Build add?",
    a: [
      "Elite is everything in Accelerate, plus SEO (Search Engine Optimization), AEO (AI Engine Optimization), and GMB (Google Business Profile) Management.",
      "The Website Build is a one-time $3,500: a custom built website with a strategy deep dive, custom design, copy and content writing, and premium hosting, security, and support.",
      "Accelerate is the core offer, and both of these are optional add-ons.",
    ],
  },
  {
    q: "Do you work with remodelers or just new home builders?",
    a: "Both. We partner with established home builders, large-scale remodelers, and residential construction companies that do great work but want a more predictable way to generate demand and land projects.",
  },
  {
    q: "What happens once I sign up?",
    a: "We build and install your acquisition system during the first 21 days. That includes dialing in your positioning and messaging, developing your creative strategy, scripting your ads, coordinating your on-site video shoot, editing the creative, setting up tracking and the CRM automations, and preparing your Meta campaigns for launch.",
  },
];
