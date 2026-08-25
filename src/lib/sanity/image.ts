import { createImageUrlBuilder } from "@sanity/image-url";

// No secrets here — project ID/dataset are public identifiers (exposed via
// NEXT_PUBLIC_* on purpose) and the image CDN URLs they build are public
// URLs. Safe to import from client components (e.g. the admin editor,
// RelatedBlogs' carousel) as well as server components.

export type SanityImage = {
  asset?: { _ref: string; _type: "reference" };
  alt?: string;
  caption?: string;
};

const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
});

export function imageUrl(source: SanityImage | null | undefined, width?: number) {
  if (!source || !source.asset) return "";
  const img = builder.image(source).auto("format").fit("max");
  return (width ? img.width(width) : img).url();
}
