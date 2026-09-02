// Client-safe helpers for the homepage review cards. No Sanity client here
// — Testimonials.tsx is a client component and imports this file.

export type ReviewItem = {
  name: string;
  /** Display string, e.g. "August 2026". */
  date: string;
  /** One paragraph, or several for longer reviews. */
  text: string | string[];
  initials: string;
};

export type TestimonialDoc = {
  _id: string;
  firstName?: string;
  lastName?: string;
  /** ISO date (YYYY-MM-DD). */
  date?: string;
  text?: string;
};

export function formatReviewDate(iso: string | undefined) {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", timeZone: "UTC" });
}

export function reviewInitials(firstName: string, lastName: string) {
  const a = firstName.trim().charAt(0);
  const b = lastName.trim().charAt(0);
  return (a + b).toUpperCase() || "?";
}

/** Blank lines in the admin textarea separate paragraphs on the card. */
export function splitReviewParagraphs(text: string): string | string[] {
  const parts = text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  if (parts.length <= 1) return parts[0] || "";
  return parts;
}

export function toReviewItem(doc: TestimonialDoc): ReviewItem {
  const first = (doc.firstName || "").trim();
  const last = (doc.lastName || "").trim();
  return {
    name: [first, last].filter(Boolean).join(" "),
    date: formatReviewDate(doc.date),
    text: splitReviewParagraphs(doc.text || ""),
    initials: reviewInitials(first, last),
  };
}
