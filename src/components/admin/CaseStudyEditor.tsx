"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminApi, AdminApiError, uploadImage } from "@/lib/admin/api";
import { imageUrl, type SanityImage } from "@/lib/sanity/image";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Field, INPUT_CLASS } from "@/components/admin/BlogEditor";

type Img = (SanityImage & { _type: "image" }) | null;
type Stat = { _key: string; label: string; value: number | ""; prefix: string; suffix: string };
type Work = { _key: string; title: string; description: string };

const uid = () => Math.random().toString(36).slice(2, 10);
const emptyStat = (): Stat => ({ _key: uid(), label: "", value: "", prefix: "", suffix: "" });
const emptyWork = (): Work => ({ _key: uid(), title: "", description: "" });

function slugifyClient(s: string) {
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function CaseStudyEditor({ caseStudyId }: { caseStudyId?: string }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();

  const [loading, setLoading] = useState(Boolean(caseStudyId));
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [errors, setErrors] = useState<string[] | null>(null);
  const [published, setPublished] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const slugTouchedRef = useRef(Boolean(caseStudyId));
  const [industry, setIndustry] = useState("");
  const [tagline, setTagline] = useState("");
  const [highlights, setHighlights] = useState<string[]>(["", "", ""]);
  const [heroImage, setHeroImage] = useState<Img>(null);
  const [sortOrder, setSortOrder] = useState<number | "">("");

  const [stats, setStats] = useState<Stat[]>(() => [emptyStat(), emptyStat(), emptyStat(), emptyStat()]);
  const [aboutHtml, setAboutHtml] = useState("");
  const [whatWeDid, setWhatWeDid] = useState<Work[]>(() => [emptyWork()]);
  const [resultsHtml, setResultsHtml] = useState("");
  const [resultsImage, setResultsImage] = useState<Img>(null);
  const [testimonialQuote, setTestimonialQuote] = useState("");
  const [testimonialName, setTestimonialName] = useState("");
  const [testimonialRole, setTestimonialRole] = useState("");

  useEffect(() => {
    if (!caseStudyId) return;
    (async () => {
      try {
        const { caseStudy: c } = await adminApi<{
          caseStudy: {
            name?: string;
            slug?: { current?: string };
            industry?: string;
            tagline?: string;
            highlights?: string[];
            heroImage?: Img;
            sortOrder?: number;
            stats?: Partial<Stat>[];
            aboutHtml?: string;
            whatWeDid?: Partial<Work>[];
            resultsHtml?: string;
            resultsImage?: Img;
            testimonialQuote?: string;
            testimonialName?: string;
            testimonialRole?: string;
            published?: boolean;
          };
        }>(`/api/admin/case-studies/${caseStudyId}`);
        setName(c.name || "");
        setSlug(c.slug?.current || "");
        setIndustry(c.industry || "");
        setTagline(c.tagline || "");
        const h = Array.isArray(c.highlights) ? c.highlights.slice(0, 3) : [];
        while (h.length < 3) h.push("");
        setHighlights(h);
        setHeroImage(c.heroImage || null);
        setSortOrder(typeof c.sortOrder === "number" ? c.sortOrder : "");
        const s = (Array.isArray(c.stats) ? c.stats : []).map((x) => ({
          _key: x._key || uid(),
          label: x.label || "",
          value: typeof x.value === "number" ? x.value : "",
          prefix: x.prefix || "",
          suffix: x.suffix || "",
        })) as Stat[];
        while (s.length < 4) s.push(emptyStat());
        setStats(s);
        setAboutHtml(c.aboutHtml || "");
        const w = (Array.isArray(c.whatWeDid) ? c.whatWeDid : []).map((x) => ({
          _key: x._key || uid(),
          title: x.title || "",
          description: x.description || "",
        }));
        setWhatWeDid(w.length ? w : [emptyWork()]);
        setResultsHtml(c.resultsHtml || "");
        setResultsImage(c.resultsImage || null);
        setTestimonialQuote(c.testimonialQuote || "");
        setTestimonialName(c.testimonialName || "");
        setTestimonialRole(c.testimonialRole || "");
        setPublished(Boolean(c.published));
      } catch (err) {
        toast(err instanceof Error ? err.message : "Could not load case study.", "error");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseStudyId]);

  function onNameChange(v: string) {
    setName(v);
    if (!slugTouchedRef.current) setSlug(slugifyClient(v));
  }
  function onSlugChange(v: string) {
    slugTouchedRef.current = true;
    setSlug(slugifyClient(v));
  }

  async function upload(file: File, set: (img: Img) => void) {
    if (file.size > 4 * 1024 * 1024) {
      toast("That image is larger than the 4 MB limit.", "error");
      return;
    }
    try {
      const { image } = await uploadImage(file, name);
      set(image as Img);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed.", "error");
    }
  }

  async function save(publish: boolean) {
    setSaving(publish ? "publish" : "draft");
    setErrors(null);
    try {
      const payload = {
        name,
        slug,
        industry,
        tagline,
        highlights,
        heroImage: heroImage || undefined,
        sortOrder: sortOrder === "" ? undefined : Number(sortOrder),
        stats: stats.map((s) => ({ ...s, value: s.value === "" ? 0 : Number(s.value) })),
        aboutHtml,
        whatWeDid,
        resultsHtml,
        resultsImage: resultsImage || undefined,
        testimonialQuote,
        testimonialName,
        testimonialRole,
        published: publish,
      };
      let result: { caseStudy: { _id: string } };
      if (caseStudyId) {
        result = await adminApi(`/api/admin/case-studies/${caseStudyId}`, { method: "PATCH", body: payload });
      } else {
        result = await adminApi("/api/admin/case-studies", { method: "POST", body: payload });
      }
      toast(publish ? "Case study published." : "Draft saved.");
      if (!caseStudyId) {
        router.push(`/admin/case-studies/${result.caseStudy._id}`);
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

  async function remove() {
    if (!caseStudyId) return;
    const ok = await confirm({ title: "Delete this case study?", message: "This can't be undone." });
    if (!ok) return;
    try {
      await adminApi(`/api/admin/case-studies/${caseStudyId}`, { method: "DELETE" });
      router.push("/admin/case-studies");
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
          <h1 className="text-2xl font-bold text-white">{caseStudyId ? "Edit case study" : "Add case study"}</h1>
          <p className="text-sm text-white/40 mt-1">
            The first card feeds the thumbnail on /case-studies; the rest builds the full page.
          </p>
        </div>
        <Link href="/admin/case-studies" className="px-4 py-2.5 rounded-full text-sm font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
          ← Back to case studies
        </Link>
      </div>

      <Section title="Thumbnail & intro" hint="Shown on the case-studies collection card and at the top of the page.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
          <Field label="Client name">
            <input type="text" value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="e.g. MU Developments" className={INPUT_CLASS} />
          </Field>
          <Field label="Industry" hint="The small label on the thumbnail, e.g. Custom Home Building.">
            <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Custom Home Building" className={INPUT_CLASS} />
          </Field>
        </div>
        <Field label="Slug" hint="Auto-generated from the name. Edit it yourself and it will stay locked to your version.">
          <input type="text" value={slug} onChange={(e) => onSlugChange(e.target.value)} placeholder="auto-generated-from-name" className={INPUT_CLASS} />
        </Field>
        <Field label="Highlights" hint="Up to three short wins, one per line on the thumbnail. Keep each to a few words.">
          <div className="space-y-2">
            {highlights.map((h, i) => (
              <input
                key={i}
                type="text"
                value={h}
                onChange={(e) => setHighlights((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder={["e.g. $1.3M contract from one ad lead", "e.g. 381 leads at $12.80 per lead", "e.g. 3 active sets of plans in progress"][i]}
                className={INPUT_CLASS}
              />
            ))}
          </div>
        </Field>
        <Field label="Tagline" hint="One or two sentences under the client name at the top of the page (also the page's search description).">
          <textarea value={tagline} onChange={(e) => setTagline(e.target.value)} className={`${INPUT_CLASS} min-h-[90px] resize-y`} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
          <ImageField label="Hero image (required to publish)" hint="Thumbnail photo and the large image at the top of the page." image={heroImage} onFile={(f) => upload(f, setHeroImage)} onClear={() => setHeroImage(null)} />
          <Field label="Order" hint="Lower numbers show first on the collection page.">
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value === "" ? "" : Number(e.target.value))} placeholder="auto" className={INPUT_CLASS} />
          </Field>
        </div>
      </Section>

      <Section title="The results" hint="Four headline numbers. Value is the number that counts up; prefix/suffix wrap it, e.g. $ … M.">
        <div className="space-y-2.5">
          {stats.map((s, i) => (
            <div key={s._key} className="grid grid-cols-[1fr_80px_100px_80px] gap-2">
              <input type="text" value={s.label} placeholder="Label, e.g. Website leads generated" onChange={(e) => setStats((arr) => arr.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} className={INPUT_CLASS} />
              <input type="text" value={s.prefix} placeholder="$" onChange={(e) => setStats((arr) => arr.map((x, j) => (j === i ? { ...x, prefix: e.target.value } : x)))} className={INPUT_CLASS} />
              <input type="number" step="any" value={s.value} placeholder="381" onChange={(e) => setStats((arr) => arr.map((x, j) => (j === i ? { ...x, value: e.target.value === "" ? "" : Number(e.target.value) } : x)))} className={INPUT_CLASS} />
              <input type="text" value={s.suffix} placeholder="+" onChange={(e) => setStats((arr) => arr.map((x, j) => (j === i ? { ...x, suffix: e.target.value } : x)))} className={INPUT_CLASS} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="About the client" hint="The centred intro paragraph under the numbers.">
        <RichTextEditor value={aboutHtml} onChange={setAboutHtml} features="basic" minHeight={140} placeholder="Who are they, and where were they before working with us?" />
      </Section>

      <Section title="What we did" hint="One card per piece of the system. Four cards make the 2×2 grid on desktop.">
        <div className="space-y-3">
          {whatWeDid.map((w, i) => (
            <div key={w._key} className="border border-white/10 rounded-xl p-4 bg-white/[0.02] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Card {i + 1}</span>
                <div className="flex gap-1">
                  <SmallButton disabled={i === 0} onClick={() => setWhatWeDid((arr) => move(arr, i, -1))}>↑</SmallButton>
                  <SmallButton disabled={i === whatWeDid.length - 1} onClick={() => setWhatWeDid((arr) => move(arr, i, 1))}>↓</SmallButton>
                  <SmallButton danger onClick={() => setWhatWeDid((arr) => (arr.length > 1 ? arr.filter((_, j) => j !== i) : [emptyWork()]))}>✕</SmallButton>
                </div>
              </div>
              <input type="text" value={w.title} placeholder="Title, e.g. Positioning & Offer" onChange={(e) => setWhatWeDid((arr) => arr.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} className={INPUT_CLASS} />
              <textarea value={w.description} placeholder="What we did and why it mattered." onChange={(e) => setWhatWeDid((arr) => arr.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} className={`${INPUT_CLASS} min-h-[80px] resize-y`} />
            </div>
          ))}
          <button type="button" onClick={() => setWhatWeDid((arr) => [...arr, emptyWork()])} className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-white hover:bg-white/10 transition-colors">
            + Add card
          </button>
        </div>
      </Section>

      <Section title="What changed" hint="The results write-up, shown beside its image.">
        <RichTextEditor value={resultsHtml} onChange={setResultsHtml} features="basic" minHeight={160} placeholder="What happened after launch?" />
        <ImageField label="Results image" hint="Optional — falls back to the hero image. Also used behind the testimonial." image={resultsImage} onFile={(f) => upload(f, setResultsImage)} onClear={() => setResultsImage(null)} />
      </Section>

      <Section title="Client testimonial" hint="Optional. Leave the quote empty to hide this block on the page.">
        <Field label="Quote">
          <textarea value={testimonialQuote} onChange={(e) => setTestimonialQuote(e.target.value)} className={`${INPUT_CLASS} min-h-[90px] resize-y`} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
          <Field label="Name">
            <input type="text" value={testimonialName} onChange={(e) => setTestimonialName(e.target.value)} placeholder="e.g. Jeff Martin" className={INPUT_CLASS} />
          </Field>
          <Field label="Role / company">
            <input type="text" value={testimonialRole} onChange={(e) => setTestimonialRole(e.target.value)} placeholder="e.g. MU Developments" className={INPUT_CLASS} />
          </Field>
        </div>
      </Section>

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
        <button type="button" onClick={() => save(false)} disabled={saving !== null} className="px-5 py-3 rounded-full text-sm font-bold bg-white text-[#08120E] hover:bg-white/90 transition-colors disabled:opacity-50">
          {saving === "draft" ? "Saving…" : "Save draft"}
        </button>
        <button type="button" onClick={() => save(true)} disabled={saving !== null} className="px-5 py-3 rounded-full text-sm font-bold bg-[#38B685] text-[#08120E] hover:bg-[#2f9e73] transition-colors disabled:opacity-50">
          {saving === "publish" ? "Saving…" : published ? "Save & keep published" : "Publish"}
        </button>
        {caseStudyId && (
          <button type="button" onClick={remove} className="ml-auto px-5 py-3 rounded-full text-sm font-bold bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition-colors">
            Delete case study
          </button>
        )}
      </div>
    </div>
  );
}

function move<T>(arr: T[], i: number, dir: 1 | -1) {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 mb-5 space-y-4.5">
      <div>
        <h2 className="text-base font-bold text-white">{title}</h2>
        {hint && <p className="text-xs text-white/40 mt-1">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function SmallButton({ children, onClick, disabled, danger }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-6 h-6 rounded-md border border-white/10 text-xs disabled:opacity-30 ${danger ? "text-red-300 hover:bg-red-500/10" : "text-white/60 hover:bg-white/5"}`}
    >
      {children}
    </button>
  );
}

function ImageField({ label, hint, image, onFile, onClear }: { label: string; hint?: string; image: Img; onFile: (f: File) => void; onClear: () => void }) {
  return (
    <Field label={label} hint={hint}>
      {image ? (
        <div className="relative w-full max-w-[260px] aspect-[4/3] rounded-xl overflow-hidden border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl(image, 520)} alt="" className="w-full h-full object-cover" />
          <button type="button" onClick={onClear} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white text-sm leading-none">
            ×
          </button>
        </div>
      ) : (
        <ImageDropzone onFile={onFile} />
      )}
    </Field>
  );
}
