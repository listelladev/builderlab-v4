// Blog content, modeled the way it would arrive from a CMS: one collection
// array, each item consumed by the shared article template at
// /blog/[slug]. `body` holds the rich-text content as typed blocks so the
// detail template can render consistent H2/H3/paragraph/list/image styling
// regardless of which article is being shown.

export type BlogBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "p-link"; before: string; linkText: string; href: string; after: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string };

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  intro: string;
  body: BlogBlock[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-referral-only-growth-caps-every-service-business",
    title: "Why Referral-Only Growth Caps Every Custom Home Builder",
    category: "Growth Strategy",
    date: "2026-06-02",
    author: "Builderlab Team",
    readTime: "6 min read",
    image: "/images/case-toptier.png",
    intro:
      "Referrals feel free, but they're the most expensive growth channel most custom home builders have, because it's the one you can never plan around. Here's why every referral-only builder eventually hits the same ceiling, and what actually breaks it.",
    body: [
      { type: "h2", text: "The referral trap" },
      {
        type: "p",
        text: "Every established builder we've worked with started the same way: word of mouth. It's flattering, it's cheap, and for a while it's genuinely enough. The problem shows up later, once you've built a crew and overhead around a growth channel you don't actually control.",
      },
      {
        type: "p",
        text: "Referrals scale with your past work, not your ambition. A great year means a full pipeline. A quiet year means the same crew sitting idle, and there's no lever to pull. You can't spend your way into more referrals next month.",
      },
      {
        type: "image",
        src: "/images/case-concrete.png",
        alt: "A construction crew working on site",
        caption: "Referral-only growth ties your pipeline to last year's work, not this year's ambition.",
      },
      { type: "h2", text: "What predictable growth actually requires" },
      {
        type: "p",
        text: "Predictability isn't about replacing referrals. It's about adding a second engine that runs independently of them. That means owning your positioning, your creative, and your ad spend well enough that you can turn the dial up or down on demand.",
      },
      {
        type: "list",
        items: [
          "A positioning statement that's true, specific, and defensible",
          "Creative you control, not a stock template shared with competitors",
          "A paid channel that captures both passive interest and active intent",
          "A sales process that doesn't rely on the owner personally following up",
        ],
      },
      { type: "h2", text: "The businesses that break through" },
      {
        type: "h3", text: "They stop treating marketing as a cost center" },
      {
        type: "p",
        text: "The businesses that actually escape the referral ceiling stop asking \"what does marketing cost\" and start asking \"what does a customer cost, and what are they worth.\" That single reframe changes every decision downstream.",
      },
      {
        type: "image",
        src: "/images/case-nhfa.png",
        alt: "A team reviewing growth metrics together",
      },
      {
        type: "p",
        text: "Referrals will always be part of a healthy building business. They're proof the work is good. But they were never designed to be a growth strategy on their own. Once you can turn a dollar into predictable, qualified demand, referrals become the bonus, not the whole plan.",
      },
    ],
  },
  {
    slug: "meta-ads-vs-google-ads-which-should-you-run-first",
    title: "Meta Ads vs Google Ads: Which Should You Run First?",
    category: "Paid Ads",
    date: "2026-05-18",
    author: "Builderlab Team",
    readTime: "5 min read",
    image: "/images/case-insight.png",
    intro:
      "Most businesses run whichever platform their competitor is running, or whichever an agency happens to specialize in. Here's a better way to decide, based on how your customers actually buy, not what's trending.",
    body: [
      { type: "h2", text: "Two very different jobs" },
      {
        type: "p",
        text: "Meta and Google aren't competing for the same budget. They're doing two completely different jobs in your funnel. Google captures demand that already exists. Meta creates demand that doesn't exist yet.",
      },
      {
        type: "p",
        text: "If someone is searching \"custom home builder near me,\" they've already decided to buy. They're deciding who from. That's Google's job, and it's usually the highest-intent traffic you can buy.",
      },
      { type: "h2", text: "Where Meta earns its place" },
      {
        type: "p",
        text: "Meta works earlier in the decision. Nobody wakes up scrolling Instagram looking to hire a builder, but a scroll-stopping video that builds trust plants the idea, so when they are ready to search, your name is the one they already recognize.",
      },
      {
        type: "image",
        src: "/images/case-mowman.png",
        alt: "Behind the scenes of a video ad shoot",
        caption: "Founder-led video creative is what makes Meta work for considered purchases.",
      },
      { type: "h3", text: "The mistake most businesses make" },
      {
        type: "list",
        items: [
          "Running Google alone and paying premium CPCs with no brand recognition backing the click",
          "Running Meta alone with generic stock creative that doesn't build real trust",
          "Splitting budget evenly instead of weighting toward whichever stage your business is weakest in",
        ],
      },
      { type: "h2", text: "So which comes first?" },
      {
        type: "p",
        text: "If you have zero brand recognition and a limited budget, start with Google. It's the lowest-risk way to prove the offer converts. Once you have a repeatable close rate, layer in Meta to lower your cost per lead and start owning the top of the funnel too.",
      },
    ],
  },
  {
    slug: "the-anatomy-of-a-scroll-stopping-ad",
    title: "The Anatomy of a Scroll-Stopping Ad",
    category: "Creative",
    date: "2026-05-04",
    author: "Builderlab Team",
    readTime: "7 min read",
    image: "/images/case-nhfa.png",
    intro:
      "Most ads fail in the first second, not the last. Here's what separates creative that gets scrolled past instantly from creative that actually earns three seconds of attention, and eventually a lead.",
    body: [
      { type: "h2", text: "You have less than a second" },
      {
        type: "p",
        text: "The average person decides whether to keep watching an ad before they've consciously registered what it's for. That decision is almost entirely visual: motion, faces, and pattern interrupts, not your logo or your offer.",
      },
      {
        type: "h2", text: "The three-second test" },
      {
        type: "p",
        text: "If someone watched the first three seconds of your ad with the sound off, would they know what's happening and want to keep watching? If the honest answer is no, the hook is the problem, not the offer, not the targeting.",
      },
      {
        type: "list",
        items: [
          "Open on a real moment, not a logo animation or a stock intro",
          "Show the transformation before you explain it",
          "Use on-screen text for the first line of dialogue, since most people watch muted",
          "Cut anything in the first three seconds that isn't earning attention",
        ],
      },
      {
        type: "image",
        src: "/images/case-toptier.png",
        alt: "A finished custom home exterior at dusk",
        caption: "Real, specific footage consistently outperforms polished stock content.",
      },
      { type: "h3", text: "Why founder-led creative wins" },
      {
        type: "p",
        text: "People trust people, not brands, especially for considered, high-ticket purchases. An ad featuring the actual person doing the actual work builds more trust in fifteen seconds than a beautifully produced brand film built to \"feel premium.\"",
      },
      { type: "h2", text: "Production doesn't mean polish" },
      {
        type: "p",
        text: "In-house production isn't about a bigger budget. It's about control and speed. The ability to script, shoot, and test a new hook within days, instead of waiting weeks for an external agency, is what actually compounds over a quarter.",
      },
    ],
  },
  {
    slug: "why-most-agencies-stop-at-the-lead",
    title: "Why Most Agencies Stop at the Lead (And Why That's a Problem)",
    category: "Sales",
    date: "2026-04-21",
    author: "Builderlab Team",
    readTime: "6 min read",
    image: "/images/case-concrete.png",
    intro:
      "A full inbox of leads means nothing if half of them never get a callback. Most agencies report on clicks and leads because that's where their responsibility ends. Here's why that's the wrong place to stop.",
    body: [
      { type: "h2", text: "Vanity metrics feel good, revenue pays the bills" },
      {
        type: "p",
        text: "Clicks, impressions, and even leads are easy to report and easy to inflate. None of them pay a single invoice. The only number that actually matters is revenue attributable back to the campaign, and most agencies simply don't track that far.",
      },
      { type: "h2", text: "What breaks between lead and sale" },
      {
        type: "list",
        items: [
          "Leads sitting unanswered for hours while the owner is on a job site",
          "No structured qualification, so the sales team wastes time on poor-fit leads",
          "No CRM, so nobody can see where a deal actually stalled",
          "No feedback loop from sales back to the ad campaigns generating the leads",
        ],
      },
      {
        type: "image",
        src: "/images/case-mowman.png",
        alt: "A business owner reviewing leads on a laptop",
      },
      { type: "h3", text: "Closing the loop" },
      {
        type: "p",
        text: "The businesses that scale fastest treat sales process as part of the marketing system, not a separate department. When ad spend and CRM data live in the same view, you can see exactly which campaigns produce leads that actually close, not just leads that look good on a report.",
      },
      { type: "h2", text: "Stop at the lead, and you'll always guess" },
      {
        type: "p",
        text: "If your growth partner's reporting ends at \"leads generated,\" you're being asked to trust that the rest of the funnel works. Reporting that follows the money all the way to revenue is the only version that actually tells you if it's working.",
      },
    ],
  },
  {
    slug: "how-to-price-a-premium-service-without-losing-the-room",
    title: "How to Price a Premium Service Without Losing the Room",
    category: "Positioning",
    date: "2026-04-06",
    author: "Builderlab Team",
    readTime: "5 min read",
    image: "/images/case-insight.png",
    intro:
      "Underpricing feels safe, but it's usually what's actually costing you the sale. Here's how the highest-margin custom home builders talk about price without flinching, and why the flinch is what loses the room.",
    body: [
      { type: "h2", text: "The flinch is contagious" },
      {
        type: "p",
        text: "If you hesitate before stating your price, the buyer notices, and mirrors it right back at you. Confidence around price isn't arrogance, it's a signal that you already know the work is worth it, which is exactly what a considered buyer is looking for.",
      },
      { type: "h2", text: "Justify the value before the number" },
      {
        type: "p",
        text: "By the time price comes up, the buyer should already understand exactly what makes you different from the cheaper option. If price is the first thing they hear about, of course it feels high. There's nothing yet to compare it against.",
      },
      {
        type: "list",
        items: [
          "Lead with outcomes and specificity, not generic quality claims",
          "Show the work, don't just describe it",
          "Let past clients say the expensive part out loud, so you don't have to",
        ],
      },
      {
        type: "image",
        src: "/images/case-nhfa.png",
        alt: "A team presenting project results",
      },
      { type: "h3", text: "Premium pricing needs premium proof" },
      {
        type: "p",
        text: "You can't charge a premium price on generic positioning. The businesses that hold their price with confidence have already done the work of proving, visually and specifically, why they're not interchangeable with the cheaper option down the road.",
      },
    ],
  },
  {
    slug: "the-21-day-growth-system-explained",
    title: "The 21-Day Growth System, Explained",
    category: "Growth Strategy",
    date: "2026-03-19",
    author: "Builderlab Team",
    readTime: "8 min read",
    image: "/images/case-mowman.png",
    intro:
      "\"We'll get to it eventually\" is how most growth initiatives die. Here's exactly what happens in the first 21 days of working with us, and why the order of operations matters more than the individual tactics.",
    body: [
      { type: "h2", text: "Why sequence matters more than speed" },
      {
        type: "p",
        text: "Running ads before positioning is locked in is the single most common mistake we see. It doesn't matter how good the creative is if the offer underneath it isn't dialled in yet. You'll just be paying to find out the offer needs work.",
      },
      { type: "h2", text: "Days 1–7: Positioning & Offer" },
      {
        type: "p",
        text: "We start by figuring out why you actually are the best option for a specific buyer, not every buyer. That gets locked into your messaging, your offer structure, and your unit economics before a single ad goes live.",
      },
      {
        type: "image",
        src: "/images/case-toptier.png",
        alt: "A strategy session in progress",
      },
      { type: "h2", text: "Days 8–14: Creative & Campaign Build" },
      {
        type: "h3", text: "Scripting, shooting, and building the funnel" },
      {
        type: "list",
        items: [
          "Script and produce founder-led creative in-house",
          "Build Meta campaigns to generate top-of-funnel demand",
          "Build Google campaigns to capture existing search intent",
          "Ship dedicated landing pages built to convert, not just inform",
        ],
      },
      { type: "h2", text: "Days 15–21: Launch & Scale What Works" },
      {
        type: "p",
        text: "Everything goes live, and from day one we're tracking cost per lead, cost per sale, and ROI in real time, not waiting for a monthly report to find out what worked. Winning creative gets more budget immediately; underperforming variants get cut fast.",
      },
      {
        type: "p",
        text: "Twenty-one days isn't a marketing timeline. It's how long it takes to install a system that keeps compounding long after the calendar runs out.",
      },
      {
        type: "p-link",
        before: "You can see exactly what this looks like once it's live in our",
        linkText: "MU Developments case study",
        href: "/case-studies/mu-developments",
        after: ", start to finish.",
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function formatBlogDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
