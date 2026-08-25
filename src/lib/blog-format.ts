// Pure formatting helpers shared by server AND client components (e.g.
// BlogCard renders inside RelatedBlogs, a client component for its carousel
// controls). Deliberately has no Sanity client / secrets, unlike blog.ts.

export function displayReadTime(post: { readTime: number; readTimeOverride?: number }) {
  return post.readTimeOverride || post.readTime || 1;
}

export function formatBlogDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
