'use client';

import * as React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';

export interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  category: 'Editing' | 'History' | 'Clipboard' | 'Selection';
}

const SHORTCUTS: ShortcutItem[] = [
  { keys: ['⌘ / Ctrl', 'C'], description: 'Copy selected element or section', category: 'Clipboard' },
  { keys: ['⌘ / Ctrl', 'V'], description: 'Paste element into target container', category: 'Clipboard' },
  { keys: ['⌘ / Ctrl', 'D'], description: 'Duplicate selected element', category: 'Clipboard' },
  { keys: ['Delete', 'Backspace'], description: 'Delete selected element', category: 'Editing' },
  { keys: ['Enter'], description: 'Enter inline text editing mode', category: 'Editing' },
  { keys: ['Escape'], description: 'Deselect current element / Exit editing', category: 'Selection' },
  { keys: ['⌘ / Ctrl', 'Z'], description: 'Undo last change', category: 'History' },
  { keys: ['⌘ / Ctrl', '⇧', 'Z'], description: 'Redo previously undone change', category: 'History' },
  { keys: ['⌘ / Ctrl', 'S'], description: 'Save draft revision immediately', category: 'Editing' },
];

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts"
      description="Quickly craft and manipulate website elements with builder hotkeys."
      maxWidth="md"
    >
      <div className="space-y-4 pt-2 select-none">
        <div className="divide-y divide-slate-800/80 rounded-xl bg-slate-900/60 border border-slate-800/80 overflow-hidden">
          {SHORTCUTS.map((shortcut, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 text-xs hover:bg-slate-900 transition-colors"
            >
              <span className="text-slate-300 font-medium">
                {shortcut.description}
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                {shortcut.keys.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 shadow-sm"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <div className="flex items-center gap-1.5">
            <Keyboard className="w-3.5 h-3.5 text-indigo-400" />
            <span>Shortcuts work across canvas, inspector, and layers.</span>
          </div>
          <span>KDBA M3.1 Precision Builder</span>
        </div>
      </div>
    </Dialog>
  );
}
