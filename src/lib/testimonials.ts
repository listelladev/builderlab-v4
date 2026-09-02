import "server-only";
import { sanityReadClient } from "@/lib/sanity/client";
import { testimonials as staticTestimonials } from "@/lib/data";
import { toReviewItem, type ReviewItem, type TestimonialDoc } from "@/lib/reviews-format";

const TESTIMONIAL_PROJECTION = `{
  _id,
  firstName,
  lastName,
  date,
  text
}`;

export async function getTestimonials(): Promise<TestimonialDoc[]> {
  return sanityReadClient.fetch(
    `*[_type == "testimonial"] | order(date desc, _createdAt desc) ${TESTIMONIAL_PROJECTION}`
  );
}

/**
 * Homepage review cards, newest first. Falls back to the built-in list only
 * if the content lake cannot be reached, so a CMS outage never blanks the
 * section — an intentionally empty CMS list renders as empty.
 */
export async function getHomepageReviews(): Promise<ReviewItem[]> {
  try {
    const docs = await getTestimonials();
    return docs.map(toReviewItem);
  } catch (err) {
    console.error("[testimonials] falling back to static reviews:", err);
    return staticTestimonials.map((t) => ({
      name: t.name,
      date: t.date,
      text: t.text,
      initials: t.initials,
    }));
  }
}
