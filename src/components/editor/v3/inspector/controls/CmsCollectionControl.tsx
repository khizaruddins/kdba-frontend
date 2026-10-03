'use client';

import * as React from 'react';
import { CmsCollection } from '@/types/cms';

interface CmsCollectionControlProps {
  props: Record<string, unknown>;
  onChangeProps: (next: Record<string, unknown>) => void;
  collections: CmsCollection[];
}

export function CmsCollectionControl({
  props,
  onChangeProps,
  collections,
}: CmsCollectionControlProps) {
  const collectionSlug = String(props.collectionSlug || 'blog-posts');
  const limit = Number(props.limit) || 6;
  const columns = Number(props.columns) || 3;
  const presentation = String(props.presentation || 'grid');
  const orderBy = String(props.orderBy || 'newest');

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-muted-foreground">Collection</label>
        <select
          value={collectionSlug}
          onChange={(e) => onChangeProps({ ...props, collectionSlug: e.target.value })}
          className="w-full h-8 px-2 rounded bg-muted/50 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
        >
          {collections.map((col) => (
            <option key={col.slug} value={col.slug}>
              {col.name}
            </option>
          ))}
          {!collections.find((c) => c.slug === collectionSlug) && (
            <option value={collectionSlug}>{collectionSlug} (Missing)</option>
          )}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-muted-foreground">Presentation</label>
        <div className="flex bg-muted/50 rounded p-0.5 border border-border">
          {['grid', 'list', 'featured'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChangeProps({ ...props, presentation: p })}
              className={`flex-1 text-xs py-1 rounded transition-colors ${
                presentation === p
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {presentation !== 'list' && (
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-muted-foreground">Columns</label>
          <div className="flex bg-muted/50 rounded p-0.5 border border-border">
            {[1, 2, 3, 4].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onChangeProps({ ...props, columns: c })}
                className={`flex-1 text-xs py-1 rounded transition-colors ${
                  columns === c
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-muted-foreground">Items to show</label>
        <div className="flex bg-muted/50 rounded p-0.5 border border-border mb-2">
          {[3, 6, 9, 12].map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => onChangeProps({ ...props, limit: l })}
              className={`flex-1 text-xs py-1 rounded transition-colors ${
                limit === l
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <input
          type="number"
          min={1}
          max={100}
          value={limit}
          onChange={(e) => onChangeProps({ ...props, limit: parseInt(e.target.value) || 1 })}
          className="w-full h-8 px-2 rounded bg-muted/50 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-muted-foreground">Order by</label>
        <select
          value={orderBy}
          onChange={(e) => onChangeProps({ ...props, orderBy: e.target.value })}
          className="w-full h-8 px-2 rounded bg-muted/50 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>
    </div>
  );
}
