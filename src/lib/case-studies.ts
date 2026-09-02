import "server-only";
import { sanityReadClient } from "@/lib/sanity/client";
import { imageUrl, type SanityImage } from "@/lib/sanity/image";

// Case studies are CMS-managed (`caseStudy` documents, edited in the admin
// at /admin/case-studies). The public templates consume the resolved shape
// below: image fields arrive as CDN URLs and the two long-form fields as
// sanitized HTML from the WYSIWYG editor.

export type CaseStudyStat = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
};

export type CaseStudyWork = {
  title: string;
  description: string;
};

export type CaseStudy = {
  _id: string;
  slug: string;
  name: string;
  industry: string;
  tagline: string;
  // Short enough to stay on one line on the collection page's card, unlike
  // `tagline`/`resultsHtml` which are written to wrap.
  highlights: string[];
  heroImage: string;
  stats: CaseStudyStat[];
  aboutHtml: string;
  whatWeDid: CaseStudyWork[];
  resultsHtml: string;
  resultsImage: string;
  testimonial: {
    quote: string;
    name: string;
    role: string;
  } | null;
};

export type CaseStudyDoc = {
  _id: string;
  slug?: string;
  name?: string;
  industry?: string;
  tagline?: string;
  highlights?: string[];
  heroImage?: SanityImage;
  stats?: (CaseStudyStat & { _key?: string })[];
  aboutHtml?: string;
  whatWeDid?: (CaseStudyWork & { _key?: string })[];
  resultsHtml?: string;
  resultsImage?: SanityImage;
  testimonialQuote?: string;
  testimonialName?: string;
  testimonialRole?: string;
};

const CASE_STUDY_PROJECTION = `{
  _id,
  "slug": slug.current,
  name,
  industry,
  tagline,
  highlights,
  heroImage,
  stats,
  aboutHtml,
  whatWeDid,
  resultsHtml,
  resultsImage,
  testimonialQuote,
  testimonialName,
  testimonialRole
}`;

function resolve(doc: CaseStudyDoc): CaseStudy {
  const hero = imageUrl(doc.heroImage, 1800);
  const quote = (doc.testimonialQuote || "").trim();
  return {
    _id: doc._id,
    slug: doc.slug || "",
    name: doc.name || "",
    industry: doc.industry || "",
    tagline: doc.tagline || "",
    highlights: (doc.highlights || []).filter((h) => typeof h === "string" && h.trim()),
    heroImage: hero,
    stats: (doc.stats || []).filter((s) => s && s.label),
    aboutHtml: doc.aboutHtml || "",
    whatWeDid: (doc.whatWeDid || []).filter((w) => w && (w.title || w.description)),
    resultsHtml: doc.resultsHtml || "",
    resultsImage: imageUrl(doc.resultsImage, 1400) || hero,
    testimonial: quote
      ? { quote, name: doc.testimonialName || "", role: doc.testimonialRole || "" }
      : null,
  };
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const docs: CaseStudyDoc[] = await sanityReadClient.fetch(
    `*[_type == "caseStudy" && published == true] | order(sortOrder asc, _createdAt asc) ${CASE_STUDY_PROJECTION}`
  );
  return docs.map(resolve);
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  const doc: CaseStudyDoc | null = await sanityReadClient.fetch(
    `*[_type == "caseStudy" && published == true && slug.current == $slug][0] ${CASE_STUDY_PROJECTION}`,
    { slug }
  );
  return doc ? resolve(doc) : null;
}
