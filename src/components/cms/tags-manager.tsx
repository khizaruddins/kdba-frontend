'use client';

import * as React from 'react';
import { useCmsWebsite } from '@/hooks/use-cms-website';
import { CmsWebsiteSwitcher } from '@/components/cms/cms-website-switcher';
import { cmsApi, cmsTagsApi } from '@/lib/api/cms';
import { CmsRecord, CmsTag } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { Plus, X, Search, Hash } from 'lucide-react';
import { slugify } from '@/lib/cms/record-title';

export function TagsManager() {
  const { websites, websiteId: activeWebsiteId, selectWebsite } = useCmsWebsite();
  const [records, setRecords] = React.useState<CmsRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [newTag, setNewTag] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!activeWebsiteId) return;
    loadData();
  }, [activeWebsiteId]);

  const loadData = async () => {
    if (!activeWebsiteId) return;
    setLoading(true);
    try {
      await cmsApi.bootstrap(activeWebsiteId).catch(() => {});
      
      let dedicatedTags: CmsRecord[] = [];
      try {
        const dedicated = await cmsTagsApi.list(activeWebsiteId);
        if (Array.isArray(dedicated)) {
          dedicatedTags = dedicated.map((t: CmsTag, idx: number) => ({
            id: t.id,
            collectionId: 'tags',
            slug: t.slug,
            status: 'PUBLISHED',
            sortOrder: idx,
            data: {
              name: t.name,
              slug: t.slug,
            },
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
          }));
        }
      } catch (err) {
        console.warn('Dedicated tags API unavailable, using collections', err);
      }

      const legacy = await cmsApi.listRecords(activeWebsiteId, 'tags').catch(() => ({ data: [] }));
      const legacyTags: CmsRecord[] = Array.isArray(legacy) ? legacy : legacy.data || [];

      const seen = new Set<string>();
      const merged: CmsRecord[] = [];
      for (const t of dedicatedTags) {
        seen.add(t.id);
        if (t.slug) seen.add(t.slug);
        merged.push(t);
      }
      for (const t of legacyTags) {
        if (!seen.has(t.id) && (!t.slug || !seen.has(t.slug))) {
          merged.push(t);
        }
      }

      setRecords(merged);
    } catch (e) {
      console.error(e);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWebsiteId || !newTag.trim()) return;
    setIsSubmitting(true);
    try {
      const slug = slugify(newTag);
      await cmsTagsApi.create(activeWebsiteId, { name: newTag.trim(), slug }).catch(() => {});
      await cmsApi.createRecord(activeWebsiteId, 'tags', { data: { name: newTag.trim() }, slug }).catch(() => {});
      setNewTag('');
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (recordId: string) => {
    if (!activeWebsiteId) return;
    try {
      await cmsTagsApi.delete(activeWebsiteId, recordId).catch(() => {});
      await cmsApi.deleteRecord(activeWebsiteId, 'tags', recordId).catch(() => {});
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = records.filter(r => String(r.data.name || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Tags</h1>
          <p className="text-sm text-muted-foreground mt-1">Specific keywords to categorize content.</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-md border border-border bg-card text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm min-h-[400px] flex flex-col">
        {loading ? (
          <div className="flex flex-wrap gap-2 animate-pulse">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-8 w-24 bg-muted rounded-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <Hash className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
            <p className="text-muted-foreground font-medium">No tags found</p>
            {search && <p className="text-sm text-muted-foreground mt-1">Try a different search term.</p>}
          </div>
        ) : (
          <div className="flex-1 flex flex-wrap content-start gap-3">
            {filtered.map(r => (
              <div key={r.id} className="group flex items-center gap-2 bg-muted/50 hover:bg-muted border border-border rounded-full px-3 py-1.5 text-sm font-medium text-foreground transition-colors">
                <span>{String(r.data.name || 'Unnamed')}</span>
                <button
                  type="button"
                  onClick={() => handleDelete(r.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                  aria-label="Delete tag"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-border">
          <form onSubmit={handleAdd} className="flex gap-3 max-w-md">
            <input
              type="text"
              placeholder="Add new tag..."
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              className="flex-1 h-10 px-4 rounded-md border border-border bg-background text-sm focus:outline-none focus:border-primary"
            />
            <Button type="submit" disabled={!newTag.trim() || isSubmitting}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
