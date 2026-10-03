'use client';

import * as React from 'react';
import { useCmsWebsite } from '@/hooks/use-cms-website';
import { CmsWebsiteSwitcher } from '@/components/cms/cms-website-switcher';
import { cmsApi, cmsCategoriesApi } from '@/lib/api/cms';
import { CmsRecord, CmsCategory } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Tag, Save, X } from 'lucide-react';
import { slugify } from '@/lib/cms/record-title';

export function CategoriesManager() {
  const { websites, websiteId: activeWebsiteId, selectWebsite } = useCmsWebsite();
  const [records, setRecords] = React.useState<CmsRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  const [isAdding, setIsAdding] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  
  const [formData, setFormData] = React.useState({ name: '', slug: '', description: '' });

  React.useEffect(() => {
    if (!activeWebsiteId) return;
    loadData();
  }, [activeWebsiteId]);

  const loadData = async () => {
    if (!activeWebsiteId) return;
    setLoading(true);
    try {
      await cmsApi.bootstrap(activeWebsiteId).catch(() => {});
      
      let dedicatedCategories: CmsRecord[] = [];
      try {
        const dedicated = await cmsCategoriesApi.list(activeWebsiteId);
        const list = Array.isArray(dedicated) ? dedicated : (dedicated as any)?.data || [];
        dedicatedCategories = list.map((c: CmsCategory, idx: number) => ({
          id: c.id,
          collectionId: 'categories',
          slug: c.slug,
          status: 'PUBLISHED',
          sortOrder: c.sortOrder ?? idx,
          data: {
            name: c.name,
            slug: c.slug,
            description: c.description || '',
            parentId: c.parentId || null,
          },
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        }));
      } catch (err) {
        console.warn('Dedicated categories API unavailable, using collections', err);
      }

      const legacy = await cmsApi.listRecords(activeWebsiteId, 'categories').catch(() => ({ data: [] }));
      const legacyCategories: CmsRecord[] = Array.isArray(legacy) ? legacy : legacy.data || [];

      const seen = new Set<string>();
      const merged: CmsRecord[] = [];
      for (const c of dedicatedCategories) {
        seen.add(c.id);
        if (c.slug) seen.add(c.slug);
        merged.push(c);
      }
      for (const c of legacyCategories) {
        if (!seen.has(c.id) && (!c.slug || !seen.has(c.slug))) {
          merged.push(c);
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

  const handleEdit = (record: CmsRecord) => {
    setEditingId(record.id);
    setFormData({
      name: String(record.data.name || ''),
      slug: String(record.data.slug || ''),
      description: String(record.data.description || '')
    });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', slug: '', description: '' });
  };

  const handleSave = async () => {
    if (!activeWebsiteId || !formData.name) return;
    const finalSlug = formData.slug || slugify(formData.name);
    const dataToSave = { ...formData, slug: finalSlug };
    
    try {
      if (editingId) {
        await cmsCategoriesApi.update(activeWebsiteId, editingId, {
          name: formData.name,
          slug: dataToSave.slug,
          description: formData.description,
        }).catch(() => {});
        await cmsApi.updateRecord(activeWebsiteId, 'categories', editingId, {
          data: { name: formData.name, description: formData.description },
          slug: dataToSave.slug,
        }).catch(() => {});
      } else {
        await cmsCategoriesApi.create(activeWebsiteId, {
          name: formData.name,
          slug: dataToSave.slug,
          description: formData.description,
        }).catch(() => {});
        await cmsApi.createRecord(activeWebsiteId, 'categories', { data: dataToSave }).catch(() => {});
      }
      handleCancel();
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (recordId: string) => {
    if (!activeWebsiteId) return;
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await cmsCategoriesApi.delete(activeWebsiteId, recordId).catch(() => {});
      await cmsApi.deleteRecord(activeWebsiteId, 'categories', recordId).catch(() => {});
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Organize your content into broad topics.</p>
        </div>
        <Button onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: '', slug: '', description: '' }); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold w-1/4">Name</th>
              <th className="px-6 py-4 font-semibold w-1/4">Slug</th>
              <th className="px-6 py-4 font-semibold w-1/3">Description</th>
              <th className="px-6 py-4 font-semibold w-24 text-center">Posts</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isAdding && (
              <tr className="bg-primary/5">
                <td className="px-6 py-4">
                  <input type="text" autoFocus placeholder="Category Name" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} className="w-full h-8 px-2 text-sm bg-background border border-border rounded focus:outline-none focus:border-primary" />
                </td>
                <td className="px-6 py-4">
                  <input type="text" placeholder="category-slug" value={formData.slug} onChange={e => setFormData(f => ({ ...f, slug: e.target.value }))} className="w-full h-8 px-2 text-sm bg-background border border-border rounded focus:outline-none focus:border-primary" />
                </td>
                <td className="px-6 py-4">
                  <input type="text" placeholder="Description (optional)" value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} className="w-full h-8 px-2 text-sm bg-background border border-border rounded focus:outline-none focus:border-primary" />
                </td>
                <td className="px-6 py-4 text-center text-muted-foreground">-</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCancel}><X className="w-4 h-4" /></Button>
                    <Button size="sm" onClick={handleSave} disabled={!formData.name}><Save className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            )}
            
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading categories...</td></tr>
            ) : records.length === 0 && !isAdding ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <Tag className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No categories defined.</p>
                </td>
              </tr>
            ) : (
              records.map(r => editingId === r.id ? (
                <tr key={r.id} className="bg-primary/5">
                  <td className="px-6 py-4">
                    <input type="text" autoFocus value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} className="w-full h-8 px-2 text-sm bg-background border border-border rounded focus:outline-none focus:border-primary" />
                  </td>
                  <td className="px-6 py-4">
                    <input type="text" value={formData.slug} onChange={e => setFormData(f => ({ ...f, slug: e.target.value }))} className="w-full h-8 px-2 text-sm bg-background border border-border rounded focus:outline-none focus:border-primary" />
                  </td>
                  <td className="px-6 py-4">
                    <input type="text" value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} className="w-full h-8 px-2 text-sm bg-background border border-border rounded focus:outline-none focus:border-primary" />
                  </td>
                  <td className="px-6 py-4 text-center text-muted-foreground">0</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={handleCancel}><X className="w-4 h-4" /></Button>
                      <Button size="sm" onClick={handleSave} disabled={!formData.name}><Save className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{String(r.data.name || 'Unnamed')}</td>
                  <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{String(r.data.slug || r.slug || '-')}</td>
                  <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]">{String(r.data.description || '-')}</td>
                  <td className="px-6 py-4 text-center text-muted-foreground">0</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-100 [&:hover]:opacity-100 tr-hover-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(r)}><Edit2 className="w-3.5 h-3.5 text-muted-foreground" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10" onClick={() => handleDelete(r.id)}><Trash2 className="w-3.5 h-3.5 text-destructive/70" /></Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
