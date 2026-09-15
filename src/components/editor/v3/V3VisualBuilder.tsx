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
import { ContactLayoutPicker } from './ContactLayoutPicker';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Dialog } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Rocket, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useV3Autosave } from '@/lib/editor/use-v3-autosave';

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
}

function useCompactEditor() {
  const [compact, setCompact] = React.useState(false);
  React.useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return compact;
}

function EditorNavPanel({ tab }: { tab: string | null }) {
  if (tab === 'add') return <AddElementsPanel />;
  if (tab === 'layers') return <LayersPanel />;
  if (tab === 'pages') return <PagesPanel />;
  if (tab === 'site') return <SiteStructurePanel />;
  if (tab === 'theme') return <ThemePanel />;
  if (tab === 'assets') return <AssetsPanel />;
  return null;
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

  const setActiveNavTab = useV3EditorStore((s) => s.setActiveNavTab);
  const compact = useCompactEditor();
  const [inspectorOpen, setInspectorOpen] = React.useState(false);
  const [publishSuccessOpen, setPublishSuccessOpen] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);
  const [contactPickerOpen, setContactPickerOpen] = React.useState(false);

  useV3Autosave();

  React.useEffect(() => {
    if (compact && selectedNodeId) setInspectorOpen(true);
  }, [compact, selectedNodeId]);

  React.useEffect(() => {
    const openHelp = () => setHelpOpen(true);
    const openContact = () => setContactPickerOpen(true);
    window.addEventListener('kdba-editor-help', openHelp);
    window.addEventListener('kdba-editor-contact-picker', openContact);
    return () => {
      window.removeEventListener('kdba-editor-help', openHelp);
      window.removeEventListener('kdba-editor-contact-picker', openContact);
    };
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
        onOpenInspector={compact ? () => setInspectorOpen(true) : undefined}
      />

      {saveStatus === 'error' && (
        <Alert variant="destructive" className="rounded-none border-x-0">
          <AlertCircle />
          <AlertTitle>Save failed</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
            <span>{errorMessage || 'The document could not be saved.'}</span>
            <span className="flex gap-2">
              {hasConflict ? (
                <Button size="sm" variant="outline" onClick={() => void reloadFromServer()}>
                  Reload latest
                </Button>
              ) : null}
              <Button size="sm" onClick={() => void saveDocument()}>
                Retry
              </Button>
            </span>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex-1 flex w-full overflow-hidden relative">
        {!previewMode && <V3EditorSidebarRail />}
        {previewMode || compact ? (
          <V3EditorCanvas />
        ) : (
          <ResizablePanelGroup orientation="horizontal" className="flex-1 min-w-0">
            {activeNavTab ? (
              <>
                <ResizablePanel defaultSize={22} minSize={16} maxSize={40} className="min-w-[220px] overflow-hidden">
                  <EditorNavPanel tab={activeNavTab} />
                </ResizablePanel>
                <ResizableHandle withHandle />
              </>
            ) : null}
            <ResizablePanel defaultSize={activeNavTab ? 56 : 78} minSize={30} className="overflow-hidden">
              <div className="flex h-full min-h-0 flex-col">
                <V3EditorCanvas />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={22} minSize={16} maxSize={40} className="min-w-[220px] overflow-hidden">
              <V3Inspector />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>

      <ContactLayoutPicker open={contactPickerOpen} onOpenChange={setContactPickerOpen} />

      {!previewMode && compact ? (
        <Sheet
          open={Boolean(activeNavTab)}
          onOpenChange={(open) => {
            if (!open) setActiveNavTab(null);
          }}
        >
          <SheetContent side="left" className="w-80 gap-0 p-0 sm:max-w-80" showCloseButton={false}>
            <SheetTitle className="sr-only">Editor panel</SheetTitle>
            <EditorNavPanel tab={activeNavTab} />
          </SheetContent>
        </Sheet>
      ) : null}

      {!previewMode && compact ? (
        <Sheet open={inspectorOpen} onOpenChange={setInspectorOpen}>
          <SheetContent side="right" className="w-80 gap-0 p-0 sm:max-w-80" showCloseButton={false}>
            <SheetTitle className="sr-only">Inspector</SheetTitle>
            <V3Inspector />
          </SheetContent>
        </Sheet>
      ) : null}

      <Dialog
        isOpen={publishSuccessOpen}
        onClose={() => setPublishSuccessOpen(false)}
        title="Website published"
        description="Your visual changes are now live."
      >
        <div className="space-y-4 pt-2">
          <Alert>
            <Rocket />
            <AlertTitle>Live website updated</AlertTitle>
            <AlertDescription>Visitors can now see the published WebsiteDocument.</AlertDescription>
          </Alert>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPublishSuccessOpen(false)}>
              Done
            </Button>
            <Button onClick={() => window.open(`/site/${liveSlug}`, '_blank')}>
              Visit live website
              <ExternalLink />
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
        <ul className="space-y-2 pt-2 text-sm text-muted-foreground">
          <li><Kbd>⌘</Kbd> <Kbd>S</Kbd> Save</li>
          <li><Kbd>⌘</Kbd> <Kbd>Z</Kbd> Undo</li>
          <li><Kbd>⌘</Kbd> <Kbd>Shift</Kbd> <Kbd>Z</Kbd> Redo</li>
          <li><Kbd>⌘</Kbd> <Kbd>C</Kbd> / <Kbd>V</Kbd> Copy / paste node</li>
          <li><Kbd>Delete</Kbd> Remove selected node</li>
          <li><Kbd>Esc</Kbd> Clear selection</li>
        </ul>
      </Dialog>
    </div>
  );
}
