'use client';

import * as React from 'react';
import { apiClient } from '@/lib/api/client';
import { Lead, LeadStats, LeadStatus } from '@/types';
import { formatDate } from '@/lib/utils';
import {
  Users,
  Search,
  Trash2,
  Eye,
  Mail,
  Phone,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';

export default function LeadsPage() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [stats, setStats] = React.useState<LeadStats>({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    lost: 0,
  });
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [isLoading, setIsLoading] = React.useState(true);

  // Detail Modal
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);

  const loadLeads = async () => {
    try {
      const [leadsData, statsData]: any = await Promise.all([
        apiClient.get('/leads', {
          params: {
            search: search || undefined,
            status: statusFilter !== 'ALL' ? statusFilter : undefined,
          },
        }),
        apiClient.get('/leads/stats'),
      ]);

      setLeads(Array.isArray(leadsData) ? leadsData : []);
      if (statsData) setStats(statsData);
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadLeads();
  }, [search, statusFilter]);

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    try {
      await apiClient.patch(`/leads/${id}`, { status: newStatus });
      loadLeads();
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await apiClient.delete(`/leads/${id}`);
      setSelectedLead(null);
      loadLeads();
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  const statusOptions: LeadStatus[] = [
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'CONVERTED',
    'LOST',
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          Leads & Customer Inquiries
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Inbound customer leads collected automatically through your website contact forms
        </p>
      </div>

      {/* Stats Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="p-4 bg-slate-900/60">
          <span className="text-[11px] font-semibold text-slate-400">Total Leads</span>
          <p className="text-2xl font-black text-white mt-1">{stats.total}</p>
        </Card>
        <Card className="p-4 bg-indigo-950/20 border-indigo-500/30">
          <span className="text-[11px] font-semibold text-indigo-400">New Inquiries</span>
          <p className="text-2xl font-black text-indigo-300 mt-1">{stats.new}</p>
        </Card>
        <Card className="p-4 bg-slate-900/60">
          <span className="text-[11px] font-semibold text-amber-400">Contacted</span>
          <p className="text-2xl font-black text-white mt-1">{stats.contacted}</p>
        </Card>
        <Card className="p-4 bg-slate-900/60">
          <span className="text-[11px] font-semibold text-sky-400">Qualified</span>
          <p className="text-2xl font-black text-white mt-1">{stats.qualified}</p>
        </Card>
        <Card className="p-4 bg-emerald-950/20 border-emerald-500/30">
          <span className="text-[11px] font-semibold text-emerald-400">Converted</span>
          <p className="text-2xl font-black text-emerald-300 mt-1">{stats.converted}</p>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, message..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {['ALL', ...statusOptions].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      {leads.length === 0 && !isLoading ? (
        <EmptyState
          icon={<Users className="h-6 w-6 text-indigo-400" />}
          title="No leads found"
          description="Inbound inquiries submitted by website visitors will appear here in real-time."
        />
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Contact Info</th>
                  <th className="py-3 px-6">Message Preview</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Received</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-white">
                      {lead.name}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-200">{lead.email}</p>
                      {lead.phone && (
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {lead.phone}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate text-slate-300">
                      {lead.message || 'No message'}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(
                            lead.id,
                            e.target.value as LeadStatus,
                          )
                        }
                        className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-200 cursor-pointer"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-400 hover:text-rose-300"
                        onClick={() => handleDelete(lead.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Lead Detail Dialog */}
      <Dialog
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title={selectedLead?.name}
        description={`Submitted on ${selectedLead ? formatDate(selectedLead.createdAt) : ''}`}
      >
        {selectedLead && (
          <div className="space-y-6 pt-2">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Email
                </span>
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="text-xs font-semibold text-indigo-400 hover:underline mt-0.5 block"
                >
                  {selectedLead.email}
                </a>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Phone
                </span>
                <span className="text-xs text-white mt-0.5 block">
                  {selectedLead.phone || 'Not provided'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                Inquiry Message
              </span>
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedLead.message || 'No message provided.'}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Update Status:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedLead.id,
                      e.target.value as LeadStatus,
                    )
                  }
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(selectedLead.id)}
              >
                Delete Lead
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
