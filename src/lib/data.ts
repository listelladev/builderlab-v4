export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// filter: "silhouette" flattens the logo to a solid white mark (default).
// "detail" only desaturates + inverts luminance, preserving internal shading
// (needed for logos whose internal detail is drawn with color, not alpha,
// e.g. Birch Hill's monogram), using "silhouette" on those would erase it.
export const marqueeLogos: { src: string; height: number; filter?: "silhouette" | "detail" }[] = [
  { src: "/images/marquee/tmpxghj7zbw.png", height: 64 },
  { src: "/images/marquee/tmp0nx142o9.svg", height: 46 },
  { src: "/images/marquee/tmp8at_r56g.webp", height: 86 },
  { src: "/images/marquee/tmp9t_gru49.webp", height: 64 },
  { src: "/images/marquee/tmphrj5piff.webp", height: 64 },
  { src: "/images/marquee/tmpma6qahc2.webp", height: 86 },
  { src: "/images/marquee/tmpxuozryrn.webp", height: 64, filter: "detail" },
];

// width/height are each file's real pixel dimensions (needed so next/image's
// aspect-ratio hint matches the source instead of distorting it), height is
// the rendered display height in px. Their aspect ratios vary wildly (1.4:1
// up to 4.4:1 for GoHighLevel's wide wordmark), so a single shared height
// class made some read as tiny and others as oversized, height is tuned per
// logo so they carry roughly the same visual weight side by side.
export const partnerLogos = [
  { src: "/images/partners/nahb.webp", alt: "NAHB", href: "https://www.nahb.org/", width: 1630, height: 1135, displayHeight: 50 },
  { src: "/images/partners/meta-partner.png", alt: "Meta Business Partner", href: "https://www.facebook.com/business", width: 1138, height: 485, displayHeight: 38 },
  { src: "/images/partners/gohighlevel.png", alt: "GoHighLevel", href: "https://www.gohighlevel.com/", width: 500, height: 113, displayHeight: 26 },
  { src: "/images/partners/wpvip.png", alt: "WordPress VIP Gold Agency Partner", href: "https://wpvip.com/partners/", width: 268, height: 103, displayHeight: 42 },
];

export const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/builderlabmarketing" },
  { label: "Instagram", href: "https://www.instagram.com/builderlabmarketing" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/builderlabmarketing/" },
  { label: "YouTube", href: "https://www.youtube.com/@thebuilderlab" },
];

export const comparisonRows = {
  builderlab: [
    "Built exclusively for custom home builders",
    "You, on camera, building real trust",
    "Positioning & offer dialled in first",
    "Find your bottleneck, fix it, then scale",
    "Reporting on revenue, cost per sale & ROI",
    "Sales optimisation, CRM & follow-ups included",
    "One dedicated growth strategist, always",
    "Fair minimum term, then month to month",
  ],
  others: [
    "Generalists who'll take any client",
    "Stock footage and a generic voiceover",
    "Skip straight to running ads",
    "Run ads and hope for the best",
    "Vanity metrics: clicks and impressions",
    "Stops the moment you get a lead",
    "Siloed teams, passed around",
    "Multi-year contracts that trap you",
  ],
};

export const footerServices = [
  "Meta Ads",
  "Google Ads",
  "Creative Production",
  "Landing Pages",
  "CRO & UX",
  "Sales Optimisation",
  "CRM Integration",
];

export type CaseStudy = {
  name: string;
  stat: string;
  statLabel: string;
  bullets: string[];
  image?: string;
  video?: boolean;
  duration?: string;
  vimeoId?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    name: "Bianchi Group Developers",
    stat: "+212%",
    statLabel: "revenue growth",
    bullets: [
      "Six figures a month in ad spend, but growth had stalled.",
      "Doubled their revenue in just 11 months.",
      "Went from a 7 figure to an 8 figure builder in 24 months.",
    ],
    image: "/images/case-nhfa.png",
    vimeoId: "1205386331",
  },
  {
    name: "Blackbriar Development",
    stat: "+$1.2M",
    statLabel: "new revenue per year",
    bullets: [
      "Growing on word of mouth alone, with zero predictability.",
      "Installed premium positioning and founder-led ads.",
      "Now adding $1M+ a year in new build work.",
    ],
    image: "/images/case-toptier.png",
  },
  {
    name: "Rockstar Homes",
    stat: "+208%",
    statLabel: "revenue increase",
    bullets: [
      "Running his own ads and hitting a ceiling.",
      "We took over and rebuilt the entire system.",
      "Tripled his revenue inside 12 months.",
    ],
    image: "/images/case-insight.png",
    video: true,
    duration: "1:43",
  },
  {
    name: "Koze Design & Build",
    stat: "2×",
    statLabel: "revenue in 8 months",
    bullets: [
      "Established for years, but capped by word of mouth.",
      "Plugged in the full Builderlab Growth System.",
      "Doubled his revenue in 8 months.",
    ],
    video: true,
    duration: "1:34",
  },
  {
    name: "Stately Homes",
    stat: "+103%",
    statLabel: "monthly revenue",
    bullets: [
      "Wanted to grow without racing to the bottom on price.",
      "Suburb-targeted ads that attracted premium buyers.",
      "Doubled monthly revenue with zero discount ads.",
    ],
  },
  {
    name: "Imagine Development Ltd",
    stat: "+$1.8M",
    statLabel: "added revenue",
    bullets: [
      "Scaling on referrals alone, with no ad system in place.",
      "Added $800K in new revenue inside 12 months.",
      "Launched a new division that added another $1M.",
    ],
    image: "/images/case-mowman.png",
  },
  {
    name: "Alogla Custom Homes",
    stat: "+550%",
    statLabel: "increase in revenue",
    bullets: [
      "Relying on referral work alone, with no lead engine.",
      "Installed a lead system and a structured sales process.",
      "Tripled lead volume for 6.5× revenue.",
    ],
    image: "/images/case-concrete.png",
  },
];

export const capabilities = [
  { num: "01", name: "Positioning & Offer" },
  { num: "02", name: "Website & Landing Pages" },
  { num: "03", name: "Meta & Google Ads" },
  { num: "04", name: "SEO & Organic Growth" },
  { num: "05", name: "CRM & Lead Automation" },
  { num: "06", name: "Sales Process & Follow-Up" },
];

export const steps = [
  {
    n: "01",
    title: "Positioning & Offer",
    body: "Every builder says they do quality work. We figure out why buyers should choose you specifically. Then we nail your positioning, your offer, your messaging, and your unit economics.",
    tags: ["Market positioning", "Offer packaging", "Messaging framework", "Unit economics"],
    visual: "positioning",
  },
  {
    n: "02",
    title: "Plug In Our Ads System",
    body: "We generate leads on Meta Ads through scroll-stopping creative that builds trust and makes your brand impossible to miss. We capture intent on Google Ads from people actively searching for what you offer. Two channels. One goal. More leads, more revenue.",
    tags: ["Creative strategy", "Ad scripting", "Landing pages", "Creative testing"],
    visual: "ads",
  },
  {
    n: "03",
    title: "Scale What Works",
    body: "We find what works. Then we pour fuel on it. Real-time tracking, data-driven decisions, and continuous optimisation to scale your business profitably.",
    tags: ["Revenue tracking"],
    visual: "dashboard",
  },
];

export const testimonials = [
  {
    text: "One month in and revenue has doubled, with less than an hour of marketing work from me. They get you in front of customers ready to buy.",
    name: "Ben Fairbairn",
    company: "Crestline Homes",
    initials: "BF",
  },
  {
    text: "Working with Builderlab has been exceptional. The quality of leads is second to none, and their service surpasses any agency we've dealt with in 10 years. Can't recommend them highly enough.",
    name: "Anthony Spagnolo",
    company: "Meridian Builders",
    initials: "AS",
  },
  {
    text: "Within 3 months they helped double our revenue (7-figure run rate), expand internationally, and sharpen our Google & Meta ads. Highly recommend for any company looking to scale.",
    name: "Tim Veron",
    company: "Hallmark Custom Homes",
    initials: "TV",
  },
  {
    text: "We were happy with our previous agency but wanted to take the business to the next level. We moved to the Builderlab team and the results have exceeded expectations. Very pleased we made the change.",
    name: "DB",
    company: "",
    initials: "DB",
  },
  {
    text: "I was skeptical and only agreed to a one-month trial. They delivered everything they promised and more. The lead quality far surpassed my expectations, and it feels like a real partnership.",
    name: "SC",
    company: "",
    initials: "SC",
  },
  {
    text: "The team goes the extra mile to make sure everything works as intended. Highly recommend.",
    name: "JO",
    company: "",
    initials: "JO",
  },
  {
    text: "An absolute game-changer. Brought in more work than I could keep up with, and the ad creative was awesome. The team's knowledge, speed and efficiency are amazing. Five stars all the way.",
    name: "Matthew",
    company: "Northgate Custom Homes",
    initials: "MD",
  },
  {
    text: "Very informative, creative and knowledgeable. We're really happy with the service the team provided.",
    name: "CS",
    company: "",
    initials: "CS",
  },
  {
    text: "Our leads haven't stopped coming in, consistently 4-5 a day, and still on a relatively low marketing budget. If you want to grow your business, go with Builderlab.",
    name: "CP",
    company: "",
    initials: "CP",
  },
];

export const faqs = [
  {
    q: "What builders do you work with?",
    a: "Custom home builders and design-build firms running $3M to $10M businesses. If you're building $700K to $2M custom homes and tired of guessing whether your marketing is working, we're built for you.",
  },
  {
    q: "How long does it take to see results?",
    a: "Paid ads can start producing qualified leads within 2 to 4 weeks. SEO and organic channels take longer to compound, usually 6 to 12 months before you see meaningful movement. We map out a realistic timeline for your market before we start, so you know exactly what to expect and when.",
  },
  {
    q: "Do you lock clients into contracts?",
    a: "There's a fair minimum term so the strategy has a real chance to work. After that, we're month to month. Our partners stay because it's working, not because they're locked in.",
  },
  {
    q: "What platforms do you advertise on?",
    a: "Meta Ads and Google Ads. We run one or both depending on what your business needs and where your buyers are actually spending their time.",
  },
  {
    q: "Do you create the ad creative?",
    a: "Yes. Everything is scripted, edited, and produced in-house, often with you on camera, since a real person talking about their work builds more trust than stock footage ever will.",
  },
  {
    q: "What makes Builderlab different from other agencies?",
    a: "Most agencies hand you a report full of clicks and impressions. We measure success in conversations that turn into contracts, and we'll actually tell you when something isn't working. We're not yes-men. We're builders of pipelines.",
  },
  {
    q: "How do I get started?",
    a: 'Click "Book My Free Strategy Call" and pick a time that works. You\'ll speak directly with a Growth Strategist who will audit your current marketing, your positioning, and your growth opportunities. Something that would normally cost thousands. Completely free. No sales pitch. Just a clear plan to grow your business.',
  },
];

export const phoneCodes = [
  { flag: "🇦🇺", code: "+61" },
  { flag: "🇺🇸", code: "+1" },
  { flag: "🇬🇧", code: "+44" },
  { flag: "🇨🇦", code: "+1" },
  { flag: "🇳🇿", code: "+64" },
  { flag: "🇩🇪", code: "+49" },
  { flag: "🇫🇷", code: "+33" },
  { flag: "🇳🇱", code: "+31" },
  { flag: "🇪🇸", code: "+34" },
  { flag: "🇮🇹", code: "+39" },
  { flag: "🇵🇭", code: "+63" },
  { flag: "🇲🇾", code: "+60" },
  { flag: "🇭🇰", code: "+852" },
  { flag: "🇯🇵", code: "+81" },
  { flag: "🇨🇳", code: "+86" },
];
