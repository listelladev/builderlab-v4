import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SectionGlow } from "@/components/SectionGlow";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleContent } from "@/components/ArticleContent";
import { RelatedBlogs } from "@/components/RelatedBlogs";
import { blogPosts, getBlogPost, formatBlogDate } from "@/lib/blog";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Blog | Builderlab`,
    description: post.intro,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main>
        <section className="relative pt-28 pb-14 lg:pt-36 lg:pb-16 overflow-hidden">
          <SectionGlow
            positions={[
              "top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] blur-[160px] opacity-30",
            ]}
          />
          <div className="relative z-10 max-w-[900px] mx-auto px-6 lg:px-10">
            <Reveal className="mb-10">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Blog", href: "/blog" },
                  { label: post.title },
                ]}
              />
            </Reveal>

            <Reveal delay={0.05} className="text-center">
              <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
                {post.category}
              </span>
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6 text-balance leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1 text-sm text-white/50">
                <span>{post.author}</span>
                <span className="text-white/20">·</span>
                <span>{formatBlogDate(post.date)}</span>
                <span className="text-white/20">·</span>
                <span>{post.readTime}</span>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative pb-12 lg:pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-[#08120E]" />
          <Reveal
            delay={0.1}
            className="relative z-10 max-w-[1100px] mx-auto px-6 lg:px-10"
          >
            <div className="relative aspect-[16/8] rounded-2xl overflow-hidden border border-white/5">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </Reveal>
        </section>

        <section className="relative pb-24 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[#08120E]" />
          <div className="relative z-10 max-w-[940px] mx-auto px-6 lg:px-10 text-left">
            <Reveal>
              <p className="text-base font-medium text-white/80 leading-relaxed mb-2">
                {post.intro}
              </p>
            </Reveal>
            <ArticleContent body={post.body} />
          </div>
        </section>

        <RelatedBlogs current={post.slug} posts={blogPosts} />
      </main>
      <Footer />
    </>
  );
}
