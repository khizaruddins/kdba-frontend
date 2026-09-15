'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { V3EditorHeader } from './V3EditorHeader';
import { V3EditorSidebarRail } from './V3EditorSidebarRail';
import { AddElementsPanel } from './panels/AddElementsPanel';
import { LayersPanel } from './panels/LayersPanel';
import { PagesPanel } from './panels/PagesPanel';
import { ThemePanel } from './panels/ThemePanel';
import { AssetsPanel } from './panels/AssetsPanel';
import { SiteStructurePanel } from './panels/SiteStructurePanel';
import { V3EditorCanvas } from './V3EditorCanvas';
import { V3Inspector } from './inspector/V3Inspector';
import { Dialog } from '@/components/ui/dialog';
import { Rocket, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useV3Autosave } from '@/lib/editor/use-v3-autosave';

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
}

export function V3VisualBuilder() {
  const activeNavTab = useV3EditorStore((s) => s.activeNavTab);
  const previewMode = useV3EditorStore((s) => s.previewMode);
  const saveDocument = useV3EditorStore((s) => s.saveDocument);
  const setSelectedNodeId = useV3EditorStore((s) => s.setSelectedNodeId);
  const undo = useV3EditorStore((s) => s.undo);
  const redo = useV3EditorStore((s) => s.redo);
  const websiteId = useV3EditorStore((s) => s.websiteId);
  const document = useV3EditorStore((s) => s.document);
  const removeNode = useV3EditorStore((s) => s.removeNode);
  const selectedNodeId = useV3EditorStore((s) => s.selectedNodeId);
  const copySelectedNode = useV3EditorStore((s) => s.copySelectedNode);
  const pasteClipboard = useV3EditorStore((s) => s.pasteClipboard);
  const saveStatus = useV3EditorStore((s) => s.saveStatus);
  const errorMessage = useV3EditorStore((s) => s.errorMessage);
  const hasConflict = useV3EditorStore((s) => s.hasConflict);
  const reloadFromServer = useV3EditorStore((s) => s.reloadFromServer);

  const [publishSuccessOpen, setPublishSuccessOpen] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);

  useV3Autosave();

  React.useEffect(() => {
    const openHelp = () => setHelpOpen(true);
    window.addEventListener('kdba-editor-help', openHelp);
    return () => window.removeEventListener('kdba-editor-help', openHelp);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const cmd = isMac ? e.metaKey : e.ctrlKey;
      const typing = isTypingTarget(e.target);

      if (cmd && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void saveDocument();
        return;
      }

      if (typing) return;

      if (cmd && e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        redo();
      } else if (cmd && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      } else if (cmd && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        copySelectedNode();
      } else if (cmd && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        pasteClipboard();
      } else if (e.key === 'Escape') {
        setSelectedNodeId(null);
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        e.preventDefault();
        removeNode(selectedNodeId);
      } else if (cmd && e.key === '/') {
        e.preventDefault();
        setHelpOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    saveDocument,
    undo,
    redo,
    setSelectedNodeId,
    copySelectedNode,
    pasteClipboard,
    removeNode,
    selectedNodeId,
  ]);

  const liveSlug =
    document?.settings?.subdomain || document?.site?.id || websiteId;

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      <V3EditorHeader
        onPublishSuccess={() => setPublishSuccessOpen(true)}
      />

      {saveStatus === 'error' && (
        <div className="flex items-center justify-between gap-3 px-4 py-2 bg-rose-950/70 border-b border-rose-900/60 text-rose-100 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="truncate">{errorMessage || 'Save failed'}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {hasConflict && (
              <Button size="sm" variant="outline" onClick={() => void reloadFromServer()}>
                Reload latest
              </Button>
            )}
            <Button size="sm" onClick={() => void saveDocument()}>
              Retry
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 flex w-full overflow-hidden relative">
        {!previewMode && <V3EditorSidebarRail />}
        {!previewMode && activeNavTab === 'add' && <AddElementsPanel />}
        {!previewMode && activeNavTab === 'layers' && <LayersPanel />}
        {!previewMode && activeNavTab === 'pages' && <PagesPanel />}
        {!previewMode && activeNavTab === 'site' && <SiteStructurePanel />}
        {!previewMode && activeNavTab === 'theme' && <ThemePanel />}
        {!previewMode && activeNavTab === 'assets' && <AssetsPanel />}
        <V3EditorCanvas />
        {!previewMode && <V3Inspector />}
      </div>

      <Dialog
        isOpen={publishSuccessOpen}
        onClose={() => setPublishSuccessOpen(false)}
        title="Website Published Live!"
        description="Your visual changes are now live."
      >
        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Rocket className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-emerald-200">Live Website Active</p>
              <p className="text-[11px] text-emerald-400/80">Visitors can view the updated WebsiteDocument.</p>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setPublishSuccessOpen(false)}>
              Done
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
              onClick={() => window.open(`/site/${liveSlug}`, '_blank')}
            >
              <span>Visit Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="Editor shortcuts"
        description="Keyboard controls for the visual builder."
      >
        <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
          <li><kbd className="text-slate-400">⌘/Ctrl + S</kbd> Save</li>
          <li><kbd className="text-slate-400">⌘/Ctrl + Z</kbd> Undo</li>
          <li><kbd className="text-slate-400">⌘/Ctrl + Shift + Z</kbd> Redo</li>
          <li><kbd className="text-slate-400">⌘/Ctrl + C / V</kbd> Copy / paste node</li>
          <li><kbd className="text-slate-400">Delete</kbd> Remove selected node</li>
          <li><kbd className="text-slate-400">Esc</kbd> Clear selection</li>
        </ul>
      </Dialog>
    </div>
  );
}
