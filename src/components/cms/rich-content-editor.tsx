'use client';

import * as React from 'react';
import {
  ContentBlock,
  ContentBlockType,
  createBlock,
  ParagraphBlock,
  HeadingBlock,
  QuoteBlock,
  CodeBlock,
  ListBlock,
  CalloutBlock,
  ImageBlock,
} from '@/lib/cms/content-blocks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code as CodeIcon,
  Link as LinkIcon,
  Heading2,
  Heading3,
  GripVertical,
  Plus,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { MediaPickerModal } from '@/components/ui/media-picker-modal';

export interface RichContentEditorProps {
  value: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export function RichContentEditor({
  value,
  onChange,
  placeholder,
  readOnly = false,
}: RichContentEditorProps) {
  const [blocks, setBlocks] = React.useState<ContentBlock[]>(
    value.length > 0 ? value : [createBlock('paragraph')]
  );
  const [activeBlockId, setActiveBlockId] = React.useState<string | null>(null);

  React.useEffect(() => {
    onChange(blocks);
  }, [blocks, onChange]);

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } as ContentBlock : b))
    );
  };

  const insertBlockAfter = (id: string, type: ContentBlockType = 'paragraph') => {
    const newBlock = createBlock(type);
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      next.splice(idx + 1, 0, newBlock);
      return next;
    });
    setTimeout(() => {
      const el = document.getElementById(`block-${newBlock.id}`);
      if (el) el.focus();
    }, 50);
  };

  const removeBlock = (id: string) => {
    if (blocks.length <= 1) return;
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string, index: number, block: ContentBlock) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (block.type === 'paragraph' || block.type === 'heading2' || block.type === 'heading3' || block.type === 'heading4') {
        e.preventDefault();
        insertBlockAfter(id);
      }
    }
    if (e.key === 'Backspace') {
      const el = e.currentTarget as HTMLElement;
      if (el.textContent === '') {
        e.preventDefault();
        removeBlock(id);
        if (index > 0) {
          setTimeout(() => {
            document.getElementById(`block-${blocks[index - 1].id}`)?.focus();
          }, 50);
        }
      }
    }
  };

  const renderBlock = (block: ContentBlock, index: number) => {
    const isFocused = activeBlockId === block.id;

    return (
      <div
        key={block.id}
        className="group relative flex gap-2 -ml-12 py-1 items-start"
        onFocus={() => setActiveBlockId(block.id)}
      >
        <div
          className={`mt-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity w-10 justify-end ${
            isFocused ? 'opacity-100' : ''
          }`}
          contentEditable={false}
        >
          <Button
            variant="ghost"
            size="icon"
            className="size-6 h-6 w-6 rounded-md text-muted-foreground hover:bg-muted"
            onClick={() => insertBlockAfter(block.id)}
            title="Add block"
          >
            <Plus className="size-4" />
          </Button>
          <div className="cursor-grab text-muted-foreground hover:bg-muted rounded-md p-1">
            <GripVertical className="size-4" />
          </div>
        </div>

        <div className="flex-1 min-w-0" data-block-id={block.id}>
          <BlockRenderer
            block={block}
            onChange={(updates) => updateBlock(block.id, updates)}
            onKeyDown={(e) => handleKeyDown(e, block.id, index, block)}
            readOnly={readOnly}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {blocks.map((block, i) => renderBlock(block, i))}
      <div className="mt-8 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newBlock = createBlock('paragraph');
            setBlocks([...blocks, newBlock]);
          }}
        >
          <Plus className="size-4 mr-2" />
          Add Content
        </Button>
      </div>
    </div>
  );
}

function BlockRenderer({
  block,
  onChange,
  onKeyDown,
  readOnly,
}: {
  block: ContentBlock;
  onChange: (updates: Partial<ContentBlock>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  readOnly: boolean;
}) {
  const [mediaPickerOpen, setMediaPickerOpen] = React.useState(false);

  if (block.type === 'paragraph') {
    return (
      <div
        id={`block-${block.id}`}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        className="outline-none min-h-[1.5em] text-foreground leading-relaxed"
        onBlur={(e) => onChange({ html: e.currentTarget.innerHTML })}
        onKeyDown={onKeyDown}
        dangerouslySetInnerHTML={{ __html: block.html || '' }}
        data-placeholder="Type '/' for commands"
      />
    );
  }

  if (block.type === 'heading2') {
    return (
      <h2
        id={`block-${block.id}`}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        className="outline-none min-h-[1.5em] text-3xl font-bold mt-8 mb-4 text-foreground"
        onBlur={(e) => onChange({ text: e.currentTarget.textContent || '' })}
        onKeyDown={onKeyDown}
      >
        {block.text}
      </h2>
    );
  }

  if (block.type === 'heading3') {
    return (
      <h3
        id={`block-${block.id}`}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        className="outline-none min-h-[1.5em] text-2xl font-bold mt-6 mb-3 text-foreground"
        onBlur={(e) => onChange({ text: e.currentTarget.textContent || '' })}
        onKeyDown={onKeyDown}
      >
        {block.text}
      </h3>
    );
  }

  if (block.type === 'heading4') {
    return (
      <h4
        id={`block-${block.id}`}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        className="outline-none min-h-[1.5em] text-xl font-bold mt-4 mb-2 text-foreground"
        onBlur={(e) => onChange({ text: e.currentTarget.textContent || '' })}
        onKeyDown={onKeyDown}
      >
        {block.text}
      </h4>
    );
  }

  if (block.type === 'quote') {
    return (
      <blockquote className="border-l-4 border-muted pl-4 italic text-muted-foreground my-4">
        <div
          id={`block-${block.id}`}
          contentEditable={!readOnly}
          suppressContentEditableWarning
          className="outline-none min-h-[1.5em]"
          onBlur={(e) => onChange({ text: e.currentTarget.textContent || '' })}
          onKeyDown={onKeyDown}
        >
          {block.text}
        </div>
      </blockquote>
    );
  }

  if (block.type === 'code') {
    return (
      <div className="my-4 bg-muted p-4 rounded-md font-mono text-sm">
        <textarea
          className="w-full bg-transparent outline-none resize-none"
          value={block.code}
          onChange={(e) => onChange({ code: e.target.value })}
          placeholder="Code here..."
          rows={Math.max(3, block.code.split('\n').length)}
        />
      </div>
    );
  }

  if (block.type === 'divider') {
    return <hr className="my-8 border-border" />;
  }

  if (block.type === 'bullet-list') {
    return (
      <ul className="list-disc pl-6 my-4 text-foreground">
        {block.items.map((item, i) => (
          <li
            key={i}
            contentEditable={!readOnly}
            suppressContentEditableWarning
            className="outline-none min-h-[1.5em]"
            onBlur={(e) => {
              const newItems = [...block.items];
              newItems[i] = e.currentTarget.textContent || '';
              onChange({ items: newItems });
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === 'number-list') {
    return (
      <ol className="list-decimal pl-6 my-4 text-foreground">
        {block.items.map((item, i) => (
          <li
            key={i}
            contentEditable={!readOnly}
            suppressContentEditableWarning
            className="outline-none min-h-[1.5em]"
            onBlur={(e) => {
              const newItems = [...block.items];
              newItems[i] = e.currentTarget.textContent || '';
              onChange({ items: newItems });
            }}
          >
            {item}
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === 'callout') {
    return (
      <div className="bg-muted p-4 rounded-md flex gap-4 my-4 items-start">
        <span className="text-xl">{block.emoji}</span>
        <div
          contentEditable={!readOnly}
          suppressContentEditableWarning
          className="outline-none min-h-[1.5em] flex-1 text-foreground"
          onBlur={(e) => onChange({ text: e.currentTarget.textContent || '' })}
        >
          {block.text}
        </div>
      </div>
    );
  }

  if (block.type === 'image') {
    return (
      <div className="my-4">
        {block.url ? (
          <div className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={block.url}
              alt={block.alt || ''}
              className="max-w-full rounded-md border"
            />
            <div className="mt-2">
              <Input
                placeholder="Caption (optional)"
                value={block.caption || ''}
                onChange={(e) => onChange({ caption: e.target.value })}
                className="text-sm text-center border-none bg-transparent"
              />
            </div>
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50"
            onClick={() => setMediaPickerOpen(true)}
          >
            <ImageIcon className="size-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Click to upload image</p>
          </div>
        )}
        <MediaPickerModal
          isOpen={mediaPickerOpen}
          onClose={() => setMediaPickerOpen(false)}
          onSelect={(url) => {
            onChange({ url });
            setMediaPickerOpen(false);
          }}
        />
      </div>
    );
  }

  return null;
}
