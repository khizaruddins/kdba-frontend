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
  Image as ImageIcon,
  Settings,
} from 'lucide-react';
import { TEXT_EDITABLE_TYPES } from '@/lib/editor/nesting';
import { useTrackedRect } from './useTrackedRect';

export function SelectionOverlay() {
  const selectedNodeId = useV3EditorStore((s) => s.selectedNodeId);
  const previewMode = useV3EditorStore((s) => s.previewMode);
  const document = useV3EditorStore((s) => s.document);
  const getSelectedNode = useV3EditorStore((s) => s.getSelectedNode);
  const findParent = useV3EditorStore((s) => s.findParent);
  const duplicateNode = useV3EditorStore((s) => s.duplicateNode);
  const removeNode = useV3EditorStore((s) => s.removeNode);
  const moveNode = useV3EditorStore((s) => s.moveNode);
  const setActiveNavTab = useV3EditorStore((s) => s.setActiveNavTab);
  const focusInspectorSection = useV3EditorStore((s) => s.focusInspectorSection);
  const setInlineEditingNodeId = useV3EditorStore((s) => s.setInlineEditingNodeId);
  const inlineEditingNodeId = useV3EditorStore((s) => s.inlineEditingNodeId);
  const selectedNode = getSelectedNode();
  const rect = useTrackedRect(
    selectedNodeId,
    Boolean(selectedNodeId && document && !previewMode && selectedNode && selectedNode.type !== 'page-root'),
  );

  if (previewMode || !selectedNodeId || !selectedNode || !rect || selectedNode.type === 'page-root') {
    return null;
  }
  if (inlineEditingNodeId === selectedNodeId) return null;

  const parentInfo = findParent(selectedNodeId);

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
      className="border border-indigo-500/90 rounded-sm"
    >
      <div
        style={{ pointerEvents: 'auto' }}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('kdba/node-id', selectedNodeId);
          e.dataTransfer.setData('kdba/node-type', selectedNode.type);
          useV3EditorStore.getState().setDragState(true, selectedNode.type, selectedNodeId);
        }}
        onDragEnd={() => useV3EditorStore.getState().setDragState(false)}
        className="absolute -top-6 left-0 flex items-center gap-1 px-1.5 h-5 rounded-t bg-indigo-600 text-white font-semibold text-[10px] tracking-wide max-w-[220px] cursor-grab"
      >
        <span className="truncate">{selectedNode.name || selectedNode.type}</span>
      </div>

      <div
        style={{ pointerEvents: 'auto' }}
        className="absolute -top-7 right-0 flex items-center gap-0.5 p-0.5 rounded-md bg-slate-950/95 border border-slate-800 shadow-xl text-slate-300"
      >
        {TEXT_EDITABLE_TYPES.includes(selectedNode.type) && (
          <button
            type="button"
            onClick={() => setInlineEditingNodeId(selectedNode.id)}
            className="flex items-center gap-1 px-1.5 h-6 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-medium"
            title="Edit text"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        )}

        {selectedNode.type === 'image' && (
          <button
            type="button"
            onClick={() => {
              setActiveNavTab(null);
              focusInspectorSection('content');
            }}
            className="flex items-center gap-1 px-1.5 h-6 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-medium"
            title="Replace image in inspector"
          >
            <ImageIcon className="w-3 h-3" />
            <span>Replace</span>
          </button>
        )}

        {selectedNode.type === 'section' && (
          <button
            type="button"
            onClick={() => {
              setActiveNavTab(null);
              focusInspectorSection('layout');
            }}
            className="flex items-center gap-1 px-1.5 h-6 rounded hover:bg-slate-800 hover:text-white text-[10px] font-medium"
            title="Section settings"
          >
            <Settings className="w-3 h-3" />
            <span>Settings</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveNavTab('add')}
          title="Add element"
          className="p-1 rounded hover:bg-slate-800 hover:text-white"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => duplicateNode(selectedNodeId)}
          title="Duplicate"
          className="p-1 rounded hover:bg-slate-800 hover:text-white"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        {parentInfo && parentInfo.index > 0 && (
          <button
            type="button"
            onClick={() => moveNode(selectedNodeId, parentInfo.parent.id, parentInfo.index - 1)}
            title="Move up"
            className="p-1 rounded hover:bg-slate-800 hover:text-white"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        )}
        {parentInfo && parentInfo.parent.children && parentInfo.index < parentInfo.parent.children.length - 1 && (
          <button
            type="button"
            onClick={() => moveNode(selectedNodeId, parentInfo.parent.id, parentInfo.index + 1)}
            title="Move down"
            className="p-1 rounded hover:bg-slate-800 hover:text-white"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => removeNode(selectedNodeId)}
          title="Delete"
          className="p-1 rounded hover:bg-rose-900/60 hover:text-rose-300"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
