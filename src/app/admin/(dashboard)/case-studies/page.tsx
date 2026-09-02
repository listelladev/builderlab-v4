"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { adminApi, AdminApiError } from "@/lib/admin/api";
import { imageUrl, type SanityImage } from "@/lib/sanity/image";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";

type AdminCaseStudy = {
  _id: string;
  name?: string;
  slug?: { current?: string };
  industry?: string;
  published?: boolean;
  sortOrder?: number;
  heroImage?: SanityImage;
};

export default function AdminCaseStudiesListPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [items, setItems] = useState<AdminCaseStudy[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const { caseStudies } = await adminApi<{ caseStudies: AdminCaseStudy[] }>("/api/admin/case-studies");
      setItems(caseStudies);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not load case studies.");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function togglePublish(c: AdminCaseStudy) {
    try {
      await adminApi(`/api/admin/case-studies/${c._id}`, {
        method: "PATCH",
        body: { action: c.published ? "unpublish" : "publish" },
      });
      toast(c.published ? "Case study unpublished." : "Case study published.");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong.", "error");
    }
  }

  async function remove(c: AdminCaseStudy) {
    const ok = await confirm({
      title: "Delete this case study?",
      message: `"${c.name || "Untitled"}" will be permanently removed.`,
    });
    if (!ok) return;
    try {
      await adminApi(`/api/admin/case-studies/${c._id}`, { method: "DELETE" });
      toast("Case study deleted.");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong.", "error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3.5 mb-6.5">
        <div>
          <h1 className="text-2xl font-bold text-white">Case studies</h1>
          <p className="text-sm text-white/40 mt-1">
            Only published case studies appear on the public Case Studies page.
          </p>
        </div>
        <Link
          href="/admin/case-studies/new"
          className="bg-[#38B685] text-[#08120E] font-bold rounded-full px-5 py-2.5 text-sm hover:bg-[#2f9e73] transition-colors"
        >
          + Add case study
        </Link>
      </div>

      {error && <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 text-red-400 text-sm">{error}</div>}

      {!error && items === null && (
        <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 text-white/50 text-sm">Loading…</div>
      )}

      {!error && items && items.length === 0 && (
        <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 text-white/50 text-sm">
          No case studies yet.
        </div>
      )}

      {!error && items && items.length > 0 && (
        <div className="bg-[#161616] border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-white/40 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold">Photo</th>
                <th className="px-4 py-3 font-semibold">Client</th>
                <th className="px-4 py-3 font-semibold">Industry</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((c) => {
                const src = imageUrl(c.heroImage, 160);
                return (
                  <tr key={c._id} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3">
                      {src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt="" className="w-14 h-10.5 object-cover rounded-lg bg-white/5" />
                      ) : (
                        <div className="w-14 h-10.5 rounded-lg bg-white/5" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{c.name || "(untitled)"}</div>
                      <div className="text-xs text-white/30">/case-studies/{c.slug?.current || ""}</div>
                    </td>
                    <td className="px-4 py-3 text-white/70">{c.industry || "—"}</td>
                    <td className="px-4 py-3 text-white/70">{typeof c.sortOrder === "number" ? c.sortOrder : "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          c.published ? "bg-[#38B685]/15 text-[#38B685]" : "bg-white/10 text-white/50"
                        }`}
                      >
                        {c.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/case-studies/${c._id}`}
                        className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors mr-1.5"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => togglePublish(c)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors mr-1.5"
                      >
                        {c.published ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => remove(c)}
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
