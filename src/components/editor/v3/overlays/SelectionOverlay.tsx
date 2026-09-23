'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { Lock } from 'lucide-react';
import { ContextualToolbar } from '../toolbars/ContextualToolbar';

export function SelectionOverlay() {
  const {
    selectedNodeId,
    getSelectedNode,
  } = useV3EditorStore();

  const [rect, setRect] = React.useState<DOMRect | null>(null);

  const selectedNode = getSelectedNode();

  // Continuously sync selection bounding box to DOM element
  React.useEffect(() => {
    const updateRect = () => {
      if (!selectedNodeId) {
        setRect(null);
        return;
      }
      const el = window.document.querySelector(`[data-node-id="${selectedNodeId}"]`);
      if (el) {
        setRect(el.getBoundingClientRect());
      } else {
        setRect(null);
      }
    };

    updateRect();
    window.addEventListener('scroll', updateRect, true);
    window.addEventListener('resize', updateRect);

    const interval = setInterval(updateRect, 100);
    return () => {
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
      clearInterval(interval);
    };
  }, [selectedNodeId]);

  if (!selectedNodeId || !selectedNode || !rect) return null;

  // Don't show toolbar for page-root
  if (selectedNode.type === 'page-root') return null;

  const isLocked = Boolean(selectedNode.locked);
  const displayName = selectedNode.label || selectedNode.name || selectedNode.type;

  // Position toolbar: above selection by default, below if too close to top
  const isCloseToTop = rect.top < 60;

  return (
    <div
      style={{
        position: 'fixed',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        pointerEvents: 'none',
        zIndex: 40,
      }}
      className={`border-2 rounded transition-all select-none ${
        isLocked
          ? 'border-amber-500/80 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
          : 'border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
      }`}
    >
      {/* Node Tag Pill */}
      <div
        style={{ pointerEvents: 'auto' }}
        className={`absolute -top-6 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded-t-md text-white font-bold text-[10px] tracking-wide uppercase shadow-md ${
          isLocked ? 'bg-amber-600' : 'bg-indigo-600'
        }`}
      >
        <span>{displayName}</span>
        {isLocked && <Lock className="w-2.5 h-2.5 text-amber-200" />}
      </div>

      {/* Floating Context Toolbar */}
      <div
        style={{ pointerEvents: 'auto' }}
        className={`absolute ${
          isCloseToTop ? '-bottom-12 left-0' : '-top-11 right-0'
        } flex items-center z-50`}
      >
        <ContextualToolbar node={selectedNode} />
      </div>

      {/* 4 Corner Resize Handles */}
      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-indigo-600 shadow" />
      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border-2 border-indigo-600 shadow" />
      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-indigo-600 shadow" />
      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border-2 border-indigo-600 shadow" />
    </div>
  );
}
