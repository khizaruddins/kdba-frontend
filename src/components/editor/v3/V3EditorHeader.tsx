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
    <header className="h-14 w-full border-b border-slate-800/80 bg-slate-950 flex items-center justify-between px-4 select-none z-30 shrink-0">
      {/* 1. Left: Navigation, Title & Save Status */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          title="Back to Dashboard"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white tracking-tight truncate max-w-[220px]">
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
        <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800">
          {viewportOptions.map((opt) => {
            const isActive = viewport === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setViewport(opt.id)}
                title={`${opt.label} (${opt.dim})`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
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
          onChange={(e) => setZoom(Number(e.target.value))}
          className="h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none cursor-pointer"
        >
          <option value="50">50%</option>
          <option value="75">75%</option>
          <option value="100">100%</option>
          <option value="125">125%</option>
          <option value="150">150%</option>
        </select>
      </div>

      {/* 3. Right: Undo/Redo, Preview, Save & Publish */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-slate-800">
          <button
            type="button"
            disabled={!canUndo}
            onClick={undo}
            title="Undo (Cmd+Z)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={redo}
            title="Redo (Cmd+Shift+Z)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Button */}
        <button
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          title={previewMode ? 'Exit Preview' : 'Preview Live Website'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            previewMode
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow'
              : 'border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white'
          }`}
        >
          {previewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{previewMode ? 'Exit Preview' : 'Preview'}</span>
        </button>

        {/* Save Button */}
        <button
          type="button"
          onClick={() => saveDocument()}
          disabled={saveStatus === 'saving'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-800 bg-slate-900 hover:bg-slate-800 text-white transition-colors"
        >
          {saveStatus === 'saving' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save</span>
        </button>

        {/* Publish Button */}
        <button
          type="button"
          disabled={isPublishing}
          onClick={handlePublish}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          {isPublishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Rocket className="w-3.5 h-3.5" />}
          <span>Publish</span>
        </button>
      </div>
    </header>
  );
}
