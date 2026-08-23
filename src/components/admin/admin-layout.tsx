'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from './admin-sidebar';
import { AdminHeader } from './admin-header';
import { useAdminStore } from '@/stores/admin-store';
import { Loader2 } from 'lucide-react';

export function AdminLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, fetchAdminProfile, fetchOverview } = useAdminStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const valid = await fetchAdminProfile();
      if (!valid) {
        router.push('/admin/login');
      } else {
        fetchOverview();
      }
      if (isMounted) setChecking(false);
    };

    init();
    return () => {
      isMounted = false;
    };
  }, [fetchAdminProfile, fetchOverview, router]);

  if (checking || (isLoading && !isAuthenticated)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <span className="text-sm font-semibold text-slate-400">
            Verifying Super Admin Authorization...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Left Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader title={title} subtitle={subtitle} />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
