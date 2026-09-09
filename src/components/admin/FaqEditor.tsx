"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin/api";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";

export function FaqEditor({ faqId }: { faqId?: string }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();

  const [loading, setLoading] = useState(Boolean(faqId));
  const [saving, setSaving] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (!faqId) return;
    (async () => {
      try {
        const { faq } = await adminApi<{
          faq: { question?: string; answer?: string[] | string };
        }>(`/api/admin/faqs/${faqId}`);
        setQuestion(faq.question || "");
        setAnswer(
          Array.isArray(faq.answer)
            ? faq.answer.join("\n\n")
            : faq.answer || ""
        );
      } catch (err) {
        toast(err instanceof Error ? err.message : "Could not load FAQ.", "error");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faqId]);

  async function save() {
    if (!question.trim()) {
      toast("Add a question before saving.", "error");
      return;
    }
    if (!answer.trim()) {
      toast("Add an answer before saving.", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = { question, answer };
      if (faqId) {
        await adminApi(`/api/admin/faqs/${faqId}`, { method: "PATCH", body: payload });
        toast("FAQ updated.");
      } else {
        await adminApi("/api/admin/faqs", { method: "POST", body: payload });
        toast("FAQ published.");
      }
      router.push("/admin/faqs");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function removeFaq() {
    if (!faqId) return;
    const ok = await confirm({
      title: "Delete this FAQ?",
      message: "This can't be undone.",
    });
    if (!ok) return;
    try {
      await adminApi(`/api/admin/faqs/${faqId}`, { method: "DELETE" });
      router.push("/admin/faqs");
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
          <h1 className="text-2xl font-bold text-white">{faqId ? "Edit FAQ" : "Add FAQ"}</h1>
          <p className="text-sm text-white/40 mt-1">
            Shown in the Frequently Asked Questions section on the homepage.
          </p>
        </div>
        <Link
          href="/admin/faqs"
          className="px-4 py-2.5 rounded-full text-sm font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          ← Back to FAQs
        </Link>
      </div>

      <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 mb-5 space-y-4.5">
        <div>
          <label className="block text-xs font-bold text-white/70 mb-2">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What type of companies do you work with?"
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-white/70 mb-2">Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={8}
            placeholder="Write the answer. Leave a blank line between paragraphs to split them."
            className={`${INPUT_CLASS} resize-y leading-relaxed`}
          />
          <p className="text-xs text-white/30 mt-1.5">
            Separate paragraphs with a blank line.
          </p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="px-5 py-3 rounded-full text-sm font-bold bg-[#38B685] text-[#08120E] hover:bg-[#2f9e73] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : faqId ? "Save changes" : "Publish"}
        </button>
        {faqId && (
          <button
            type="button"
            onClick={removeFaq}
            className="ml-auto px-5 py-3 rounded-full text-sm font-bold bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

const INPUT_CLASS =
  "w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#38B685] transition-colors placeholder:text-white/30";
