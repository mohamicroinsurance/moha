'use client'

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import AuthGuard from "@/components/providers/auth-guard";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/dashboard/auth');

  return (
    <AuthGuard>
      {isAuthPage ? (
        // Auth pages without sidebar/header
        <>{children}</>
      ) : (
        // Dashboard pages with sidebar/header
        <div className="min-h-screen bg-gray-50">
          <DashboardSidebar />
          <div className="md:pl-64 flex flex-col flex-1">
            <DashboardHeader />
            <main className="flex-1 p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}

