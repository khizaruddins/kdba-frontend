'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { CmsRecord, CmsCollection, CmsPost } from '@/types/cms';
import { cmsApi, cmsPostsApi } from '@/lib/api/cms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Copy, Trash2, Globe, Lock, Eye, Calendar, Archive } from 'lucide-react';
import { countWords, estimateReadTime, ContentBlock } from '@/lib/cms/content-blocks';
import { recordTitle } from '@/lib/cms/record-title';

interface UnifiedPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  authorName?: string;
  featuredImageUrl?: string;
  status: string;
  views?: number;
  blocks: ContentBlock[];
  isDedicated: boolean;
  raw: CmsPost | CmsRecord;
}

function parseBlocks(content: unknown): ContentBlock[] {
  if (Array.isArray(content)) return content as ContentBlock[];
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed as ContentBlock[];
    } catch {
      // not json
    }
  }
  return [];
}

export function PostsListManager({
  websiteId,
  collection,
}: {
  websiteId: string;
  collection: CmsCollection;
}) {
  const router = useRouter();
  const [posts, setPosts] = React.useState<UnifiedPostItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  const loadRecords = React.useCallback(async () => {
    setLoading(true);
    try {
      // Try dedicated posts API first
      let dedicatedItems: UnifiedPostItem[] = [];
      try {
        const dedicatedRes = await cmsPostsApi.list(websiteId, { q: search });
        if (dedicatedRes?.data && Array.isArray(dedicatedRes.data)) {
          dedicatedItems = dedicatedRes.data.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt || undefined,
            authorName: p.author?.name || undefined,
            featuredImageUrl: p.featuredImage || undefined,
            status: p.status,
            views: p.views || 0,
            blocks: parseBlocks(p.content),
            isDedicated: true,
            raw: p,
          }));
        }
      } catch (err) {
        console.warn('Dedicated posts API unavailable, falling back to collections', err);
      }

      // Also fetch collection records as fallback or to merge legacy items
      const legacyRes = await cmsApi.listRecords(websiteId, collection.id, { q: search }).catch(() => ({ data: [] }));
      const legacyItems: UnifiedPostItem[] = (legacyRes.data || []).map((r) => ({
        id: r.id,
        title: recordTitle(r),
        slug: r.slug || '',
        excerpt: (r.data?.excerpt as string) || undefined,
        authorName: (r.data?.authorName as string) || undefined,
        featuredImageUrl: (r.data?.featuredImageUrl as string) || undefined,
        status: r.status || 'DRAFT',
        views: 0,
        blocks: parseBlocks(r.data?.content),
        isDedicated: false,
        raw: r,
      }));

      // Combine by slug/id (dedicated posts take precedence)
      const seenIds = new Set<string>();
      const seenSlugs = new Set<string>();
      const combined: UnifiedPostItem[] = [];

      for (const item of dedicatedItems) {
        seenIds.add(item.id);
        seenSlugs.add(item.slug);
        combined.push(item);
      }
      for (const item of legacyItems) {
        if (!seenIds.has(item.id) && !seenSlugs.has(item.slug)) {
          combined.push(item);
        }
      }

      setPosts(combined);
    } catch (err) {
      console.error('Failed to load posts', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [websiteId, collection.id, search]);

  React.useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const handleDelete = async (item: UnifiedPostItem) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      if (item.isDedicated) {
        await cmsPostsApi.delete(websiteId, item.id).catch(() => {});
      }
      // Also try cleaning from collection record if present
      await cmsApi.deleteRecord(websiteId, collection.id, item.id).catch(() => {});
    } catch (err) {
      console.error('Failed to delete post', err);
    }
    loadRecords();
  };

  const handleDuplicate = async (item: UnifiedPostItem) => {
    try {
      const newTitle = `${item.title} (Copy)`;
      const newSlug = `${item.slug}-copy-${Date.now().toString(36).slice(-4)}`;
      
      if (item.isDedicated) {
        await cmsPostsApi.create(websiteId, {
          title: newTitle,
          slug: newSlug,
          excerpt: item.excerpt,
          content: JSON.stringify(item.blocks),
          featuredImage: item.featuredImageUrl,
          status: 'DRAFT',
        }).catch(() => {});
      }

      await cmsApi.createRecord(websiteId, collection.id, {
        data: {
          title: newTitle,
          excerpt: item.excerpt,
          content: item.blocks,
          authorName: item.authorName,
          featuredImageUrl: item.featuredImageUrl,
        },
        slug: newSlug,
        status: 'DRAFT',
      }).catch(() => {});
    } catch (err) {
      console.error('Failed to duplicate post', err);
    }
    loadRecords();
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500 border-green-500/20">
            <Globe className="mr-1 size-3" /> Published
          </Badge>
        );
      case 'SCHEDULED':
        return (
          <Badge variant="outline" className="border-blue-500/30 text-blue-500 bg-blue-500/10">
            <Calendar className="mr-1 size-3" /> Scheduled
          </Badge>
        );
      case 'ARCHIVED':
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <Archive className="mr-1 size-3" /> Archived
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Lock className="mr-1 size-3" /> Draft
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-9 w-64"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => router.push('/content/blog-posts/new')}>
          <Plus className="mr-2 size-4" />
          New Post
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Thumbnail</TableHead>
              <TableHead>Post</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((item) => {
                const words = countWords(item.blocks);
                const readTime = estimateReadTime(item.blocks);

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.featuredImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.featuredImageUrl} alt="" className="w-16 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                          No img
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{item.excerpt || 'No excerpt'}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {words} words &middot; {readTime} min read
                      </div>
                    </TableCell>
                    <TableCell>{item.authorName || '-'}</TableCell>
                    <TableCell>
                      {renderStatusBadge(item.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="size-3.5" />
                        <span>{item.views ?? 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/content/blog-posts/${item.id}`)}
                        >
                          <Edit2 className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicate(item)}
                        >
                          <Copy className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
