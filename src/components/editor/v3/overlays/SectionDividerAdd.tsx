'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { Plus } from 'lucide-react';

export interface SectionDividerAddProps {
  index: number;
  targetParentId: string;
}

export function SectionDividerAdd({
  index,
  targetParentId,
}: SectionDividerAddProps) {
  const { addNode, setSelectedNodeId } = useV3EditorStore();
  const [isHovered, setIsHovered] = React.useState(false);

  const handleAddSection = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSection = addNode(
      targetParentId,
      {
        type: 'section',
        name: 'New Section',
        props: { fullWidth: true, variant: 'default' },
        styles: {
          layout: { position: 'relative', width: '100%' },
          spacing: { padding: { top: '80px', bottom: '80px', left: '24px', right: '24px' } },
          background: { color: 'transparent' },
        },
      },
      index,
    );

    // Also add a default container inside the new section
    if (newSection && newSection.id) {
      addNode(newSection.id, {
        type: 'container',
        name: 'Container',
        props: { maxWidth: '1200px' },
        styles: {
          layout: { position: 'relative', width: '100%', maxWidth: '1200px' },
          spacing: { margin: { left: 'auto', right: 'auto' }, padding: { left: '24px', right: '24px' } },
        },
      });
      setSelectedNodeId(newSection.id);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-4 flex items-center justify-center my-[-8px] z-20 group transition-all"
    >
      {/* Subtle indicator or glowing active line */}
      <div
        className={`w-full transition-all duration-200 ${
          isHovered
            ? 'h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_10px_rgba(99,102,241,0.6)]'
            : 'h-[1px] bg-transparent group-hover:bg-slate-800'
        }`}
      />

      {/* Floating Add Section Pill */}
      <button
        type="button"
        onClick={handleAddSection}
        className={`absolute px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-all duration-200 ${
          isHovered
            ? 'scale-100 opacity-100 bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            : 'scale-90 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto bg-slate-900 border border-slate-700 text-slate-300'
        }`}
        title="Add a new section here"
      >
        <Plus className="w-3.5 h-3.5 text-white" />
        <span>Add Section</span>
      </button>
    </div>
  );
}
