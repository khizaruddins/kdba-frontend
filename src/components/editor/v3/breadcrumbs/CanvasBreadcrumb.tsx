'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { ChevronRight, Home, Layers } from 'lucide-react';

export function CanvasBreadcrumb() {
  const {
    selectedNodeId,
    getNodePath,
    setSelectedNodeId,
    getActivePage,
    document,
  } = useV3EditorStore();

  const activePage = getActivePage();
  const path = selectedNodeId ? getNodePath(selectedNodeId) : [];

  if (!document || !activePage) return null;

  return (
    <div className="w-full flex items-center justify-between px-4 py-1.5 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 text-[11px] text-slate-400 select-none z-10">
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {/* Page / Home Root */}
        <button
          type="button"
          onClick={() => {
            if (activePage.root) {
              setSelectedNodeId(activePage.root.id);
            }
          }}
          className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
            !selectedNodeId || selectedNodeId === activePage.root?.id
              ? 'bg-indigo-600/30 text-indigo-300 font-semibold'
              : 'hover:bg-slate-900 hover:text-slate-200'
          }`}
          title={`Page: ${activePage.title}`}
        >
          <Home className="w-3 h-3 text-indigo-400" />
          <span>{activePage.title || 'Page'}</span>
        </button>

        {/* Node Ancestor Hierarchy */}
        {path.map((item, idx) => {
          if (item.type === 'page-root') return null; // Already rendered as Home
          const isSelected = item.id === selectedNodeId;
          const displayName = item.label || item.name || item.type;

          return (
            <React.Fragment key={item.id}>
              <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
              <button
                type="button"
                onClick={() => setSelectedNodeId(item.id)}
                className={`truncate max-w-[130px] px-2 py-0.5 rounded font-medium transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'hover:bg-slate-900 hover:text-slate-200 text-slate-400'
                }`}
                title={displayName}
              >
                {displayName}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-slate-500 text-[10px] hidden sm:flex shrink-0 pl-2">
        <Layers className="w-3 h-3 text-slate-600" />
        <span>Click parent to inspect container</span>
      </div>
    </div>
  );
}
