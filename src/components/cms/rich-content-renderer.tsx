import * as React from 'react';
import { ContentBlock } from '@/lib/cms/content-blocks';

function sanitize(html: string): string {
  // Simple sanitizer for demonstration. In a real app, use DOMPurify.
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

export function RichContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="prose prose-invert max-w-none prose-img:rounded-xl prose-hr:border-border">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  if (block.type === 'paragraph') {
    return <p dangerouslySetInnerHTML={{ __html: sanitize(block.html) }} />;
  }

  if (block.type === 'heading2') {
    return <h2 id={`h-${block.id}`}>{block.text}</h2>;
  }
  if (block.type === 'heading3') {
    return <h3 id={`h-${block.id}`}>{block.text}</h3>;
  }
  if (block.type === 'heading4') {
    return <h4 id={`h-${block.id}`}>{block.text}</h4>;
  }

  if (block.type === 'image') {
    return (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={block.url} alt={block.alt || ''} className="w-full" />
        {block.caption && <figcaption className="text-center">{block.caption}</figcaption>}
      </figure>
    );
  }

  if (block.type === 'quote') {
    return (
      <blockquote className="border-l-4 border-muted pl-4 italic">
        <p>{block.text}</p>
        {block.attribution && <footer>— {block.attribution}</footer>}
      </blockquote>
    );
  }

  if (block.type === 'code') {
    return (
      <pre className="bg-muted p-4 rounded-md overflow-x-auto">
        <code>{block.code}</code>
      </pre>
    );
  }

  if (block.type === 'divider') {
    return <hr />;
  }

  if (block.type === 'bullet-list') {
    return (
      <ul>
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.type === 'number-list') {
    return (
      <ol>
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ol>
    );
  }

  if (block.type === 'callout') {
    return (
      <div className="bg-muted p-4 rounded-md flex gap-4 my-4">
        <span className="text-xl">{block.emoji}</span>
        <div>{block.text}</div>
      </div>
    );
  }

  return null;
}
