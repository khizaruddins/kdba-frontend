'use client';

import * as React from 'react';
import { Bold, Italic, Underline, Link, RemoveFormatting, Check, Palette } from 'lucide-react';

export interface InlineFormatToolbarProps {
  onCommit: () => void;
  onColorChange?: (color: string) => void;
}

export function InlineFormatToolbar({ onCommit, onColorChange }: InlineFormatToolbarProps) {
  const [activeStyles, setActiveStyles] = React.useState({
    bold: false,
    italic: false,
    underline: false,
  });

  const checkStyles = React.useCallback(() => {
    if (typeof document === 'undefined') return;
    try {
      setActiveStyles({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
      });
    } catch {
      // Ignore if unsupported in active selection
    }
  }, []);

  React.useEffect(() => {
    const handleSelectionChange = () => checkStyles();
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [checkStyles]);

  const exec = (cmd: string, val: string | undefined = undefined) => {
    document.execCommand(cmd, false, val);
    checkStyles();
  };

  const handleLink = () => {
    const url = prompt('Enter link URL (e.g. https://... or /page):');
    if (url) {
      exec('createLink', url);
    }
  };

  return (
    <div
      onMouseDown={(e) => {
        // Prevent losing focus on contentEditable text
        e.preventDefault();
      }}
      className="flex items-center gap-0.5 p-1 rounded-xl bg-card/95 border border-border shadow-2xl backdrop-blur-md text-foreground text-xs select-none animate-in fade-in zoom-in-95 duration-100"
    >
      <button
        type="button"
        onClick={() => exec('bold')}
        className={`p-1.5 rounded-lg transition-colors ${
          activeStyles.bold
            ? 'bg-primary text-primary-foreground font-bold'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
        title="Bold (⌘B)"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => exec('italic')}
        className={`p-1.5 rounded-lg transition-colors ${
          activeStyles.italic
            ? 'bg-primary text-primary-foreground font-bold'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
        title="Italic (⌘I)"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => exec('underline')}
        className={`p-1.5 rounded-lg transition-colors ${
          activeStyles.underline
            ? 'bg-primary text-primary-foreground font-bold'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
        title="Underline (⌘U)"
      >
        <Underline className="w-3.5 h-3.5" />
      </button>

      <div className="h-4 w-[1px] bg-border mx-0.5" />

      <button
        type="button"
        onClick={handleLink}
        className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        title="Insert Link"
      >
        <Link className="w-3.5 h-3.5" />
      </button>

      {onColorChange && (
        <label className="relative p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer flex items-center">
          <Palette className="w-3.5 h-3.5" />
          <input
            type="color"
            defaultValue="#FFFFFF"
            onChange={(e) => onColorChange(e.target.value)}
            className="sr-only"
            title="Text Color"
          />
        </label>
      )}

      <button
        type="button"
        onClick={() => exec('removeFormat')}
        className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        title="Clear Formatting"
      >
        <RemoveFormatting className="w-3.5 h-3.5" />
      </button>

      <div className="h-4 w-[1px] bg-border mx-0.5" />

      <button
        type="button"
        onClick={onCommit}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm transition-colors"
        title="Finish editing (Enter / Esc)"
      >
        <Check className="w-3 h-3" />
        <span>Done</span>
      </button>
    </div>
  );
}
