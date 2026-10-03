'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { useTrackedRect } from './useTrackedRect';
import { ContextualToolbar } from '../toolbars/ContextualToolbar';
import { InlineFormatToolbar } from '../toolbars/InlineFormatToolbar';

export function SelectionOverlay() {
  const selectedNodeId = useV3EditorStore((s) => s.selectedNodeId);
  const previewMode = useV3EditorStore((s) => s.previewMode);
  const document = useV3EditorStore((s) => s.document);
  const getSelectedNode = useV3EditorStore((s) => s.getSelectedNode);
  const inlineEditingNodeId = useV3EditorStore((s) => s.inlineEditingNodeId);
  const setInlineEditingNodeId = useV3EditorStore((s) => s.setInlineEditingNodeId);
  const updateStyles = useV3EditorStore((s) => s.updateStyles);

  const selectedNode = getSelectedNode();
  const rect = useTrackedRect(
    selectedNodeId,
    Boolean(selectedNodeId && document && !previewMode && selectedNode && selectedNode.type !== 'page-root'),
  );

  if (previewMode || !selectedNodeId || !selectedNode || !rect || selectedNode.type === 'page-root') {
    return null;
  }

  // When inline text editing is active on this node, render the floating formatting toolbar
  if (inlineEditingNodeId === selectedNodeId) {
    const isCloseToTop = rect.top < 65;
    return (
      <div
        data-editor-chrome
        style={{
          position: 'fixed',
          top: rect.top,
          left: rect.left,
          width: Math.max(rect.width, 8),
          height: Math.max(rect.height, 8),
          pointerEvents: 'none',
          zIndex: 45,
        }}
        className="ring-2 ring-primary/80 rounded-sm"
      >
        <div
          style={{ pointerEvents: 'auto' }}
          className={`absolute ${isCloseToTop ? 'top-full mt-2' : '-top-11'} left-0 flex items-center z-50 whitespace-nowrap`}
        >
          <InlineFormatToolbar
            onCommit={() => setInlineEditingNodeId(null)}
            onColorChange={(color) => updateStyles(selectedNode.id, { typography: { color } })}
          />
        </div>
      </div>
    );
  }

  const isCloseToTop = rect.top < 65;

  return (
    <div
      data-editor-chrome
      style={{
        position: 'fixed',
        top: rect.top,
        left: rect.left,
        width: Math.max(rect.width, 8),
        height: Math.max(rect.height, 8),
        pointerEvents: 'none',
        zIndex: 40,
      }}
      className="border-2 border-primary/90 rounded-sm shadow-[0_0_12px_rgba(99,102,241,0.25)]"
    >
      {/* Node Drag Handle / Label Tab */}
      <div
        style={{ pointerEvents: 'auto' }}
        draggable={!selectedNode.locked}
        onDragStart={(e) => {
          if (selectedNode.locked) {
            e.preventDefault();
            return;
          }
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('kdba/node-id', selectedNodeId);
          e.dataTransfer.setData('kdba/node-type', selectedNode.type);
          useV3EditorStore.getState().setDragState(true, selectedNode.type, selectedNodeId);
        }}
        onDragEnd={() => useV3EditorStore.getState().setDragState(false)}
        className="absolute -top-5 left-0 flex items-center gap-1 px-1.5 h-4.5 rounded-t bg-primary text-primary-foreground font-bold text-[9px] uppercase tracking-wider max-w-[200px] cursor-grab select-none shadow"
      >
        <span className="truncate">{selectedNode.label || selectedNode.name || selectedNode.type}</span>
      </div>

      {/* Primary Contextual Toolbar Attached to Element */}
      <div
        style={{ pointerEvents: 'auto' }}
        className={`absolute ${isCloseToTop ? 'top-full mt-2' : '-top-12'} left-0 flex items-center z-50 whitespace-nowrap`}
      >
        <ContextualToolbar node={selectedNode} />
      </div>
    </div>
  );
}
