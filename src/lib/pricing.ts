// Everything the /pricing page says, in one place. Program names, prices and
// feature wording are taken verbatim from the client's reworked pricing page
// (Nov 2026). Edit here, not in the components.

export type TermId = "12mo" | "6mo" | "monthly";

export const terms: {
  id: TermId;
  label: string;
  badge?: string;
  /** Small pill on the term explainer card. */
  tag: string;
  setupFee: number;
  /** Line under each program's price. */
  setupCopy: string;
  blurb: string;
}[] = [
  {
    id: "12mo",
    label: "12 Months",
    badge: "No setup fee",
    tag: "Best Value",
    setupFee: 0,
    setupCopy: "No setup fee",
    blurb: "The full runway to build, test and scale. Most builders choose this option.",
  },
  {
    id: "6mo",
    label: "6 Months",
    tag: "Try It Out",
    setupFee: 2000,
    setupCopy: "+ $2,000 one-time setup fee",
    blurb: "Enough time to launch your system and see real results come in.",
  },
  {
    id: "monthly",
    label: "Month-to-Month",
    tag: "Most Flexible",
    setupFee: 5000,
    setupCopy: "+ $5,000 one-time setup fee",
    blurb: "No long-term commitment. Stay because it's working, not because of a contract.",
  },
];

export const termById = (id: TermId) => terms.find((t) => t.id === id)!;

export type PlanId = "core" | "scale" | "elite";

export type RoadmapStep = { when: string; title: string; body: string };
export type FeatureGroup = { title: string; desc: string; items: string[] };

export type Plan = {
  id: PlanId;
  tier: string;
  name: string;
  forWho: string;
  tagline: string;
  monthly: number;
  cta: string;
  featured?: boolean;
  roadmap: RoadmapStep[];
  includesLabel: string;
  groups: FeatureGroup[];
  adSpend: string;
};

const KICKOFF: RoadmapStep = {
  when: "Within 48 hours",
  title: "Kickoff Call",
  body: "We align on goals, get access to everything and build your strategy.",
};

export const plans: Plan[] = [
  {
    id: "core",
    tier: "Tier 1",
    name: "Core",
    forWho: "For builders who need a steady flow of leads",
    tagline:
      "Ads that get you noticed, follow-up that never forgets, and reviews that build trust.",
    monthly: 2500,
    cta: "Get Started with Core",
    roadmap: [
      KICKOFF,
      {
        when: "Day 30",
        title: "You're Live and Getting Inquiries",
        body: "Meta Ads are running and every lead gets an instant text and email.",
      },
      {
        when: "Day 60",
        title: "You Stay Top of Mind",
        body: "Retargeting, tuned ads and new reviews do the work. No more chasing leads by hand.",
      },
      {
        when: "Day 90",
        title: "A Predictable Pipeline",
        body: "Qualified inquiries come in consistently from homeowners who found you.",
      },
    ],
    includesLabel: "Everything Included",
    groups: [
      {
        title: "Meta Ads",
        desc: "Reach homeowners planning to build and stay in front of them until they're ready to talk.",
        items: [
          "Meta Ads Management",
          "Retargeting Campaign",
          "Ad Scripting & Editing",
          "3 New Video Ads per Month",
          "4 New Image Ads per Month",
        ],
      },
      {
        title: "Google Business Profile",
        desc: "Look established and trusted the moment someone searches your name.",
        items: ["GBP Clean Up", "4 Posts per Month", "Auto Review Requests & Replies"],
      },
      {
        title: "CRM & Automation",
        desc: "Every lead gets a fast reply, and nothing slips through the cracks.",
        items: [
          "BuilderLab CRM",
          "Lead Follow-Up Texts & Emails",
          "Missed Call Text Back",
          "Pipeline Management",
        ],
      },
      {
        title: "Strategy & Team",
        desc: "A dedicated expert, a clear plan and numbers you can see.",
        items: ["Bi-Weekly Strategy Call", "Dedicated Growth Strategist", "King KPI Dashboard"],
      },
    ],
    adSpend: "$2,000/mo",
  },
  {
    id: "scale",
    tier: "Tier 2",
    name: "Scale",
    forWho: "For builders ready to own their market online",
    tagline:
      "Add a new website, Google Ads and SEO so homeowners find you the moment they start looking.",
    monthly: 3750,
    cta: "Get Started with Scale",
    featured: true,
    roadmap: [
      KICKOFF,
      {
        when: "Day 30",
        title: "Live Everywhere Homeowners Look",
        body: "Your new website, Meta Ads and Google Ads are live. Search or scroll, you show up.",
      },
      {
        when: "Day 60",
        title: "Your Market Starts to Notice",
        body: "Ads tuned to what converts, a growing Google profile and SEO building your authority.",
      },
      {
        when: "Day 90",
        title: "The Builder People Recognize",
        body: "Lead nurture is running and homeowners know your name before they ever call.",
      },
    ],
    includesLabel: "Everything in Core, Plus",
    groups: [
      {
        title: "Website Design & Hosting",
        desc: "A website that turns visitors into consultations, with nothing for you to maintain.",
        items: ["Website Design & Build", "Hosting, Security & Maintenance"],
      },
      {
        title: "Google Ads",
        desc: "Show up first when homeowners search for a builder in your area.",
        items: ["Google Ads Management", "Conversion Landing Page"],
      },
      {
        title: "AI Search & SEO",
        desc: "Get found on Google and recommended by AI tools, without paying per click.",
        items: [
          "SEO & Rankings",
          "AI Search Optimization",
          "2 Monthly Blog Articles",
          "Business Directory Listings",
        ],
      },
    ],
    adSpend: "$3,000 – $4,000/mo",
  },
  {
    id: "elite",
    tier: "Tier 3",
    name: "Elite",
    forWho: "For builders who want to be the name in town",
    tagline:
      "Professional video, social media and email that keep your brand in front of homeowners all year.",
    monthly: 5250,
    cta: "Get Started with Elite",
    roadmap: [
      KICKOFF,
      {
        when: "Day 30",
        title: "Live Everywhere Homeowners Look",
        body: "Your new website, Meta Ads and Google Ads are live. Search or scroll, you show up.",
      },
      {
        when: "Day 60",
        title: "Your Brand Is Everywhere",
        body: "Professional video powers your ads and social, and your newsletter keeps referrals warm.",
      },
      {
        when: "Day 90",
        title: "Complete Market Dominance",
        body: "Your pipeline builds consistently and you're the obvious builder in your market.",
      },
    ],
    includesLabel: "Everything in Scale, Plus",
    groups: [
      {
        title: "Video Production",
        desc: "Professional footage that makes your ads, website and social stand out.",
        items: ["On-Site Video Production (2x/Year)"],
      },
      {
        title: "Social Media",
        desc: "An active social presence that takes none of your time.",
        items: ["4 Social Media Posts per Month (Scripted, Edited & Posted)"],
      },
      {
        title: "Email Marketing",
        desc: "Past clients and referral partners keep your name top of mind.",
        items: ["Monthly Email Newsletter (Client Branded)"],
      },
    ],
    adSpend: "$3,000 – $4,000/mo",
  },
];

export const planById = (id: PlanId) => plans.find((p) => p.id === id)!;

export const plansFootNote =
  "Website design is included in Scale and Elite. Ad spend is paid directly to Meta and Google and is separate from your program fee.";

// ---------------------------------------------------------------------------
// One-time add-ons. The two websites are alternatives: picking one swaps out
// the other (`group`).
// ---------------------------------------------------------------------------

export type AddOnId = "video" | "premium-site" | "boosted-site";

export type AddOn = {
  id: AddOnId;
  name: string;
  desc: string;
  price: number;
  features: string[];
  group?: "website";
  wide?: boolean;
};

export const addOns: AddOn[] = [
  {
    id: "video",
    name: "Done-For-You Video Marketing",
    desc: "A professional videographer meets you on-site for a 4-hour filming session.",
    price: 1500,
    wide: true,
    features: [
      "(1) Owner Introduction Video",
      "(2) Company Process Videos",
      "(1) Project Spotlight Video",
      "(1) Client Case Study",
      "Vertical B-Roll for Ads",
      "Professional Editing, ready to use for ads, website and social media",
    ],
  },
  {
    id: "premium-site",
    name: "Premium Website",
    desc: "A clean, fast website that tells your story and turns visitors into leads.",
    price: 3995,
    group: "website",
    features: [
      "Website Design & Build",
      "Copy & Content Writing",
      "Premium Hosting, Security & Support",
      "8 to 12 Pages",
      "Foundational SEO",
      "Analytics Setup",
      "CRM Integration",
    ],
  },
  {
    id: "boosted-site",
    name: "Boosted Website",
    desc: "More pages, more polish and stronger SEO for builders with a bigger portfolio.",
    price: 5995,
    group: "website",
    features: [
      "Website Design & Build",
      "Copy & Content Writing",
      "Premium Hosting, Security & Support",
      "12 to 20 Pages",
      "Premium Animations",
      "Boosted SEO",
      "Analytics Setup",
      "CRM Integration",
    ],
  },
];

export const addOnById = (id: AddOnId) => addOns.find((a) => a.id === id)!;

// ---------------------------------------------------------------------------
// "Your Proposal" receipt.
// ---------------------------------------------------------------------------

export type ProposalLine = {
  key: string;
  label: string;
  note?: string;
  amount: number;
  suffix: string;
  /** Shown instead of the amount (e.g. "Waived"). */
  display?: string;
};

export function buildProposal(term: TermId, planId: PlanId, addOnIds: AddOnId[]) {
  const t = termById(term);
  const plan = planById(planId);
  const commitment =
    term === "monthly" ? "Month-to-month" : `${t.label} commitment`;

  const lines: ProposalLine[] = [
    {
      key: "plan",
      label: `${plan.name} Program`,
      note: commitment,
      amount: plan.monthly,
      suffix: "/mo",
    },
    t.setupFee
      ? {
          key: "setup",
          label: "One-time setup fee",
          note: t.label,
          amount: t.setupFee,
          suffix: "",
        }
      : {
          key: "setup",
          label: "Setup fee",
          note: "Waived on 12 months",
          amount: 0,
          suffix: "",
          display: "Waived",
        },
  ];

  // Keep add-ons in page order regardless of click order.
  for (const a of addOns) {
    if (!addOnIds.includes(a.id)) continue;
    lines.push({ key: a.id, label: a.name, note: "One time", amount: a.price, suffix: "" });
  }

  const oneTime =
    t.setupFee + addOns.filter((a) => addOnIds.includes(a.id)).reduce((s, a) => s + a.price, 0);

  return { lines, monthly: plan.monthly, oneTime, adSpend: plan.adSpend };
}

// ---------------------------------------------------------------------------
// "What this costs to build in-house": a dropdown inside each program card.
// Illustrative estimates from the client's page. `covers` lists the program
// line items each hire would have to replace.
// ---------------------------------------------------------------------------

export type InHouseRole = { role: string; covers: string; cost: number };

const coreRoles: InHouseRole[] = [
  { role: "Paid Social Media Buyer", covers: "Meta Ads Management · Retargeting Campaign", cost: 5500 },
  { role: "Video Producer & Editor", covers: "Ad Scripting & Editing · 3 Video Ads per Month", cost: 5000 },
  { role: "Graphic Designer", covers: "4 Image Ads per Month", cost: 3000 },
  { role: "Local Listings Manager", covers: "Google Business Profile · Review Requests", cost: 1200 },
  { role: "CRM & Automation Specialist", covers: "BuilderLab CRM · Follow-Up · Missed Call Text Back", cost: 4500 },
  { role: "Marketing Strategist", covers: "Dedicated Growth Strategist · Bi-Weekly Strategy Calls", cost: 7000 },
  { role: "Data Analyst", covers: "King KPI Dashboard", cost: 2500 },
];

const scaleExtra: InHouseRole[] = [
  { role: "Web Designer & Developer", covers: "Website Design & Build · Hosting & Maintenance", cost: 3000 },
  { role: "Google Ads Specialist", covers: "Google Ads Management · Conversion Landing Page", cost: 5000 },
  { role: "SEO Specialist", covers: "SEO & Rankings · Business Directory Listings", cost: 4000 },
  { role: "Content & AEO Strategist", covers: "AI Search Optimization · 2 Blog Articles per Month", cost: 3000 },
];

const eliteExtra: InHouseRole[] = [
  { role: "Videographer", covers: "On-Site Video Production (2x/Year)", cost: 1000 },
  { role: "Social Media Manager", covers: "4 Social Posts per Month, Scripted & Edited", cost: 3500 },
  { role: "Email Marketing Specialist", covers: "Monthly Client-Branded Newsletter", cost: 2000 },
];

const sum = (roles: InHouseRole[]) => roles.reduce((s, r) => s + r.cost, 0);
const coreTotal = sum(coreRoles);
const scaleTotal = coreTotal + sum(scaleExtra);

export const inHouse: Record<PlanId, { roles: InHouseRole[]; oursLabel: string }> = {
  core: { roles: coreRoles, oursLabel: "Our Core program" },
  scale: {
    roles: [
      { role: "Your Core team", covers: "Everything in Core, hired in-house", cost: coreTotal },
      ...scaleExtra,
    ],
    oursLabel: "Our Scale program",
  },
  elite: {
    roles: [
      { role: "Your Scale team", covers: "Everything in Scale, hired in-house", cost: scaleTotal },
      ...eliteExtra,
    ],
    oursLabel: "Our Elite program",
  },
};

// ---------------------------------------------------------------------------
// "Which program is right for you?" comparison table. A cell is `true` (✓),
// `false` (—) or text.
// ---------------------------------------------------------------------------

export type CompareCell = boolean | string;
export type CompareRow = { label: string; cells: [CompareCell, CompareCell, CompareCell] };

export const compare: { bestFor: [string, string, string]; groups: { title: string; rows: CompareRow[] }[] } = {
  bestFor: ["Steady lead flow", "Owning search", "Market leadership"],
  groups: [
    {
      title: "Advertising",
      rows: [
        { label: "Meta Ads Management", cells: [true, true, true] },
        { label: "Retargeting Campaign", cells: [true, true, true] },
        { label: "New ads per month", cells: ["3 video + 4 image", "3 video + 4 image", "3 video + 4 image"] },
        { label: "Google Ads Management", cells: [false, true, true] },
        { label: "Conversion Landing Page", cells: [false, true, true] },
      ],
    },
    {
      title: "Get found",
      rows: [
        { label: "Google Business Profile", cells: [true, true, true] },
        { label: "Website Design, Build & Hosting", cells: [false, true, true] },
        { label: "SEO & AI Search Optimization", cells: [false, true, true] },
        { label: "Blog articles per month", cells: [false, "2", "2"] },
      ],
    },
    {
      title: "Brand & content",
      rows: [
        { label: "On-Site Video Production", cells: [false, false, "2x per year"] },
        { label: "Social media posts per month", cells: [false, false, "4"] },
        { label: "Monthly Email Newsletter", cells: [false, false, true] },
      ],
    },
    {
      title: "CRM & support",
      rows: [
        { label: "BuilderLab CRM & Automations", cells: [true, true, true] },
        { label: "Dedicated Growth Strategist", cells: [true, true, true] },
        { label: "Strategy calls", cells: ["Bi-weekly", "Bi-weekly", "Bi-weekly"] },
      ],
    },
    {
      title: "Budget",
      rows: [{ label: "Recommended ad spend", cells: ["$2,000/mo", "$3,000 – $4,000/mo", "$3,000 – $4,000/mo"] }],
    },
  ],
};

// ---------------------------------------------------------------------------
// Pricing-page FAQs. Managed in the admin (Pricing FAQs); this list is the
// fallback shown until the CMS has any, and the source for
// scripts/seed-pricing-faqs.mjs (via scripts/data/pricing-faqs.json).
// ---------------------------------------------------------------------------

export const pricingFaqs: { q: string; a: string | string[] }[] = [
  {
    q: "Which program should I start with?",
    a: "If you need more leads now and already have a website you're happy with, start with Core. If your website is outdated or you want to show up on Google, go with Scale. If you want to be the most recognized builder in your area, Elite covers everything. We'll help you decide on your strategy call.",
  },
  {
    q: "I build ultra high-end homes. Is Core still a good fit?",
    a: "Yes. For ultra high-end builders, we may recommend Google Ads instead of Meta Ads at the Core level. Your market is smaller, so reaching homeowners who are actively searching for a builder works better. Everything else in Core stays the same.",
  },
  {
    q: "Does ad spend come out of my program fee?",
    a: "No. Ad spend is paid directly to Meta and Google and is separate from your BuilderLab program fee. Each program lists a recommended monthly budget.",
  },
  {
    q: "How is my ad spend used across Meta and Google?",
    a: "Each platform has a different job. Meta Ads (Facebook and Instagram) build trust: they introduce you, show off your finished projects and teach homeowners about the homes you build, like lake homes or energy-efficient homes. Google Ads capture demand: they put you at the top of search results when homeowners are looking for a builder right now. Together, Meta builds the trust and Google catches the homeowner when they're ready to build.",
  },
  {
    q: "What's the difference between the commitment options?",
    a: "The monthly price is the same. A 12-month program has no setup fee. A 6-month program has a $2,000 one-time setup fee, and month-to-month has a $5,000 one-time setup fee.",
  },
  {
    q: "Is a website included?",
    a: "Website design, build and hosting are included in Scale and Elite. On Core, you can add a Premium Website ($3,995) or Boosted Website ($5,995) as a one-time project.",
  },
  {
    q: "Can I upgrade later?",
    a: "Yes. Many builders start on Core and move up once their pipeline is full. Just tell your Growth Strategist and we'll plan the switch.",
  },
  {
    q: "What guarantees do you offer?",
    a: "Two. Our 7-Day Alignment Guarantee: if we're not the right fit, get your money back within your first 7 days, no questions asked. And our 12-Month ROI Guarantee: if you don't see a return on your investment, we keep working for free until you do.",
  },
];
