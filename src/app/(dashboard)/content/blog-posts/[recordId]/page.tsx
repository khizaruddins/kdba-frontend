'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCmsWebsite } from '@/hooks/use-cms-website';
import { cmsApi } from '@/lib/api/cms';
import { PostEditor } from '@/components/cms/post-editor';
import { Loader2 } from 'lucide-react';

export default function BlogPostEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { websiteId } = useCmsWebsite();
  const [collectionId, setCollectionId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (websiteId) {
      void cmsApi.listCollections(websiteId).then((cols) => {
        const blogCol = cols.find((c) => c.slug === 'blog-posts' || c.name.toLowerCase().includes('blog'));
        if (blogCol) {
          setCollectionId(blogCol.id);
        }
      });
    }
  }, [websiteId]);

  if (!websiteId || !collectionId) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <PostEditor
      websiteId={websiteId}
      collectionId={collectionId}
      recordId={params.recordId === 'new' ? undefined : String(params.recordId)}
      onBack={() => router.push('/content/blog-posts')}
    />
  );
}
