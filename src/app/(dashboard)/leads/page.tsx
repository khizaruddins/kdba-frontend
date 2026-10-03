'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MoreHorizontal,
  Search,
  Users,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Archive,
  Trash2,
  ExternalLink,
  MessageSquare,
  Clock,
  Sparkles,
  Inbox,
  CheckCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import { Lead, LeadStats, LeadStatus } from '@/types';
import { formatDate } from '@/lib/utils';
import {
  LEAD_STATUS_LABEL,
  LEAD_STATUSES,
  leadStatusVariant,
  shortRef,
} from '@/lib/workspace';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/kdba/page-header';
import { StatCard } from '@/components/kdba/stat-card';
import { useConfirm } from '@/components/kdba/confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EMPTY_STATS: LeadStats = {
  total: 0,
  new: 0,
  contacted: 0,
  qualified: 0,
  converted: 0,
  lost: 0,
};

export default function LeadsPage() {
  const router = useRouter();
  const { confirm, dialog } = useConfirm();
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [stats, setStats] = React.useState<LeadStats>(EMPTY_STATS);
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadLeads = React.useCallback(async () => {
    try {
      const [leadsData, statsData] = await Promise.all([
        apiClient.get('/leads', {
          params: {
            search: debouncedSearch || undefined,
            status: statusFilter !== 'ALL' ? statusFilter : undefined,
          },
        }),
        apiClient.get('/leads/stats', { params: { days: 28 } }),
      ]);
      setLeads(Array.isArray(leadsData) ? leadsData : []);
      if (statsData) setStats(statsData as unknown as LeadStats);
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, statusFilter]);

  React.useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  const handleStatusUpdate = async (id: string, newStatus: LeadStatus) => {
    try {
      const updated = (await apiClient.patch(`/leads/${id}`, { status: newStatus })) as unknown as Lead;
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
      if (selectedLead?.id === id) {
        setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      toast.success(`Submission marked as ${LEAD_STATUS_LABEL[newStatus]}`);
      void apiClient.get('/leads/stats', { params: { days: 28 } }).then((s) => {
        if (s) setStats(s as unknown as LeadStats);
      });
    } catch {
      toast.error('Could not update submission status');
    }
  };

  const handleDelete = (id: string) => {
    confirm({
      title: 'Delete this submission?',
      description: 'The inquiry will be permanently deleted from your inbox.',
      confirmLabel: 'Delete submission',
      destructive: true,
      onConfirm: async () => {
        await apiClient.delete(`/leads/${id}`);
        toast.success('Submission deleted');
        if (selectedLead?.id === id) {
          setSheetOpen(false);
          setSelectedLead(null);
        }
        await loadLeads();
      },
    });
  };

  const openSubmission = (lead: Lead) => {
    setSelectedLead(lead);
    setSheetOpen(true);
    // If it's NEW, automatically mark as CONTACTED or read
    if (lead.status === 'NEW') {
      void handleStatusUpdate(lead.id, 'CONTACTED');
    }
  };

  return (
    <div className="space-y-6">
      {dialog}
      <PageHeader
        title="Form Submissions"
        description="Inbox for customer inquiries, lead submissions, and contact messages."
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/forms">Configure Forms</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total Inquiries" value={stats.total} trend={stats.change?.total} loading={isLoading} />
        <StatCard title="New / Unread" value={stats.new} className="bg-sky-50 dark:bg-sky-950/30" loading={isLoading} />
        <StatCard title="Contacted" value={stats.contacted} className="bg-amber-50 dark:bg-amber-950/30" loading={isLoading} />
        <StatCard title="Qualified" value={stats.qualified} loading={isLoading} />
        <StatCard title="Converted" value={stats.converted} className="bg-emerald-50 dark:bg-emerald-950/30" loading={isLoading} />
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList variant="line">
                <TabsTrigger value="ALL">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="NEW">New ({stats.new})</TabsTrigger>
                <TabsTrigger value="CONTACTED">Contacted</TabsTrigger>
                <TabsTrigger value="QUALIFIED">Qualified</TabsTrigger>
                <TabsTrigger value="CONVERTED">Converted</TabsTrigger>
                <TabsTrigger value="LOST">Archived</TabsTrigger>
              </TabsList>
            </Tabs>
            <Input
              className="lg:max-w-xs"
              placeholder="Search by name, email, or topic…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              leftIcon={<Search />}
            />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : leads.length === 0 ? (
            <EmptyState
              icon={<Inbox className="h-6 w-6 text-muted-foreground" />}
              title="No submissions found"
              description="When visitors submit contact forms on your published website, inquiries will appear here."
              className="min-h-0 border-0 bg-transparent"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Contact Details</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => {
                  const isUnread = lead.status === 'NEW';
                  return (
                    <TableRow
                      key={lead.id}
                      className={`cursor-pointer transition-colors ${
                        isUnread ? 'bg-primary/5 font-medium' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => openSubmission(lead)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isUnread && <div className="h-2 w-2 rounded-full bg-primary" />}
                          <div>
                            <p className="font-semibold text-foreground">{lead.name}</p>
                            <p className="text-xs text-muted-foreground">{shortRef(lead.id)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{lead.email}</p>
                        {lead.phone ? (
                          <p className="text-xs text-muted-foreground">{lead.phone}</p>
                        ) : null}
                      </TableCell>
                      <TableCell className="capitalize text-muted-foreground">
                        {(lead.source || 'website').replace('_', ' ')}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(lead.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={leadStatusVariant(lead.status)}>
                          {LEAD_STATUS_LABEL[lead.status]}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openSubmission(lead)}>
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(
                                  lead.id,
                                  lead.status === 'NEW' ? 'CONTACTED' : 'NEW',
                                )
                              }
                            >
                              {lead.status === 'NEW' ? 'Mark as read' : 'Mark as unread'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(lead.id, 'LOST')}>
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDelete(lead.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Slide-over Inspection Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {selectedLead && (
            <div className="space-y-6 py-2">
              <SheetHeader className="text-left space-y-2 border-b pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant={leadStatusVariant(selectedLead.status)}>
                    {LEAD_STATUS_LABEL[selectedLead.status]}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {shortRef(selectedLead.id, 'ID: ')}
                  </span>
                </div>
                <SheetTitle className="text-xl font-bold">{selectedLead.name}</SheetTitle>
                <SheetDescription className="text-xs flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Received {formatDate(selectedLead.createdAt)}
                </SheetDescription>
              </SheetHeader>

              {/* Quick Actions Bar */}
              <div className="flex items-center gap-2">
                <Button size="sm" className="flex-1" asChild>
                  <a href={`mailto:${selectedLead.email}?subject=Reply to your inquiry`}>
                    <Mail className="mr-1.5 h-3.5 w-3.5" />
                    Reply Email
                  </a>
                </Button>
                {selectedLead.phone && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`tel:${selectedLead.phone}`}>
                      <Phone className="mr-1.5 h-3.5 w-3.5" />
                      Call
                    </a>
                  </Button>
                )}
              </div>

              {/* Status Update */}
              <div className="space-y-1.5 rounded-xl border bg-muted/20 p-3">
                <label className="text-xs font-semibold text-muted-foreground">
                  Submission Status
                </label>
                <Select
                  value={selectedLead.status}
                  onValueChange={(val: LeadStatus) => handleStatusUpdate(selectedLead.id, val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {LEAD_STATUS_LABEL[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 rounded-xl border p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Contact Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-foreground">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a href={`mailto:${selectedLead.email}`} className="truncate hover:underline">
                      {selectedLead.email}
                    </a>
                  </div>
                  {selectedLead.phone && (
                    <div className="flex items-center gap-2 text-foreground">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                      <a href={`tel:${selectedLead.phone}`} className="hover:underline">
                        {selectedLead.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Inbox className="h-4 w-4 shrink-0" />
                    <span>Source: {selectedLead.source || 'Website Contact Form'}</span>
                  </div>
                </div>
              </div>

              {/* Submission Message / Body */}
              <div className="space-y-2 rounded-xl border p-4 bg-card/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Message
                </h4>
                <div className="rounded-lg bg-background p-3 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {selectedLead.message || (
                    <span className="italic text-muted-foreground">No message text provided.</span>
                  )}
                </div>
              </div>

              <SheetFooter className="flex-row items-center justify-between gap-2 border-t pt-4 sm:justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(selectedLead.id)}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Delete
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/leads/${selectedLead.id}`}>
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                    Full View
                  </Link>
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
