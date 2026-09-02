'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { Plus, X, FileText, Trash2 } from 'lucide-react';

export function PagesPanel() {
  const { document, activePageId, setActivePageId, setActiveNavTab, addPage, removePage } =
    useV3EditorStore();

  const [newPageTitle, setNewPageTitle] = React.useState('');
  const [newPageSlug, setNewPageSlug] = React.useState('');
  const [isAdding, setIsAdding] = React.useState(false);

  if (!document) return null;

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;
    const slug = newPageSlug.trim() || newPageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addPage(newPageTitle.trim(), slug);
    setNewPageTitle('');
    setNewPageSlug('');
    setIsAdding(false);
  };

  return (
    <div className="w-80 shrink-0 border-r border-slate-800/80 bg-slate-950/95 flex flex-col h-full overflow-hidden select-none z-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-sm text-white tracking-tight">Pages</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Add Page"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveNavTab(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Page Form */}
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
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              Create Page
            </button>
          </div>
        </form>
      )}

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {document.pages.map((page) => {
          const isActive = activePageId === page.id;
          return (
            <div
              key={page.id}
              onClick={() => setActivePageId(page.id)}
              className={`group flex items-center justify-between h-9 px-3 rounded-xl cursor-pointer transition-colors text-xs ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <FileText className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{page.title}</span>
                <span className={`text-[10px] font-mono ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {page.slug}
                </span>
              </div>

              {/* Actions */}
              {document.pages.length > 1 && (
                <button
                  type="button"
                  title="Delete page"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePage(page.id);
                  }}
                  className={`p-1 opacity-0 group-hover:opacity-100 hover:text-rose-400 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
