"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "./Reveal";
import { SectionGlow } from "./SectionGlow";
import { BlogCard } from "./BlogCard";
import type { BlogPost } from "@/lib/blog";

export function BlogCollection({ posts }: { posts: BlogPost[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.categoryName).filter(Boolean)))],
    [posts]
  );
  const [category, setCategory] = useState("All");
  const filtered =
    category === "All" ? posts : posts.filter((p) => p.categoryName === category);

  return (
    <>
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
        <SectionGlow
          positions={[
            "top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] blur-[160px] opacity-30",
          ]}
        />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <Reveal className="max-w-2xl">
              <span className="inline-block text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
                The blog
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 text-balance">
                Growth, unpacked.
              </h1>
              <p className="text-lg text-white/60 leading-relaxed">
                Strategy, creative, and sales insight from the team installing
                growth systems for custom home builders every day.
              </p>
            </Reveal>

            <Reveal delay={0.05} className="shrink-0">
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
                Filter by category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="appearance-none bg-[#161616] border border-white/10 text-white text-sm rounded-full pl-5 pr-11 py-3 outline-none focus:border-[#38B685] transition-colors cursor-pointer min-w-[200px]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-[#0D1814]">
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative pt-8 pb-24 lg:pt-10 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[#08120E]" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={category}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {filtered.map((post) => (
                  <StaggerItem key={post.slug}>
                    <BlogCard post={post} />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
