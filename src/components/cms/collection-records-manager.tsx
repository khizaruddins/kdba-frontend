'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { MoreHorizontal, Plus, Search } from 'lucide-react';
import { cmsApi } from '@/lib/api/cms';
import { recordTitle, slugify } from '@/lib/cms/record-title';
import { CmsCollection, CmsRecord, CmsRecordStatus } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/kdba/page-header';
import { useConfirm } from '@/components/kdba/confirm-dialog';
import { RecordStatusBadge } from '@/components/cms/record-status-badge';
import { DynamicRecordForm } from '@/components/cms/dynamic-record-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

export function CollectionRecordsManager({
  websiteId,
  collection,
  title,
  description,
  singular = 'Record',
}: {
  websiteId: string;
  collection: CmsCollection;
  title?: string;
  description?: string;
  singular?: string;
}) {
  const { confirm, dialog } = useConfirm();
  const [records, setRecords] = React.useState<CmsRecord[]>([]);
  const [meta, setMeta] = React.useState({ total: 0, page: 1, pageSize: 20, totalPages: 1 });
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState<'ALL' | CmsRecordStatus>('ALL');
  const [sort, setSort] = React.useState('updatedAt');
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc');
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CmsRecord | null>(null);
  const [formData, setFormData] = React.useState<Record<string, unknown>>({});
  const [formStatus, setFormStatus] = React.useState<CmsRecordStatus>('DRAFT');
  const [saving, setSaving] = React.useState(false);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await cmsApi.listRecords(websiteId, collection.id, {
        q: query.trim() || undefined,
        status: status === 'ALL' ? undefined : status,
        page,
        pageSize: 20,
        sort,
        order,
      });
      setRecords(result.data);
      setMeta(result.meta);
    } catch {
      toast.error('Could not load records');
    } finally {
      setIsLoading(false);
    }
  }, [websiteId, collection.id, query, status, page, sort, order]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setFormData({});
    setFormStatus(collection.settings?.defaultStatus || 'DRAFT');
    setEditorOpen(true);
  };

  const openEdit = (record: CmsRecord) => {
    setEditing(record);
    setFormData({ ...(record.data || {}) });
    setFormStatus(record.status);
    setEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const titleValue =
        (typeof formData.title === 'string' && formData.title) ||
        (typeof formData.name === 'string' && formData.name) ||
        (typeof formData.question === 'string' && formData.question) ||
        '';
      const slug =
        (typeof formData.slug === 'string' && formData.slug) ||
        (titleValue ? slugify(titleValue) : undefined);

      if (editing) {
        await cmsApi.updateRecord(websiteId, collection.id, editing.id, {
          data: formData,
          slug,
          status: formStatus,
        });
        toast.success(`${singular} updated`);
      } else {
        await cmsApi.createRecord(websiteId, collection.id, {
          data: formData,
          slug,
          status: formStatus,
        });
        toast.success(`${singular} created`);
      }
      setEditorOpen(false);
      await load();
    } catch (err: any) {
      toast.error(err?.message || `Could not save ${singular.toLowerCase()}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (record: CmsRecord) => {
    try {
      const data = { ...(record.data || {}) };
      if (typeof data.title === 'string') data.title = `${data.title} copy`;
      if (typeof data.name === 'string') data.name = `${data.name} copy`;
      if (typeof data.slug === 'string') data.slug = `${data.slug}-copy`;
      await cmsApi.createRecord(websiteId, collection.id, {
        data,
        status: 'DRAFT',
      });
      toast.success(`${singular} duplicated`);
      await load();
    } catch {
      toast.error('Could not duplicate record');
    }
  };

  const handleDelete = (record: CmsRecord) => {
    confirm({
      title: `Delete ${recordTitle(record)}?`,
      description: 'This removes the record from your content library. Published pages stop showing it.',
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: async () => {
        await cmsApi.deleteRecord(websiteId, collection.id, record.id);
        toast.success(`${singular} deleted`);
        await load();
      },
    });
  };

  return (
    <div className="space-y-6">
      {dialog}
      <PageHeader
        title={title || collection.name}
        description={description || collection.description || 'Manage records for this collection.'}
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus />
            Create {singular}
          </Button>
        }
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setPage(1);
              setQuery(e.target.value);
            }}
            placeholder="Search records"
            className="h-9 pl-8"
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) => {
            setPage(1);
            setStatus(value as 'ALL' | CmsRecordStatus);
          }}
        >
          <SelectTrigger className="w-[160px]" size="sm" aria-label="Status filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={`${sort}:${order}`}
          onValueChange={(value) => {
            const [nextSort, nextOrder] = value.split(':');
            setSort(nextSort);
            setOrder(nextOrder as 'asc' | 'desc');
          }}
        >
          <SelectTrigger className="w-[180px]" size="sm" aria-label="Sort records">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt:desc">Recently updated</SelectItem>
            <SelectItem value="createdAt:desc">Newest</SelectItem>
            <SelectItem value="sortOrder:asc">Manual order</SelectItem>
            <SelectItem value="slug:asc">Slug A–Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : records.length === 0 ? (
        <EmptyState
          title={`No ${collection.name.toLowerCase()} yet`}
          description={`Add your first ${singular.toLowerCase()} and use it anywhere on your website.`}
          actionLabel={`Create ${singular}`}
          onAction={openCreate}
        />
      ) : (
        <>
          <Card className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="font-medium">{recordTitle(record)}</div>
                      {record.slug ? (
                        <div className="font-mono text-xs text-muted-foreground">/{record.slug}</div>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <RecordStatusBadge status={record.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(record.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon-sm" variant="ghost" aria-label="Record actions">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(record)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => void handleDuplicate(record)}>
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" onClick={() => handleDelete(record)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <div className="grid gap-3 md:hidden">
            {records.map((record) => (
              <Card key={record.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{recordTitle(record)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(record.updatedAt)}</p>
                  </div>
                  <RecordStatusBadge status={record.status} />
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(record)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(record)}>
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {meta.total} record{meta.total === 1 ? '' : 's'}
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Badge variant="secondary">
                {meta.page} / {meta.totalPages}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <Dialog
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={editing ? `Edit ${singular}` : `Create ${singular}`}
        description="Content is stored in CMS and bound into the website when published."
        maxWidth="2xl"
      >
        <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Status</p>
            <Select value={formStatus} onValueChange={(v) => setFormStatus(v as CmsRecordStatus)}>
              <SelectTrigger aria-label="Record status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DynamicRecordForm fields={collection.fields} value={formData} onChange={setFormData} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={saving}>
              Save
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
