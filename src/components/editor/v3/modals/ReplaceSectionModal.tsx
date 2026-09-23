'use client';

import * as React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { SECTION_METADATA_MAP } from '@/lib/document/defaults';
import { SectionType } from '@/types';
import { LayoutTemplate, Check, Sparkles } from 'lucide-react';

export interface ReplaceSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId: string;
}

export function ReplaceSectionModal({
  isOpen,
  onClose,
  sectionId,
}: ReplaceSectionModalProps) {
  const { findNode, setSectionVariant, replaceSection } = useV3EditorStore();

  const section = sectionId ? findNode(sectionId) : null;
  const sectionType = ((section?.props?.sectionType as string) ||
    section?.type ||
    'features') as SectionType;
  const currentVariant = (section?.props?.variant as string) || 'default';

  const metadata = SECTION_METADATA_MAP[sectionType] || SECTION_METADATA_MAP.features;
  const variants = metadata?.variants || [
    { id: 'default', label: 'Default Variant' },
    { id: 'split', label: 'Split Layout' },
    { id: 'bento-grid', label: 'Bento Grid' },
    { id: 'cards', label: 'Cards Layout' },
  ];

  const handleSelectVariant = (variantId: string) => {
    if (setSectionVariant) {
      setSectionVariant(sectionId, variantId);
    } else {
      replaceSection(sectionId, variantId);
    }
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Replace ${metadata?.name || 'Section'} Variant`}
      description="Select an alternate variant. Compatible headings, body text, buttons, and media will be preserved."
      maxWidth="lg"
    >
      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {variants.map((variant) => {
            const isSelected = currentVariant === variant.id;
            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => handleSelectVariant(variant.id)}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all group ${
                  isSelected
                    ? 'bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg shrink-0 border ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 group-hover:text-white'
                  }`}
                >
                  <LayoutTemplate className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-xs text-white truncate">
                      {variant.label}
                    </h4>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Switch to {variant.label.toLowerCase()} architecture.
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/30 flex items-center gap-2 text-indigo-300 text-xs">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Content will seamlessly adapt into the new section structure.</span>
        </div>
      </div>
    </Dialog>
  );
}
