import "server-only";
import { sanityReadClient } from "@/lib/sanity/client";
import { faqs as staticFaqs } from "@/lib/data";
import { pricingFaqs } from "@/lib/pricing";

// FAQs are CMS-managed (`faq` documents, edited in the admin at /admin/faqs
// and /admin/pricing-faqs).
// Only two fields: the question and its answer. `answer` is stored as an
// array of paragraph strings so multi-paragraph answers survive a round
// trip through the editor.

export type Faq = {
  _id: string;
  question: string;
  answer: string[];
};

type FaqDoc = {
  _id: string;
  question?: string;
  answer?: string[] | string;
};

function toParagraphs(value: string[] | string | undefined): string[] {
  if (Array.isArray(value)) return value.map((p) => String(p).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return [];
}

const FAQ_PROJECTION = `{ _id, question, answer }`;

// `faq` documents are shared by two sections, told apart by an optional
// `page` field set by the admin: "pricing" for the /pricing FAQs, absent
// (every document that predates the field) for the homepage.
export type FaqPage = "home" | "pricing";

const PAGE_FILTER: Record<FaqPage, string> = {
  home: `coalesce(page, "home") != "pricing"`,
  pricing: `page == "pricing"`,
};

/** GROQ filter for one page's FAQs; shared with the admin API routes. */
export function faqPageFilter(page: FaqPage): string {
  return PAGE_FILTER[page];
}

type StaticFaq = { q: string; a: string | string[] };

function staticFallback(source: StaticFaq[], prefix: string): Faq[] {
  return source.map((f, i) => ({
    _id: `${prefix}-${i}`,
    question: f.q,
    answer: Array.isArray(f.a) ? f.a : [f.a],
  }));
}

async function fetchFaqs(page: FaqPage, fallback: Faq[]): Promise<Faq[]> {
  try {
    const docs: FaqDoc[] = await sanityReadClient.fetch(
      `*[_type == "faq" && ${PAGE_FILTER[page]}] | order(order asc, _createdAt asc) ${FAQ_PROJECTION}`
    );
    const resolved = docs
      .map((d) => ({
        _id: d._id,
        question: (d.question || "").trim(),
        answer: toParagraphs(d.answer),
      }))
      .filter((f) => f.question && f.answer.length);
    return resolved.length ? resolved : fallback;
  } catch (err) {
    console.error(`[faqs] falling back to static ${page} FAQs:`, err);
    return fallback;
  }
}

/**
 * Homepage FAQ items, in curated order. Falls back to the built-in list if
 * the content lake cannot be reached OR has no `faq` documents yet, so the
 * homepage section never blanks before the CMS is seeded.
 */
export function getFaqs(): Promise<Faq[]> {
  return fetchFaqs("home", staticFallback(staticFaqs, "static-faq"));
}

/** Pricing-page FAQ items; same fallback behaviour as the homepage list. */
export function getPricingFaqs(): Promise<Faq[]> {
  return fetchFaqs("pricing", staticFallback(pricingFaqs, "static-pricing-faq"));
}
