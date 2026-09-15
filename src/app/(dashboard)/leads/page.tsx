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
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/kdba/page-header';
import { useConfirm } from '@/components/kdba/confirm-dialog';

export default function LeadsPage() {
  const { confirm, dialog } = useConfirm();
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

  const handleDelete = (id: string) => {
    confirm({
      title: 'Delete this lead?',
      description: 'The inquiry will be removed from your inbox.',
      confirmLabel: 'Delete lead',
      destructive: true,
      onConfirm: async () => {
        await apiClient.delete(`/leads/${id}`);
        setSelectedLead(null);
        toast.success('Lead deleted');
        await loadLeads();
      },
    });
  };

  const statusOptions: LeadStatus[] = [
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'CONVERTED',
    'LOST',
  ];

  return (
    <div className="flex-1 space-y-6">
      {dialog}
      <PageHeader
        title="Forms & leads"
        description="Inbound inquiries collected from published contact forms."
      />

      {/* Stats Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-7 w-12" /> : <div className="text-2xl font-bold">{stats.total}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-primary">New</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-7 w-12" /> : <div className="text-2xl font-bold">{stats.new}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-amber-500">Contacted</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-7 w-12" /> : <div className="text-2xl font-bold">{stats.contacted}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-sky-500">Qualified</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-7 w-12" /> : <div className="text-2xl font-bold">{stats.qualified}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-emerald-500">Converted</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-7 w-12" /> : <div className="text-2xl font-bold">{stats.converted}</div>}
          </CardContent>
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

        <div className="flex items-center gap-2 overflow-x-auto p-1 border rounded-lg bg-muted/50">
          {['ALL', ...statusOptions].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex space-x-4 items-center">
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : leads.length === 0 ? (
            <EmptyState
              icon={<Users className="h-6 w-6 text-muted-foreground" />}
              title="No leads found"
              description="Inbound inquiries submitted by website visitors will appear here in real-time."
              className="border-0 bg-transparent rounded-none my-8"
            />
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-muted-foreground font-medium">
                <tr>
                  <th className="py-3 px-6 h-10 align-middle">Name</th>
                  <th className="py-3 px-6 h-10 align-middle">Contact Info</th>
                  <th className="py-3 px-6 h-10 align-middle">Message Preview</th>
                  <th className="py-3 px-6 h-10 align-middle">Status</th>
                  <th className="py-3 px-6 h-10 align-middle">Received</th>
                  <th className="py-3 px-6 h-10 align-middle text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium">
                      {lead.name}
                    </td>
                    <td className="py-4 px-6">
                      <p>{lead.email}</p>
                      {lead.phone && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {lead.phone}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6 max-w-[200px] truncate text-muted-foreground">
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
                        className="h-8 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium cursor-pointer"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                        onClick={() => handleDelete(lead.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Lead Detail Dialog */}
      <Dialog
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title={selectedLead?.name}
        description={`Submitted on ${selectedLead ? formatDate(selectedLead.createdAt) : ''}`}
      >
        {selectedLead && (
          <div className="space-y-6 pt-2">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border bg-muted/30">
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Email
                </span>
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="text-sm font-medium hover:underline text-foreground block"
                >
                  {selectedLead.email}
                </a>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Phone
                </span>
                <span className="text-sm font-medium text-foreground block">
                  {selectedLead.phone || 'Not provided'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-muted-foreground block mb-2">
                Inquiry Message
              </span>
              <div className="p-4 rounded-xl border bg-muted/30 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {selectedLead.message || 'No message provided.'}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Update Status:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedLead.id,
                      e.target.value as LeadStatus,
                    )
                  }
                  className="h-9 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium cursor-pointer"
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
