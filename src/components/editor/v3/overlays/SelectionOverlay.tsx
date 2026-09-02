'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import {
  Plus,
  Copy,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit3,
  Sparkles,
} from 'lucide-react';

export function SelectionOverlay() {
  const {
    selectedNodeId,
    getSelectedNode,
    findParent,
    duplicateNode,
    removeNode,
    moveNode,
    setActiveNavTab,
    setInlineEditingNodeId,
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

  const parentInfo = findParent(selectedNodeId);

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!parentInfo || parentInfo.index <= 0) return;
    moveNode(selectedNodeId, parentInfo.parent.id, parentInfo.index - 1);
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!parentInfo || !parentInfo.parent.children) return;
    if (parentInfo.index >= parentInfo.parent.children.length - 1) return;
    moveNode(selectedNodeId, parentInfo.parent.id, parentInfo.index + 1);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateNode(selectedNodeId);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeNode(selectedNodeId);
  };

  const handleOpenAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveNavTab('add');
  };

  // Convert client rect to canvas relative coordinates
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
      className="border-2 border-indigo-500 rounded transition-all select-none"
    >
      {/* Node Tag Pill on Top-Left */}
      <div
        style={{ pointerEvents: 'auto' }}
        className="absolute -top-7 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded-t-md bg-indigo-600 text-white font-bold text-[10px] tracking-wide uppercase shadow-md"
      >
        <span>{selectedNode.name || selectedNode.type}</span>
      </div>

      {/* Floating Context Toolbar directly above */}
      <div
        style={{ pointerEvents: 'auto' }}
        className="absolute -top-10 right-0 flex items-center gap-0.5 p-0.5 rounded-lg bg-slate-950 border border-slate-800 shadow-xl shadow-black/80 text-slate-300"
      >
        {['heading', 'paragraph', 'text', 'button', 'badge', 'quote'].includes(selectedNode.type) && (
          <button
            type="button"
            onClick={() => setInlineEditingNodeId(selectedNode.id)}
            className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[10px] shadow transition-colors"
            title="Edit text inline"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        )}

        {selectedNode.type === 'image' && (
          <button
            type="button"
            onClick={() => {
              const urlInput = window.document.querySelector('input[placeholder*="https://"]') as HTMLInputElement;
              if (urlInput) {
                urlInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                urlInput.focus();
              }
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[10px] shadow transition-colors"
            title="Replace image in inspector"
          >
            <Sparkles className="w-3 h-3" />
            <span>Replace</span>
          </button>
        )}

        {selectedNode.type === 'list' && (
          <button
            type="button"
            onClick={() => {
              const listInput = window.document.querySelector('input[placeholder*="Enter list item"]') as HTMLInputElement;
              if (listInput) {
                listInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                listInput.focus();
              }
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[10px] shadow transition-colors"
            title="Edit list items in inspector"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit Items</span>
          </button>
        )}

        {selectedNode.type === 'footer' && (
          <button
            type="button"
            onClick={() => {
              const footerInput = window.document.querySelector('input[placeholder*="Company Name"]') as HTMLInputElement;
              if (footerInput) {
                footerInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                footerInput.focus();
              }
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[10px] shadow transition-colors"
            title="Edit footer and links in inspector"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit Links</span>
          </button>
        )}

        {selectedNode.type === 'navbar' && (
          <button
            type="button"
            onClick={() => {
              const navInput = window.document.querySelector('input[placeholder*="Brand Name"]') as HTMLInputElement;
              if (navInput) {
                navInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                navInput.focus();
              }
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[10px] shadow transition-colors"
            title="Edit navbar and links in inspector"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit Nav</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleOpenAdd}
          title="Add element inside/after"
          className="p-1 rounded hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleDuplicate}
          title="Duplicate element"
          className="p-1 rounded hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {parentInfo && parentInfo.index > 0 && (
          <button
            type="button"
            onClick={handleMoveUp}
            title="Move Up"
            className="p-1 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        )}

        {parentInfo && parentInfo.parent.children && parentInfo.index < parentInfo.parent.children.length - 1 && (
          <button
            type="button"
            onClick={handleMoveDown}
            title="Move Down"
            className="p-1 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={handleDelete}
          title="Delete element"
          className="p-1 rounded hover:bg-rose-900/60 hover:text-rose-300 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Corner Resize Handles */}
      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-indigo-600 shadow" />
      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border-2 border-indigo-600 shadow" />
      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-indigo-600 shadow" />
      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border-2 border-indigo-600 shadow" />
    </div>
  );
}
