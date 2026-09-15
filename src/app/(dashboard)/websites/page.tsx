'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import { Website, Template } from '@/types';
import { formatDate } from '@/lib/utils';
import { ExternalLink, Globe, LayoutGrid, List, Pencil, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader } from '@/components/kdba/page-header';
import { WebsiteActionsMenu } from '@/components/kdba/website-actions-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type StatusFilter = 'ALL' | 'PUBLISHED' | 'DRAFT';
type SortKey = 'updated' | 'name' | 'status';
type ViewMode = 'grid' | 'list';

export default function WebsitesPage() {
  const router = useRouter();
  const [websites, setWebsites] = React.useState<Website[]>([]);
  const [templates, setTemplates] = React.useState<Template[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [query, setQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('ALL');
  const [templateFilter, setTemplateFilter] = React.useState('ALL');
  const [sortKey, setSortKey] = React.useState<SortKey>('updated');
  const [view, setView] = React.useState<ViewMode>('grid');

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [newSiteName, setNewSiteName] = React.useState('');
  const [selectedTemplateId, setSelectedTemplateId] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const loadWebsites = async () => {
    try {
      const [websitesData, templatesData]: unknown[] = await Promise.all([
        apiClient.get('/websites').catch(() => []),
        apiClient.get('/templates').catch(() => []),
      ]);
      setWebsites(Array.isArray(websitesData) ? websitesData : []);
      if (Array.isArray(templatesData)) {
        setTemplates(templatesData);
        if (templatesData.length > 0) setSelectedTemplateId((prev) => prev || templatesData[0].id);
      }
    } catch (err) {
      console.error('Failed to load websites:', err);
      toast.error('Could not load websites');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    void loadWebsites();
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = websites.filter((site) => {
      const matchesQuery =
        !q ||
        site.name.toLowerCase().includes(q) ||
        site.slug.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'ALL' || site.status === statusFilter;
      const matchesTemplate =
        templateFilter === 'ALL' ||
        site.templateId === templateFilter ||
        site.template?.id === templateFilter;
      return matchesQuery && matchesStatus && matchesTemplate;
    });
    return list.sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name);
      if (sortKey === 'status') return a.status.localeCompare(b.status);
      return new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime();
    });
  }, [websites, query, statusFilter, templateFilter, sortKey]);

  const handleCreateWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName || !selectedTemplateId) return;

    setIsSubmitting(true);
    try {
      const businesses: unknown = await apiClient.get('/businesses');
      let businessId = Array.isArray(businesses) ? businesses[0]?.id : undefined;

      if (!businessId) {
        const created: { id: string } = await apiClient.post('/businesses', { name: newSiteName });
        businessId = created.id;
      }

      const createdSite: Website = await apiClient.post('/websites', {
        businessId,
        templateId: selectedTemplateId,
        name: newSiteName,
      });

      setIsCreateOpen(false);
      toast.success('Website created');
      router.push(`/editor/${createdSite.id}`);
    } catch (err) {
      console.error('Failed to create website:', err);
      toast.error('Could not create website');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Websites"
        description="Create, edit, publish, and manage every site in this workspace."
        actions={
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus />
            New website
          </Button>
        }
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or slug"
            className="h-9 pl-8"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(['ALL', 'PUBLISHED', 'DRAFT'] as StatusFilter[]).map((status) => (
            <Button
              key={status}
              size="sm"
              variant={statusFilter === status ? 'secondary' : 'ghost'}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'ALL' ? 'All' : status === 'PUBLISHED' ? 'Live' : 'Draft'}
            </Button>
          ))}
          <Select value={sortKey} onValueChange={(value) => setSortKey(value as SortKey)}>
            <SelectTrigger className="w-[180px]" size="sm" aria-label="Sort websites">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Recently updated</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
          {templates.length > 0 ? (
            <Select value={templateFilter} onValueChange={setTemplateFilter}>
              <SelectTrigger className="w-[180px]" size="sm" aria-label="Filter by template">
                <SelectValue placeholder="Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All templates</SelectItem>
                {templates.map((tpl) => (
                  <SelectItem key={tpl.id} value={tpl.id}>
                    {tpl.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
          <div className="flex rounded-lg border p-0.5">
            <Button
              size="icon-sm"
              variant={view === 'grid' ? 'secondary' : 'ghost'}
              aria-label="Grid view"
              onClick={() => setView('grid')}
            >
              <LayoutGrid />
            </Button>
            <Button
              size="icon-sm"
              variant={view === 'list' ? 'secondary' : 'ghost'}
              aria-label="List view"
              onClick={() => setView('list')}
            >
              <List />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Globe className="size-6" />}
          title={websites.length === 0 ? 'No websites yet' : 'No matching websites'}
          description={
            websites.length === 0
              ? 'Create your first website from a template.'
              : 'Try a different search or filter.'
          }
          actionLabel={websites.length === 0 ? 'Choose a template' : undefined}
          onAction={websites.length === 0 ? () => router.push('/templates') : undefined}
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((website) => {
            const isPublished = website.status === 'PUBLISHED';
            return (
              <Card key={website.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={isPublished ? 'success' : 'secondary'}>
                      {isPublished ? 'Live' : 'Draft'}
                    </Badge>
                    <WebsiteActionsMenu website={website} onChanged={() => void loadWebsites()} />
                  </div>
                  <CardTitle className="truncate">{website.name}</CardTitle>
                  <p className="truncate font-mono text-xs text-muted-foreground">/site/{website.slug}</p>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Updated {formatDate(website.updatedAt || website.createdAt || '')}
                  {website.template?.name ? ` · ${website.template.name}` : ''}
                </CardContent>
                <CardFooter className="gap-2">
                  <Button size="sm" className="flex-1" asChild>
                    <Link href={`/editor/${website.id}`}>
                      <Pencil />
                      Open builder
                    </Link>
                  </Button>
                  {isPublished ? (
                    <Button size="icon-sm" variant="outline" asChild>
                      <Link href={`/site/${website.slug}`} target="_blank" aria-label="View live site">
                        <ExternalLink />
                      </Link>
                    </Button>
                  ) : null}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
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
              {filtered.map((website) => (
                <TableRow key={website.id}>
                  <TableCell>
                    <div className="font-medium">{website.name}</div>
                    <div className="font-mono text-xs text-muted-foreground">/{website.slug}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={website.status === 'PUBLISHED' ? 'success' : 'secondary'}>
                      {website.status === 'PUBLISHED' ? 'Live' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(website.updatedAt || website.createdAt || '')}
                  </TableCell>
                  <TableCell>
                    <WebsiteActionsMenu website={website} onChanged={() => void loadWebsites()} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create website"
        description="Give it a name and pick a starting template."
      >
        <form onSubmit={handleCreateWebsite} className="space-y-4">
          <Input
            label="Website name"
            required
            value={newSiteName}
            onChange={(e) => setNewSiteName(e.target.value)}
            placeholder="e.g. Apex Advisory"
          />
          <div className="grid gap-2">
            <p className="text-[13px] font-medium">Template</p>
            <div className="grid max-h-56 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    selectedTemplateId === tpl.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {String(tpl.category)}
                  </span>
                  <span className="mt-0.5 block text-sm font-medium">{tpl.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Create & open editor
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
