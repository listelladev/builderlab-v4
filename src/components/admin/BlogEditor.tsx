"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminApi, AdminApiError, uploadImage } from "@/lib/admin/api";
import { imageUrl } from "@/lib/sanity/image";
import { portableTextToHtml } from "@/lib/admin/portable-to-html";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import type { BodyBlock, PortableTextImageBlock } from "@/lib/blog";

type Category = { _id: string; name: string; slug?: { current?: string } };
type FeaturedImage = PortableTextImageBlock | null;

function slugifyClient(s: string) {
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function htmlWordCount(html: string) {
  if (!html || typeof window === "undefined") return 0;
  const text = new DOMParser().parseFromString(html, "text/html").body.textContent || "";
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function BlogEditor({ postId }: { postId?: string }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();

  const [loading, setLoading] = useState(Boolean(postId));
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const slugTouchedRef = useRef(Boolean(postId));
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedAt, setPublishedAt] = useState(() =>
    postId ? "" : new Date().toISOString().slice(0, 10)
  );
  const [excerpt, setExcerpt] = useState("");
  const [readTimeOverride, setReadTimeOverride] = useState<number | "">("");
  const [featuredImage, setFeaturedImage] = useState<FeaturedImage>(null);
  const [published, setPublished] = useState(false);
  const [bodyHtml, setBodyHtml] = useState("");
  const [migratedFromBlocks, setMigratedFromBlocks] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [manageOpen, setManageOpen] = useState(false);
  const [errors, setErrors] = useState<string[] | null>(null);

  const autoReadTime = useMemo(
    () => Math.max(1, Math.ceil(htmlWordCount(bodyHtml) / 225)),
    [bodyHtml]
  );

  useEffect(() => {
    adminApi<{ categories: Category[] }>("/api/admin/categories")
      .then(({ categories }) => setCategories(categories))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!postId) return;
    (async () => {
      try {
        const { post } = await adminApi<{
          post: {
            title?: string;
            slug?: { current?: string };
            category?: { _id?: string };
            author?: string;
            publishedAt?: string;
            excerpt?: string;
            body?: BodyBlock[];
            bodyHtml?: string;
            readTimeOverride?: number;
            featuredImage?: FeaturedImage;
            published?: boolean;
          };
        }>(`/api/admin/blog-posts/${postId}`);
        setTitle(post.title || "");
        setSlug(post.slug?.current || "");
        setCategory(post.category?._id || "");
        setAuthor(post.author || "");
        setPublishedAt(post.publishedAt ? post.publishedAt.slice(0, 10) : "");
        setExcerpt(post.excerpt || "");
        setReadTimeOverride(post.readTimeOverride || "");
        setFeaturedImage(post.featuredImage || null);
        setPublished(Boolean(post.published));
        if (typeof post.bodyHtml === "string" && post.bodyHtml.trim()) {
          setBodyHtml(post.bodyHtml);
        } else if (Array.isArray(post.body) && post.body.length) {
          // Legacy block-based article: convert once for editing. The HTML
          // becomes the stored format on the next save.
          setBodyHtml(portableTextToHtml(post.body));
          setMigratedFromBlocks(true);
        }
      } catch (err) {
        toast(err instanceof Error ? err.message : "Could not load post.", "error");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slugTouchedRef.current) setSlug(slugifyClient(v));
  }
  function onSlugChange(v: string) {
    slugTouchedRef.current = true;
    setSlug(slugifyClient(v));
  }

  async function onFeaturedFile(file: File) {
    if (file.size > 4 * 1024 * 1024) {
      toast("That image is larger than the 4 MB limit.", "error");
      return;
    }
    try {
      const { image } = await uploadImage(file, title);
      setFeaturedImage(image as FeaturedImage);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed.", "error");
    }
  }

  async function createCategory() {
    const name = window.prompt("New category name");
    if (!name || !name.trim()) return;
    try {
      const { category: created } = await adminApi<{ category: Category }>("/api/admin/categories", {
        method: "POST",
        body: { name: name.trim() },
      });
      setCategories((c) => [...c, created]);
      setCategory(created._id);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not create category.", "error");
    }
  }

  async function deleteCategory(id: string) {
    const cat = categories.find((c) => c._id === id);
    const ok = await confirm({
      title: "Delete this category?",
      message: `"${cat?.name || "This category"}" will be permanently removed.`,
    });
    if (!ok) return;
    try {
      await adminApi(`/api/admin/categories/${id}`, { method: "DELETE" });
      setCategories((c) => c.filter((x) => x._id !== id));
      if (category === id) setCategory("");
      toast("Category deleted.");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not delete category.", "error");
    }
  }

  async function save(publish: boolean) {
    setSaving(publish ? "publish" : "draft");
    setErrors(null);
    try {
      const payload = {
        title,
        slug,
        category: category || undefined,
        author,
        publishedAt: publishedAt || undefined,
        featuredImage: featuredImage || undefined,
        excerpt,
        bodyHtml,
        readTimeOverride: readTimeOverride === "" ? undefined : Number(readTimeOverride),
        published: publish,
      };
      let result: { post: { _id: string } };
      if (postId) {
        result = await adminApi(`/api/admin/blog-posts/${postId}`, { method: "PATCH", body: payload });
      } else {
        result = await adminApi("/api/admin/blog-posts", { method: "POST", body: payload });
      }
      toast(publish ? "Post published." : "Draft saved.");
      setMigratedFromBlocks(false);
      if (!postId) {
        router.push(`/admin/blog/${result.post._id}`);
      } else {
        setPublished(publish);
      }
    } catch (err) {
      if (err instanceof AdminApiError && err.errors) setErrors(err.errors);
      toast(err instanceof Error ? err.message : "Something went wrong.", "error");
    } finally {
      setSaving(null);
    }
  }

  async function removePost() {
    if (!postId) return;
    const ok = await confirm({ title: "Delete this post?", message: "This can't be undone." });
    if (!ok) return;
    try {
      await adminApi(`/api/admin/blog-posts/${postId}`, { method: "DELETE" });
      router.push("/admin/blog");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong.", "error");
    }
  }

  if (loading) {
    return <div className="text-white/50 text-sm">Loading…</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3.5 mb-6.5">
        <div>
          <h1 className="text-2xl font-bold text-white">{postId ? "Edit post" : "Add blog post"}</h1>
          <p className="text-sm text-white/40 mt-1">
            Write the article in the editor below — it looks the way it will on the site.
          </p>
        </div>
        <Link href="/admin/blog" className="px-4 py-2.5 rounded-full text-sm font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
          ← Back to posts
        </Link>
      </div>

      <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 mb-5 space-y-4.5">
        <Field label="Title">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g. How to Prepare Your Roof for Monsoon Season"
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Slug" hint="Auto-generated from the title. Edit it yourself and it will stay locked to your version.">
          <input
            type="text"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="auto-generated-from-title"
            className={INPUT_CLASS}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
          <Field label="Category">
            <select
              value={category}
              onChange={(e) => {
                if (e.target.value === "__new__") {
                  createCategory();
                  return;
                }
                setCategory(e.target.value);
              }}
              className={INPUT_CLASS}
            >
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
              <option value="__new__">+ New category…</option>
            </select>
            <button
              type="button"
              onClick={() => setManageOpen((v) => !v)}
              className="mt-2 text-xs font-semibold text-white/50 hover:text-white transition-colors"
            >
              Manage categories
            </button>
            {manageOpen && (
              <div className="mt-2.5 space-y-1.5">
                {categories.length === 0 && <p className="text-xs text-white/30">No categories yet.</p>}
                {categories.map((c) => (
                  <div
                    key={c._id}
                    className="flex items-center justify-between gap-2 px-3 py-2 border border-white/10 rounded-lg text-sm"
                  >
                    <span className="text-white/80">{c.name}</span>
                    <button
                      type="button"
                      aria-label={`Delete ${c.name}`}
                      onClick={() => deleteCategory(c._id)}
                      className="w-5.5 h-5.5 rounded-full bg-red-500/15 text-red-300 text-xs font-bold leading-none hover:bg-red-500/25 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          <Field label="Author">
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. The Team"
              className={INPUT_CLASS}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
          <Field label="Date published">
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
          <Field
            label="Read time override (optional)"
            hint={`Auto-calculated: ${autoReadTime} min read (leave blank to use this)`}
          >
            <input
              type="number"
              min={1}
              value={readTimeOverride}
              onChange={(e) => setReadTimeOverride(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="auto-calculated"
              className={INPUT_CLASS}
            />
          </Field>
        </div>

        <Field label="Excerpt" hint="Used on the Blog collection card. Aim for 1–2 sentences.">
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            maxLength={220}
            placeholder="Shown on the Blog collection card…"
            className={`${INPUT_CLASS} min-h-[90px] resize-y`}
          />
        </Field>
      </div>

      <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 mb-5">
        <label className="block text-xs font-bold text-white/70 mb-2.5">
          Featured image (required to publish)
        </label>
        {featuredImage ? (
          <div className="relative w-55 aspect-[4/3] rounded-xl overflow-hidden border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl(featuredImage, 440)} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setFeaturedImage(null)}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white text-sm leading-none"
            >
              ×
            </button>
          </div>
        ) : (
          <ImageDropzone onFile={onFeaturedFile} />
        )}
      </div>

      <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 mb-5">
        <label className="block text-xs font-bold text-white/70 mb-2.5">Article body</label>
        {migratedFromBlocks && (
          <p className="text-xs text-white/40 mb-3">
            This article was written in the old block editor. It has been converted for editing here
            and will be stored in the new format when you save.
          </p>
        )}
        <RichTextEditor
          value={bodyHtml}
          onChange={setBodyHtml}
          placeholder="Start writing the article…"
          minHeight={420}
        />
      </div>

      {errors && errors.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/25 rounded-2xl p-5 mb-5 text-red-300 text-sm">
          <strong>Fix the following before publishing:</strong>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => save(false)}
          disabled={saving !== null}
          className="px-5 py-3 rounded-full text-sm font-bold bg-white text-[#08120E] hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          {saving === "draft" ? "Saving…" : "Save draft"}
        </button>
        <button
          type="button"
          onClick={() => save(true)}
          disabled={saving !== null}
          className="px-5 py-3 rounded-full text-sm font-bold bg-[#38B685] text-[#08120E] hover:bg-[#2f9e73] transition-colors disabled:opacity-50"
        >
          {saving === "publish" ? "Saving…" : published ? "Save & keep published" : "Publish"}
        </button>
        {postId && (
          <button
            type="button"
            onClick={removePost}
            className="ml-auto px-5 py-3 rounded-full text-sm font-bold bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition-colors"
          >
            Delete post
          </button>
        )}
      </div>
    </div>
  );
}

export const INPUT_CLASS =
  "w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#38B685] transition-colors placeholder:text-white/30";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-white/70 mb-2">{label}</label>
      {children}
      {hint && <p className="text-xs text-white/30 mt-1.5">{hint}</p>}
    </div>
  );
}
