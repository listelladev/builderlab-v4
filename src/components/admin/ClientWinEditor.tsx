"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminApi, uploadImage } from "@/lib/admin/api";
import { imageUrl } from "@/lib/sanity/image";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import type { SanityImage } from "@/lib/sanity/image";

type ClientWinImage = SanityImage & { _type: "image" };

export function ClientWinEditor({ winId }: { winId?: string }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();

  const [loading, setLoading] = useState(Boolean(winId));
  const [saving, setSaving] = useState(false);

  const [image, setImage] = useState<ClientWinImage | null>(null);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (!winId) return;
    (async () => {
      try {
        const { win } = await adminApi<{
          win: { image?: ClientWinImage; date?: string; name?: string };
        }>(`/api/admin/client-wins/${winId}`);
        setImage(win.image || null);
        setDate(win.date || "");
        setName(win.name || "");
      } catch (err) {
        toast(err instanceof Error ? err.message : "Could not load client win.", "error");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winId]);

  async function onFile(file: File) {
    if (file.size > 4 * 1024 * 1024) {
      toast("That image is larger than the 4 MB limit.", "error");
      return;
    }
    try {
      const { image } = await uploadImage(file, name);
      setImage(image as ClientWinImage);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed.", "error");
    }
  }

  async function save() {
    if (!image) {
      toast("Upload an image before saving.", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = { image, date, name };
      if (winId) {
        await adminApi(`/api/admin/client-wins/${winId}`, { method: "PATCH", body: payload });
        toast("Client win updated.");
      } else {
        await adminApi("/api/admin/client-wins", { method: "POST", body: payload });
        toast("Client win added.");
      }
      router.push("/admin/client-wins");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function removeWin() {
    if (!winId) return;
    const ok = await confirm({ title: "Delete this client win?", message: "This can't be undone." });
    if (!ok) return;
    try {
      await adminApi(`/api/admin/client-wins/${winId}`, { method: "DELETE" });
      router.push("/admin/client-wins");
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
          <h1 className="text-2xl font-bold text-white">{winId ? "Edit client win" : "Add client win"}</h1>
          <p className="text-sm text-white/40 mt-1">
            Upload a screenshot of the testimonial. It shows at full size in the masonry grid.
          </p>
        </div>
        <Link
          href="/admin/client-wins"
          className="px-4 py-2.5 rounded-full text-sm font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          ← Back to client wins
        </Link>
      </div>

      <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 mb-5">
        <label className="block text-xs font-bold text-white/70 mb-2.5">Screenshot (required)</label>
        {image ? (
          <div className="relative w-full max-w-xs rounded-xl overflow-hidden border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl(image, 600)} alt="" className="w-full h-auto" />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white text-sm leading-none"
            >
              ×
            </button>
          </div>
        ) : (
          <ImageDropzone onFile={onFile} />
        )}
      </div>

      <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 mb-5 space-y-4.5">
        <Field label="Date" hint="Written however you like, e.g. April 2026.">
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="e.g. April 2026"
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Name" hint="Formatted however you like, e.g. “John D.” or “The Miller Family”.">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John D."
            className={INPUT_CLASS}
          />
        </Field>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="px-5 py-3 rounded-full text-sm font-bold bg-[#38B685] text-[#08120E] hover:bg-[#2f9e73] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : winId ? "Save changes" : "Add client win"}
        </button>
        {winId && (
          <button
            type="button"
            onClick={removeWin}
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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-white/70 mb-2">{label}</label>
      {children}
      {hint && <p className="text-xs text-white/30 mt-1.5">{hint}</p>}
    </div>
  );
}
