"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { adminApi, AdminApiError } from "@/lib/admin/api";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";

type AdminFaq = {
  _id: string;
  question?: string;
  answer?: string[] | string;
};

function preview(answer: AdminFaq["answer"]): string {
  const text = Array.isArray(answer) ? answer.join(" ") : answer || "";
  return text.length > 160 ? `${text.slice(0, 160)}…` : text;
}

export default function AdminFaqsListPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [faqs, setFaqs] = useState<AdminFaq[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const { faqs } = await adminApi<{ faqs: AdminFaq[] }>("/api/admin/faqs");
      setFaqs(faqs);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not load FAQs.");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function remove(f: AdminFaq) {
    const ok = await confirm({
      title: "Delete this FAQ?",
      message: `"${f.question || "This FAQ"}" will be permanently removed.`,
    });
    if (!ok) return;
    try {
      await adminApi(`/api/admin/faqs/${f._id}`, { method: "DELETE" });
      toast("FAQ deleted.");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong.", "error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3.5 mb-6.5">
        <div>
          <h1 className="text-2xl font-bold text-white">FAQs</h1>
          <p className="text-sm text-white/40 mt-1">
            The Frequently Asked Questions section on the homepage.
          </p>
        </div>
        <Link
          href="/admin/faqs/new"
          className="bg-[#38B685] text-[#08120E] font-bold rounded-full px-5 py-2.5 text-sm hover:bg-[#2f9e73] transition-colors"
        >
          + Add FAQ
        </Link>
      </div>

      {error && (
        <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 text-red-400 text-sm">
          {error}
        </div>
      )}

      {!error && faqs === null && (
        <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 text-white/50 text-sm">
          Loading…
        </div>
      )}

      {!error && faqs && faqs.length === 0 && (
        <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 text-white/50 text-sm">
          No FAQs yet.
        </div>
      )}

      {!error && faqs && faqs.length > 0 && (
        <div className="flex flex-col gap-3">
          {faqs.map((f) => (
            <div
              key={f._id}
              className="bg-[#161616] border border-white/10 rounded-2xl p-5 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="font-semibold text-white text-sm">
                  {f.question || "(no question)"}
                </div>
                <p className="text-xs text-white/40 mt-1 leading-relaxed">
                  {preview(f.answer)}
                </p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <Link
                  href={`/admin/faqs/${f._id}`}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => remove(f)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
