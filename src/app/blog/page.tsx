import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogCollection } from "@/components/BlogCollection";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Builderlab",
  description:
    "Growth strategy, paid ads, creative, and sales insights for custom home builders.",
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main>
        <BlogCollection posts={blogPosts} />
      </main>
      <Footer />
    </>
  );
}
