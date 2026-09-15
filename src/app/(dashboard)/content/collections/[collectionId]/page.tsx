'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Settings2 } from 'lucide-react';
import { cmsApi } from '@/lib/api/cms';
import { useCmsWebsite } from '@/hooks/use-cms-website';
import { BUILTIN_CONTENT_LINKS, CmsCollection } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { CmsWebsiteSwitcher } from '@/components/cms/cms-website-switcher';
import { CollectionRecordsManager } from '@/components/cms/collection-records-manager';

export default function CollectionDetailPage() {
  const params = useParams();
  const collectionId = String(params?.collectionId || '');
  const { websites, websiteId, selectWebsite, isLoading: sitesLoading } = useCmsWebsite();
  const [collection, setCollection] = React.useState<CmsCollection | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!websiteId || !collectionId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void cmsApi
      .getCollection(websiteId, collectionId)
      .then((item) => {
        if (!cancelled) setCollection(item);
      })
      .catch(() => toast.error('Could not load collection'))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [websiteId, collectionId]);

  const meta = BUILTIN_CONTENT_LINKS.find((item) => item.slug === collection?.slug);

  if (sitesLoading || loading) return <Skeleton className="h-64 w-full" />;
  if (!websiteId || !collection) {
    return <EmptyState title="Collection not found" description="It may have been deleted." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <CmsWebsiteSwitcher websites={websites} websiteId={websiteId} onChange={selectWebsite} />
        <Button size="sm" variant="outline" asChild>
          <Link href={`/content/collections/${collection.id}/edit`}>
            <Settings2 />
            Edit fields
          </Link>
        </Button>
      </div>
      <CollectionRecordsManager
        websiteId={websiteId}
        collection={collection}
        singular={meta?.singular || 'Record'}
      />
    </div>
  );
}
