'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { X, FolderOpen, Image as ImageIcon, Plus } from 'lucide-react';
import { COMPONENT_MANIFEST } from '@/lib/editor/component-manifest';

export function AssetsPanel() {
  const setActiveNavTab = useV3EditorStore((s) => s.setActiveNavTab);
  const insertNodeType = useV3EditorStore((s) => s.insertNodeType);
  const updateProps = useV3EditorStore((s) => s.updateProps);
  const [url, setUrl] = React.useState('');

  const handleInsertImage = () => {
    const created = insertNodeType('image');
    if (created && url.trim()) {
      updateProps(created.id, { src: url.trim(), url: url.trim() });
    }
  };

  return (
    <div className="w-80 shrink-0 border-r border-slate-800/80 bg-slate-950/95 flex flex-col h-full overflow-hidden z-20">
      <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-sm text-white tracking-tight">Assets</h3>
        </div>
        <button
          type="button"
          onClick={() => setActiveNavTab(null)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Close assets panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <p className="text-slate-400">Insert an image from a URL onto the canvas.</p>
        <label className="text-[11px] font-medium text-slate-400" htmlFor="asset-url">
          Image URL
        </label>
        <div className="flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <input
            id="asset-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          type="button"
          onClick={handleInsertImage}
          className="w-full h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Insert {COMPONENT_MANIFEST.image.name}
        </button>
      </div>
    </div>
  );
}
