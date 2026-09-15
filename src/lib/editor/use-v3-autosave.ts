'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';

/** Wait until the editor has been idle this long before autosaving. */
const IDLE_MS = 15_000;
/** Never fire two document PUTs closer together than this. */
const MIN_GAP_MS = 15_000;

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'wheel'] as const;

export function useV3Autosave() {
  const isDirty = useV3EditorStore((s) => s.isDirty);
  const document = useV3EditorStore((s) => s.document);
  const saveStatus = useV3EditorStore((s) => s.saveStatus);
  const isDragging = useV3EditorStore((s) => s.isDragging);
  const isInlineEditing = useV3EditorStore((s) => s.isInlineEditing);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCallAtRef = React.useRef(0);
  const lastAttemptedDocRef = React.useRef<typeof document>(null);

  const schedule = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const state = useV3EditorStore.getState();
    if (!state.isDirty || !state.document) return;
    if (state.isDragging || state.isInlineEditing) return;
    if (state.saveStatus === 'saving') return;
    if (state.saveStatus === 'error' && lastAttemptedDocRef.current === state.document) return;

    const remainingGap = MIN_GAP_MS - (Date.now() - lastCallAtRef.current);
    const wait = Math.max(IDLE_MS, remainingGap);

    timeoutRef.current = setTimeout(() => {
      const next = useV3EditorStore.getState();
      if (!next.isDirty || !next.document) return;
      if (next.isDragging || next.isInlineEditing) {
        schedule();
        return;
      }
      if (next.saveStatus === 'saving') return;
      if (next.saveStatus === 'error' && lastAttemptedDocRef.current === next.document) return;

      lastCallAtRef.current = Date.now();
      lastAttemptedDocRef.current = next.document;
      void next.saveDocument();
    }, wait);
  }, []);

  React.useEffect(() => {
    schedule();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isDirty, document, isDragging, isInlineEditing, saveStatus, schedule]);

  React.useEffect(() => {
    const onActivity = () => {
      if (!useV3EditorStore.getState().isDirty) return;
      schedule();
    };
    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, onActivity, { passive: true });
    }
    return () => {
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, onActivity);
      }
    };
  }, [schedule]);
}
