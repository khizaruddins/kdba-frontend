'use client';

import * as React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import {
  AlignCenter,
  Columns2,
  LayoutGrid,
  Grid,
  Check,
  Rows,
  ArrowLeftRight,
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
  diagram: React.ReactNode;
}

const LAYOUT_OPTIONS: LayoutOption[] = [
  {
    id: '1-col',
    name: '1 Column (Centered)',
    description: 'Statement layout with centered content, generous margin, and focused call to action.',
    icon: <AlignCenter className="w-4 h-4 text-primary" />,
    diagram: (
      <div className="w-16 h-10 rounded border border-border bg-muted/30 p-1 flex flex-col items-center justify-center gap-1">
        <div className="w-10 h-2 rounded bg-primary/70" />
        <div className="w-7 h-1.5 rounded bg-muted-foreground/40" />
      </div>
    ),
  },
  {
    id: '50-50',
    name: '2 Columns (50 / 50)',
    description: 'Balanced two-column split with equal space for copy and visual media.',
    icon: <Columns2 className="w-4 h-4 text-primary" />,
    diagram: (
      <div className="w-16 h-10 rounded border border-border bg-muted/30 p-1 grid grid-cols-2 gap-1 items-center">
        <div className="h-full rounded bg-primary/40 border border-primary/30" />
        <div className="h-full rounded bg-muted-foreground/30" />
      </div>
    ),
  },
  {
    id: '40-60',
    name: '40 / 60 Split',
    description: 'Compact side column (40%) paired with prominent showcase area (60%).',
    icon: <Columns2 className="w-4 h-4 text-primary" />,
    diagram: (
      <div className="w-16 h-10 rounded border border-border bg-muted/30 p-1 flex gap-1 items-center">
        <div className="w-[40%] h-full rounded bg-muted-foreground/30" />
        <div className="w-[60%] h-full rounded bg-primary/40 border border-primary/30" />
      </div>
    ),
  },
  {
    id: '60-40',
    name: '60 / 40 Split',
    description: 'Prominent headline narrative (60%) paired with compact media column (40%).',
    icon: <Columns2 className="w-4 h-4 text-primary" />,
    diagram: (
      <div className="w-16 h-10 rounded border border-border bg-muted/30 p-1 flex gap-1 items-center">
        <div className="w-[60%] h-full rounded bg-primary/40 border border-primary/30" />
        <div className="w-[40%] h-full rounded bg-muted-foreground/30" />
      </div>
    ),
  },
  {
    id: 'split-reverse',
    name: 'Swap Order (Reversed)',
    description: 'Flip element sequence (e.g. Media | Copy becomes Copy | Media) preserving nodes.',
    icon: <ArrowLeftRight className="w-4 h-4 text-primary" />,
    diagram: (
      <div className="w-16 h-10 rounded border border-border bg-muted/30 p-1 grid grid-cols-2 gap-1 items-center">
        <div className="h-full rounded bg-muted-foreground/30" />
        <div className="h-full rounded bg-primary/40 border border-primary/30" />
      </div>
    ),
  },
  {
    id: '3-col',
    name: '3 Columns',
    description: 'Three equal columns designed for feature cards, testimonials, or services.',
    icon: <Grid className="w-4 h-4 text-primary" />,
    diagram: (
      <div className="w-16 h-10 rounded border border-border bg-muted/30 p-1 grid grid-cols-3 gap-1 items-center">
        <div className="h-full rounded bg-muted-foreground/30" />
        <div className="h-full rounded bg-primary/40 border border-primary/30" />
        <div className="h-full rounded bg-muted-foreground/30" />
      </div>
    ),
  },
  {
    id: 'bento',
    name: 'Bento Grid',
    description: 'Modern asymmetric mosaic grid with varying cell proportions for rich feature stories.',
    icon: <LayoutGrid className="w-4 h-4 text-primary" />,
    diagram: (
      <div className="w-16 h-10 rounded border border-border bg-muted/30 p-1 grid grid-cols-3 gap-1">
        <div className="col-span-2 h-4 rounded bg-primary/40 border border-primary/30" />
        <div className="h-4 rounded bg-muted-foreground/30" />
        <div className="h-3 rounded bg-muted-foreground/30" />
        <div className="col-span-2 h-3 rounded bg-muted-foreground/30" />
      </div>
    ),
  },
  {
    id: 'stack',
    name: 'Stack',
    description: 'Sequential vertical stack with configurable spacing between elements.',
    icon: <Rows className="w-4 h-4 text-primary" />,
    diagram: (
      <div className="w-16 h-10 rounded border border-border bg-muted/30 p-1 flex flex-col justify-between">
        <div className="w-full h-2 rounded bg-primary/40 border border-primary/30" />
        <div className="w-full h-2 rounded bg-muted-foreground/30" />
        <div className="w-full h-2 rounded bg-muted-foreground/30" />
      </div>
    ),
  },
  {
    id: 'grid',
    name: 'Multi-Column Grid',
    description: 'Responsive card grid with automatic wrap and uniform gaps.',
    icon: <Grid className="w-4 h-4 text-primary" />,
    diagram: (
      <div className="w-16 h-10 rounded border border-border bg-muted/30 p-1 grid grid-cols-2 gap-1">
        <div className="h-3 rounded bg-muted-foreground/30" />
        <div className="h-3 rounded bg-primary/40" />
        <div className="h-3 rounded bg-primary/40" />
        <div className="h-3 rounded bg-muted-foreground/30" />
      </div>
    ),
  },
];

export function ChangeLayoutModal({
  isOpen,
  onClose,
  sectionId,
}: ChangeLayoutModalProps) {
  const { findNode, changeLayout } = useV3EditorStore();

  const section = sectionId ? findNode(sectionId) : null;
  const currentLayout = (section?.props?.layoutVariant as string) || '1-col';

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
        {LAYOUT_OPTIONS.map((layout) => {
          const isSelected = currentLayout === layout.id;
          return (
            <button
              key={layout.id}
              type="button"
              onClick={() => handleSelectLayout(layout.id)}
              className={`flex flex-col items-start gap-2.5 p-3 rounded-xl border text-left transition-all group ${
                isSelected
                  ? 'bg-primary/10 border-primary ring-2 ring-primary/30 shadow-sm'
                  : 'bg-card border-border hover:border-primary/50 hover:bg-muted/40'
              }`}
            >
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
                  {layout.icon}
                  <span>{layout.name}</span>
                </div>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] shrink-0 shadow">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              {/* Visual Diagram */}
              <div className="w-full flex justify-center py-1">
                {layout.diagram}
              </div>

              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                {layout.description}
              </p>
            </button>
          );
        })}
      </div>
    </Dialog>
  );
}
