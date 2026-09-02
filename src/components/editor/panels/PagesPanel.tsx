'use client';

import * as React from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { Plus, Trash2, FileText, Globe, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

export function PagesPanel() {
  const { website, activePageId, setActivePageId, addPage, deletePage, updatePage } =
    useEditorStore();

  const [isAddPageOpen, setIsAddPageOpen] = React.useState(false);
  const [newPageTitle, setNewPageTitle] = React.useState('');
  const [newPageSlug, setNewPageSlug] = React.useState('');
  const [editingPageId, setEditingPageId] = React.useState<string | null>(null);

  if (!website) return null;
  const pages = Array.isArray(website.pages) ? website.pages : [];

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle) return;

    const formattedSlug = newPageSlug.startsWith('/')
      ? newPageSlug
      : `/${newPageSlug || newPageTitle.toLowerCase().replace(/\s+/g, '-')}`;

    addPage({
      title: newPageTitle,
      slug: formattedSlug,
    });

    setNewPageTitle('');
    setNewPageSlug('');
    setIsAddPageOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Website Pages
          </h3>
          <p className="text-[11px] text-slate-500">
            Manage page routes and structure
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsAddPageOpen(true)}
          leftIcon={<Plus className="h-3 w-3" />}
          className="text-xs h-7 px-2.5"
        >
          Add Page
        </Button>
      </div>

      <div className="space-y-2">
        {pages.map((page: any) => {
          const isActive = page.id === activePageId;
          const isEditing = editingPageId === page.id;

          return (
            <div
              key={page.id}
              className={`rounded-xl border p-3 transition-all ${
                isActive
                  ? 'border-indigo-500/80 bg-indigo-500/10 shadow-sm'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActivePageId(page.id)}
                  className="flex items-center gap-2.5 text-left flex-1 cursor-pointer"
                >
                  <FileText
                    className={`h-4 w-4 ${
                      isActive ? 'text-indigo-400' : 'text-slate-500'
                    }`}
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {page.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {page.slug}
                    </span>
                  </div>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingPageId(isEditing ? null : page.id)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 text-[11px] font-semibold"
                  >
                    {isEditing ? 'Done' : 'Edit'}
                  </button>

                  {pages.length > 1 && page.slug !== '/' && (
                    <button
                      type="button"
                      onClick={() => deletePage(page.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                      title="Delete Page"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Page Settings */}
              {isEditing && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-3">
                  <Input
                    label="Page Title"
                    value={page.title}
                    onChange={(e) => updatePage(page.id, { title: e.target.value })}
                  />
                  <Input
                    label="Route Slug"
                    value={page.slug}
                    onChange={(e) => updatePage(page.id, { slug: e.target.value })}
                    disabled={page.slug === '/'}
                  />
                  <Input
                    label="Page SEO Title"
                    value={page.seoTitle || ''}
                    onChange={(e) => updatePage(page.id, { seoTitle: e.target.value })}
                    placeholder="Custom page title for search engines"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Page Modal */}
      <Dialog
        isOpen={isAddPageOpen}
        onClose={() => setIsAddPageOpen(false)}
        title="Add New Page"
        description="Create a new supported page for your website."
      >
        <form onSubmit={handleCreatePage} className="space-y-4 pt-2">
          <Input
            label="Page Title"
            required
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
            placeholder="e.g. Services, About, Portfolio"
          />

          <Input
            label="Route URL Slug"
            value={newPageSlug}
            onChange={(e) => setNewPageSlug(e.target.value)}
            placeholder="e.g. /services"
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddPageOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Page
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
