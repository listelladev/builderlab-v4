"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin/api";
import { Logo } from "@/components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminApi("/api/auth/login", { method: "POST", body: { password } });
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Incorrect password.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08120E] px-6">
      <div className="w-full max-w-[380px] bg-[#161616] border border-white/10 rounded-2xl p-10 text-center">
        <div className="flex justify-center mb-1">
          <Logo className="h-7" />
        </div>
        <h1 className="text-lg font-bold text-white mt-4 mb-1.5">Site Admin</h1>
        <p className="text-sm text-white/50 mb-6">Sign in to manage blog content.</p>

        {error && (
          <div className="text-sm text-red-400 font-semibold mb-4">{error}</div>
        )}

        <form onSubmit={onSubmit} className="space-y-3.5">
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#38B685] transition-colors placeholder:text-white/30"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#38B685] text-[#08120E] font-bold rounded-full py-3 text-sm hover:bg-[#2f9e73] transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
