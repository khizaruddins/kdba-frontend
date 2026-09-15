'use client';

import * as React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { FileText, Plus } from 'lucide-react';
import { cmsApi } from '@/lib/api/cms';
import { useCmsWebsite } from '@/hooks/use-cms-website';
import { BUILTIN_CONTENT_LINKS, CmsCollection } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/kdba/page-header';
import { CmsWebsiteSwitcher } from '@/components/cms/cms-website-switcher';
import { StatCard } from '@/components/kdba/stat-card';

export default function ContentOverviewPage() {
  const { websites, websiteId, selectWebsite, isLoading: sitesLoading } = useCmsWebsite();
  const [collections, setCollections] = React.useState<CmsCollection[]>([]);
  const [counts, setCounts] = React.useState<Record<string, { total: number; draft: number; published: number }>>({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!websiteId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        await cmsApi.bootstrap(websiteId);
        const list = await cmsApi.listCollections(websiteId);
        if (cancelled) return;
        setCollections(list);
        const next: Record<string, { total: number; draft: number; published: number }> = {};
        await Promise.all(
          list.map(async (collection) => {
            const [all, draft, published] = await Promise.all([
              cmsApi.listRecords(websiteId, collection.id, { pageSize: 1 }),
              cmsApi.listRecords(websiteId, collection.id, { pageSize: 1, status: 'DRAFT' }),
              cmsApi.listRecords(websiteId, collection.id, { pageSize: 1, status: 'PUBLISHED' }),
            ]);
            next[collection.id] = {
              total: all.meta.total,
              draft: draft.meta.total,
              published: published.meta.total,
            };
          }),
        );
        if (!cancelled) setCounts(next);
      } catch {
        toast.error('Could not load content overview');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [websiteId]);

  const totals = Object.values(counts).reduce(
    (acc, item) => ({
      total: acc.total + item.total,
      draft: acc.draft + item.draft,
      published: acc.published + item.published,
    }),
    { total: 0, draft: 0, published: 0 },
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content"
        description="Manage business content once, then bind it into your website layouts."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <CmsWebsiteSwitcher
              websites={websites}
              websiteId={websiteId}
              onChange={selectWebsite}
            />
            <Button size="sm" asChild>
              <Link href="/content/collections">
                <Plus />
                Collections
              </Link>
            </Button>
          </div>
        }
      />

      {sitesLoading || loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : !websiteId ? (
        <EmptyState
          icon={<FileText className="size-6" />}
          title="No website selected"
          description="Create a website first, then manage blog posts, services, team, and more here."
          actionLabel="Create website"
          onAction={() => {
            window.location.href = '/templates';
          }}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard title="All records" value={String(totals.total)} />
            <StatCard title="Published" value={String(totals.published)} />
            <StatCard title="Drafts" value={String(totals.draft)} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Create common business content without opening the visual editor.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {BUILTIN_CONTENT_LINKS.map((item) => (
                <Button key={item.slug} size="sm" variant="outline" asChild>
                  <Link href={item.href}>Create {item.singular}</Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Collections</CardTitle>
              <CardDescription>Built-in and custom content libraries for this website.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {collections.map((collection) => {
                const stats = counts[collection.id] || { total: 0, draft: 0, published: 0 };
                return (
                  <Link
                    key={collection.id}
                    href={`/content/collections/${collection.id}`}
                    className="rounded-xl border p-4 transition-colors hover:bg-muted/40"
                  >
                    <p className="font-medium">{collection.name}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {collection.description || 'Content collection'}
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {stats.total} records · {stats.published} published · {stats.draft} drafts
                    </p>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
