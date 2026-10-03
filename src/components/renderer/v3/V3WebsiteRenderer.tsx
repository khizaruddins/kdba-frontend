'use client';

import * as React from 'react';
import { WebsiteDocumentV3 } from '@/types/v3-document';
import { NodeRenderer } from './NodeRenderer';
import { V3RenderProvider } from './V3RenderContext';
import { getThemeLayoutTokens, resolveThemeColor } from '@/lib/editor/theme-tokens';
import { CmsRenderPayload } from '@/lib/cms/bindings';
import { CmsRecord } from '@/types/cms';
import { buildGoogleFontsUrl, extractAllDocumentFonts, formatFontFamilyWithFallback } from '@/lib/fonts/google-fonts';

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
  onNavigate?: (url: string) => void;
  className?: string;
  style?: React.CSSProperties;
  tenantSlug?: string | null;
  cms?: CmsRenderPayload | null;
  activeRecord?: CmsRecord | null;
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
  onNavigate,
  className = '',
  style = {},
  tenantSlug,
  cms = null,
  activeRecord = null,
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

  const rawHeadingFont =
    document.theme?.typography?.headingFont ||
    document.theme?.headingFont ||
    document.theme?.typography?.h1?.fontFamily ||
    'Inter';
  const rawBodyFont =
    document.theme?.typography?.bodyFont ||
    document.theme?.bodyFont ||
    document.theme?.typography?.body?.fontFamily ||
    'Inter';

  const headingFont = formatFontFamilyWithFallback(rawHeadingFont);
  const bodyFont = formatFontFamilyWithFallback(rawBodyFont);

  const googleFontsUrl = React.useMemo(() => {
    const fonts = extractAllDocumentFonts(document as unknown as Record<string, unknown>);
    return buildGoogleFontsUrl(fonts);
  }, [document]);

  // Inject Google Fonts into the real document <head> so they load in the editor canvas too
  React.useEffect(() => {
    if (!googleFontsUrl || typeof window === 'undefined') return;
    const linkId = 'kdba-google-fonts';
    let link = window.document.getElementById(linkId) as HTMLLinkElement | null;
    if (!link) {
      link = window.document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      window.document.head.appendChild(link);
    }
    if (link.href !== googleFontsUrl) {
      link.href = googleFontsUrl;
    }
  }, [googleFontsUrl]);

  const cssVariables = {
    '--kdba-primary': themeColors.primary,
    '--kdba-secondary': themeColors.secondary,
    '--kdba-accent': themeColors.accent,
    '--kdba-background': themeColors.background,
    '--kdba-surface': themeColors.surface,
    '--kdba-text': themeColors.text,
    '--kdba-muted': themeColors.muted,
    '--kdba-border': themeColors.border,
    '--kdba-font-heading': headingFont,
    '--kdba-font-body': bodyFont,
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
    <V3RenderProvider
      value={{
        document,
        isEditing,
        viewport,
        tenantSlug: tenantSlug || document.settings?.subdomain || document.settings?.customDomain || null,
        cms,
        activeRecord,
        onNavigate,
      }}
    >
      <div
        style={cssVariables}
        className={`min-h-screen w-full bg-[var(--kdba-background)] text-[var(--kdba-text)] ${className}`}
      >
        {googleFontsUrl && (
          // eslint-disable-next-line @next/next/no-page-custom-font
          <link rel="stylesheet" href={googleFontsUrl} />
        )}
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
          @keyframes kdba-fade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes kdba-fade-up {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes kdba-fade-down {
            from { opacity: 0; transform: translateY(-24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes kdba-fade-left {
            from { opacity: 0; transform: translateX(32px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes kdba-fade-right {
            from { opacity: 0; transform: translateX(-32px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes kdba-scale {
            from { opacity: 0; transform: scale(0.92); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes kdba-slide {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          @keyframes kdba-blur-in {
            from { opacity: 0; filter: blur(12px); transform: scale(0.98); }
            to { opacity: 1; filter: blur(0); transform: scale(1); }
          }
          /* on-hover animation trigger */
          .kdba-node[data-anim-hover]:hover {
            animation-name: var(--kdba-hover-anim-name);
            animation-duration: var(--kdba-hover-anim-duration, 600ms);
            animation-delay: var(--kdba-hover-anim-delay, 0ms);
            animation-timing-function: var(--kdba-hover-anim-easing, cubic-bezier(0.16, 1, 0.3, 1));
            animation-fill-mode: both;
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
