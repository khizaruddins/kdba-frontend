'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { V3WebsiteRenderer } from '@/components/renderer/v3/V3WebsiteRenderer';
import { SelectionOverlay } from './overlays/SelectionOverlay';
import { CanvasBreadcrumb } from './breadcrumbs/CanvasBreadcrumb';
import { KeyboardShortcutsModal } from './modals/KeyboardShortcutsModal';
import { COMPONENT_MANIFEST } from '@/lib/editor/component-manifest';
import { NodeType } from '@/types/v3-document';

export function V3EditorCanvas() {
  const {
    document,
    activePageId,
    selectedNodeId,
    hoveredNodeId,
    setSelectedNodeId,
    setHoveredNodeId,
    viewport,
    zoom,
    previewMode,
    addNode,
    moveNode,
    duplicateNode,
    removeNode,
    copyNode,
    pasteNode,
    getActivePage,
    findNode,
    findParent,
    setInlineEditingNodeId,
  } = useV3EditorStore();

  const [shortcutsModalOpen, setShortcutsModalOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Keyboard Shortcuts Listener for Canvas (Cmd+C, Cmd+V, Cmd+D, Delete, Enter, ?)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input, textarea, or contentEditable element
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmd = isMac ? e.metaKey : e.ctrlKey;

      if (cmd && (e.key === 'c' || e.key === 'C')) {
        if (selectedNodeId) {
          e.preventDefault();
          copyNode(selectedNodeId);
          showToast('Copied to clipboard');
        }
      } else if (cmd && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        const pasted = pasteNode();
        if (pasted) {
          showToast('Pasted element');
        }
      } else if (cmd && (e.key === 'd' || e.key === 'D')) {
        if (selectedNodeId) {
          e.preventDefault();
          duplicateNode(selectedNodeId);
          showToast('Duplicated element');
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          e.preventDefault();
          removeNode(selectedNodeId);
          showToast('Deleted element');
        }
      } else if (e.key === 'Enter') {
        if (selectedNodeId) {
          const selected = findNode(selectedNodeId);
          if (
            selected &&
            ['heading', 'paragraph', 'text', 'button', 'quote', 'badge'].includes(
              selected.type,
            )
          ) {
            e.preventDefault();
            setInlineEditingNodeId(selectedNodeId);
          }
        }
      } else if (e.key === '?') {
        e.preventDefault();
        setShortcutsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedNodeId,
    copyNode,
    pasteNode,
    duplicateNode,
    removeNode,
    findNode,
    setInlineEditingNodeId,
  ]);

  const [dropIndicator, setDropIndicator] = React.useState<{
    targetId: string;
    position: 'before' | 'after' | 'inside';
    top: number;
    left: number;
    width: number;
  } | null>(null);

  if (!document) return null;

  // Viewport container width & framing
  const viewportStyles = {
    desktop: 'w-full max-w-full min-h-screen bg-slate-950',
    tablet:
      'w-[768px] max-w-[768px] rounded-[32px] border-[10px] border-slate-900 bg-slate-950 shadow-2xl shadow-black/80 my-8 overflow-hidden flex flex-col',
    mobile:
      'w-[390px] max-w-[390px] rounded-[44px] border-[12px] border-slate-900 bg-slate-950 shadow-2xl shadow-black/80 my-8 overflow-hidden flex flex-col',
  }[viewport];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

    // Find closest node under pointer
    const targetElement = (e.target as HTMLElement).closest('[data-node-id]');
    if (!targetElement) {
      setDropIndicator(null);
      return;
    }

    const targetId = targetElement.getAttribute('data-node-id');
    if (!targetId) return;

    const rect = targetElement.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const isTopHalf = offsetY < rect.height / 2;

    setDropIndicator({
      targetId,
      position: isTopHalf ? 'before' : 'after',
      top: isTopHalf ? rect.top : rect.bottom,
      left: rect.left,
      width: rect.width,
    });
  };

  const handleDragLeave = () => {
    setDropIndicator(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropIndicator(null);

    const nodeType = e.dataTransfer.getData('kdba/node-type') as NodeType;
    const movedNodeId = e.dataTransfer.getData('kdba/node-id');

    if (!nodeType && !movedNodeId) return;

    // Determine target parent & index
    const targetElement = (e.target as HTMLElement).closest('[data-node-id]');
    const targetId = targetElement?.getAttribute('data-node-id');

    const page = getActivePage();
    if (!page || !page.root) return;

    let targetParentId = page.root.id;
    let targetIndex = undefined;

    if (targetId) {
      const targetNode = findNode(targetId);
      if (targetNode && ['section', 'container', 'column', 'grid', 'stack', 'row'].includes(targetNode.type)) {
        targetParentId = targetNode.id;
      } else {
        const parentInfo = findParent(targetId);
        if (parentInfo) {
          targetParentId = parentInfo.parent.id;
          targetIndex = parentInfo.index + 1;
        }
      }
    }

    if (movedNodeId) {
      moveNode(movedNodeId, targetParentId, targetIndex);
    } else if (nodeType && COMPONENT_MANIFEST[nodeType]) {
      const manifest = COMPONENT_MANIFEST[nodeType];
      addNode(
        targetParentId,
        {
          type: nodeType,
          name: manifest.name,
          props: manifest.defaultProps,
          styles: manifest.defaultStyles,
        },
        targetIndex,
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* 1. Canvas Breadcrumbs (Hidden in preview mode) */}
      {!previewMode && <CanvasBreadcrumb />}

      {/* 2. Scrollable Canvas Surface */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="flex-1 overflow-y-auto overflow-x-hidden bg-[#0B0D13] flex justify-center items-start p-4 select-none relative"
      >
        {/* Zoom transform container */}
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className={`flex justify-center transition-all ${viewportStyles}`}
        >
          {/* Device Notch for Mobile */}
          {viewport === 'mobile' && !previewMode && (
            <div className="h-7 w-full bg-slate-900 flex items-center justify-center shrink-0 border-b border-slate-800/80">
              <div className="h-3 w-28 rounded-full bg-slate-950 flex items-center justify-end px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700/60" />
              </div>
            </div>
          )}

          {/* Device Header for Tablet */}
          {viewport === 'tablet' && !previewMode && (
            <div className="h-6 w-full bg-slate-900 flex items-center justify-center shrink-0 border-b border-slate-800/80">
              <div className="h-2 w-16 rounded-full bg-slate-800" />
            </div>
          )}

          {/* Render Website Tree */}
          <div
            data-viewport-mode={viewport}
            className="w-full flex-1 overflow-visible relative"
            onClick={() => setSelectedNodeId(null)}
          >
            <V3WebsiteRenderer
              document={document}
              activePageId={activePageId}
              isEditing={!previewMode}
              viewport={viewport}
              selectedNodeId={selectedNodeId}
              hoveredNodeId={hoveredNodeId}
              onSelectNode={(id) => setSelectedNodeId(id)}
              onHoverNode={(id) => setHoveredNodeId(id)}
              onDoubleClickText={(id) => setInlineEditingNodeId(id)}
            />
          </div>
        </div>

        {/* Floating Selection Box & Context Toolbar */}
        {!previewMode && <SelectionOverlay />}

        {/* Visual Drop Insertion Line */}
        {dropIndicator && !previewMode && (
          <div
            style={{
              position: 'fixed',
              top: dropIndicator.top - 2,
              left: dropIndicator.left,
              width: dropIndicator.width,
              pointerEvents: 'none',
              zIndex: 50,
            }}
            className="h-1 bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.8)] flex items-center justify-center"
          >
            <div className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-wider shadow">
              Drop Here
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 shadow-2xl backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />
    </div>
  );
}
