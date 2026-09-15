'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { cmsApi } from '@/lib/api/cms';
import { useCmsWebsite } from '@/hooks/use-cms-website';
import { BUILTIN_CONTENT_LINKS, CmsCollection } from '@/types/cms';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { CmsWebsiteSwitcher } from '@/components/cms/cms-website-switcher';
import { CollectionRecordsManager } from '@/components/cms/collection-records-manager';

export default function BuiltinCollectionPage() {
  const params = useParams();
  const slug = String(params?.slug || '');
  const { websites, websiteId, selectWebsite, isLoading: sitesLoading } = useCmsWebsite();
  const [collection, setCollection] = React.useState<CmsCollection | null>(null);
  const [loading, setLoading] = React.useState(true);

  const meta = BUILTIN_CONTENT_LINKS.find((item) => item.slug === slug);

  React.useEffect(() => {
    if (!websiteId || !slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        await cmsApi.bootstrap(websiteId);
        const list = await cmsApi.listCollections(websiteId);
        const found = list.find((item) => item.slug === slug) || null;
        if (!cancelled) setCollection(found);
      } catch {
        toast.error('Could not load collection');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [websiteId, slug]);

  if (sitesLoading || loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!websiteId) {
    return (
      <EmptyState
        title="Select a website"
        description="Content collections are managed per website."
      />
    );
  }

  if (!collection) {
    return (
      <div className="space-y-4">
        <CmsWebsiteSwitcher websites={websites} websiteId={websiteId} onChange={selectWebsite} />
        <EmptyState
          title="Collection not found"
          description={`No collection with slug “${slug}” exists for this website.`}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CmsWebsiteSwitcher websites={websites} websiteId={websiteId} onChange={selectWebsite} />
      </div>
      <CollectionRecordsManager
        websiteId={websiteId}
        collection={collection}
        title={meta?.label || collection.name}
        singular={meta?.singular || 'Record'}
        description={collection.description || undefined}
      />
    </div>
  );
}
