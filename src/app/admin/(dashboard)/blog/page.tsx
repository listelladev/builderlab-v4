"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { adminApi, AdminApiError } from "@/lib/admin/api";
import { imageUrl } from "@/lib/sanity/image";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";

type AdminPost = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  category?: { name?: string };
  author?: string;
  published?: boolean;
  featuredImage?: { asset?: { _ref: string; _type: "reference" } };
};

export default function AdminBlogListPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [posts, setPosts] = useState<AdminPost[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const { posts } = await adminApi<{ posts: AdminPost[] }>("/api/admin/blog-posts");
      setPosts(posts);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not load posts.");
    }
  }, []);

  useEffect(() => {
    // Fetch-on-mount: setPosts/setError only ever run after the awaited
    // request resolves, never synchronously during this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function togglePublish(p: AdminPost) {
    try {
      await adminApi(`/api/admin/blog-posts/${p._id}`, {
        method: "PATCH",
        body: { action: p.published ? "unpublish" : "publish" },
      });
      toast(p.published ? "Post unpublished." : "Post published.");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong.", "error");
    }
  }

  async function remove(p: AdminPost) {
    const ok = await confirm({
      title: "Delete this post?",
      message: `"${p.title || "Untitled"}" will be permanently removed.`,
    });
    if (!ok) return;
    try {
      await adminApi(`/api/admin/blog-posts/${p._id}`, { method: "DELETE" });
      toast("Post deleted.");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong.", "error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3.5 mb-6.5">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog posts</h1>
          <p className="text-sm text-white/40 mt-1">
            Only published posts appear on the public Blog page.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-[#38B685] text-[#08120E] font-bold rounded-full px-5 py-2.5 text-sm hover:bg-[#2f9e73] transition-colors"
        >
          + Add blog post
        </Link>
      </div>

      {error && <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 text-red-400 text-sm">{error}</div>}

      {!error && posts === null && (
        <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 text-white/50 text-sm">Loading…</div>
      )}

      {!error && posts && posts.length === 0 && (
        <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 text-white/50 text-sm">
          No blog posts yet.
        </div>
      )}

      {!error && posts && posts.length > 0 && (
        <div className="bg-[#161616] border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-white/40 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold">Photo</th>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Author</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => {
                const src = imageUrl(p.featuredImage, 160);
                return (
                  <tr key={p._id} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3">
                      {src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt="" className="w-14 h-10.5 object-cover rounded-lg bg-white/5" />
                      ) : (
                        <div className="w-14 h-10.5 rounded-lg bg-white/5" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{p.title || "(untitled)"}</div>
                      <div className="text-xs text-white/30">/blog/{p.slug?.current || ""}</div>
                    </td>
                    <td className="px-4 py-3 text-white/70">{p.category?.name || "—"}</td>
                    <td className="px-4 py-3 text-white/70">{p.author || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          p.published
                            ? "bg-[#38B685]/15 text-[#38B685]"
                            : "bg-white/10 text-white/50"
                        }`}
                      >
                        {p.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/blog/${p._id}`}
                        className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors mr-1.5"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => togglePublish(p)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors mr-1.5"
                      >
                        {p.published ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => remove(p)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
