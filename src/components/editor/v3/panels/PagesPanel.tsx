'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import {
  Plus,
  X,
  FileText,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Home,
  ChevronUp,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';

export function PagesPanel() {
  const document = useV3EditorStore((s) => s.document);
  const activePageId = useV3EditorStore((s) => s.activePageId);
  const websiteId = useV3EditorStore((s) => s.websiteId);
  const setActivePageId = useV3EditorStore((s) => s.setActivePageId);
  const setActiveNavTab = useV3EditorStore((s) => s.setActiveNavTab);
  const addPage = useV3EditorStore((s) => s.addPage);
  const removePage = useV3EditorStore((s) => s.removePage);
  const updatePage = useV3EditorStore((s) => s.updatePage);
  const duplicatePage = useV3EditorStore((s) => s.duplicatePage);
  const setHomePage = useV3EditorStore((s) => s.setHomePage);
  const reorderPages = useV3EditorStore((s) => s.reorderPages);
  const setPreviewMode = useV3EditorStore((s) => s.setPreviewMode);

  const [newPageTitle, setNewPageTitle] = React.useState('');
  const [newPageSlug, setNewPageSlug] = React.useState('');
  const [isAdding, setIsAdding] = React.useState(false);
  const [renamingId, setRenamingId] = React.useState<string | null>(null);

  if (!document) return null;

  const pages = [...document.pages].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const liveSlug = document.settings?.subdomain || document.site?.id || websiteId;

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;
    const slug = newPageSlug.trim() || newPageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addPage(newPageTitle.trim(), slug);
    setNewPageTitle('');
    setNewPageSlug('');
    setIsAdding(false);
  };

  const movePage = (index: number, direction: -1 | 1) => {
    const next = [...pages];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    reorderPages(next.map((page) => page.id));
  };

  return (
    <div className="w-80 shrink-0 border-r border-slate-800/80 bg-slate-950/95 flex flex-col h-full overflow-hidden select-none z-20">
      <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-sm text-white tracking-tight">Pages</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Add Page"
            aria-label="Add page"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveNavTab(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close pages panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleCreatePage} className="p-3 bg-slate-900 border-b border-slate-800 space-y-2">
          <input
            type="text"
            placeholder="Page Title (e.g. Services)"
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
            className="w-full h-8 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            autoFocus
          />
          <input
            type="text"
            placeholder="Slug (e.g. /services)"
            value={newPageSlug}
            onChange={(e) => setNewPageSlug(e.target.value)}
            className="w-full h-8 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex gap-2 justify-end pt-1">
            <button type="button" onClick={() => setIsAdding(false)} className="px-2.5 py-1 text-xs text-slate-400 hover:text-white">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-500 text-white">
              Create Page
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {pages.map((page, index) => {
          const isActive = activePageId === page.id;
          const isHome = page.type === 'home';
          return (
            <div
              key={page.id}
              className={`group rounded-xl border px-2 py-1.5 ${
                isActive ? 'bg-indigo-600/20 border-indigo-500/40' : 'border-transparent hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActivePageId(page.id)}
                  className="flex-1 min-w-0 text-left"
                >
                  {renamingId === page.id ? (
                    <input
                      autoFocus
                      defaultValue={page.title}
                      onClick={(e) => e.stopPropagation()}
                      onBlur={(e) => {
                        const title = e.target.value.trim();
                        if (title) updatePage(page.id, { title });
                        setRenamingId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                      }}
                      className="w-full h-6 px-1 rounded bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5 truncate text-xs text-slate-200">
                      {isHome && <Home className="w-3 h-3 text-amber-300 shrink-0" />}
                      <span className="truncate font-medium">{page.title}</span>
                      <span className="text-[10px] font-mono text-slate-500">{page.slug}</span>
                    </div>
                  )}
                </button>
                {page.enabled === false && <EyeOff className="w-3 h-3 text-slate-500" />}
              </div>
              <div className="flex items-center gap-0.5 mt-1 opacity-0 group-hover:opacity-100">
                <button type="button" title="Rename" onClick={() => setRenamingId(page.id)} className="p-1 text-slate-400 hover:text-white text-[10px]">
                  Rename
                </button>
                <button type="button" title="Duplicate page" aria-label="Duplicate page" onClick={() => duplicatePage(page.id)} className="p-1 text-slate-400 hover:text-white">
                  <Copy className="w-3 h-3" />
                </button>
                <button type="button" title="Set homepage" aria-label="Set homepage" onClick={() => setHomePage(page.id)} className="p-1 text-slate-400 hover:text-amber-300">
                  <Home className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  title={page.enabled === false ? 'Show page' : 'Hide page'}
                  aria-label={page.enabled === false ? 'Show page' : 'Hide page'}
                  onClick={() => updatePage(page.id, { enabled: page.enabled === false })}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  {page.enabled === false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
                <button type="button" title="Move up" aria-label="Move page up" onClick={() => movePage(index, -1)} className="p-1 text-slate-400 hover:text-white">
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button type="button" title="Move down" aria-label="Move page down" onClick={() => movePage(index, 1)} className="p-1 text-slate-400 hover:text-white">
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  title="Preview page"
                  aria-label="Preview page"
                  onClick={() => {
                    setActivePageId(page.id);
                    setPreviewMode(true);
                  }}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <Eye className="w-3 h-3" />
                </button>
                <a
                  href={`/site/${liveSlug}${page.slug === '/' ? '' : page.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Open published page"
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
                {pages.length > 1 && (
                  <button
                    type="button"
                    title="Delete page"
                    aria-label="Delete page"
                    onClick={() => removePage(page.id)}
                    className="p-1 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
