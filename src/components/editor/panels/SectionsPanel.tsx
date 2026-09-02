'use client';

import * as React from 'react';
import { useEditorStore } from '@/stores/editor-store';
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ChevronRight,
  Plus,
  Trash2,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { SECTION_METADATA_MAP } from '@/lib/document/defaults';
import { SectionType } from '@/types';

export function SectionsPanel() {
  const {
    website,
    activePageId,
    setActivePageId,
    activeSectionId,
    setActiveSectionId,
    toggleSection,
    moveSection,
    addSection,
    deleteSection,
  } = useEditorStore();

  const [isAddSectionOpen, setIsAddSectionOpen] = React.useState(false);

  if (!website) return null;

  const pages = Array.isArray(website.pages) ? website.pages : [];
  const activePage =
    pages.find((p: any) => p.id === activePageId) || pages[0];

  const sections = Array.isArray(activePage?.sections) ? activePage.sections : [];

  const availableTypes: SectionType[] = [
    'hero',
    'about',
    'services',
    'features',
    'products',
    'portfolio',
    'gallery',
    'team',
    'testimonials',
    'stats',
    'pricing',
    'faq',
    'process',
    'contact',
    'map',
    'opening-hours',
    'cta',
    'footer',
  ];

  return (
    <div className="space-y-6">
      {/* Page Switcher */}
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
          Current Page
        </label>
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-800 bg-slate-900 p-1">
          {pages.map((page: any) => (
            <button
              key={page.id}
              type="button"
              onClick={() => setActivePageId(page.id)}
              className={`flex-1 min-w-[70px] rounded-lg py-1.5 px-2 text-xs font-semibold transition-all cursor-pointer text-center truncate ${
                page.id === activePage?.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {page.title}
            </button>
          ))}
        </div>
      </div>

      {/* Sections List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {activePage?.title} Sections ({sections.length})
          </label>
        </div>

        <div className="space-y-2">
          {sections.map((section: any, idx: number) => {
            const isSelected = activeSectionId === section.id;
            const isEnabled = section.enabled !== false;

            return (
              <div
                key={section.id}
                className={`group flex items-center justify-between rounded-xl border p-2.5 transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-md ring-1 ring-indigo-500'
                    : isEnabled
                    ? 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                    : 'border-slate-900 bg-slate-950/60 opacity-50'
                }`}
              >
                {/* Title & Click to edit */}
                <button
                  type="button"
                  onClick={() => setActiveSectionId(section.id)}
                  className="flex items-center gap-2.5 text-left flex-1 cursor-pointer overflow-hidden"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs font-semibold text-slate-200 truncate block group-hover:text-white">
                      {section.title || section.type}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {section.variant || 'default'}
                    </span>
                  </div>
                </button>

                {/* Section Controls */}
                <div className="flex items-center gap-0.5 shrink-0 ml-2">
                  {/* Reorder Up */}
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveSection(activePage.id, idx, 'up')}
                    className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300 disabled:opacity-20 cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>

                  {/* Reorder Down */}
                  <button
                    type="button"
                    disabled={idx === sections.length - 1}
                    onClick={() => moveSection(activePage.id, idx, 'down')}
                    className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300 disabled:opacity-20 cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>

                  {/* Toggle Visibility */}
                  <button
                    type="button"
                    onClick={() => toggleSection(activePage.id, section.id)}
                    className={`rounded p-1 transition-colors cursor-pointer ${
                      isEnabled
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-400'
                    }`}
                    title={isEnabled ? 'Hide section' : 'Show section'}
                  >
                    {isEnabled ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {/* Delete Section */}
                  <button
                    type="button"
                    onClick={() => deleteSection(activePage.id, section.id)}
                    className="rounded p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 cursor-pointer"
                    title="Delete section"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  {/* Open Section Properties */}
                  <button
                    type="button"
                    onClick={() => setActiveSectionId(section.id)}
                    className="rounded p-1 text-indigo-400 hover:bg-slate-800 hover:text-white cursor-pointer ml-1"
                    title="Edit section"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Section Button */}
        <div className="pt-3">
          <button
            type="button"
            onClick={() => setIsAddSectionOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 py-2.5 text-xs font-semibold text-indigo-400 hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-300 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Section</span>
          </button>
        </div>
      </div>

      {/* Add Section Dialog */}
      <Dialog
        isOpen={isAddSectionOpen}
        onClose={() => setIsAddSectionOpen(false)}
        title={`Add Section to ${activePage?.title}`}
        description="Choose a section from the component library."
      >
        <div className="space-y-2.5 pt-2 max-h-96 overflow-y-auto pr-1">
          {availableTypes.map((type) => {
            const meta = SECTION_METADATA_MAP[type];
            return (
              <div
                key={type}
                onClick={() => {
                  if (activePage) {
                    addSection(activePage.id, type, meta?.name || type);
                    setIsAddSectionOpen(false);
                  }
                }}
                className="group flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 hover:border-indigo-500 hover:bg-indigo-500/10 transition-all cursor-pointer text-left"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors text-xs font-bold">
                  {type.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-white block group-hover:text-indigo-200">
                    {meta?.name || type}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug">
                    {meta?.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddSectionOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
