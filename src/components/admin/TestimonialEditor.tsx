"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { adminApi, AdminApiError } from "@/lib/admin/api";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { Field, INPUT_CLASS } from "@/components/admin/BlogEditor";

export function TestimonialEditor({ testimonialId }: { testimonialId?: string }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();

  const [loading, setLoading] = useState(Boolean(testimonialId));
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[] | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [date, setDate] = useState(() =>
    testimonialId ? "" : new Date().toISOString().slice(0, 10)
  );
  const [text, setText] = useState("");

  useEffect(() => {
    if (!testimonialId) return;
    (async () => {
      try {
        const { testimonial } = await adminApi<{
          testimonial: { firstName?: string; lastName?: string; date?: string; text?: string };
        }>(`/api/admin/testimonials/${testimonialId}`);
        setFirstName(testimonial.firstName || "");
        setLastName(testimonial.lastName || "");
        setDate(testimonial.date ? testimonial.date.slice(0, 10) : "");
        setText(testimonial.text || "");
      } catch (err) {
        toast(err instanceof Error ? err.message : "Could not load review.", "error");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testimonialId]);

  async function save() {
    setSaving(true);
    setErrors(null);
    try {
      const payload = { firstName, lastName, date, text };
      if (testimonialId) {
        await adminApi(`/api/admin/testimonials/${testimonialId}`, { method: "PATCH", body: payload });
        toast("Review updated.");
      } else {
        await adminApi("/api/admin/testimonials", { method: "POST", body: payload });
        toast("Review added.");
      }
      router.push("/admin/testimonials");
    } catch (err) {
      if (err instanceof AdminApiError && err.errors) setErrors(err.errors);
      toast(err instanceof Error ? err.message : "Something went wrong.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!testimonialId) return;
    const ok = await confirm({ title: "Delete this review?", message: "This can't be undone." });
    if (!ok) return;
    try {
      await adminApi(`/api/admin/testimonials/${testimonialId}`, { method: "DELETE" });
      router.push("/admin/testimonials");
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
          <h1 className="text-2xl font-bold text-white">{testimonialId ? "Edit review" : "Add review"}</h1>
          <p className="text-sm text-white/40 mt-1">
            Shown on the homepage under &ldquo;Don&apos;t Take Our Word For It&rdquo;, newest first.
          </p>
        </div>
        <Link
          href="/admin/testimonials"
          className="px-4 py-2.5 rounded-full text-sm font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          ← Back to reviews
        </Link>
      </div>

      <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 mb-5 space-y-4.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
          <Field label="First name">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Chris"
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Last name">
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Coleman"
              className={INPUT_CLASS}
            />
          </Field>
        </div>
        <Field label="Date" hint="Only the month and year are shown on the card.">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={INPUT_CLASS} />
        </Field>
        <Field label="Review" hint="Leave a blank line between paragraphs for longer reviews.">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What did they say?"
            className={`${INPUT_CLASS} min-h-[200px] resize-y leading-relaxed`}
          />
        </Field>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
            ))}
          </span>
          Every review shows as 5 stars and Verified automatically.
        </div>
      </div>

      {errors && errors.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/25 rounded-2xl p-5 mb-5 text-red-300 text-sm">
          <ul className="list-disc pl-5 space-y-1">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="px-5 py-3 rounded-full text-sm font-bold bg-[#38B685] text-[#08120E] hover:bg-[#2f9e73] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : testimonialId ? "Save changes" : "Add review"}
        </button>
        {testimonialId && (
          <button
            type="button"
            onClick={remove}
            className="ml-auto px-5 py-3 rounded-full text-sm font-bold bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
