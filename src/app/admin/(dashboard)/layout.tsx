import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/sanity/auth";
import { ToastProvider } from "@/components/admin/Toast";
import { ConfirmProvider } from "@/components/admin/ConfirmDialog";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <ToastProvider>
      <ConfirmProvider>
        <div className="min-h-screen flex bg-[#08120E]">
          <AdminSidebar />
          <div className="flex-1 px-6 py-8 lg:px-11 lg:py-9 max-w-[1180px]">{children}</div>
        </div>
      </ConfirmProvider>
    </ToastProvider>
  );
}
