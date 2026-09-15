'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Search, Users } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import { Lead, LeadStats } from '@/types';
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
      console.error('Failed to load leads:', err);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, statusFilter]);

  React.useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  const handleDelete = (id: string) => {
    confirm({
      title: 'Delete this lead?',
      description: 'The inquiry will be removed from your inbox.',
      confirmLabel: 'Delete lead',
      destructive: true,
      onConfirm: async () => {
        await apiClient.delete(`/leads/${id}`);
        toast.success('Lead deleted');
        await loadLeads();
      },
    });
  };

  return (
    <div className="space-y-6">
      {dialog}
      <PageHeader
        title="Forms & leads"
        description="Inbound inquiries collected from published contact forms."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total" value={stats.total} trend={stats.change?.total} loading={isLoading} />
        <StatCard title="New" value={stats.new} className="bg-sky-50 dark:bg-sky-950/30" loading={isLoading} />
        <StatCard title="Contacted" value={stats.contacted} className="bg-amber-50 dark:bg-amber-950/30" loading={isLoading} />
        <StatCard title="Qualified" value={stats.qualified} loading={isLoading} />
        <StatCard title="Converted" value={stats.converted} className="bg-emerald-50 dark:bg-emerald-950/30" loading={isLoading} />
      </div>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList variant="line">
                <TabsTrigger value="ALL">All</TabsTrigger>
                {LEAD_STATUSES.map((status) => (
                  <TabsTrigger key={status} value={status}>
                    {LEAD_STATUS_LABEL[status]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Input
              className="lg:max-w-xs"
              placeholder="Search name or email…"
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
              icon={<Users className="h-6 w-6 text-muted-foreground" />}
              title="No leads found"
              description="Inbound inquiries submitted by website visitors will appear here."
              className="min-h-0 border-0 bg-transparent"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/leads/${lead.id}`)}
                  >
                    <TableCell>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{shortRef(lead.id)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{lead.email}</p>
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
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
                          <DropdownMenuItem asChild>
                            <Link href={`/leads/${lead.id}`}>View</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onClick={() => handleDelete(lead.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
