import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import { formatBlogDate, displayReadTime } from "@/lib/blog-format";
import { imageUrl } from "@/lib/sanity/image";

export function BlogCard({ post }: { post: BlogPost }) {
  const src = imageUrl(post.featuredImage, 700);
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full">
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/5 mb-5 bg-[#161616]">
        {src && (
          <Image
            src={src}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        )}
      </div>

      <span className="text-xs font-semibold uppercase tracking-wider text-[#38B685] mb-3">
        {post.categoryName}
      </span>
      <h3 className="text-xl font-bold text-white mb-2 leading-snug group-hover:text-[#38B685] transition-colors duration-500">
        {post.title}
      </h3>
      <p className="text-xs text-white/40 mb-3">
        {formatBlogDate(post.publishedAt)} · {displayReadTime(post)} min read
      </p>
      <p className="text-sm text-white/50 leading-relaxed line-clamp-3 mb-5 flex-1">
        {post.excerpt}
      </p>
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
        Read More
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500 ease-out" />
      </span>
    </Link>
  );
}
