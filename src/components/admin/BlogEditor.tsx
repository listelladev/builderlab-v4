"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminApi, AdminApiError, uploadImage } from "@/lib/admin/api";
import { imageUrl } from "@/lib/sanity/image";
import { uid, htmlToInline, blockToHtml } from "@/lib/admin/richtext";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import type { BodyBlock, PortableTextBlock, PortableTextImageBlock } from "@/lib/blog";

type Category = { _id: string; name: string; slug?: { current?: string } };
type FeaturedImage = PortableTextImageBlock | null;

type BlockKind = "normal" | "h2" | "h3" | "blockquote" | "bullet" | "number" | "image";

function isImageBlock(b: BodyBlock): b is PortableTextImageBlock {
  return b._type === "image";
}
function isTextBlock(b: BodyBlock): b is PortableTextBlock {
  return b._type === "block";
}

function newTextBlock(style: "normal" | "h2" | "h3" | "blockquote"): PortableTextBlock {
  return {
    _type: "block",
    _key: uid(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: uid(), text: "", marks: [] }],
  };
}
function newListBlock(listItem: "bullet" | "number"): PortableTextBlock {
  return {
    _type: "block",
    _key: uid(),
    style: "normal",
    listItem,
    level: 1,
    markDefs: [],
    children: [{ _type: "span", _key: uid(), text: "", marks: [] }],
  };
}
function newImageBlock(): PortableTextImageBlock {
  return { _type: "image", _key: uid(), asset: undefined, alt: "", caption: "" };
}

function slugifyClient(s: string) {
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function estimateReadTime(body: BodyBlock[]) {
  let words = 0;
  for (const b of body) {
    if (isTextBlock(b)) {
      words += (b.children || []).map((c) => c.text || "").join(" ").trim().split(/\s+/).filter(Boolean).length;
    }
  }
  return Math.max(1, Math.ceil(words / 225));
}

type Group =
  | { kind: "single"; block: BodyBlock; index: number }
  | { kind: "list"; listItem: "bullet" | "number"; blocks: PortableTextBlock[]; start: number; end: number };

function computeGroups(body: BodyBlock[]): Group[] {
  const groups: Group[] = [];
  let i = 0;
  while (i < body.length) {
    const b = body[i];
    if (isTextBlock(b) && b.listItem) {
      let j = i + 1;
      while (j < body.length && isTextBlock(body[j]) && (body[j] as PortableTextBlock).listItem === b.listItem) j++;
      groups.push({ kind: "list", listItem: b.listItem, blocks: body.slice(i, j) as PortableTextBlock[], start: i, end: j });
      i = j;
    } else {
      groups.push({ kind: "single", block: b, index: i });
      i += 1;
    }
  }
  return groups;
}

function blockLabel(b: BodyBlock) {
  if (isImageBlock(b)) return "Image";
  if (isTextBlock(b)) {
    if (b.style === "h2") return "H2";
    if (b.style === "h3") return "H3";
    if (b.style === "blockquote") return "Quote";
  }
  return "Paragraph";
}

function ToolbarButton({ label, onClick, className }: { label: React.ReactNode; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-white hover:bg-white/10 transition-colors ${className || ""}`}
    >
      {label}
    </button>
  );
}

function RichTextToolbar({ targetRef }: { targetRef: React.RefObject<HTMLDivElement | null> }) {
  const exec = (cmd: string) => {
    targetRef.current?.focus();
    if (cmd === "link") {
      const url = window.prompt("Link URL");
      if (url) document.execCommand("createLink", false, url);
    } else {
      document.execCommand(cmd, false);
    }
  };
  return (
    <div className="flex gap-1.5 flex-wrap mb-2.5">
      <ToolbarButton label={<b>B</b>} onClick={() => exec("bold")} />
      <ToolbarButton label={<i>I</i>} onClick={() => exec("italic")} />
      <ToolbarButton label="Link" onClick={() => exec("link")} />
    </div>
  );
}

const RTE_CLASS =
  "rte border border-white/10 rounded-lg px-3.5 py-3 min-h-[70px] text-[15px] leading-relaxed text-white/90 outline-none focus:border-[#38B685] transition-colors [&_a]:text-[#38B685] [&_a]:underline [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-5";

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

  const [categories, setCategories] = useState<Category[]>([]);
  const [manageOpen, setManageOpen] = useState(false);

  const bodyRef = useRef<BodyBlock[]>([]);
  const [, setBodyVersion] = useState(0);
  const rerenderBody = () => setBodyVersion((v) => v + 1);

  const [errors, setErrors] = useState<string[] | null>(null);

  const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const readTimeHintRef = useRef<HTMLSpanElement>(null);

  const updateReadTimeHint = useCallback(() => {
    if (readTimeHintRef.current) {
      readTimeHintRef.current.textContent = `Auto-calculated: ${estimateReadTime(bodyRef.current)} min read (leave blank to use this)`;
    }
  }, []);

  useEffect(() => {
    adminApi<{ categories: Category[] }>("/api/admin/categories")
      .then(({ categories }) => setCategories(categories))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!postId) {
      updateReadTimeHint();
      return;
    }
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
        bodyRef.current = Array.isArray(post.body) ? post.body : [];
        rerenderBody();
        updateReadTimeHint();
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

  function addBlock(kind: BlockKind) {
    const block: BodyBlock =
      kind === "image"
        ? newImageBlock()
        : kind === "bullet" || kind === "number"
          ? newListBlock(kind)
          : newTextBlock(kind);
    bodyRef.current = [...bodyRef.current, block];
    rerenderBody();
    updateReadTimeHint();
  }

  function removeGroup(g: Group) {
    if (g.kind === "single") {
      bodyRef.current = bodyRef.current.filter((_, i) => i !== g.index);
    } else {
      bodyRef.current = [...bodyRef.current.slice(0, g.start), ...bodyRef.current.slice(g.end)];
    }
    rerenderBody();
    updateReadTimeHint();
  }

  function moveGroup(groups: Group[], gi: number, dir: 1 | -1) {
    const target = gi + dir;
    if (target < 0 || target >= groups.length) return;
    const a = groups[gi];
    const b = groups[target];
    const aStart = a.kind === "single" ? a.index : a.start;
    const aEnd = a.kind === "single" ? a.index + 1 : a.end;
    const bStart = b.kind === "single" ? b.index : b.start;
    const bEnd = b.kind === "single" ? b.index + 1 : b.end;
    const first = dir > 0 ? { start: aStart, end: aEnd } : { start: bStart, end: bEnd };
    const second = dir > 0 ? { start: bStart, end: bEnd } : { start: aStart, end: aEnd };
    const firstSlice = bodyRef.current.slice(first.start, first.end);
    const secondSlice = bodyRef.current.slice(second.start, second.end);
    bodyRef.current = [
      ...bodyRef.current.slice(0, first.start),
      ...secondSlice,
      ...firstSlice,
      ...bodyRef.current.slice(second.end),
    ];
    rerenderBody();
  }

  function syncSingleBlock(key: string, index: number) {
    const el = blockRefs.current.get(key);
    if (!el) return;
    const { markDefs, children } = htmlToInline(el);
    const b = bodyRef.current[index];
    if (b && isTextBlock(b)) {
      bodyRef.current[index] = { ...b, markDefs, children };
    }
  }

  function syncListGroup(groupKey: string, start: number, end: number, listItem: "bullet" | "number") {
    const el = blockRefs.current.get(groupKey);
    if (!el) return;
    const listEl = el.querySelector("ul, ol");
    const items = listEl ? Array.from(listEl.querySelectorAll(":scope > li")) : [];
    let newBlocks: PortableTextBlock[] = items.map((li) => {
      const { markDefs, children } = htmlToInline(li as HTMLElement);
      return { _type: "block", _key: uid(), style: "normal", listItem, level: 1, markDefs, children };
    });
    if (!newBlocks.length) newBlocks = [newListBlock(listItem)];
    bodyRef.current = [...bodyRef.current.slice(0, start), ...newBlocks, ...bodyRef.current.slice(end)];
  }

  function handleListKeydown(e: React.KeyboardEvent<HTMLDivElement>, containerEl: HTMLElement) {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    let li: Node | null = range.startContainer;
    while (li && (li as HTMLElement).nodeName !== "LI") li = li.parentNode;
    if (!li || !containerEl.contains(li)) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const newLi = document.createElement("li");
      newLi.appendChild(document.createElement("br"));
      (li as HTMLElement).after(newLi);
      const newRange = document.createRange();
      newRange.setStart(newLi, 0);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    } else if (
      e.key === "Backspace" &&
      range.collapsed &&
      range.startOffset === 0 &&
      (li as HTMLElement).previousElementSibling
    ) {
      e.preventDefault();
      const prev = (li as HTMLElement).previousElementSibling as HTMLElement;
      const newRange = document.createRange();
      newRange.selectNodeContents(prev);
      newRange.collapse(false);
      while ((li as HTMLElement).firstChild) prev.appendChild((li as HTMLElement).firstChild as ChildNode);
      (li as HTMLElement).remove();
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
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

  async function onBlockImageFile(file: File, key: string, index: number) {
    if (file.size > 4 * 1024 * 1024) {
      toast("That image is larger than the 4 MB limit.", "error");
      return;
    }
    try {
      const { image } = await uploadImage(file, "");
      const b = bodyRef.current[index];
      if (b && isImageBlock(b) && b._key === key) {
        bodyRef.current[index] = { ...b, asset: image.asset };
        rerenderBody();
      }
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

  function syncAllBeforeSave() {
    const groups = computeGroups(bodyRef.current);
    for (const g of groups) {
      if (g.kind === "single" && isTextBlock(g.block)) {
        syncSingleBlock(g.block._key, g.index);
      }
    }
    for (const g of groups) {
      if (g.kind === "list") {
        const groupKey = "group-" + g.start;
        syncListGroup(groupKey, g.start, g.end, g.listItem);
      }
    }
  }

  async function save(publish: boolean) {
    syncAllBeforeSave();
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
        body: bodyRef.current,
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

  // bodyRef is the deliberate source of truth for block content (mirrors the
  // vanilla editor's `state.body`): reading it here, and only re-rendering
  // via the bodyVersion bump in rerenderBody(), is what lets typing inside a
  // contentEditable block avoid a full re-render (and the cursor jump that
  // would cause) on every keystroke.
  // eslint-disable-next-line react-hooks/refs
  const groups = computeGroups(bodyRef.current);

  if (loading) {
    return <div className="text-white/50 text-sm">Loading…</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3.5 mb-6.5">
        <div>
          <h1 className="text-2xl font-bold text-white">{postId ? "Edit post" : "Add blog post"}</h1>
          <p className="text-sm text-white/40 mt-1">
            Article content uses the structured block editor below — no raw HTML.
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
          <Field label="Read time override (optional)">
            <input
              type="number"
              min={1}
              value={readTimeOverride}
              onChange={(e) => setReadTimeOverride(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="auto-calculated"
              className={INPUT_CLASS}
            />
            <span ref={readTimeHintRef} className="block text-xs text-white/30 mt-1.5" />
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
        <div className="flex flex-col gap-3 mb-3">
          {groups.length === 0 && (
            <p className="text-sm text-white/30">No content yet — add a block below to start the article.</p>
          )}
          {groups.map((g, gi) => (
            <BlockGroupItem
              key={g.kind === "single" ? g.block._key : "group-" + g.start}
              group={g}
              groupIndex={gi}
              totalGroups={groups.length}
              blockRefs={blockRefs}
              onMove={(dir) => moveGroup(groups, gi, dir)}
              onRemove={() => removeGroup(g)}
              onTextInput={(key, index) => {
                syncSingleBlock(key, index);
                updateReadTimeHint();
              }}
              onListInput={(groupKey, start, end, listItem) => {
                syncListGroup(groupKey, start, end, listItem);
                updateReadTimeHint();
              }}
              onListKeydown={handleListKeydown}
              onImageFile={onBlockImageFile}
              onAltChange={(index, alt) => {
                const b = bodyRef.current[index];
                if (b && isImageBlock(b)) bodyRef.current[index] = { ...b, alt };
              }}
              onCaptionChange={(index, caption) => {
                const b = bodyRef.current[index];
                if (b && isImageBlock(b)) bodyRef.current[index] = { ...b, caption };
              }}
            />
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          <ToolbarButton label="+ Paragraph" onClick={() => addBlock("normal")} />
          <ToolbarButton label="+ H2" onClick={() => addBlock("h2")} />
          <ToolbarButton label="+ H3" onClick={() => addBlock("h3")} />
          <ToolbarButton label="+ Quote" onClick={() => addBlock("blockquote")} />
          <ToolbarButton label="+ Bulleted list item" onClick={() => addBlock("bullet")} />
          <ToolbarButton label="+ Numbered list item" onClick={() => addBlock("number")} />
          <ToolbarButton label="+ Image" onClick={() => addBlock("image")} />
        </div>
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

const INPUT_CLASS =
  "w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#38B685] transition-colors placeholder:text-white/30";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-white/70 mb-2">{label}</label>
      {children}
      {hint && <p className="text-xs text-white/30 mt-1.5">{hint}</p>}
    </div>
  );
}

function BlockHead({
  label,
  groupIndex,
  totalGroups,
  onMove,
  onRemove,
}: {
  label: string;
  groupIndex: number;
  totalGroups: number;
  onMove: (dir: 1 | -1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">{label}</span>
      <div className="flex gap-1">
        <button
          type="button"
          disabled={groupIndex === 0}
          onClick={() => onMove(-1)}
          className="w-6 h-6 rounded-md border border-white/10 text-white/60 text-xs disabled:opacity-30 hover:bg-white/5"
        >
          ↑
        </button>
        <button
          type="button"
          disabled={groupIndex === totalGroups - 1}
          onClick={() => onMove(1)}
          className="w-6 h-6 rounded-md border border-white/10 text-white/60 text-xs disabled:opacity-30 hover:bg-white/5"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="w-6 h-6 rounded-md border border-white/10 text-red-300 text-xs hover:bg-red-500/10"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function BlockGroupItem({
  group,
  groupIndex,
  totalGroups,
  blockRefs,
  onMove,
  onRemove,
  onTextInput,
  onListInput,
  onListKeydown,
  onImageFile,
  onAltChange,
  onCaptionChange,
}: {
  group: Group;
  groupIndex: number;
  totalGroups: number;
  blockRefs: React.RefObject<Map<string, HTMLDivElement>>;
  onMove: (dir: 1 | -1) => void;
  onRemove: () => void;
  onTextInput: (key: string, index: number) => void;
  onListInput: (groupKey: string, start: number, end: number, listItem: "bullet" | "number") => void;
  onListKeydown: (e: React.KeyboardEvent<HTMLDivElement>, containerEl: HTMLElement) => void;
  onImageFile: (file: File, key: string, index: number) => void;
  onAltChange: (index: number, alt: string) => void;
  onCaptionChange: (index: number, caption: string) => void;
}) {
  // Called unconditionally regardless of which branch below renders, so the
  // hook order stays stable across re-renders (a given block's `_type`
  // never changes after creation, but the group's `kind` is still a runtime
  // branch as far as the Rules of Hooks are concerned).
  const toolbarRef = useRef<HTMLDivElement>(null);

  const setRef = (key: string) => (el: HTMLDivElement | null) => {
    if (el) blockRefs.current.set(key, el);
    else blockRefs.current.delete(key);
  };

  const head = (label: string) => (
    <BlockHead label={label} groupIndex={groupIndex} totalGroups={totalGroups} onMove={onMove} onRemove={onRemove} />
  );

  if (group.kind === "list") {
    const groupKey = "group-" + group.start;
    const tag = group.listItem === "number" ? "ol" : "ul";
    const itemsHtml = group.blocks.map((b) => `<li>${blockToHtml(b)}</li>`).join("");
    const listHtml = `<${tag} style="margin:0;padding-left:22px;">${itemsHtml}</${tag}>`;
    return (
      <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
        {head(group.listItem === "number" ? "Numbered list" : "Bulleted list")}
        <RichTextToolbar targetRef={toolbarRef} />
        <div
          ref={(el) => {
            setRef(groupKey)(el);
            toolbarRef.current = el;
          }}
          className={RTE_CLASS}
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: listHtml }}
          onInput={() => onListInput(groupKey, group.start, group.end, group.listItem)}
          onKeyDown={(e) => {
            const el = blockRefs.current.get(groupKey);
            if (el) onListKeydown(e, el);
          }}
        />
      </div>
    );
  }

  const b = group.block;
  const index = group.index;

  if (isImageBlock(b)) {
    const src = imageUrl(b, 500);
    return (
      <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
        {head("Image")}
        {src ? (
          <div className="relative w-65 aspect-[4/3] rounded-lg overflow-hidden border border-white/10 mb-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="mb-2.5">
            <ImageDropzone onFile={(file) => onImageFile(file, b._key, index)} />
          </div>
        )}
        <Field label="Alt text">
          <input
            type="text"
            defaultValue={b.alt || ""}
            onChange={(e) => onAltChange(index, e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
        <div className="h-2.5" />
        <Field label="Caption (optional)">
          <input
            type="text"
            defaultValue={b.caption || ""}
            onChange={(e) => onCaptionChange(index, e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
      </div>
    );
  }

  return (
    <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
      {head(blockLabel(b))}
      <RichTextToolbar targetRef={toolbarRef} />
      <div
        ref={(el) => {
          setRef(b._key)(el);
          toolbarRef.current = el;
        }}
        className={RTE_CLASS}
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: blockToHtml(b) || "" }}
        onInput={() => onTextInput(b._key, index)}
      />
    </div>
  );
}
