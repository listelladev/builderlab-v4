"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin/api";
import { Logo } from "@/components/Logo";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const blogActive = pathname.startsWith("/admin/blog");
  const clientWinsActive = pathname.startsWith("/admin/client-wins");

  async function logout() {
    await adminApi("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="w-60 shrink-0 bg-[#0B0F0D] border-r border-white/5 flex flex-col p-5 sticky top-0 h-screen">
      <div className="mb-7 ml-2">
        <Logo className="h-6" />
      </div>
      <nav className="flex flex-col gap-1">
        <Link
          href="/admin/blog"
          className={`px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
            blogActive ? "bg-[#38B685] text-[#08120E]" : "text-white/60 hover:bg-white/5 hover:text-white"
          }`}
        >
          Blog Posts
        </Link>
        <Link
          href="/admin/client-wins"
          className={`px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
            clientWinsActive ? "bg-[#38B685] text-[#08120E]" : "text-white/60 hover:bg-white/5 hover:text-white"
          }`}
        >
          Client Wins
        </Link>
      </nav>
      <div className="flex-1" />
      <button
        onClick={logout}
        className="mt-3 px-3.5 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm font-semibold hover:bg-white/10 transition-colors text-left"
      >
        Log out
      </button>
    </div>
  );
}
