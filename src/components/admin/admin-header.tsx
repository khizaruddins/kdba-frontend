'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, DollarSign, Activity, RefreshCw } from 'lucide-react';
import { useAdminStore } from '@/stores/admin-store';

export function AdminHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { overview, fetchOverview } = useAdminStore();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOverview();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const revenue = overview?.financials.totalGrossRevenue || 0;
  const mrr = overview?.financials.mrr || 0;
  const blockedCount = overview?.tenants.blocked || 0;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-8">
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Financial Pulse Tickers */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
            <DollarSign className="h-3.5 w-3.5" />
            <span>Earned: ${revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-400">
            <Activity className="h-3.5 w-3.5" />
            <span>MRR: ${mrr.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>

          {blockedCount > 0 && (
            <Link
              href="/admin/tenants?status=BLOCKED"
              className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>{blockedCount} Blocked</span>
            </Link>
          )}
        </div>

        {/* Sync Button */}
        <button
          onClick={handleRefresh}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="Refresh Platform Analytics"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
        </button>
      </div>
    </header>
  );
}
