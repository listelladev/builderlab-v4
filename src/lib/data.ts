export type NavLink = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Client Wins", href: "/client-wins" },
  {
    label: "Resources",
    children: [
      // TODO: swap in the real Podcast / Ads Handbook URLs once provided.
      { label: "Builder Backstage Podcast", href: "#" },
      { label: "Builder Ads Handbook", href: "#" },
      { label: "YouTube Channel", href: "https://www.youtube.com/@thebuilderlab" },
    ],
  },
  { label: "FAQs", href: "/#faqs" },
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
  "Creative Production",
  "High-Converting Websites",
  "AI Search Optimization",
  "CRM & Automation",
];

export type VideoTestimonial = {
  wistiaId: string;
  name: string;
  blurb: string;
  /** Custom poster image (a real project/client photo) — passed straight
   * to wistia-player's `poster` attribute, which overrides Wistia's own
   * auto-generated video-frame swatch entirely. */
  poster: string;
};

// Names are pulled straight from each video's Wistia title (verified via
// Wistia's oEmbed metadata, not guessed from the transcript), and turn out
// to be the same clients as the old YouTube set. Summaries are short pulls
// from each video's own transcript, not marketing copy written from
// scratch, kept to 1-2 sentences so they stay well inside the card's
// flexible-height content area regardless of which video is longest. Jeff
// Martin appears twice (a full testimonial plus a quick-stats recap clip)
// so they're kept apart in list order, not at the two ends, since the
// carousel triples this array and the ends wrap next to each other.
export const videoTestimonials: VideoTestimonial[] = [
  {
    wistiaId: "deqa5gu0np",
    name: "Jeff Martin",
    blurb:
      "After relocating to Georgia with no local network, Jeff booked 10-15 client meetings in his very first week, turning $4,600 in ad spend into three sets of plans and a pipeline of serious land buyers.",
    poster: "/images/testimonials/jeff-martin-a.webp",
  },
  {
    wistiaId: "nksu2vle0e",
    name: "Josh Sanders",
    blurb:
      "Josh says the CRM makes it easy to stay organized: following up with longer-term leads every few weeks while booking in-office meetings with the ones ready to move now.",
    poster: "/images/testimonials/josh-sanders.webp",
  },
  {
    wistiaId: "4o9usavu0v",
    name: "Chris Coleman",
    blurb:
      "BuilderLab rebuilt Birch Hill Homes' website and marketing from the ground up, driving a big lift in leads, and delivered it ahead of schedule with a better product than expected.",
    poster: "/images/testimonials/chris-coleman.webp",
  },
  {
    wistiaId: "gxbl3cxdos",
    name: "Daniel Green",
    blurb:
      "From a custom growth blueprint to high-performing ad creative, BuilderLab helped Blackbriar Development attract high-end clientele and build a consistent pipeline of new projects.",
    poster: "/images/testimonials/daniel-green.webp",
  },
  {
    wistiaId: "p8mzlcw182",
    name: "Jeff Martin",
    blurb:
      "The quick numbers: 10-15 booked meetings in week one, three sets of plans, four serious land buyers, and another 10-15 warm prospects in the pipeline.",
    poster: "/images/testimonials/jeff-martin-b.webp",
  },
  {
    wistiaId: "v9u3d0sk9r",
    name: "John Lendvai",
    blurb:
      "Tracking leads inside the CRM turned into real business, including a design services agreement in the works and a contract pipeline worth hundreds of thousands of dollars.",
    poster: "/images/testimonials/john-lendvai.webp",
  },
  {
    wistiaId: "erl547aqay",
    name: "Anthony Natale",
    blurb:
      "BuilderLab took the time to actually learn how Rockstone Homes builds. The result: a new site ranking on Google, ads running, and so many quality leads Anthony can pick and choose his projects.",
    poster: "/images/testimonials/anthony-natale.webp",
  },
  {
    wistiaId: "fe0l0e47nx",
    name: "Mike Wolf",
    blurb:
      "A 30-year real estate investor and educator, Mike says Eric doesn't just deliver: he over-delivers, hitting every deadline ahead of schedule.",
    poster: "/images/testimonials/mike-wolf.webp",
  },
];

export type FeaturedWebsite = {
  name: string;
  url: string;
  image: string;
};

export const featuredWebsites: FeaturedWebsite[] = [
  { name: "Koze Design & Build", url: "https://kozedesignbuild.ca/", image: "/images/site-koze.jpeg" },
  { name: "Stately Homes", url: "https://buildstately.com/", image: "/images/site-stately.jpeg" },
  { name: "Bianchi Group Developers", url: "https://bianchigroupdevelopers.com/", image: "/images/site-bianchi.jpeg" },
  { name: "Birch Hill Homes", url: "https://birchhillhomes.com/", image: "/images/site-birchhill.jpeg" },
  { name: "Alogla Homes", url: "https://aloglahomes.com/", image: "/images/site-alogla.jpeg" },
  { name: "Imagine Development Ltd.", url: "https://imaginedevelopment.com/", image: "/images/site-imagine.jpeg" },
];

export const builderTypes = [
  { num: "01", name: "Custom Home Builders" },
  { num: "02", name: "Modular Home Builders" },
  { num: "03", name: "Design-Build Firms" },
  { num: "04", name: "Large-Scale Remodelers" },
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
    title: "Omnipresence (Website & SEO)",
    body: "We build a website that converts and ranks. Local SEO, on-page optimisation, and content that keeps you top of search so buyers find you before they find your competitors.",
    tags: ["Website design", "Local SEO", "On-page optimisation", "Content strategy"],
    visual: "omnipresence",
  },
  {
    n: "04",
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
