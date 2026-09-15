'use client';

import * as React from 'react';
import Link from 'next/link';
import { useV3EditorStore, ViewportMode } from '@/stores/v3-editor-store';
import { CommandMenu } from '@/components/kdba/command-menu';
import { ThemeToggle } from '@/components/kdba/theme-toggle';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Eye,
  EyeOff,
  Loader2,
  Monitor,
  PanelRight,
  Redo2,
  Rocket,
  Save,
  Smartphone,
  Tablet,
  Undo2,
} from 'lucide-react';

export interface V3EditorHeaderProps {
  onPublishSuccess?: () => void;
  onOpenInspector?: () => void;
}

export function V3EditorHeader({ onPublishSuccess, onOpenInspector }: V3EditorHeaderProps) {
  const {
    document,
    viewport,
    setViewport,
    zoom,
    setZoom,
    previewMode,
    setPreviewMode,
    undoStack,
    redoStack,
    undo,
    redo,
    saveStatus,
    saveDocument,
    publishDocument,
    lastSavedAt,
  } = useV3EditorStore();

  const [isPublishing, setIsPublishing] = React.useState(false);
  const [timeAgo, setTimeAgo] = React.useState('Saved');

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  React.useEffect(() => {
    const updateTime = () => {
      if (saveStatus === 'saving') {
        setTimeAgo('Saving...');
      } else if (saveStatus === 'error') {
        setTimeAgo('Save failed');
      } else if (saveStatus === 'unsaved') {
        setTimeAgo('Unsaved changes');
      } else if (!lastSavedAt) {
        setTimeAgo('Saved');
      } else {
        const seconds = Math.floor((Date.now() - lastSavedAt.getTime()) / 1000);
        if (seconds < 10) setTimeAgo('Saved, just now');
        else if (seconds < 60) setTimeAgo(`Saved, ${seconds}s ago`);
        else setTimeAgo('Saved');
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 5000);
    return () => clearInterval(timer);
  }, [saveStatus, lastSavedAt]);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await publishDocument();
      if (onPublishSuccess) onPublishSuccess();
    } catch (err: unknown) {
      console.error('Publish error:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const viewportOptions: { id: ViewportMode; label: string; icon: React.ReactNode; dim: string }[] = [
    { id: 'desktop', label: 'Desktop', icon: <Monitor className="w-4 h-4" />, dim: '1440 × 1024' },
    { id: 'tablet', label: 'Tablet', icon: <Tablet className="w-4 h-4" />, dim: '768 × 1024' },
    { id: 'mobile', label: 'Mobile', icon: <Smartphone className="w-4 h-4" />, dim: '390 × 844' },
  ];

  return (
    <header className="flex h-14 w-full shrink-0 items-center justify-between border-b bg-background px-4 z-30 select-none">
      {/* 1. Left: Navigation, Title & Save Status */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Back to Dashboard"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="max-w-[220px] truncate text-sm font-semibold tracking-tight">
              {document?.site?.name || 'Website Studio'}
            </span>

            {/* Live Save Status Badge */}
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                saveStatus === 'saved'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : saveStatus === 'saving'
                  ? 'bg-warning/10 border-warning/30 text-warning'
                  : saveStatus === 'error'
                  ? 'bg-destructive/10 border-rose-500/30 text-destructive'
                  : 'bg-muted/50 border-border text-muted-foreground'
              }`}
            >
              {saveStatus === 'saved' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              {saveStatus === 'saving' && <Loader2 className="w-3 h-3 animate-spin text-warning" />}
              {saveStatus === 'error' && <AlertCircle className="w-3 h-3 text-destructive" />}
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ToggleGroup
          type="single"
          value={viewport}
          onValueChange={(value) => {
            if (value === 'desktop' || value === 'tablet' || value === 'mobile') setViewport(value);
          }}
          variant="outline"
          size="sm"
          spacing={0}
        >
          {viewportOptions.map((opt) => (
            <ToggleGroupItem
              key={opt.id}
              value={opt.id}
              aria-label={opt.label}
              title={`${opt.label} (${opt.dim})`}
            >
              {opt.icon}
              <span className="hidden md:inline">{opt.label}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <Select
          value={String(zoom)}
          onValueChange={(next) => {
            if (next === 'fit') {
              const desktopWidth = viewport === 'desktop' ? 1280 : viewport === 'tablet' ? 768 : 390;
              const available = Math.max(320, window.innerWidth - 420);
              setZoom(Math.max(25, Math.min(125, Math.round((available / desktopWidth) * 100))));
              return;
            }
            setZoom(Number(next));
          }}
        >
          <SelectTrigger className="w-[92px]" size="sm" aria-label="Canvas zoom">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="25">25%</SelectItem>
            <SelectItem value="50">50%</SelectItem>
            <SelectItem value="75">75%</SelectItem>
            <SelectItem value="100">100%</SelectItem>
            <SelectItem value="125">125%</SelectItem>
            <SelectItem value="fit">Fit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        {previewMode ? (
          <>
            <Button size="sm" variant="outline" onClick={() => setPreviewMode(false)}>
              <EyeOff />
              Exit preview
            </Button>
            <CommandMenu compact />
            <ThemeToggle />
          </>
        ) : (
          <>
            <div className="flex items-center gap-0.5 border-r pr-2">
              <Button variant="ghost" size="icon-sm" disabled={!canUndo} onClick={undo} aria-label="Undo">
                <Undo2 />
              </Button>
              <Button variant="ghost" size="icon-sm" disabled={!canRedo} onClick={redo} aria-label="Redo">
                <Redo2 />
              </Button>
            </div>
            <Button size="sm" variant="outline" onClick={() => setPreviewMode(true)}>
              <Eye />
              Preview
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void saveDocument()}
              disabled={saveStatus === 'saving'}
              isLoading={saveStatus === 'saving'}
            >
              <Save />
              {saveStatus === 'error' ? 'Retry save' : 'Save'}
            </Button>
            <Button
              size="sm"
              disabled={isPublishing}
              isLoading={isPublishing}
              onClick={() => void handlePublish()}
            >
              <Rocket />
              Publish
            </Button>
            {onOpenInspector ? (
              <Button
                size="icon-sm"
                variant="outline"
                className="lg:hidden"
                aria-label="Open inspector"
                onClick={onOpenInspector}
              >
                <PanelRight />
              </Button>
            ) : null}
            <CommandMenu compact />
            <ThemeToggle />
          </>
        )}
      </div>
    </header>
  );
}
