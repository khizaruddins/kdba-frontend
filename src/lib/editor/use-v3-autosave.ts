'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';

const AUTOSAVE_MS = 1800;

export function useV3Autosave() {
  const isDirty = useV3EditorStore((s) => s.isDirty);
  const document = useV3EditorStore((s) => s.document);
  const saveStatus = useV3EditorStore((s) => s.saveStatus);
  const isDragging = useV3EditorStore((s) => s.isDragging);
  const isInlineEditing = useV3EditorStore((s) => s.isInlineEditing);
  const saveDocument = useV3EditorStore((s) => s.saveDocument);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (!isDirty || !document || isDragging || isInlineEditing) return;
    if (saveStatus === 'saving') return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      void saveDocument();
    }, AUTOSAVE_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isDirty, document, isDragging, isInlineEditing, saveStatus, saveDocument]);
}
