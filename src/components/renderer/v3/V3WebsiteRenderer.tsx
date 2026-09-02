'use client';

import * as React from 'react';
import { WebsiteDocumentV3 } from '@/types/v3-document';
import { NodeRenderer } from './NodeRenderer';

export interface V3WebsiteRendererProps {
  document: WebsiteDocumentV3;
  activePageId?: string | null;
  activePageSlug?: string | null;
  isEditing?: boolean;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  selectedNodeId?: string | null;
  hoveredNodeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
  onHoverNode?: (nodeId: string | null) => void;
  onDoubleClickText?: (nodeId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function V3WebsiteRenderer({
  document,
  activePageId,
  activePageSlug,
  isEditing = false,
  viewport = 'desktop',
  selectedNodeId,
  hoveredNodeId,
  onSelectNode,
  onHoverNode,
  onDoubleClickText,
  className = '',
  style = {},
}: V3WebsiteRendererProps) {
  if (!document) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-8 text-slate-500">
        <p className="text-xs">No website document loaded.</p>
      </div>
    );
  }

  const pages = Array.isArray(document.pages) ? document.pages : [];

  // Determine active page
  let currentPage = null;
  if (activePageId) {
    currentPage = pages.find((p) => p.id === activePageId);
  } else if (activePageSlug) {
    currentPage = pages.find((p) => p.slug === activePageSlug);
  } else {
    currentPage = pages.find((p) => p.slug === '/') || pages[0];
  }

  if (!currentPage && pages.length > 0) {
    currentPage = pages[0];
  }

  const themeColors = document.theme?.colors || {
    primary: '#4F46E5',
    secondary: '#0F172A',
    accent: '#06B6D4',
    background: '#0B0D13',
    surface: '#131620',
    text: '#FFFFFF',
    muted: '#94A3B8',
    border: '#212636',
  };

  const cssVariables = {
    '--kdba-primary': themeColors.primary,
    '--kdba-secondary': themeColors.secondary,
    '--kdba-accent': themeColors.accent,
    '--kdba-background': themeColors.background,
    '--kdba-surface': themeColors.surface,
    '--kdba-text': themeColors.text,
    '--kdba-muted': themeColors.muted,
    '--kdba-border': themeColors.border,
    '--kdba-font-heading': document.theme?.typography?.h1?.fontFamily || 'Inter',
    '--kdba-font-body': document.theme?.typography?.body?.fontFamily || 'Inter',
    ...style,
  } as React.CSSProperties;

  return (
    <div
      style={cssVariables}
      className={`min-h-screen w-full bg-[var(--kdba-background)] text-[var(--kdba-text)] ${className}`}
    >
      {currentPage?.root ? (
        <NodeRenderer
          node={currentPage.root}
          isEditing={isEditing}
          viewport={viewport}
          selectedNodeId={selectedNodeId}
          hoveredNodeId={hoveredNodeId}
          onSelectNode={onSelectNode}
          onHoverNode={onHoverNode}
          onDoubleClickText={onDoubleClickText}
        />
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center text-slate-500">
          <p className="text-sm font-semibold text-slate-300">Empty Page</p>
          <p className="text-xs mt-1 text-slate-500">Add sections from the left panel.</p>
        </div>
      )}
    </div>
  );
}
