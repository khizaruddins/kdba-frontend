'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  Building2,
  Globe,
  Receipt,
  ShieldAlert,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { useAdminStore } from '@/stores/admin-store';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboardPage() {
  const { overview, fetchOverview } = useAdminStore();

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const financials = overview?.financials || {
    totalGrossRevenue: 0,
    mrr: 0,
    arr: 0,
    totalInvoicesAmount: 0,
    paidInvoicesAmount: 0,
    pendingInvoicesAmount: 0,
    overdueInvoicesAmount: 0,
  };

  const tenants = overview?.tenants || {
    total: 0,
    active: 0,
    blocked: 0,
    suspended: 0,
  };

  const websites = overview?.websites || { totalLive: 0 };
  const planDistribution = overview?.planDistribution || [];
  const revenueTrend = overview?.revenueTrend || [];
  const recentTransactions = overview?.recentTransactions || [];

  // Find max revenue for chart scaling
  const maxMonthlyRev = Math.max(...revenueTrend.map((r) => r.revenue), 100);

  return (
    <AdminLayout
      title="Platform Financials & Governance Overview"
      subtitle="Comprehensive metrics on revenue, subscriptions, tenant status, and platform health."
    >
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Top Financial & Platform KPI Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Gross Earnings */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Total Platform Revenue
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black tracking-tight text-white">
                ${financials.totalGrossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <ArrowUpRight className="h-4 w-4" />
                <span>All-time gross receipts collected</span>
              </div>
            </div>
          </div>

          {/* MRR */}
          <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-slate-900 to-slate-950 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Active Monthly Run Rate (MRR)
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black tracking-tight text-white">
                ${financials.mrr.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>ARR: ${financials.arr.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                <span className="font-semibold text-indigo-400">Predictable Recurring</span>
              </div>
            </div>
          </div>

          {/* Tenants Breakdown */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Tenants & Governance
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-300">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black tracking-tight text-white">
                {tenants.total}
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {tenants.active} Active
                </span>
                {tenants.blocked > 0 && (
                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-rose-400" />
                    {tenants.blocked} Blocked
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Live Websites */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Published Websites
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Globe className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black tracking-tight text-white">
                {websites.totalLive}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                <span>Serving global tenant traffic with high-speed CDN</span>
              </div>
            </div>
          </div>
        </div>

        {/* 12-Month Financial Revenue Trend Chart */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  KDBA Platform Monthly Revenue Performance
                </h3>
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-400 border border-emerald-500/20">
                  Live Ledger
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Visualizing revenue earned and processed across all tenants month-by-month.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <span className="h-3 w-3 rounded-md bg-indigo-500 shadow-sm" />
                <span>Monthly Inflow ($)</span>
              </div>
            </div>
          </div>

          {/* Interactive CSS Bar Chart */}
          <div className="pt-4">
            <div className="flex h-64 items-end gap-3 sm:gap-6 border-b border-slate-800 pb-4">
              {revenueTrend.map((item, idx) => {
                const heightPercent = Math.max(
                  Math.round((item.revenue / maxMonthlyRev) * 100),
                  8,
                );
                return (
                  <div
                    key={idx}
                    className="group relative flex flex-1 flex-col items-center justify-end h-full"
                  >
                    {/* Hover Tooltip */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 flex flex-col items-center">
                      <div className="rounded-lg bg-slate-950 border border-slate-700 px-2.5 py-1 text-center shadow-2xl">
                        <div className="text-xs font-black text-amber-400">
                          ${item.revenue.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {item.transactions} transactions
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-slate-950 rotate-45 border-r border-b border-slate-700 -mt-1" />
                    </div>

                    {/* Bar Pillar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-indigo-600 via-indigo-500 to-amber-400 transition-all duration-300 group-hover:brightness-125 group-hover:scale-105 shadow-lg shadow-indigo-600/20"
                    />

                    {/* X-axis Label */}
                    <span className="mt-3 text-[11px] font-semibold text-slate-400 group-hover:text-white transition-colors truncate max-w-[60px]">
                      {item.month.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subscription Tier Distribution & Recent Payment Stream */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Subscription Tier Breakdown */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Platform Plan Distribution
              </h3>
              <Link
                href="/admin/plans"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Manage Plans &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {planDistribution.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">
                      {plan.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      ${plan.monthlyPrice}/mo
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      {plan.activeSubscribers} Active Subscriber{plan.activeSubscribers !== 1 ? 's' : ''}
                    </span>
                    <span className="font-semibold text-emerald-400">
                      +${plan.mrrContribution.toLocaleString()}/mo MRR
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Revenue & Payment Stream */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Real-Time Earnings Ledger
                </h3>
                <Badge variant="success">Live Stream</Badge>
              </div>
              <Link
                href="/admin/billing"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                All Invoices & Bills &rarr;
              </Link>
            </div>

            <div className="divide-y divide-slate-800/80 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">
              {recentTransactions.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No payment transactions recorded yet.
                </div>
              ) : (
                recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">
                          {tx.tenantName}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="font-mono">{tx.transactionNumber}</span>
                          <span>•</span>
                          <span>{tx.gateway} ({tx.paymentMethod})</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold text-emerald-400 font-mono">
                        +${tx.amount.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
