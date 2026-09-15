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
    <div className="flex h-full w-full min-w-0 shrink-0 flex-col overflow-hidden border-r border-border bg-card z-20">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm text-foreground tracking-tight">Assets</h3>
        </div>
        <button
          type="button"
          onClick={() => setActiveNavTab(null)}
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label="Close assets panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <p className="text-muted-foreground">Insert an image from a URL onto the canvas.</p>
        <label className="text-[11px] font-medium text-muted-foreground" htmlFor="asset-url">
          Image URL
        </label>
        <div className="flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            id="asset-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 h-8 px-2.5 rounded-lg bg-muted/50 border border-border text-foreground focus:outline-none focus:border-ring"
          />
        </div>
        <button
          type="button"
          onClick={handleInsertImage}
          className="w-full h-8 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Insert {COMPONENT_MANIFEST.image.name}
        </button>
      </div>
    </div>
  );
}
