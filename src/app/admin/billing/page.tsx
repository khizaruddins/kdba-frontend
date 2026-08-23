'use client';

import React, { useEffect, useState } from 'react';
import {
  Receipt,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Building2,
  DollarSign,
  Download,
  X,
  Search,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { useAdminStore } from '@/stores/admin-store';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminBillingPage() {
  const { overview, fetchOverview } = useAdminStore();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Create Invoice Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tenantsList, setTenantsList] = useState<any[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [amount, setAmount] = useState('79.00');
  const [description, setDescription] = useState('Platform Pro Retainer Services');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadBillingData = async () => {
    setIsLoading(true);
    try {
      const [invRes, txnRes, tenantsRes]: any = await Promise.all([
        apiClient.get(`/admin/invoices${statusFilter ? `?status=${statusFilter}` : ''}`),
        apiClient.get('/admin/transactions'),
        apiClient.get('/admin/tenants?limit=100'),
      ]);
      setInvoices(Array.isArray(invRes) ? invRes : []);
      setTransactions(Array.isArray(txnRes) ? txnRes : []);
      setTenantsList(tenantsRes?.items || []);
      if (tenantsRes?.items?.length > 0 && !selectedTenantId) {
        setSelectedTenantId(tenantsRes.items[0].id);
      }
    } catch (err) {
      console.error('Failed to load billing records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBillingData();
  }, [statusFilter]);

  const handleMarkPaid = async (invoiceId: string) => {
    try {
      await apiClient.patch(`/admin/invoices/${invoiceId}/pay`, {
        paymentMethod: 'ADMIN_MANUAL_CLEAR',
      });
      loadBillingData();
      fetchOverview();
    } catch (err) {
      console.error('Failed to mark invoice as paid:', err);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenantId) return;
    setIsSubmitting(true);
    try {
      await apiClient.post('/admin/invoices', {
        tenantId: selectedTenantId,
        amount: parseFloat(amount),
        status: 'PENDING',
        lineItems: [{ description, amount: parseFloat(amount), quantity: 1 }],
      });
      setCreateModalOpen(false);
      loadBillingData();
      fetchOverview();
    } catch (err) {
      console.error('Failed to create invoice:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const financials = overview?.financials || {
    totalGrossRevenue: 0,
    paidInvoicesAmount: 0,
    pendingInvoicesAmount: 0,
    overdueInvoicesAmount: 0,
  };

  return (
    <AdminLayout
      title="Platform Billing, Invoices & Payments"
      subtitle="Track all tenant subscriptions, invoices, payment transaction receipts, and revenue collections."
    >
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Billing Overview Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-6 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Total Invoiced Revenue
            </span>
            <div className="mt-3 text-3xl font-black text-white font-mono">
              ${financials.paidInvoicesAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="mt-1 text-xs text-slate-400">Cleared & Collected</p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Pending Invoices
            </span>
            <div className="mt-3 text-3xl font-black text-amber-300 font-mono">
              ${financials.pendingInvoicesAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="mt-1 text-xs text-slate-400">Awaiting payment settlement</p>
          </div>

          <div className="rounded-2xl border border-rose-500/30 bg-slate-900/90 p-6 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Overdue Collections
            </span>
            <div className="mt-3 text-3xl font-black text-rose-300 font-mono">
              ${financials.overdueInvoicesAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="mt-1 text-xs text-slate-400">Past due date</p>
          </div>

          <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Direct Billing
              </span>
              <p className="mt-1 text-xs text-slate-400">Issue custom bill to any tenant</p>
            </div>
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Issue Invoice
            </Button>
          </div>
        </div>

        {/* Invoices List */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Platform Invoices Ledger
              </h3>
              <p className="text-xs text-slate-400">
                Detailed ledger of all generated invoices across all tenant organizations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {['', 'PAID', 'PENDING', 'OVERDUE'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    statusFilter === status
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                      : 'border border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {status || 'All Statuses'}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-xs font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Tenant Organization</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No invoices found.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-white">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-200">
                        {inv.tenant?.name || 'Organization'}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                        ${Number(inv.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(inv.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : inv.status === 'PENDING'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {inv.status !== 'PAID' ? (
                          <button
                            onClick={() => handleMarkPaid(inv.id)}
                            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                          >
                            Mark as Paid
                          </button>
                        ) : (
                          <span className="text-xs text-slate-500 flex items-center justify-end gap-1 font-mono">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Paid {inv.paidAt ? new Date(inv.paidAt).toLocaleDateString() : ''}</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Payment Transactions Stream */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl space-y-4">
          <h3 className="text-base font-bold text-white">
            Processed Payment Receipts & Gateway Log
          </h3>
          <div className="divide-y divide-slate-800/80 rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
            {transactions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No payment transactions recorded.
              </div>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        {tx.tenant?.name || 'Tenant Organization'}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        {tx.transactionNumber} • {tx.gateway} ({tx.paymentMethod})
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-sm font-black text-emerald-400">
                      +${Number(tx.amount).toFixed(2)}
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

      {/* Create Manual Invoice Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md space-y-5 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Issue Custom Invoice
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Tenant
                </label>
                <select
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  {tenantsList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Amount ($ USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Description / Line Item
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Custom Consulting Retainer..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Issue Invoice
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
