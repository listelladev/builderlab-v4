"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { adminApi, AdminApiError } from "@/lib/admin/api";
import { formatReviewDate, type TestimonialDoc } from "@/lib/reviews-format";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";

export default function AdminTestimonialsListPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [items, setItems] = useState<TestimonialDoc[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const { testimonials } = await adminApi<{ testimonials: TestimonialDoc[] }>(
        "/api/admin/testimonials"
      );
      setItems(testimonials);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not load reviews.");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function remove(t: TestimonialDoc) {
    const name = [t.firstName, t.lastName].filter(Boolean).join(" ") || "This review";
    const ok = await confirm({
      title: "Delete this review?",
      message: `${name}'s review will be permanently removed.`,
    });
    if (!ok) return;
    try {
      await adminApi(`/api/admin/testimonials/${t._id}`, { method: "DELETE" });
      toast("Review deleted.");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong.", "error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3.5 mb-6.5">
        <div>
          <h1 className="text-2xl font-bold text-white">Reviews</h1>
          <p className="text-sm text-white/40 mt-1">
            Homepage testimonials, newest first. Every review shows as 5 stars and Verified.
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="bg-[#38B685] text-[#08120E] font-bold rounded-full px-5 py-2.5 text-sm hover:bg-[#2f9e73] transition-colors"
        >
          + Add review
        </Link>
      </div>

      {error && <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 text-red-400 text-sm">{error}</div>}

      {!error && items === null && (
        <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 text-white/50 text-sm">Loading…</div>
      )}

      {!error && items && items.length === 0 && (
        <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 text-white/50 text-sm">
          No reviews yet.
        </div>
      )}

      {!error && items && items.length > 0 && (
        <div className="bg-[#161616] border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-white/40 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold">Reviewer</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Review</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t._id} className="border-b border-white/5 last:border-0 align-top">
                  <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                    {[t.firstName, t.lastName].filter(Boolean).join(" ") || "(no name)"}
                  </td>
                  <td className="px-4 py-3 text-white/70 whitespace-nowrap">{formatReviewDate(t.date) || "—"}</td>
                  <td className="px-4 py-3 text-white/60">
                    <span className="line-clamp-2">{t.text || "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/testimonials/${t._id}`}
                      className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors mr-1.5"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => remove(t)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
