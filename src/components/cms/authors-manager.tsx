'use client';

import * as React from 'react';
import { useCmsWebsite } from '@/hooks/use-cms-website';
import { CmsWebsiteSwitcher } from '@/components/cms/cms-website-switcher';
import { cmsApi, cmsAuthorsApi } from '@/lib/api/cms';
import { CmsRecord, CmsAuthor } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import { AuthorForm } from './author-form';
import { resolveCmsMediaValue } from '@/lib/cms/bindings';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export function AuthorsManager() {
  const { websites, websiteId: activeWebsiteId, selectWebsite } = useCmsWebsite();
  const [records, setRecords] = React.useState<CmsRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingRecord, setEditingRecord] = React.useState<CmsRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  React.useEffect(() => {
    if (!activeWebsiteId) return;
    loadAuthors();
  }, [activeWebsiteId]);

  const loadAuthors = async () => {
    if (!activeWebsiteId) return;
    setLoading(true);
    try {
      await cmsApi.bootstrap(activeWebsiteId).catch(() => {});
      
      let dedicatedAuthors: CmsRecord[] = [];
      try {
        const dedicated = await cmsAuthorsApi.list(activeWebsiteId);
        const list = Array.isArray(dedicated) ? dedicated : (dedicated as any)?.data || [];
        dedicatedAuthors = list.map((a: CmsAuthor, idx: number) => ({
          id: a.id,
          collectionId: 'authors',
          slug: a.slug,
          status: 'PUBLISHED',
          sortOrder: idx,
          data: {
            name: a.name,
            bio: a.bio || '',
            avatar: a.avatarUrl || '',
            twitter: a.socialLinks?.twitter || '',
            instagram: a.socialLinks?.instagram || '',
            linkedin: a.socialLinks?.linkedin || '',
          },
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
        }));
      } catch (err) {
        console.warn('Dedicated authors API unavailable, using collection', err);
      }

      const legacy = await cmsApi.listRecords(activeWebsiteId, 'authors').catch(() => ({ data: [] }));
      const legacyAuthors: CmsRecord[] = Array.isArray(legacy) ? legacy : legacy.data || [];

      // Merge avoiding duplicates by id or slug
      const seen = new Set<string>();
      const merged: CmsRecord[] = [];
      for (const a of dedicatedAuthors) {
        seen.add(a.id);
        if (a.slug) seen.add(a.slug);
        merged.push(a);
      }
      for (const a of legacyAuthors) {
        if (!seen.has(a.id) && (!a.slug || !seen.has(a.slug))) {
          merged.push(a);
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

  const handleAdd = () => {
    setEditingRecord(null);
    setIsFormOpen(true);
  };

  const handleEdit = (record: CmsRecord) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  const handleDelete = async (recordId: string) => {
    if (!activeWebsiteId) return;
    if (!confirm('Are you sure you want to delete this author?')) return;
    try {
      await cmsAuthorsApi.delete(activeWebsiteId, recordId).catch(() => {});
      await cmsApi.deleteRecord(activeWebsiteId, 'authors', recordId).catch(() => {});
      await loadAuthors();
    } catch (e) {
      console.error(e);
    }
  };

  const onSaveComplete = async () => {
    setIsFormOpen(false);
    await loadAuthors();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Authors</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage content creators and their bios.</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          New Author
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-card border border-border rounded-xl h-[280px]" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-xl border-border bg-card/50">
          <Users className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No authors yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-2">
            Add your first author to attribute blog posts and articles.
          </p>
          <Button variant="outline" className="mt-6" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Author
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((r) => {
            const avatar = resolveCmsMediaValue(r.data.avatar, undefined, 'authors');
            return (
              <div key={r.id} className="group relative bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center shadow-sm hover:border-primary/50 transition-colors">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-muted border border-border">
                  {avatar ? (
                    <img src={avatar} alt={String(r.data.name)} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-12 h-12 m-6 text-muted-foreground opacity-20" />
                  )}
                </div>
                <h3 className="font-semibold text-foreground text-lg">{String(r.data.name || 'Unnamed')}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 max-w-[200px]">
                  {String(r.data.bio || 'No bio provided.')}
                </p>
                <div className="mt-6 pt-6 border-t border-border w-full flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">0 Posts</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => handleEdit(r)}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(r.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="right" className="w-[480px] sm:w-[540px] p-0 border-l border-border bg-background">
          {isFormOpen && (
            <AuthorForm
              websiteId={activeWebsiteId!}
              initialRecord={editingRecord}
              onClose={() => setIsFormOpen(false)}
              onSave={onSaveComplete}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
