// Everything the /pricing page says, in one place. Offer names, prices and
// feature wording are taken verbatim from the pricing sheet — edit here, not
// in the components.

export type TermId = "monthly" | "6mo";

export const terms: { id: TermId; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "6mo", label: "6 Months" },
];

/** Shown under both packages: what happens once the program ends. */
export const afterProgram =
  "After the initial 6 months, it goes month-to-month at the current monthly rate.";

export const accelerate = {
  tier: "Program",
  name: "6 Month Growth Program",
  // monthly: per month over the 6-month program. 6mo: the program paid in full.
  prices: { monthly: 2750, "6mo": 13500 } as Record<TermId, number>,
  features: [
    "Meta Ads Strategy & Management",
    "Professional On-Site Video Shoot",
    "Video Scripting & Editing",
    "Monthly Creative Refresh",
    "BuilderLab CRM",
    "Lead Follow-Up Automations",
    "AI Sales Coach & Feedback",
    "Direct Access To BL Team",
    "Monthly Analytics & Reporting",
  ],
  minAdSpend: "Min Ad Spend - $2,000/mo",
};

// Ongoing monthly add-on (internally still `elite`; it is no longer a "tier").
export const elite = {
  name: "SEO & AI Search Ranking",
  // "$2,000/mo add on" — what this costs on top of a committed Accelerate.
  addOnMonthly: 2000,
  // "$4,500 - Monthly" — Accelerate + this add-on when paid month to month.
  monthly: 4500,
  features: [
    "SEO (Search Engine Optimization)",
    "AEO (AI Engine Optimization)",
    "GMB (Google Business Profile) Management",
  ],
};

export const website = {
  name: "Website Build",
  price: 4500,
  features: [
    "Custom Built Website",
    "Strategy Deep Dive",
    "Custom Design",
    "Copy & Content Writing",
    "Premium Hosting, Security, & Support",
  ],
};

// "Not ready for the full investment?": the downsell, tucked under the
// Accelerate card behind a discreet link for use on sales calls. Same system
// 6 Month Growth Program without the on-site video shoot and the monthly
// creative refresh. Shown on its own; it is not part of the proposal builder.
const LITE_EXCLUDED = ["Professional On-Site Video Shoot", "Monthly Creative Refresh"];

export const accelerateLite = {
  name: "6 Month Growth Program",
  badge: "Available upon request",
  intro:
    "For builders who want to start with BuilderLab before stepping up to the full program.",
  monthly: 1500,
  payInFull: 7500,
  features: accelerate.features.filter((f) => !LITE_EXCLUDED.includes(f)),
  notIncluded: LITE_EXCLUDED,
};

/** Savings of a 6-month commitment against paying Accelerate monthly. */
export function commitmentSavings(term: TermId): number {
  if (term === "monthly") return 0;
  return accelerate.prices.monthly * 6 - accelerate.prices[term];
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
 * The SEO & AI Search add-on on a month-to-month term is the one place two sheet prices meet:
 * Accelerate ($2,800) + the add-on ($2,000) does not equal the
 * "$4,500 - Monthly" combined price, so on that term it is quoted as a single
 * $4,500/mo line rather than summing the two. On 6 months the add-on is
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
            label: `${accelerate.name} + ${elite.name}`,
            note: "Monthly · 6-month program",
            amount: elite.monthly,
            suffix: "/mo",
          }
        : {
            key: "core",
            label: accelerate.name,
            note: "Monthly · 6-month program",
            amount: accelerate.prices.monthly,
            suffix: "/mo",
          },
    );
  } else {
    lines.push({
      key: "core",
      label: accelerate.name,
      note: "Paid in full · 6 months",
      amount: accelerate.prices[term],
      suffix: "",
    });
    if (withElite) {
      lines.push({
        key: "elite",
        label: elite.name,
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

/** Every dropdown on the page: the in-house breakdowns plus the downsell. */
export type PricingDropdown = InHouseTab | "lite";

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
    tabLabel: "6 Month Growth Program",
    cadence: "mo",
    roles: [
      {
        role: "Paid Social Media Buyer",
        covers: "Meta Ads Strategy & Management",
        cost: 5500,
      },
      {
        role: "Video Producer & Editor",
        covers: "Video Scripting & Editing · Monthly Creative Refresh",
        cost: 5000,
      },
      {
        role: "Videographer",
        covers: "Professional On-Site Video Shoot",
        cost: 1000,
      },
      {
        role: "CRM & Automation Specialist",
        covers: "BuilderLab CRM · Lead Follow-Up Automations",
        cost: 4500,
      },
      {
        role: "Marketing Strategist",
        covers: "Direct Access To BL Team · AI Sales Coach & Feedback",
        cost: 7000,
      },
      {
        role: "Data Analyst",
        covers: "Monthly Analytics & Reporting",
        cost: 2500,
      },
    ],
    ours: { label: "Our 6 Month Growth Program", amount: accelerate.prices.monthly },
  },
  elite: {
    tabLabel: "SEO & AI Search Ranking",
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
    ours: { label: "Our SEO & AI Search add-on", amount: elite.addOnMonthly },
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
    q: "What's included in the 6 Month Growth Program?",
    a: "The 6 Month Growth Program is the core offer: Meta Ads Strategy & Management, Professional On-Site Video Shoot, Video Scripting & Editing, Monthly Creative Refresh, BuilderLab CRM, Lead Follow-Up Automations, AI Sales Coach & Feedback, Direct Access To BL Team, and Monthly Analytics & Reporting.",
  },
  {
    q: "What's the difference between monthly and 6 months?",
    a: "It's the same system either way. Monthly is $2,750/mo. Paying the 6 months in full is $13,500, which saves you $3,000. After the initial 6 months, it goes month-to-month at the current monthly rate.",
  },
  {
    q: "Does ad spend come out of my package fee?",
    a: "No. Your package covers our work: the strategy, creative, video, CRM, automations, and reporting. Ad spend is what goes into running the ads themselves, and it's separate from your BuilderLab investment.",
  },
  {
    q: "How much should I budget for ad spend on top of the package?",
    a: "The 6 Month Growth Program has a minimum ad spend of $2,000/mo. Your ideal budget depends on your market, goals, and how fast you want to grow, and we'll walk through the numbers with you before you commit.",
  },
  {
    q: "What do the SEO & AI Search Ranking and Website Build add-ons include?",
    a: [
      "SEO & AI Search Ranking is an ongoing monthly add-on to the 6 Month Growth Program: SEO (Search Engine Optimization), AEO (AI Engine Optimization), and GMB (Google Business Profile) Management.",
      "The Website Build is a one-time $4,500: a custom built website with a strategy deep dive, custom design, copy and content writing, and premium hosting, security, and support.",
      "The 6 Month Growth Program is the core offer, and both of these are optional add-ons.",
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
