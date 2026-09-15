'use client';

import * as React from 'react';
import { WebsiteDocumentV3 } from '@/types/v3-document';
import { NodeRenderer } from './NodeRenderer';
import { V3RenderProvider } from './V3RenderContext';
import { getThemeLayoutTokens, resolveThemeColor } from '@/lib/editor/theme-tokens';

export interface V3WebsiteRendererProps {
  document: WebsiteDocumentV3;
  activePageId?: string | null;
  activePageSlug?: string | null;
  isEditing?: boolean;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  inlineEditingNodeId?: string | null;
  onCommitProps?: (nodeId: string, props: Record<string, unknown>) => void;
  onEndInlineEdit?: () => void;
  onStartInlineEdit?: (nodeId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function V3WebsiteRenderer({
  document,
  activePageId,
  activePageSlug,
  isEditing = false,
  viewport = 'desktop',
  inlineEditingNodeId = null,
  onCommitProps,
  onEndInlineEdit,
  onStartInlineEdit,
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

  let currentPage = null;
  if (activePageId) {
    currentPage = pages.find((p) => p.id === activePageId);
  } else if (activePageSlug) {
    currentPage = pages.find((p) => p.slug === activePageSlug);
  } else {
    currentPage = pages.find((p) => p.type === 'home' || p.slug === '/') || pages.find((p) => p.enabled !== false) || pages[0];
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

  const layoutTokens = getThemeLayoutTokens(document.theme?.tokens);
  const headingScale = Number(layoutTokens.headingScale) || 1;
  const bodyScale = Number(layoutTokens.bodyScale) || 1;

  const cssVariables = {
    '--kdba-primary': themeColors.primary,
    '--kdba-secondary': themeColors.secondary,
    '--kdba-accent': themeColors.accent,
    '--kdba-background': themeColors.background,
    '--kdba-surface': themeColors.surface,
    '--kdba-text': themeColors.text,
    '--kdba-muted': themeColors.muted,
    '--kdba-border': themeColors.border,
    '--kdba-font-heading':
      document.theme?.typography?.headingFont ||
      document.theme?.headingFont ||
      document.theme?.typography?.h1?.fontFamily ||
      'Inter',
    '--kdba-font-body':
      document.theme?.typography?.bodyFont ||
      document.theme?.bodyFont ||
      document.theme?.typography?.body?.fontFamily ||
      'Inter',
    '--kdba-container-max': layoutTokens.containerMaxWidth,
    '--kdba-button-radius': layoutTokens.buttonRadius,
    '--kdba-button-bg': resolveThemeColor(layoutTokens.buttonBackground) || layoutTokens.buttonBackground,
    '--kdba-button-fg': resolveThemeColor(layoutTokens.buttonColor) || layoutTokens.buttonColor,
    '--kdba-radius': layoutTokens.radius,
    '--kdba-shadow': layoutTokens.shadow,
    '--kdba-space': layoutTokens.spaceScale,
    '--kdba-heading-line': layoutTokens.headingLineHeight,
    '--kdba-body-line': layoutTokens.bodyLineHeight,
    '--kdba-tracking': layoutTokens.letterSpacing,
    '--kdba-h1': `${Math.round(56 * headingScale)}px`,
    '--kdba-h2': `${Math.round(40 * headingScale)}px`,
    '--kdba-h3': `${Math.round(28 * headingScale)}px`,
    '--kdba-body-size': `${Math.round(16 * bodyScale)}px`,
    ...style,
  } as React.CSSProperties;

  const nodeProps = {
    isEditing,
    viewport,
    inlineEditingNodeId,
    onCommitProps,
    onEndInlineEdit,
    onStartInlineEdit,
  };

  return (
    <V3RenderProvider value={{ document, isEditing, viewport }}>
      <div
        style={cssVariables}
        className={`min-h-screen w-full bg-[var(--kdba-background)] text-[var(--kdba-text)] ${className}`}
      >
        <style>{`
          .kdba-node[data-has-hover]:hover {
            background-color: var(--kdba-hover-bg, inherit);
            color: var(--kdba-hover-color, inherit);
            box-shadow: var(--kdba-hover-shadow, inherit);
            opacity: var(--kdba-hover-opacity, inherit);
          }
          .kdba-node[data-disabled="true"] {
            opacity: 0.55;
            pointer-events: none;
          }
        `}</style>
        {document.global?.headerNode && (
          <NodeRenderer node={document.global.headerNode} {...nodeProps} />
        )}
        {currentPage?.root ? (
          <NodeRenderer node={currentPage.root} {...nodeProps} />
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center text-slate-500">
            <p className="text-sm font-semibold text-slate-300">Empty Page</p>
            <p className="text-xs mt-1 text-slate-500">Add sections from the left panel.</p>
          </div>
        )}
        {document.global?.footerNode && (
          <NodeRenderer node={document.global.footerNode} {...nodeProps} />
        )}
      </div>
    </V3RenderProvider>
  );
}
