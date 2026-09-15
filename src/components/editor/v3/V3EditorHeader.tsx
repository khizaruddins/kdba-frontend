'use client';

import * as React from 'react';
import Link from 'next/link';
import { useV3EditorStore, ViewportMode } from '@/stores/v3-editor-store';
import {
  ChevronLeft,
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  Rocket,
  Save,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export interface V3EditorHeaderProps {
  onPublishSuccess?: () => void;
}

export function V3EditorHeader({ onPublishSuccess }: V3EditorHeaderProps) {
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
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : saveStatus === 'error'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              {saveStatus === 'saved' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              {saveStatus === 'saving' && <Loader2 className="w-3 h-3 animate-spin text-amber-400" />}
              {saveStatus === 'error' && <AlertCircle className="w-3 h-3 text-rose-400" />}
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Center: Viewport Mode Switcher & Zoom */}
      <div className="flex items-center gap-2">
        {/* Viewport Segmented Control */}
        <div className="flex items-center rounded-lg border bg-muted/40 p-0.5">
          {viewportOptions.map((opt) => {
            const isActive = viewport === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setViewport(opt.id)}
                title={`${opt.label} (${opt.dim})`}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-background hover:text-foreground'
                }`}
                aria-pressed={isActive}
              >
                {opt.icon}
                <span className="hidden md:inline">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Zoom Selector */}
        <select
          value={zoom}
          aria-label="Canvas zoom"
          onChange={(e) => {
            const next = e.target.value;
            if (next === 'fit') {
              const desktopWidth = viewport === 'desktop' ? 1280 : viewport === 'tablet' ? 768 : 390;
              const available = Math.max(320, window.innerWidth - 420);
              setZoom(Math.max(25, Math.min(125, Math.round((available / desktopWidth) * 100))));
              return;
            }
            setZoom(Number(next));
          }}
          className="h-8 cursor-pointer rounded-lg border bg-background px-2 text-xs text-foreground focus:outline-none"
        >
          <option value="25">25%</option>
          <option value="50">50%</option>
          <option value="75">75%</option>
          <option value="100">100%</option>
          <option value="125">125%</option>
          <option value="fit">Fit to screen</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        {previewMode ? (
          <button
            type="button"
            onClick={() => setPreviewMode(false)}
            title="Exit Preview"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 border border-amber-500/40 text-amber-300"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Exit Preview</span>
          </button>
        ) : (
          <>
            <div className="flex items-center gap-0.5 border-r pr-2">
              <button
                type="button"
                disabled={!canUndo}
                onClick={undo}
                title="Undo (Cmd+Z)"
                aria-label="Undo"
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={!canRedo}
                onClick={redo}
                title="Redo (Cmd+Shift+Z)"
                aria-label="Redo"
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setPreviewMode(true)}
              title="Preview Live Website"
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={() => saveDocument()}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-1.5 rounded-lg border bg-muted/40 px-3 py-1.5 text-xs font-semibold hover:bg-muted"
            >
              {saveStatus === 'saving' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saveStatus === 'error' ? 'Retry save' : 'Save'}</span>
            </button>

            <button
              type="button"
              disabled={isPublishing}
              onClick={handlePublish}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {isPublishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Rocket className="w-3.5 h-3.5" />}
              <span>Publish</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
