import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogCollection } from "@/components/BlogCollection";
import { getBlogPosts } from "@/lib/blog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | Builderlab",
  description:
    "Growth strategy, paid ads, creative, and sales insights for custom home builders.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return (
    <>
      <Header />
      <main>
        <BlogCollection posts={posts} />
      </main>
      <Footer />
    </>
  );
}
