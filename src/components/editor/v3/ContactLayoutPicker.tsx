'use client';

import * as React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { CONTACT_LAYOUT_PRESETS, SECTION_PRESETS } from '@/lib/editor/section-presets';

export function ContactLayoutPicker({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const insertSectionPreset = useV3EditorStore((s) => s.insertSectionPreset);

  const insertLayout = (presetId: string) => {
    const preset = SECTION_PRESETS.find((entry) => entry.id === presetId);
    if (preset) insertSectionPreset(preset.build());
    onOpenChange(false);
  };

  return (
    <Dialog
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Contact layout"
      description="Choose a layout. The form itself stays the same — only the surrounding structure changes."
      maxWidth="2xl"
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {CONTACT_LAYOUT_PRESETS.map((layout) => (
          <button
            key={layout.id}
            type="button"
            onClick={() => insertLayout(layout.id)}
            className="rounded-xl border border-border bg-muted/40 p-3 text-left hover:border-primary/50 hover:bg-muted"
          >
            <span className="block text-sm font-semibold text-foreground">{layout.name}</span>
            <span className="mt-1 block text-xs text-muted-foreground">{layout.description}</span>
          </button>
        ))}
      </div>
    </Dialog>
  );
}
