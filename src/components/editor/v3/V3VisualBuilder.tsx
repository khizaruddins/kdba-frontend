'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { V3EditorHeader } from './V3EditorHeader';
import { V3EditorSidebarRail } from './V3EditorSidebarRail';
import { AddElementsPanel } from './panels/AddElementsPanel';
import { LayersPanel } from './panels/LayersPanel';
import { PagesPanel } from './panels/PagesPanel';
import { ThemePanel } from './panels/ThemePanel';
import { V3EditorCanvas } from './V3EditorCanvas';
import { V3Inspector } from './inspector/V3Inspector';
import { Dialog } from '@/components/ui/dialog';
import { Rocket, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function V3VisualBuilder() {
  const {
    activeNavTab,
    previewMode,
    saveDocument,
    setSelectedNodeId,
    undo,
    redo,
    websiteId,
  } = useV3EditorStore();

  const [publishSuccessOpen, setPublishSuccessOpen] = React.useState(false);

  // Keyboard Shortcuts (Cmd+S, Cmd+Z, Cmd+Shift+Z, Escape)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmd = isMac ? e.metaKey : e.ctrlKey;

      if (cmd && e.key === 's') {
        e.preventDefault();
        saveDocument();
      } else if (cmd && e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        redo();
      } else if (cmd && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (e.key === 'Escape') {
        setSelectedNodeId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveDocument, undo, redo, setSelectedNodeId]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0B0D13] text-slate-100 overflow-hidden select-none">
      {/* 1. Header Toolbar */}
      <V3EditorHeader onPublishSuccess={() => setPublishSuccessOpen(true)} />

      {/* 2. Main Builder Workspace: Rail + Panels + Canvas + Inspector */}
      <div className="flex-1 flex w-full overflow-hidden relative">
        {/* Left Rail (hidden in preview mode) */}
        {!previewMode && <V3EditorSidebarRail />}

        {/* Left Flyout Panels (hidden in preview mode) */}
        {!previewMode && activeNavTab === 'add' && <AddElementsPanel />}
        {!previewMode && activeNavTab === 'layers' && <LayersPanel />}
        {!previewMode && activeNavTab === 'pages' && <PagesPanel />}
        {!previewMode && activeNavTab === 'theme' && <ThemePanel />}

        {/* Center Canvas */}
        <V3EditorCanvas />

        {/* Right Inspector (hidden in preview mode) */}
        {!previewMode && <V3Inspector />}
      </div>

      {/* Publish Success Modal */}
      <Dialog
        isOpen={publishSuccessOpen}
        onClose={() => setPublishSuccessOpen(false)}
        title="Website Published Live!"
        description="Your visual changes are now live and distributed globally across our CDN."
      >
        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Rocket className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-emerald-200">Live Website Active</p>
              <p className="text-[11px] text-emerald-400/80">Visitors can view and interact with your updated design.</p>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setPublishSuccessOpen(false)}>
              Done
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
              onClick={() => {
                if (websiteId) {
                  window.open(`/site/${websiteId}`, '_blank');
                }
              }}
            >
              <span>Visit Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
