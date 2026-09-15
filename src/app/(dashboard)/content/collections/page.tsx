'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MoreHorizontal, Plus, Search } from 'lucide-react';
import { cmsApi } from '@/lib/api/cms';
import { useCmsWebsite } from '@/hooks/use-cms-website';
import { CmsCollection, CmsPreset } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/kdba/page-header';
import { useConfirm } from '@/components/kdba/confirm-dialog';
import { CmsWebsiteSwitcher } from '@/components/cms/cms-website-switcher';
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
import { formatDate } from '@/lib/utils';

export default function CollectionsPage() {
  const router = useRouter();
  const { confirm, dialog } = useConfirm();
  const { websites, websiteId, selectWebsite, isLoading: sitesLoading } = useCmsWebsite();
  const [collections, setCollections] = React.useState<CmsCollection[]>([]);
  const [counts, setCounts] = React.useState<Record<string, number>>({});
  const [presets, setPresets] = React.useState<CmsPreset[]>([]);
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [presetOpen, setPresetOpen] = React.useState(false);

  const load = React.useCallback(async () => {
    if (!websiteId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      await cmsApi.bootstrap(websiteId);
      const [list, catalog] = await Promise.all([
        cmsApi.listCollections(websiteId),
        cmsApi.catalog(websiteId),
      ]);
      setCollections(list);
      setPresets(catalog.presets || []);
      const next: Record<string, number> = {};
      await Promise.all(
        list.map(async (collection) => {
          const page = await cmsApi.listRecords(websiteId, collection.id, { pageSize: 1 });
          next[collection.id] = page.meta.total;
        }),
      );
      setCounts(next);
    } catch {
      toast.error('Could not load collections');
    } finally {
      setLoading(false);
    }
  }, [websiteId]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const filtered = collections.filter((collection) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      collection.name.toLowerCase().includes(q) ||
      collection.slug.toLowerCase().includes(q) ||
      (collection.description || '').toLowerCase().includes(q)
    );
  });

  const handleCreatePreset = async (presetKey: string) => {
    if (!websiteId) return;
    try {
      const created = await cmsApi.createCollection(websiteId, {
        name: presets.find((p) => p.key === presetKey)?.name || presetKey,
        preset: presetKey,
      });
      toast.success('Collection created');
      setPresetOpen(false);
      router.push(`/content/collections/${created.id}`);
    } catch (err: any) {
      toast.error(err?.message || 'Could not create collection');
    }
  };

  const handleDelete = (collection: CmsCollection) => {
    if (!websiteId) return;
    confirm({
      title: `Delete ${collection.name}?`,
      description: 'Records in this collection will be removed from the content library.',
      confirmLabel: 'Delete collection',
      destructive: true,
      onConfirm: async () => {
        await cmsApi.deleteCollection(websiteId, collection.id);
        toast.success('Collection deleted');
        await load();
      },
    });
  };

  return (
    <div className="space-y-6">
      {dialog}
      <PageHeader
        title="Collections"
        description="Define content libraries such as services, team, or custom business data."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <CmsWebsiteSwitcher websites={websites} websiteId={websiteId} onChange={selectWebsite} />
            <Button size="sm" variant="outline" onClick={() => setPresetOpen(true)}>
              From template
            </Button>
            <Button size="sm" asChild>
              <Link href="/content/collections/new">
                <Plus />
                New collection
              </Link>
            </Button>
          </div>
        }
      />

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search collections"
          className="h-9 pl-8"
        />
      </div>

      {sitesLoading || loading ? (
        <Skeleton className="h-64 w-full" />
      ) : !websiteId ? (
        <EmptyState title="No website selected" description="Create a website to manage collections." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No collections yet"
          description="Start from a built-in template or create a custom collection."
          actionLabel="New collection"
          onAction={() => router.push('/content/collections/new')}
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell>
                    <Link href={`/content/collections/${collection.id}`} className="font-medium hover:underline">
                      {collection.name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">/{collection.slug}</span>
                      {collection.isBuiltin ? <Badge variant="secondary">Built-in</Badge> : null}
                    </div>
                  </TableCell>
                  <TableCell>{counts[collection.id] ?? 0}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(collection.updatedAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon-sm" variant="ghost" aria-label="Collection actions">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/content/collections/${collection.id}`}>Open</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/content/collections/${collection.id}/edit`}>Edit fields</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => handleDelete(collection)}>
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
      )}

      <Dialog
        isOpen={presetOpen}
        onClose={() => setPresetOpen(false)}
        title="Start from a template"
        description="Create a collection with a ready-made field structure."
        maxWidth="lg"
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {presets.map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => void handleCreatePreset(preset.key)}
              className="rounded-xl border p-3 text-left hover:border-primary/50 hover:bg-muted/40"
            >
              <p className="font-medium">{preset.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{preset.description}</p>
            </button>
          ))}
        </div>
      </Dialog>
    </div>
  );
}
