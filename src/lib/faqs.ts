import "server-only";
import { sanityReadClient } from "@/lib/sanity/client";
import { faqs as staticFaqs } from "@/lib/data";

// FAQs are CMS-managed (`faq` documents, edited in the admin at /admin/faqs).
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

function staticFallback(): Faq[] {
  return staticFaqs.map((f, i) => ({
    _id: `static-faq-${i}`,
    question: f.q,
    answer: Array.isArray(f.a) ? f.a : [f.a],
  }));
}

/**
 * Homepage FAQ items, in curated order. Falls back to the built-in list if
 * the content lake cannot be reached OR has no `faq` documents yet, so the
 * homepage section never blanks before the CMS is seeded.
 */
export async function getFaqs(): Promise<Faq[]> {
  try {
    const docs: FaqDoc[] = await sanityReadClient.fetch(
      `*[_type == "faq"] | order(order asc, _createdAt asc) ${FAQ_PROJECTION}`
    );
    const resolved = docs
      .map((d) => ({
        _id: d._id,
        question: (d.question || "").trim(),
        answer: toParagraphs(d.answer),
      }))
      .filter((f) => f.question && f.answer.length);
    return resolved.length ? resolved : staticFallback();
  } catch (err) {
    console.error("[faqs] falling back to static FAQs:", err);
    return staticFallback();
  }
}
