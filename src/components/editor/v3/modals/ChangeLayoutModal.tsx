'use client';

import * as React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import {
  AlignCenter,
  Columns2,
  PanelLeft,
  PanelRight,
  LayoutGrid,
  Grid,
  Minimize2,
  Check,
} from 'lucide-react';

export interface ChangeLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId: string;
}

interface LayoutOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  previewClass: string;
}

const LAYOUT_OPTIONS: LayoutOption[] = [
  {
    id: 'centered',
    name: 'Centered High-Impact',
    description: 'Hero or statement layout with centrally aligned text and focused CTA.',
    icon: <AlignCenter className="w-5 h-5 text-indigo-400" />,
    previewClass: 'flex flex-col items-center justify-center text-center',
  },
  {
    id: 'split',
    name: 'Balanced 2-Column Split',
    description: 'Equal 50/50 two-column split for copy and media side-by-side.',
    icon: <Columns2 className="w-5 h-5 text-indigo-400" />,
    previewClass: 'grid grid-cols-2 gap-2',
  },
  {
    id: 'image-left',
    name: 'Image Left / Copy Right',
    description: 'Showcase visual on the left with supporting narrative on the right.',
    icon: <PanelLeft className="w-5 h-5 text-indigo-400" />,
    previewClass: 'grid grid-cols-2 gap-2',
  },
  {
    id: 'image-right',
    name: 'Copy Left / Image Right',
    description: 'Classic reading hierarchy: value proposition first, imagery second.',
    icon: <PanelRight className="w-5 h-5 text-indigo-400" />,
    previewClass: 'grid grid-cols-2 gap-2',
  },
  {
    id: 'bento',
    name: 'Bento Grid Layout',
    description: 'Asymmetric 3-column bento architecture for modern feature highlights.',
    icon: <LayoutGrid className="w-5 h-5 text-indigo-400" />,
    previewClass: 'grid grid-cols-3 gap-1.5',
  },
  {
    id: 'grid',
    name: 'Multi-Column Grid',
    description: 'Equal grid cards for features, pricing tiers, or team members.',
    icon: <Grid className="w-5 h-5 text-indigo-400" />,
    previewClass: 'grid grid-cols-3 gap-2',
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Streamlined single-column with generous whitespace and clear focus.',
    icon: <Minimize2 className="w-5 h-5 text-indigo-400" />,
    previewClass: 'flex flex-col items-start',
  },
];

export function ChangeLayoutModal({
  isOpen,
  onClose,
  sectionId,
}: ChangeLayoutModalProps) {
  const { findNode, changeLayout } = useV3EditorStore();

  const section = sectionId ? findNode(sectionId) : null;
  const currentLayout = (section?.props?.layoutVariant as string) || 'centered';

  const handleSelectLayout = (layoutId: string) => {
    changeLayout(sectionId, layoutId);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Change Section Layout"
      description="Choose a layout structure. Existing text, buttons, and media will be preserved automatically."
      maxWidth="xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {LAYOUT_OPTIONS.map((layout) => {
          const isSelected = currentLayout === layout.id;
          return (
            <button
              key={layout.id}
              type="button"
              onClick={() => handleSelectLayout(layout.id)}
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
                {layout.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-xs text-white truncate">
                    {layout.name}
                  </h4>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {layout.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </Dialog>
  );
}
