'use client';

import * as React from 'react';
import { WebsiteNode } from '@/types/v3-document';
import {
  TEXT_RUNS_PROP,
  applyMarksToRuns,
  normalizeRuns,
  runsFromText,
  sanitizeHref,
  textFromRuns,
} from '@/lib/editor/rich-text';
import { Bold, Italic, Underline, Link, List, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export function RichTextControl({
  node,
  onChangeProps,
  onChangeAlign,
}: {
  node: WebsiteNode;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeAlign?: (align: 'left' | 'center' | 'right') => void;
}) {
  if (!['heading', 'paragraph', 'rich-text', 'text'].includes(node.type)) return null;

  const props = node.props || {};
  const runs = normalizeRuns(props[TEXT_RUNS_PROP]);
  const plain = textFromRuns(runs) || String(props.text || '');
  const allBold = runs.length > 0 && runs.every((run) => run.bold);
  const allItalic = runs.length > 0 && runs.every((run) => run.italic);
  const allUnderline = runs.length > 0 && runs.every((run) => run.underline);

  const apply = (marks: { bold?: boolean; italic?: boolean; underline?: boolean; href?: string }) => {
    const source = runs.length ? runs : runsFromText(plain);
    onChangeProps({
      text: textFromRuns(source) || plain,
      [TEXT_RUNS_PROP]: applyMarksToRuns(source, marks),
    });
  };

  const addLink = () => {
    const href = window.prompt('Link URL', runs.find((run) => run.href)?.href || 'https://');
    if (href === null) return;
    const clean = sanitizeHref(href);
    apply({ href: clean });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        <MarkButton active={allBold} label="Bold" onClick={() => apply({ bold: !allBold })}>
          <Bold className="w-3.5 h-3.5" />
        </MarkButton>
        <MarkButton active={allItalic} label="Italic" onClick={() => apply({ italic: !allItalic })}>
          <Italic className="w-3.5 h-3.5" />
        </MarkButton>
        <MarkButton active={allUnderline} label="Underline" onClick={() => apply({ underline: !allUnderline })}>
          <Underline className="w-3.5 h-3.5" />
        </MarkButton>
        <MarkButton active={Boolean(runs.some((run) => run.href))} label="Link" onClick={addLink}>
          <Link className="w-3.5 h-3.5" />
        </MarkButton>
        {node.type === 'paragraph' && (
          <MarkButton
            active={props.list === 'ul'}
            label="List"
            onClick={() => onChangeProps({ list: props.list === 'ul' ? 'none' : 'ul' })}
          >
            <List className="w-3.5 h-3.5" />
          </MarkButton>
        )}
        {onChangeAlign && (
          <>
            <MarkButton label="Align left" onClick={() => onChangeAlign('left')}>
              <AlignLeft className="w-3.5 h-3.5" />
            </MarkButton>
            <MarkButton label="Align center" onClick={() => onChangeAlign('center')}>
              <AlignCenter className="w-3.5 h-3.5" />
            </MarkButton>
            <MarkButton label="Align right" onClick={() => onChangeAlign('right')}>
              <AlignRight className="w-3.5 h-3.5" />
            </MarkButton>
          </>
        )}
      </div>
    </div>
  );
}

function MarkButton({
  active,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`h-7 w-7 rounded-md flex items-center justify-center ${
        active ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:text-foreground border border-border'
      }`}
    >
      {children}
    </button>
  );
}
