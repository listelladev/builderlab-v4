"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { adminApi, AdminApiError } from "@/lib/admin/api";
import { imageUrl } from "@/lib/sanity/image";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import type { SanityImage } from "@/lib/sanity/image";

type AdminClientWin = {
  _id: string;
  image?: SanityImage;
  date?: string;
  name?: string;
};

export default function AdminClientWinsListPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [wins, setWins] = useState<AdminClientWin[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const { wins } = await adminApi<{ wins: AdminClientWin[] }>("/api/admin/client-wins");
      setWins(wins);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not load client wins.");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function remove(w: AdminClientWin) {
    const ok = await confirm({
      title: "Delete this client win?",
      message: `"${w.name || "This client win"}" will be permanently removed.`,
    });
    if (!ok) return;
    try {
      await adminApi(`/api/admin/client-wins/${w._id}`, { method: "DELETE" });
      toast("Client win deleted.");
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong.", "error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3.5 mb-6.5">
        <div>
          <h1 className="text-2xl font-bold text-white">Client wins</h1>
          <p className="text-sm text-white/40 mt-1">
            Shown as a masonry grid on the public Client Wins page.
          </p>
        </div>
        <Link
          href="/admin/client-wins/new"
          className="bg-[#38B685] text-[#08120E] font-bold rounded-full px-5 py-2.5 text-sm hover:bg-[#2f9e73] transition-colors"
        >
          + Add client win
        </Link>
      </div>

      {error && <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 text-red-400 text-sm">{error}</div>}

      {!error && wins === null && (
        <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 text-white/50 text-sm">Loading…</div>
      )}

      {!error && wins && wins.length === 0 && (
        <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 text-white/50 text-sm">
          No client wins yet.
        </div>
      )}

      {!error && wins && wins.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wins.map((w) => {
            const src = imageUrl(w.image, 320);
            return (
              <div key={w._id} className="bg-[#161616] border border-white/10 rounded-2xl overflow-hidden">
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" className="w-full h-40 object-cover bg-white/5" />
                ) : (
                  <div className="w-full h-40 bg-white/5" />
                )}
                <div className="p-3.5">
                  <div className="font-semibold text-white text-sm truncate">{w.name || "(untitled)"}</div>
                  <div className="text-xs text-white/40 mt-0.5">{w.date || "—"}</div>
                  <div className="flex gap-1.5 mt-3">
                    <Link
                      href={`/admin/client-wins/${w._id}`}
                      className="flex-1 text-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => remove(w)}
                      className="flex-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
