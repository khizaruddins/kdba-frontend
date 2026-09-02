'use client';

import * as React from 'react';
import Link from 'next/link';
import { useEditorStore, ViewMode } from '@/stores/editor-store';
import { websitesApi } from '@/lib/api/websites';
import { validateDocument } from '@/lib/templates/validator';
import {
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Rocket,
  Eye,
  ChevronLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface EditorHeaderProps {
  onPublishSuccess?: () => void;
  onOpenPreview?: () => void;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'unsaved' | 'error';
  onSaveImmediately?: () => Promise<void>;
}

export function EditorHeader({
  onPublishSuccess,
  onOpenPreview,
  saveStatus = 'saved',
  onSaveImmediately,
}: EditorHeaderProps) {
  const {
    website,
    viewMode,
    setViewMode,
    isSaving,
    isPublishing,
    setIsPublishing,
    isDirty,
  } = useEditorStore();

  const [validationError, setValidationError] = React.useState<string | null>(null);

  const handleManualSave = async () => {
    if (onSaveImmediately) {
      await onSaveImmediately();
    }
  };

  const handlePublish = async () => {
    if (!website) return;

    // 1. Pre-publish Document Validation
    const validation = validateDocument(website);
    if (!validation.isValid) {
      setValidationError(
        `Publish prevented: ${validation.errors[0]?.message || 'Invalid document schema'}`,
      );
      return;
    }

    setValidationError(null);
    setIsPublishing(true);

    try {
      if (onSaveImmediately) {
        await onSaveImmediately();
      }
      await websitesApi.publish(website.id);
      if (onPublishSuccess) {
        onPublishSuccess();
      }
    } catch (err: any) {
      console.error('Failed to publish website:', err);
      setValidationError(
        err?.response?.data?.message || err?.message || 'Publishing failed. Please try again.',
      );
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950 px-6 z-30 select-none">
      {/* Left branding & navigation */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>

        <div className="hidden sm:flex items-center gap-2.5">
          <span className="text-sm font-bold text-white truncate max-w-[180px]">
            {website?.name || 'Website Editor'}
          </span>
          <Badge
            variant={website?.status === 'PUBLISHED' ? 'success' : 'secondary'}
          >
            {website?.status === 'PUBLISHED' ? 'Live' : 'Draft'}
          </Badge>
        </div>
      </div>

      {/* Center Device Viewport Switcher */}
      <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/90 p-1">
        <button
          type="button"
          onClick={() => setViewMode('desktop')}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all cursor-pointer ${
            viewMode === 'desktop'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Desktop viewport"
        >
          <Monitor className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setViewMode('tablet')}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all cursor-pointer ${
            viewMode === 'tablet'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Tablet viewport (768px)"
        >
          <Tablet className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setViewMode('mobile')}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all cursor-pointer ${
            viewMode === 'mobile'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Mobile viewport (375px)"
        >
          <Smartphone className="h-4 w-4" />
        </button>
      </div>

      {/* Right Actions & Autosave Status */}
      <div className="flex items-center gap-3">
        {/* Autosave Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 text-xs">
          {saveStatus === 'saving' || isSaving ? (
            <span className="flex items-center gap-1 text-indigo-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Saving...</span>
            </span>
          ) : saveStatus === 'unsaved' || isDirty ? (
            <span className="flex items-center gap-1 text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Unsaved changes</span>
            </span>
          ) : saveStatus === 'error' ? (
            <span className="flex items-center gap-1 text-rose-400">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Save failed</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-400 font-medium">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>Saved</span>
            </span>
          )}
        </div>

        {/* Manual Save */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleManualSave}
          isLoading={isSaving}
          leftIcon={<Save className="h-3.5 w-3.5" />}
          title="Save Draft (Ctrl+S)"
        >
          Save
        </Button>

        {/* Interactive Preview Modal */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenPreview}
          leftIcon={<Eye className="h-3.5 w-3.5" />}
        >
          Preview
        </Button>

        {/* Publish Button */}
        <Button
          variant="default"
          size="sm"
          onClick={handlePublish}
          isLoading={isPublishing}
          leftIcon={<Rocket className="h-3.5 w-3.5" />}
        >
          Publish Live
        </Button>
      </div>
    </header>
  );
}
