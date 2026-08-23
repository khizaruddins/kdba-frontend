'use client';

import * as React from 'react';
import Link from 'next/link';
import { useEditorStore, ViewMode } from '@/stores/editor-store';
import { apiClient } from '@/lib/api/client';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface EditorHeaderProps {
  onPublishSuccess?: () => void;
}

export function EditorHeader({ onPublishSuccess }: EditorHeaderProps) {
  const {
    website,
    viewMode,
    setViewMode,
    isSaving,
    setIsSaving,
    isPublishing,
    setIsPublishing,
    isDirty,
  } = useEditorStore();

  const [savedNotice, setSavedNotice] = React.useState(false);

  const handleSaveDraft = async () => {
    if (!website) return;
    setIsSaving(true);
    try {
      // 1. Update website theme/settings
      const websitePayload: Record<string, any> = {};
      if (website.name) websitePayload.name = website.name;
      if (website.theme) websitePayload.theme = website.theme;
      if (website.seoTitle !== undefined) websitePayload.seoTitle = website.seoTitle;
      if (website.seoDescription !== undefined) websitePayload.seoDescription = website.seoDescription;

      if (Object.keys(websitePayload).length > 0) {
        await apiClient.patch(`/websites/${website.id}`, websitePayload);
      }

      // 2. Update all sections' draft configs
      if (Array.isArray(website.pages)) {
        for (const page of website.pages) {
          if (Array.isArray(page.sections)) {
            for (const section of page.sections) {
              if (section.id && section.id.startsWith('sec_')) {
                // Newly added section: persist to database
                const created: any = await apiClient.post('/sections', {
                  pageId: page.id,
                  type: section.type,
                  title: section.title,
                  config: section.draftConfig || {},
                  sortOrder: section.sortOrder ?? 0,
                });
                section.id = created.id;
              } else if (section.id) {
                await apiClient.patch(`/sections/${section.id}`, {
                  config: section.draftConfig || {},
                });
              }
            }
          }
        }
      }

      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    } catch (err: any) {
      console.error('Failed to save draft:', err?.response?.data || err?.message || err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!website) return;

    setIsPublishing(true);
    try {
      // First save draft
      await handleSaveDraft();
      await apiClient.post(`/websites/${website.id}/publish`, {});
      if (onPublishSuccess) onPublishSuccess();
    } catch (err: any) {
      console.error('Failed to publish website:', err?.response?.data || err?.message || err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950 px-6 z-30">
      {/* Left branding & exit */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm font-bold text-white truncate max-w-[180px]">
            {website?.name || 'Website Builder'}
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
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
            viewMode === 'desktop'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Desktop view"
        >
          <Monitor className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setViewMode('tablet')}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
            viewMode === 'tablet'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Tablet view"
        >
          <Tablet className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setViewMode('mobile')}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
            viewMode === 'mobile'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Mobile view"
        >
          <Smartphone className="h-4 w-4" />
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {savedNotice && (
          <span className="hidden md:inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Draft saved</span>
          </span>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleSaveDraft}
          isLoading={isSaving}
          leftIcon={<Save className="h-3.5 w-3.5" />}
        >
          Save Draft
        </Button>

        {website?.slug && (
          <Link
            href={`/site/${website.slug}`}
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview</span>
          </Link>
        )}

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
