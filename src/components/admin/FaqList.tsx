"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { adminApi, AdminApiError } from "@/lib/admin/api";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { pricingFaqs } from "@/lib/pricing";

type AdminFaq = {
  _id: string;
  question?: string;
  answer?: string[] | string;
};

function preview(answer: AdminFaq["answer"]): string {
  const text = Array.isArray(answer) ? answer.join(" ") : answer || "";
  return text.length > 160 ? `${text.slice(0, 160)}…` : text;
}

type FaqPage = "home" | "pricing";

// The homepage and the pricing page each have their own list of FAQs; the
// same list/editor UI serves both, differing only in these strings and in
// the `page` scope sent to the API.
export const FAQ_ADMIN: Record<
  FaqPage,
  { base: string; title: string; blurb: string; query: string }
> = {
  home: {
    base: "/admin/faqs",
    title: "FAQs",
    blurb: "The Frequently Asked Questions section on the homepage.",
    query: "",
  },
  pricing: {
    base: "/admin/pricing-faqs",
    title: "Pricing FAQs",
    blurb: "The FAQ section under the pricing table on the Pricing page.",
    query: "?page=pricing",
  },
};

export function FaqList({ page }: { page: FaqPage }) {
  const cfg = FAQ_ADMIN[page];
  const toast = useToast();
  const confirm = useConfirm();
  const [faqs, setFaqs] = useState<AdminFaq[] | null>(null);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);

  const load = useCallback(async () => {
    try {
      const { faqs } = await adminApi<{ faqs: AdminFaq[] }>(
        `/api/admin/faqs${cfg.query}`
      );
      setFaqs(faqs);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not load FAQs.");
    }
  }, [cfg.query]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  // The pricing page ships with a starter set (src/lib/pricing.ts) that it
  // shows until the CMS has its own. This copies them in, so they can be
  // edited, reordered by recreating, or deleted like any other FAQ.
  async function importStarters() {
    setImporting(true);
    try {
      for (const f of pricingFaqs) {
        await adminApi("/api/admin/faqs", {
          method: "POST",
          body: { question: f.q, answer: f.a, page },
        });
      }
      toast("Starter FAQs added.");
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong.", "error");
      await load();
    } finally {
      setImporting(false);
    }
  }

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
          <h1 className="text-2xl font-bold text-white">{cfg.title}</h1>
          <p className="text-sm text-white/40 mt-1">{cfg.blurb}</p>
        </div>
        <Link
          href={`${cfg.base}/new`}
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
          <p>
            No FAQs yet.
            {page === "pricing" &&
              " The Pricing page is showing its built-in starter questions until you add your own."}
          </p>
          {page === "pricing" && (
            <button
              type="button"
              onClick={importStarters}
              disabled={importing}
              className="mt-4 bg-[#38B685] text-[#08120E] font-bold rounded-full px-5 py-2.5 text-sm hover:bg-[#2f9e73] transition-colors disabled:opacity-50"
            >
              {importing ? "Adding…" : "Add starter FAQs to edit"}
            </button>
          )}
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
                  href={`${cfg.base}/${f._id}`}
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
