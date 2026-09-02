'use client';

import * as React from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { websitesApi } from '@/lib/api/websites';

export function useAutosave(websiteId?: string, debounceMs: number = 2000) {
  const { website, isDirty, isSaving, setIsSaving, setIsDirty } = useEditorStore();
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved' | 'unsaved' | 'error'>('saved');
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (!isDirty || !website || !websiteId) return;

    setSaveStatus('unsaved');

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        setSaveStatus('saving');
        setIsSaving(true);
        await websitesApi.saveDraft(websiteId, website);
        setIsDirty(false);
        setSaveStatus('saved');
      } catch (err: any) {
        console.error('Autosave error:', err?.response?.data || err?.message || err);
        setSaveStatus('error');
      } finally {
        setIsSaving(false);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [website, isDirty, websiteId, debounceMs, setIsSaving, setIsDirty]);

  const saveImmediately = React.useCallback(async () => {
    if (!website || !websiteId) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    try {
      setSaveStatus('saving');
      setIsSaving(true);
      await websitesApi.saveDraft(websiteId, website);
      setIsDirty(false);
      setSaveStatus('saved');
    } catch (err: any) {
      console.error('Manual save error:', err?.response?.data || err?.message || err);
      setSaveStatus('error');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [website, websiteId, setIsSaving, setIsDirty]);

  return {
    saveStatus,
    saveImmediately,
  };
}
