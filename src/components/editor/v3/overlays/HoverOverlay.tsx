'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { useTrackedRect } from './useTrackedRect';

export function HoverOverlay() {
  const hoveredNodeId = useV3EditorStore((s) => s.hoveredNodeId);
  const selectedNodeId = useV3EditorStore((s) => s.selectedNodeId);
  const previewMode = useV3EditorStore((s) => s.previewMode);
  const findNode = useV3EditorStore((s) => s.findNode);
  const enabled = Boolean(hoveredNodeId && !previewMode && hoveredNodeId !== selectedNodeId);
  const rect = useTrackedRect(enabled ? hoveredNodeId : null, enabled);

  if (!enabled || !hoveredNodeId || !rect) return null;

  const node = findNode(hoveredNodeId);
  if (!node || node.type === 'page-root') return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: rect.top,
        left: rect.left,
        width: Math.max(rect.width, 4),
        height: Math.max(rect.height, 4),
        pointerEvents: 'none',
        zIndex: 35,
      }}
      className="border border-indigo-400/50 rounded-sm"
    >
      <div className="absolute -top-5 left-0 px-1.5 h-4 rounded-t bg-slate-800/90 text-indigo-200 font-medium text-[9px] uppercase tracking-wide">
        {node.name || node.type}
      </div>
    </div>
  );
}
