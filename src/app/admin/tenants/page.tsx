'use client';

import React, { useEffect, useState } from 'react';
import {
  Building2,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  MoreVertical,
  Globe,
  DollarSign,
  User,
  AlertTriangle,
  ExternalLink,
  Layers,
  X,
  CheckCircle,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { useAdminStore, AdminTenantItem } from '@/stores/admin-store';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';

export default function AdminTenantsPage() {
  const { tenants, tenantsMeta, fetchTenants, updateTenantStatus } = useAdminStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<AdminTenantItem | null>(null);
  const [detailTenant, setDetailTenant] = useState<any | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Block Modal state
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockingTenant, setBlockingTenant] = useState<AdminTenantItem | null>(null);
  const [blockActionType, setBlockActionType] = useState<'BLOCKED' | 'SUSPENDED'>('BLOCKED');
  const [blockReason, setBlockReason] = useState('Terms of Service or payment compliance');
  const [isSubmittingBlock, setIsSubmittingBlock] = useState(false);

  useEffect(() => {
    fetchTenants({ search, status: statusFilter });
  }, [search, statusFilter, fetchTenants]);

  const handleOpenBlockModal = (tenant: AdminTenantItem, type: 'BLOCKED' | 'SUSPENDED') => {
    setBlockingTenant(tenant);
    setBlockActionType(type);
    setBlockReason(
      type === 'BLOCKED'
        ? 'Violation of Platform Terms of Service'
        : 'Billing and subscription payment pending',
    );
    setBlockModalOpen(true);
  };

  const handleConfirmBlock = async () => {
    if (!blockingTenant) return;
    setIsSubmittingBlock(true);
    try {
      await updateTenantStatus(blockingTenant.id, blockActionType, blockReason);
      setBlockModalOpen(false);
      setBlockingTenant(null);
    } catch (err) {
      console.error('Failed to change tenant status:', err);
    } finally {
      setIsSubmittingBlock(false);
    }
  };

  const handleUnblock = async (tenant: AdminTenantItem) => {
    try {
      await updateTenantStatus(tenant.id, 'ACTIVE');
    } catch (err) {
      console.error('Failed to unblock tenant:', err);
    }
  };

  const handleViewDetails = async (tenant: AdminTenantItem) => {
    setSelectedTenant(tenant);
    setIsDetailLoading(true);
    try {
      const data = await apiClient.get(`/admin/tenants/${tenant.id}`);
      setDetailTenant(data);
    } catch (err) {
      console.error('Failed to load tenant details:', err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Tenants Governance & Control"
      subtitle="Oversee all platform organizations, monitor websites, manage plans, and block/unblock tenant access."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, slug, or owner email..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {['', 'ACTIVE', 'SUSPENDED', 'BLOCKED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  statusFilter === status
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'border border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {status || 'All Tenants'}
              </button>
            ))}
          </div>
        </div>

        {/* Tenants Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-xs font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4">Tenant Organization</th>
                <th className="px-6 py-4">Owner / Contact</th>
                <th className="px-6 py-4">Plan & Status</th>
                <th className="px-6 py-4">Websites</th>
                <th className="px-6 py-4">Total Revenue</th>
                <th className="px-6 py-4 text-right">Governance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No tenants match your search filter.
                  </td>
                </tr>
              ) : (
                tenants.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Organization Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-amber-400 font-bold border border-slate-700">
                          {t.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{t.name}</span>
                            {t.status === 'BLOCKED' && (
                              <span className="rounded-md bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-rose-400 border border-rose-500/20">
                                Blocked
                              </span>
                            )}
                            {t.status === 'SUSPENDED' && (
                              <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-amber-400 border border-amber-500/20">
                                Suspended
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            /{t.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="px-6 py-4">
                      {t.owner ? (
                        <div>
                          <div className="font-medium text-white">{t.owner.name}</div>
                          <div className="text-xs text-slate-400">{t.owner.email}</div>
                        </div>
                      ) : (
                        <span className="text-slate-500">No Owner</span>
                      )}
                    </td>

                    {/* Plan & Status */}
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{t.plan.name}</span>
                          {t.plan.amount > 0 && (
                            <span className="text-xs font-mono text-amber-400">
                              (${t.plan.amount}/mo)
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          {t.status === 'ACTIVE' ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              Active
                            </span>
                          ) : t.status === 'BLOCKED' ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-bold text-rose-400 border border-rose-500/20">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                              Access Blocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-400 border border-amber-500/20">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                              Suspended
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Websites Count */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-white flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-indigo-400" />
                        <span>{t.websitesCount} Total ({t.liveWebsitesCount} Live)</span>
                      </div>
                    </td>

                    {/* Total Revenue */}
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                      ${t.totalRevenueContributed.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(t)}
                          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                        >
                          Deep Dive
                        </button>

                        {t.status === 'ACTIVE' ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenBlockModal(t, 'SUSPENDED')}
                              className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-colors"
                              title="Temporarily suspend tenant"
                            >
                              Suspend
                            </button>
                            <button
                              onClick={() => handleOpenBlockModal(t, 'BLOCKED')}
                              className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors"
                              title="Block tenant completely"
                            >
                              Block
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleUnblock(t)}
                            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Unblock</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block / Suspend Modal */}
      {blockModalOpen && blockingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {blockActionType === 'BLOCKED' ? 'Block Tenant Access' : 'Suspend Tenant'}
                  </h3>
                  <p className="text-xs text-slate-400">{blockingTenant.name}</p>
                </div>
              </div>
              <button
                onClick={() => setBlockModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <span className="font-bold">Notice:</span> When blocked, tenant members cannot edit websites, upload media, or modify business settings.
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Reason for Block / Suspension
              </label>
              <textarea
                rows={3}
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Specify the policy, billing, or security reason..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBlockModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                isLoading={isSubmittingBlock}
                onClick={handleConfirmBlock}
              >
                Confirm {blockActionType === 'BLOCKED' ? 'Block' : 'Suspend'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tenant Deep Dive Drawer */}
      {selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-sm">
          <div className="h-full w-full max-w-xl border-l border-slate-800 bg-slate-900 p-8 shadow-2xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {selectedTenant.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Tenant ID: {selectedTenant.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedTenant(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isDetailLoading ? (
              <div className="py-20 text-center text-xs text-slate-400">
                Loading tenant deep dive records...
              </div>
            ) : detailTenant ? (
              <div className="space-y-6">
                {/* Status Callout */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Governance Status</span>
                    <span className="text-xs font-bold text-white">{detailTenant.status}</span>
                  </div>
                  {detailTenant.blockedReason && (
                    <div className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                      Reason: {detailTenant.blockedReason}
                    </div>
                  )}
                </div>

                {/* Websites */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Websites ({detailTenant.websites?.length || 0})
                  </h4>
                  <div className="space-y-2">
                    {detailTenant.websites?.map((w: any) => (
                      <div
                        key={w.id}
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                      >
                        <div>
                          <div className="text-sm font-bold text-white">{w.name}</div>
                          <div className="text-xs text-slate-400 font-mono">/site/{w.slug}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${w.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                          {w.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subscriptions & Invoices */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Billing History ({detailTenant.invoices?.length || 0} Invoices)
                  </h4>
                  <div className="space-y-2">
                    {detailTenant.invoices?.map((inv: any) => (
                      <div
                        key={inv.id}
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                      >
                        <div>
                          <div className="text-xs font-mono font-bold text-white">{inv.invoiceNumber}</div>
                          <div className="text-[11px] text-slate-400">{new Date(inv.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-emerald-400">${Number(inv.amount).toFixed(2)}</div>
                          <div className="text-[10px] text-slate-400">{inv.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
