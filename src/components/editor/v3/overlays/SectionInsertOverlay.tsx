'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { SECTION_PRESETS } from '@/lib/editor/section-presets';
import { Plus, X } from 'lucide-react';

export function SectionInsertOverlay() {
  const document = useV3EditorStore((s) => s.document);
  const activePageId = useV3EditorStore((s) => s.activePageId);
  const previewMode = useV3EditorStore((s) => s.previewMode);
  const insertSectionPreset = useV3EditorStore((s) => s.insertSectionPreset);
  const getActivePage = useV3EditorStore((s) => s.getActivePage);

  const [openAfterId, setOpenAfterId] = React.useState<string | null>(null);
  const [bars, setBars] = React.useState<Array<{ id: string; top: number; left: number; width: number }>>([]);

  const page = getActivePage();
  const sectionIds =
    page?.root.children
      ?.filter((c) => c.type === 'section' || c.type === 'navbar' || c.type === 'footer')
      .map((c) => c.id) ?? [];
  const sectionKey = sectionIds.join(',');

  React.useEffect(() => {
    if (previewMode) {
      const frame = requestAnimationFrame(() => setBars([]));
      return () => cancelAnimationFrame(frame);
    }

    const ids = sectionKey ? sectionKey.split(',') : [];
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next: Array<{ id: string; top: number; left: number; width: number }> = [];
        ids.forEach((id) => {
          const el = window.document.querySelector(`[data-node-id="${id}"]`);
          if (!el) return;
          const rect = el.getBoundingClientRect();
          next.push({ id, top: rect.bottom, left: rect.left, width: rect.width });
        });
        setBars(next);
      });
    };

    measure();
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);
    const timer = window.setInterval(measure, 800);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
      window.clearInterval(timer);
    };
  }, [previewMode, sectionKey, document, activePageId]);

  if (previewMode || bars.length === 0) return null;

  return (
    <>
      {bars.map((bar) => (
        <div
          key={bar.id}
          data-editor-chrome
          style={{
            position: 'fixed',
            top: bar.top - 12,
            left: bar.left,
            width: bar.width,
            zIndex: 30,
          }}
          className="flex justify-center pointer-events-none"
        >
          <button
            type="button"
            onClick={() => setOpenAfterId(openAfterId === bar.id ? null : bar.id)}
            className="pointer-events-auto flex items-center gap-1 h-6 px-2 rounded-full bg-background border border-primary/40 text-[10px] font-semibold text-primary hover:bg-primary hover:text-primary-foreground shadow-lg"
          >
            <Plus className="w-3 h-3" />
            Add Section
          </button>
        </div>
      ))}

      {openAfterId && (
        <div
          data-editor-chrome
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-6"
          onClick={() => setOpenAfterId(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-border bg-background p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Insert section</h3>
              <button type="button" onClick={() => setOpenAfterId(null)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SECTION_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    insertSectionPreset(preset.build(), openAfterId);
                    setOpenAfterId(null);
                  }}
                  className="text-left p-3 rounded-xl bg-muted/50 border border-border hover:border-primary/50 hover:bg-muted/50"
                >
                  <div className="text-xs font-semibold text-foreground">{preset.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-1 leading-snug">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
