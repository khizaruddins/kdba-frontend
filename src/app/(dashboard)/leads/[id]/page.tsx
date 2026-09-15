'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Check, Mail, Phone, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import { Lead, LeadStatus } from '@/types';
import { formatDate } from '@/lib/utils';
import { LEAD_STATUS_LABEL, LEAD_STATUSES, leadStatusVariant, shortRef } from '@/lib/workspace';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/kdba/page-header';
import { useConfirm } from '@/components/kdba/confirm-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PIPELINE: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED'];

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { confirm, dialog } = useConfirm();
  const [lead, setLead] = React.useState<Lead | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!params.id) return;
    apiClient
      .get(`/leads/${params.id}`)
      .then((data) => setLead(data as unknown as Lead))
      .catch(() => toast.error('Lead not found'))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  const handleStatusChange = async (status: LeadStatus) => {
    if (!lead) return;
    try {
      const updated = (await apiClient.patch(`/leads/${lead.id}`, { status })) as unknown as Lead;
      setLead(updated);
      toast.success('Status updated');
    } catch {
      toast.error('Could not update status');
    }
  };

  const handleDelete = () => {
    if (!lead) return;
    confirm({
      title: 'Delete this lead?',
      description: 'The inquiry will be removed from your inbox.',
      confirmLabel: 'Delete lead',
      destructive: true,
      onConfirm: async () => {
        await apiClient.delete(`/leads/${lead.id}`);
        toast.success('Lead deleted');
        router.push('/leads');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">This lead could not be loaded.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/leads">Back to leads</Link>
        </Button>
      </div>
    );
  }

  const activeIndex = PIPELINE.indexOf(lead.status);

  return (
    <div className="space-y-6">
      {dialog}
      <PageHeader
        title={shortRef(lead.id, 'LEAD-')}
        description={`Received ${formatDate(lead.createdAt)}`}
        actions={
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/leads">
                <ArrowLeft />
                Leads
              </Link>
            </Button>
            <Select value={lead.status} onValueChange={(value) => handleStatusChange(value as LeadStatus)}>
              <SelectTrigger className="w-[160px]">
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
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 />
              Delete
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Customer information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-lg font-semibold">{lead.name}</p>
            <a href={`mailto:${lead.email}`} className="flex items-center gap-2 hover:underline">
              <Mail className="size-4 text-muted-foreground" />
              {lead.email}
            </a>
            {lead.phone ? (
              <a href={`tel:${lead.phone}`} className="flex items-center gap-2 hover:underline">
                <Phone className="size-4 text-muted-foreground" />
                {lead.phone}
              </a>
            ) : (
              <p className="text-muted-foreground">No phone provided</p>
            )}
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">Source</p>
              <p className="capitalize">{(lead.source || 'website').replace('_', ' ')}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Status</CardTitle>
            <Badge variant={leadStatusVariant(lead.status)}>{LEAD_STATUS_LABEL[lead.status]}</Badge>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Move this inquiry through the pipeline as you follow up.
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="grid gap-4 sm:grid-cols-4">
            {PIPELINE.map((status, index) => {
              const complete = lead.status !== 'LOST' && activeIndex >= index;
              return (
                <li key={status} className="flex flex-col items-center text-center">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(status)}
                    className={`flex size-10 items-center justify-center rounded-full border ${
                      complete
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-border bg-muted text-muted-foreground'
                    }`}
                    aria-label={`Mark as ${LEAD_STATUS_LABEL[status]}`}
                  >
                    {complete ? <Check className="size-4" /> : index + 1}
                  </button>
                  <p className="mt-2 text-sm font-medium">{LEAD_STATUS_LABEL[status]}</p>
                </li>
              );
            })}
          </ol>
          {lead.status === 'LOST' ? (
            <p className="mt-4 text-center text-sm text-muted-foreground">This lead was marked as lost.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Message</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {lead.message || 'No message provided.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
