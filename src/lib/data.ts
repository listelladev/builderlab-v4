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
      // TODO: swap in the real Ads Handbook URL once provided.
      {
        label: "Builder Backstage Podcast",
        href: "https://podcasts.apple.com/ca/podcast/the-builder-backstage/id6802168059",
      },
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
    "Built specifically for home builders",
    "You on camera, building real trust",
    "Positioning & messaging dialed in first",
    "Educational content that builds authority",
    "Track leads all the way to signed projects",
    "Constant creative testing & optimization",
    "Strategy, creative, filming & ads under one roof",
    "Focused on becoming the go-to builder",
  ],
  others: [
    "Generalists who work with anyone",
    "Stock footage and generic ads",
    "Jump straight into running ads",
    "Generic “Get a Free Quote” ads",
    "Report on clicks, leads & impressions",
    "Run the same ads until they stop working",
    "Multiple vendors and disconnected teams",
    "Focused on getting you more “leads”",
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
  statValue: number;
  statPrefix?: string;
  statSuffix?: string;
  statLabel: string;
  blurb: string;
  /** Custom poster image (a real project/client photo) — passed straight
   * to wistia-player's `poster` attribute, which overrides Wistia's own
   * auto-generated video-frame swatch entirely. */
  poster: string;
};

// Order and copy below are the client-approved set from the Aug 2026 copy
// pass: exact reviewer quotes (not paraphrased summaries) plus the
// stat/label pulled back in above each quote.
export const videoTestimonials: VideoTestimonial[] = [
  {
    wistiaId: "gxbl3cxdos",
    name: "Daniel Green",
    statValue: 11,
    statPrefix: "$",
    statSuffix: "M",
    statLabel: "pipeline value added",
    blurb:
      "BuilderLab has been absolutely amazing for our business. They took the time to understand who we are and built a custom strategy that helped us grow at scale. Their campaigns have brought in high-end clientele and created a consistent flow of new projects. I can't speak highly enough about Eric and the team.",
    poster: "/images/testimonials/daniel-green.webp",
  },
  {
    wistiaId: "bafh6pjevo",
    name: "Jez Alogla",
    statValue: 309,
    statSuffix: "%",
    statLabel: "lead volume increase",
    blurb:
      "BuilderLab has been exactly the long-term marketing partner we were looking for. They completely revamped our website, and advertising, and our phone has been ringing consistently. Their communication is top-notch, and they've delivered exactly what was promised from day one. I highly recommend them to builders looking to grow and scale.",
    poster: "/images/testimonials/jez-alogla.webp",
  },
  {
    wistiaId: "nksu2vle0e",
    name: "Josh & Jonathan",
    statValue: 87,
    statSuffix: "%",
    statLabel: "revenue growth",
    blurb:
      "I really like the system and feel like we've got a great flow now. There are so many good prospects coming in, and we're having conversations with most of the leads. We've already had a couple of in-office meetings, with more scheduled. It's been going really well, and the quality of prospects has been great.",
    poster: "/images/testimonials/josh-sanders.webp",
  },
  {
    wistiaId: "deqa5gu0np",
    name: "Jeff Martin",
    statValue: 1.3,
    statPrefix: "$",
    statSuffix: "M",
    statLabel: "revenue added",
    blurb:
      "Within the first week, we had 10-15 booked meetings with potential clients. Since running the ads, we've received three sets of plans, connected with four serious prospects who have land or are purchasing, and built a pipeline of another 10–15 potential clients. It's been a great investment and created opportunities we wouldn't have had otherwise.",
    poster: "/images/testimonials/jeff-martin-a.webp",
  },
  {
    wistiaId: "erl547aqay",
    name: "Anthony Natale",
    statValue: 142,
    statSuffix: "%",
    statLabel: "revenue increase",
    blurb:
      "I've worked with a lot of marketing companies, but BuilderLab took the time to truly understand our business and ideal clients. Everything felt customized. Now we're seeing great leads every week. We have so many opportunities that I can pick and choose which projects I want to take on.",
    poster: "/images/testimonials/anthony-natale.webp",
  },
  {
    wistiaId: "4o9usavu0v",
    name: "Chris Coleman",
    statValue: 220,
    statSuffix: "%",
    statLabel: "lead volume increase",
    blurb:
      "BuilderLab helped us revamp our marketing, and we've already seen a huge number of leads coming in. What impressed me most was their speed and quality. Everything was delivered ahead of schedule and exceeded our expectations. Eric and his team have overperformed from the start.",
    poster: "/images/testimonials/chris-coleman.webp",
  },
  {
    wistiaId: "fe0l0e47nx",
    name: "Mike Wolf",
    statValue: 2,
    statPrefix: "+",
    statSuffix: "M",
    statLabel: "revenue added",
    blurb:
      "They not only deliver, they overdeliver. They helped me bring in more customers, and everything they promised was completed ahead of schedule. Eric is knowledgeable, exceptionally reliable, and someone I wouldn't hesitate to recommend for anything related to marketing.",
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

// Pulled verbatim from Google reviews (Aug 26, 2026). Google's own
// relative timestamps ("2 months ago") are converted to a fixed
// month/year as of that pull date rather than displayed as relative time,
// so they don't silently drift stale the longer this ships unchanged.
export const testimonials = [
  {
    text: [
      "I am the owner of Koze Design & Build in Vancouver, Canada, and have been working with Eric from Builder Lab for the past three weeks. In that short time, he has exceeded my expectations.",
      "One of the concerns when hiring a consultant is that after the initial excitement, communication drops off and it's difficult to see the value being delivered. My experience with Eric has been the exact opposite. He is highly engaged, responsive, and proactive. He feels more like an extension of our team than an outside consultant.",
      "So far, Eric has helped us build out our marketing systems using HighLevel, develop a new website, and prepare for the launch of our Meta advertising campaigns. What has impressed me most is not just the work itself, but the level of involvement and attention he brings to the process. He's consistently available, communicates clearly, and keeps projects moving forward.",
      "It's still early in our relationship, but based on what I've seen so far, I would confidently recommend Eric and Builder Lab to any business owner looking to improve their marketing and lead generation systems. I look forward to seeing the results as we continue working together.",
    ],
    name: "Jason Craig",
    company: "Koze Design & Build",
    date: "June 2026",
    initials: "JC",
  },
  {
    text: [
      "I've had the pleasure of being part of the team at BuilderLab for quite a long time now, and I can honestly say my experience has been excellent from day one. Working closely together, I've seen firsthand how professional, skilled, and passionate Eric is about his work.",
      "One thing that really stands out is his work ethic and dedication. He is always focused, communicates clearly, and ensures everything runs smoothly. The work environment he creates is positive, supportive, and motivating, which makes being part of the team a truly enjoyable experience.",
      "His creativity, attention to detail, and problem-solving ability are genuinely impressive. No matter how complex a project is, he always finds the best possible solution and helps the team work closely together.",
      "Being part of BuilderLab has been a great journey so far, and I truly appreciate the opportunity to work alongside them and Eric. I look forward to continuing this journey!",
    ],
    name: "Ibna Sina",
    company: "",
    date: "April 2026",
    initials: "IS",
  },
  {
    text: "Eric and his team have done a great job with exceeding expectations and continuing to elevate our Brand. Excellent website, SEO, and help with setting up the CRM. He has been on schedule and on target.",
    name: "Chris Coleman",
    company: "",
    date: "April 2026",
    initials: "CC",
  },
  {
    text: [
      "Our company, Mega Courts Pickleball & Tennis, recently revamped our website with Eric leading the project. He also optimized the site for SEO, and everything was delivered on time and within budget.",
      "Eric was a pleasure to work with. He made the whole process very easy and reduced a lot of the stress by providing clear advice and helpful suggestions throughout.",
      "Highly recommended!",
    ],
    name: "Vlad Voskoboinikov",
    company: "Mega Courts Pickleball & Tennis",
    date: "March 2026",
    initials: "VV",
  },
  {
    text: "Eric and his team at Builder Lab have been great to work with. They've helped us bring in solid leads that actually turn into real jobs, not just people browsing around. In this line of work, getting homeowners to trust you takes time and effort, and Eric really gets that. His team's been consistent, easy to talk to, and genuinely focused on helping us grow. It's been a big help for our business.",
    name: "Hassan Albreki",
    company: "",
    date: "October 2025",
    initials: "HA",
  },
  {
    text: "I've been working with Builderlab for the past month or so, and they've delivered on everything they promised. The quality of the website they delivered, the ebook they built me, and the overall strategy have exceeded my expectations. Everything has been handled professionally and efficiently. Eric, the owner, is very hands on and communicates with me on a regular basis...very rare to see such strong communication from a marketing agency and I love it. If you're serious about growing your construction company, I highly recommend adding them to your team.",
    name: "Sandro",
    company: "",
    date: "February 2026",
    initials: "S",
  },
  {
    text: "Working with Eric and the BuilderLab Marketing team has been a game-changer for our business. Instead of generic leads that waste time, they've consistently provided high-quality prospects who are genuinely ready to move forward. The difference in lead quality has been night and day, more serious inquiries, more meaningful conversations, and ultimately, more signed projects. Eric's approach is refreshingly honest and strategic, he really listens to your goals and builds a lead generation plan that aligns with your brand and services. For any home builder or contractor who's frustrated with cold leads and dead ends, I can't recommend BuilderLab enough. They truly deliver results.",
    name: "Abhi Chawla",
    company: "",
    date: "November 2025",
    initials: "AC",
  },
  {
    text: "Eric and the team at BuilderLab are absolute pros when it comes to custom home lead generation. They don't just send you random names, they deliver qualified, high-intent prospects that actually convert. Since working with them, I've seen a noticeable increase in closed custom home jobs, and the quality of opportunities has been consistently impressive. Eric's communication is sharp, strategic, and honest, and he really takes the time to understand your business and crafts the messaging in a way that's realistic but still powerful. If you're a contractor or home builder who's tired of chasing leads that go nowhere, BuilderLab is your solution. Highly recommend.",
    name: "Shane Kumararatne",
    company: "",
    date: "November 2025",
    initials: "SK",
  },
  {
    text: [
      "We've worked with a lot of marketing companies over the years. Most talk a good game. Very few actually understand business. These guys do.",
      "From day one, they took the time to understand our objectives, our margins, and what actually moves the needle, not vanity metrics, not buzzwords. The strategy was sweet, the execution was disciplined, and communication was really good. No chaos, no fluff, no disappearing acts.",
      "What stood out most was their ability to think like operators, not just marketers. They challenged assumptions, tested ideas, and focused relentlessly on ROI. When something wasn't working, it was addressed fast and adjusted without ego.",
      "If you want a team that treats your business like their own and delivers real results instead of excuses, this is the one. Highly recommend!",
    ],
    name: "Daniel Green",
    company: "",
    date: "February 2026",
    initials: "DG",
  },
  {
    text: "I manage SEO and web design for my customers and have tried BuilderLab to bring in extra leads. Their campaigns align well with the local SEO work we already run for custom home builders, and the inquiries so far seem genuinely relevant. Reporting is clear and communication is solid, making them a useful add-on to our marketing mix.",
    name: "Igor Shulyatikov",
    company: "",
    date: "November 2025",
    initials: "IS",
  },
  {
    text: "We have never had the need for a marketing team until we relocated to another state. Working with Eric and his team has been great. They are always quick to respond and there strategies to get our name out there has worked very well. Since teaming up with Thrivv we have introduction calls daily and though those calls we have 2 projects in the works with getting permits and about 5 more that are close. I would not hesitate to recommend them to anyone interested- you will not be disappointed.",
    name: "Jeff Martin",
    company: "",
    date: "September 2025",
    initials: "JM",
  },
  {
    text: "Thrivv Consulting has been collaborating with my business and has delivered quality leads that are helping me grow my business. In the business of construction, getting people to trust your brand and trusting you to build their homes takes a lot of persuasion and hardwork. With Thrivv Consulting, we are bringing quality leads to the table and steadily building that trust that translates to generating more business.",
    name: "Olusegun Akinrolabu",
    company: "",
    date: "October 2025",
    initials: "OA",
  },
  {
    text: "BuiderLab was amazing to work with. From start to finish they were always available to answer questions and guide me along the process. I would absolutely recommend them.",
    name: "Matthew Pellat",
    company: "",
    date: "February 2026",
    initials: "MP",
  },
  {
    text: "Eric and his team at Thrivv Consulting are outstanding. They take a new angle at strategy that really drive results.",
    name: "Christian J.",
    company: "",
    date: "August 2025",
    initials: "CJ",
  },
  {
    text: "Eric and his team have transformed my business. Very easy to work with, great communication, great results.",
    name: "Alexandros Asonitis",
    company: "",
    date: "August 2025",
    initials: "AA",
  },
  {
    text: "Eric is the best! He's extremely knowledgeable, reliable and a go-getter. Strongly recommend!",
    name: "Mike Wolf",
    company: "",
    date: "August 2025",
    initials: "MW",
  },
  {
    text: "We've worked with many agencies, but none have been able to perform like Builderlab. From day one we were getting high-quality leads for our real estate development company. We look forward to working with Eric for many years!",
    name: "Matan Michael",
    company: "",
    date: "August 2026",
    initials: "MM",
  },
];

export const faqs = [
  {
    q: "What type of companies do you work with?",
    a: "We partner with established home builders, large-scale remodelers, and residential construction companies that do great work but want a more predictable way to generate demand and land projects. We're best suited for builders with a proven track record, strong projects to showcase, and the capacity to take on more work.",
  },
  {
    q: "What makes BuilderLab different from other agencies?",
    a: [
      "We're not a generalist agency that happens to work with builders. Our entire system is built around how clients actually choose who they trust with their project.",
      "We send a real videographer to you, put you on camera, and turn your expertise into educational content that gets your face in front of thousands of people in your market. Over time, they see you, learn from you, recognize your projects, and start to trust your company before they ever reach out.",
      "We're not just generating leads. We're building your brand, creating demand, and positioning you as the local authority in your market.",
    ],
  },
  {
    q: "How much should I expect to invest?",
    a: "Our engagements start at $2,500/month, plus your Meta ad spend. Your exact investment depends on your market, goals, and the scope of what we're building. We'll walk through the numbers with you before you commit so you know exactly what you're investing in and what success needs to look like.",
  },
  {
    q: "Do I need to be good on camera?",
    a: "Not at all. Most builders aren't professional presenters, and we don't want you to sound like one. We develop the angles, write the scripts, and guide you through the entire shoot. You bring the expertise and we turn it into content that feels natural, builds authority, and earns trust.",
  },
  {
    q: "What happens during the first 21 days?",
    a: "We build and install your acquisition system. That includes dialing in your positioning and messaging, developing your creative strategy, scripting your ads, coordinating your on-site video shoot, editing the creative, setting up tracking and the CRM automations, and preparing your Meta campaigns for launch. By the end, you have a complete system built around your company.",
  },
  {
    q: "How do you generate qualified opportunities, not just leads?",
    a: [
      "We don't build campaigns around getting the cheapest lead possible. We use your positioning, projects, expertise, and educational content to attract clients who understand what you do and why you're different. The goal is to build trust before they ever inquire, so your team spends more time talking to the right prospects rather than chasing everyone who fills out a form.",
      "So when someone finally raises their hand, they're not discovering your company for the first time. They've already seen you, learned from you, and understand why you're different. That means better conversations with prospects who already know and trust your brand.",
    ],
  },
  {
    q: "How do you know which ads actually land projects?",
    a: "We track beyond clicks and form submissions. By connecting your campaigns with your CRM and sales pipeline, we can see which ads and messages are generating qualified opportunities and ultimately contributing to signed projects. We use that data to double down on what works, cut what doesn't, and make the system sharper over time.",
  },
  {
    q: "Do you work with other builders in my market?",
    a: "We're selective about who we partner with and take market conflicts seriously. If we're already working with a directly competing builder in your area, we'll address that before moving forward. We'd rather build a meaningful partnership than create a conflict between clients.",
  },
  {
    q: "What if I've been burned by a marketing agency before?",
    a: "You wouldn't be the first builder to come to us after paying for marketing that produced reports instead of revenue. That's why our approach starts with the fundamentals like your positioning, messaging, creative, and tracking before we scale ad spend. We focus on what actually matters: qualified opportunities, pipeline, signed projects, and measurable business growth.",
  },
  {
    q: "How do I get started?",
    a: "Start by applying for a strategy call below. We'll learn about your business, your market, your current pipeline, and where you want to grow. If we believe we can help, we'll walk you through the strategy, investment, and next steps. If there's a fit, we get to work and begin building your system. If not, we'll point you in a better direction.",
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
