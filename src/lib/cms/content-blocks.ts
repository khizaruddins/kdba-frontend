export type ContentBlockType =
  | 'paragraph'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'image'
  | 'quote'
  | 'code'
  | 'divider'
  | 'bullet-list'
  | 'number-list'
  | 'callout';

export interface ContentBlockBase {
  id: string;
  type: ContentBlockType;
}

export interface ParagraphBlock extends ContentBlockBase {
  type: 'paragraph';
  html: string; // safe inline HTML only: <strong>, <em>, <u>, <s>, <code>, <a href>
}

export interface HeadingBlock extends ContentBlockBase {
  type: 'heading2' | 'heading3' | 'heading4';
  text: string;
}

export interface ImageBlock extends ContentBlockBase {
  type: 'image';
  url: string;
  mediaId?: string;
  alt?: string;
  caption?: string;
  width?: 'normal' | 'wide' | 'full';
}

export interface QuoteBlock extends ContentBlockBase {
  type: 'quote';
  text: string;
  attribution?: string;
}

export interface CodeBlock extends ContentBlockBase {
  type: 'code';
  code: string;
  language?: string;
}

export interface DividerBlock extends ContentBlockBase {
  type: 'divider';
}

export interface ListBlock extends ContentBlockBase {
  type: 'bullet-list' | 'number-list';
  items: string[];
}

export interface CalloutBlock extends ContentBlockBase {
  type: 'callout';
  text: string;
  emoji?: string;
}

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | ImageBlock
  | QuoteBlock
  | CodeBlock
  | DividerBlock
  | ListBlock
  | CalloutBlock;

export function createBlock(type: ContentBlockType): ContentBlock {
  const id = Math.random().toString(36).slice(2, 10);
  switch (type) {
    case 'paragraph': return { id, type, html: '' };
    case 'heading2': return { id, type, text: '' };
    case 'heading3': return { id, type, text: '' };
    case 'heading4': return { id, type, text: '' };
    case 'image': return { id, type, url: '', alt: '', caption: '', width: 'normal' };
    case 'quote': return { id, type, text: '', attribution: '' };
    case 'code': return { id, type, code: '', language: '' };
    case 'divider': return { id, type };
    case 'bullet-list': return { id, type, items: [''] };
    case 'number-list': return { id, type, items: [''] };
    case 'callout': return { id, type, text: '', emoji: '💡' };
  }
}

export function blocksToText(blocks: ContentBlock[]): string {
  return blocks.map(b => {
    if ('html' in b) return b.html.replace(/<[^>]+>/g, '');
    if ('text' in b) return b.text;
    if ('code' in b) return b.code;
    if ('items' in b) return b.items.join(' ');
    return '';
  }).join(' ');
}

export function countWords(blocks: ContentBlock[]): number {
  const text = blocksToText(blocks);
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function estimateReadTime(blocks: ContentBlock[]): number {
  return Math.max(1, Math.ceil(countWords(blocks) / 200));
}
