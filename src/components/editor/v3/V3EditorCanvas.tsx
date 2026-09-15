'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { V3WebsiteRenderer } from '@/components/renderer/v3/V3WebsiteRenderer';
import { SelectionOverlay } from './overlays/SelectionOverlay';
import { HoverOverlay } from './overlays/HoverOverlay';
import { SectionInsertOverlay } from './overlays/SectionInsertOverlay';
import { COMPONENT_MANIFEST } from '@/lib/editor/component-manifest';
import { NodeType } from '@/types/v3-document';
import { resolveDrop, TEXT_EDITABLE_TYPES } from '@/lib/editor/nesting';
import { findNodeLocation } from '@/lib/document/v3-operations';

const VIEWPORT_WIDTH: Record<string, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 390,
};

export function V3EditorCanvas() {
  const document = useV3EditorStore((s) => s.document);
  const activePageId = useV3EditorStore((s) => s.activePageId);
  const viewport = useV3EditorStore((s) => s.viewport);
  const zoom = useV3EditorStore((s) => s.zoom);
  const previewMode = useV3EditorStore((s) => s.previewMode);
  const inlineEditingNodeId = useV3EditorStore((s) => s.inlineEditingNodeId);

  const setSelectedNodeId = useV3EditorStore((s) => s.setSelectedNodeId);
  const setHoveredNodeId = useV3EditorStore((s) => s.setHoveredNodeId);
  const setInlineEditingNodeId = useV3EditorStore((s) => s.setInlineEditingNodeId);
  const updateProps = useV3EditorStore((s) => s.updateProps);
  const addNode = useV3EditorStore((s) => s.addNode);
  const moveNode = useV3EditorStore((s) => s.moveNode);
  const getActivePage = useV3EditorStore((s) => s.getActivePage);
  const findNode = useV3EditorStore((s) => s.findNode);
  const setDropTarget = useV3EditorStore((s) => s.setDropTarget);
  const setDragState = useV3EditorStore((s) => s.setDragState);

  const canvasRef = React.useRef<HTMLDivElement>(null);
  const [dropIndicator, setDropIndicator] = React.useState<{
    top: number;
    left: number;
    width: number;
    valid: boolean;
    label: string;
  } | null>(null);

  const nodeFromPoint = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return null;
    const el = target.closest('[data-node-id]');
    if (!el) return null;
    return {
      id: el.getAttribute('data-node-id'),
      type: el.getAttribute('data-node-type') as NodeType | null,
      el,
    };
  };

  const handlePointerSelect = (e: React.MouseEvent) => {
    if (previewMode) return;
    if ((e.target as HTMLElement).closest('[data-editor-chrome]')) return;
    const hit = nodeFromPoint(e.target);
    if (!hit?.id) {
      setSelectedNodeId(null);
      return;
    }
    setSelectedNodeId(hit.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (previewMode) return;
    const hit = nodeFromPoint(e.target);
    if (!hit?.id || !hit.type) return;
    if (TEXT_EDITABLE_TYPES.includes(hit.type)) {
      e.preventDefault();
      setSelectedNodeId(hit.id);
      setInlineEditingNodeId(hit.id);
    }
  };

  const handleMouseOver = (e: React.MouseEvent) => {
    if (previewMode) return;
    const hit = nodeFromPoint(e.target);
    setHoveredNodeId(hit?.id ?? null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const page = getActivePage();
    if (!page?.root || !document) return;

    const hit = nodeFromPoint(e.target);
    if (!hit?.id || !hit.el) {
      setDropIndicator(null);
      setDropTarget(null);
      e.dataTransfer.dropEffect = 'none';
      return;
    }

    const rect = hit.el.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const ratio = rect.height > 0 ? offsetY / rect.height : 0.5;
    const position = ratio < 0.25 ? 'before' : ratio > 0.75 ? 'after' : 'inside';

    const draggedType =
      (e.dataTransfer.types.includes('kdba/node-type')
        ? (useV3EditorStore.getState().draggedNodeType as NodeType | null)
        : null) || useV3EditorStore.getState().draggedNodeType;

    const movedId = useV3EditorStore.getState().draggedNodeId;
    const movedNode = movedId ? findNode(movedId) : null;
    const childType = (movedNode?.type || draggedType) as NodeType | null;
    if (!childType) return;
    if (movedNode?.locked) {
      setDropIndicator(null);
      e.dataTransfer.dropEffect = 'none';
      return;
    }

    const loc = findNodeLocation(document, hit.id);
    const root = loc?.root || page.root;
    const sourceLoc = movedId ? findNodeLocation(document, movedId) : null;
    if (sourceLoc && loc && sourceLoc.pageId !== loc.pageId) {
      setDropIndicator({
        top: rect.top + rect.height / 2,
        left: rect.left,
        width: rect.width,
        valid: false,
        label: 'Invalid nest',
      });
      e.dataTransfer.dropEffect = 'none';
      return;
    }

    const resolved = resolveDrop(root, hit.id, childType, position);
    if (!resolved) {
      setDropIndicator(null);
      e.dataTransfer.dropEffect = 'none';
      return;
    }

    e.dataTransfer.dropEffect = resolved.valid ? (movedId ? 'move' : 'copy') : 'none';
    setDropTarget(resolved.valid ? resolved.highlightId : null, resolved.valid ? resolved.position : null);

    const lineTop =
      resolved.position === 'before' ? rect.top : resolved.position === 'after' ? rect.bottom : rect.top + rect.height / 2;

    setDropIndicator({
      top: lineTop,
      left: rect.left,
      width: rect.width,
      valid: resolved.valid,
      label: resolved.valid ? 'DROP HERE' : 'Invalid nest',
    });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDropIndicator(null);
    setDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropIndicator(null);
    setDropTarget(null);
    setDragState(false);

    const nodeType = e.dataTransfer.getData('kdba/node-type') as NodeType;
    const movedNodeId = e.dataTransfer.getData('kdba/node-id');
    if (!nodeType && !movedNodeId) return;

    const page = getActivePage();
    if (!page?.root || !document) return;

    const hit = nodeFromPoint(e.target);
    const targetId = hit?.id || page.root.id;
    const rect = hit?.el?.getBoundingClientRect();
    let position: 'before' | 'after' | 'inside' = 'inside';
    if (rect) {
      const ratio = (e.clientY - rect.top) / (rect.height || 1);
      position = ratio < 0.25 ? 'before' : ratio > 0.75 ? 'after' : 'inside';
    }

    const movedNode = movedNodeId ? findNode(movedNodeId) : null;
    if (movedNode?.locked) return;
    const childType = (movedNode?.type || nodeType) as NodeType;
    const loc = findNodeLocation(document, targetId);
    const root = loc?.root || page.root;
    const sourceLoc = movedNodeId ? findNodeLocation(document, movedNodeId) : null;
    if (sourceLoc && loc && sourceLoc.pageId !== loc.pageId) return;
    const resolved = resolveDrop(root, targetId, childType, position);
    if (!resolved?.valid) return;

    if (movedNodeId) {
      moveNode(movedNodeId, resolved.parentId, resolved.index);
    } else if (nodeType && COMPONENT_MANIFEST[nodeType]) {
      const manifest = COMPONENT_MANIFEST[nodeType];
      const created = addNode(
        resolved.parentId,
        {
          type: nodeType,
          name: manifest.name,
          props: manifest.defaultProps,
          styles: manifest.defaultStyles,
        },
        resolved.index,
      );
      if (created && TEXT_EDITABLE_TYPES.includes(nodeType)) {
        setInlineEditingNodeId(created.id);
      }
    }
  };

  if (!document) return null;

  const viewportStyles = {
    desktop: 'w-full max-w-[1280px] min-h-screen',
    tablet:
      'w-[768px] max-w-[768px] rounded-[28px] border-[8px] border-slate-800 shadow-2xl shadow-black/50 my-8 overflow-hidden flex flex-col',
    mobile:
      'w-[390px] max-w-[390px] rounded-[40px] border-[10px] border-slate-800 shadow-2xl shadow-black/50 my-8 overflow-hidden flex flex-col',
  }[viewport];

  return (
    <div
      ref={canvasRef}
      onClick={handlePointerSelect}
      onDoubleClick={handleDoubleClick}
      onMouseOver={handleMouseOver}
      onMouseLeave={() => setHoveredNodeId(null)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex-1 overflow-auto bg-[#101218] flex justify-center items-start p-6 relative"
    >
      <div
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          width: viewport === 'desktop' ? '100%' : undefined,
          maxWidth: viewport === 'desktop' ? VIEWPORT_WIDTH.desktop : undefined,
        }}
        className={`flex justify-center ${viewportStyles}`}
      >
        {viewport === 'mobile' && !previewMode && (
          <div className="h-7 w-full bg-slate-900 flex items-center justify-center shrink-0" data-editor-chrome>
            <div className="h-3 w-28 rounded-full bg-slate-950" />
          </div>
        )}
        {viewport === 'tablet' && !previewMode && (
          <div className="h-5 w-full bg-slate-900 flex items-center justify-center shrink-0" data-editor-chrome>
            <div className="h-1.5 w-16 rounded-full bg-slate-800" />
          </div>
        )}

        <div data-viewport-mode={viewport} className="w-full flex-1 overflow-visible relative">
          <V3WebsiteRenderer
            document={document}
            activePageId={activePageId}
            isEditing={!previewMode}
            viewport={viewport}
            inlineEditingNodeId={inlineEditingNodeId}
            onCommitProps={(id, props) => updateProps(id, props)}
            onEndInlineEdit={() => setInlineEditingNodeId(null)}
            onStartInlineEdit={(id) => {
              setSelectedNodeId(id);
              setInlineEditingNodeId(id);
            }}
          />
        </div>
      </div>

      {!previewMode && <SelectionOverlay />}
      {!previewMode && <HoverOverlay />}
      {!previewMode && <SectionInsertOverlay />}

      {dropIndicator && !previewMode && (
        <div
          style={{
            position: 'fixed',
            top: dropIndicator.top - 1,
            left: dropIndicator.left,
            width: dropIndicator.width,
            pointerEvents: 'none',
            zIndex: 50,
          }}
          className={`h-0.5 rounded-full flex items-center justify-center ${
            dropIndicator.valid ? 'bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.7)]' : 'bg-rose-500'
          }`}
        >
          <div
            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow ${
              dropIndicator.valid ? 'bg-indigo-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            {dropIndicator.label}
          </div>
        </div>
      )}
    </div>
  );
}
