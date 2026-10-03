'use client';

import * as React from 'react';
import {
  WebsiteNode,
  StyleDefinition,
  ResponsiveStyleDefinition,
} from '@/types/v3-document';
import { resolveThemeColor } from '@/lib/editor/theme-tokens';
import { GRADIENT_PROP } from '@/lib/document/v3-wire';
import { useV3RenderContext } from './V3RenderContext';
import { ContactFormPrimitive } from './ContactFormPrimitive';
import { buttonVariantStyle, cardVariantStyle } from '@/lib/editor/variants';
import { normalizeRuns, sanitizeHref, TEXT_RUNS_PROP, textFromRuns } from '@/lib/editor/rich-text';
import { applyBindingToProps, recordsForList, resolveCmsMediaValue } from '@/lib/cms/bindings';
import { SectionDividerAdd } from '@/components/editor/v3/overlays/SectionDividerAdd';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { formatFontFamilyWithFallback } from '@/lib/fonts/google-fonts';
import { isNavbarNode, isFooterNode } from '@/lib/editor/global-chrome';

export interface NodeRendererProps {
  node: WebsiteNode;
  isEditing?: boolean;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  inlineEditingNodeId?: string | null;
  onCommitProps?: (nodeId: string, props: Record<string, unknown>) => void;
  onEndInlineEdit?: () => void;
  onStartInlineEdit?: (nodeId: string) => void;
  className?: string;
}

function asCss(value: unknown): string | number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) return value;
  return undefined;
}

export function useResolvedLink() {
  const ctx = useV3RenderContext();
  const tenantSlug = ctx?.tenantSlug;
  const onNavigate = ctx?.onNavigate;
  const isEditing = Boolean(ctx?.isEditing);

  const resolveHref = React.useCallback(
    (rawHref: string | undefined | null): string => {
      if (!rawHref || rawHref === '#') return '#';
      if (/^(https?:|\/\/|mailto:|tel:|javascript:)/i.test(rawHref)) {
        return rawHref;
      }
      if (!tenantSlug) {
        return rawHref;
      }

      const siteBase = `/site/${tenantSlug}`;

      if (rawHref.startsWith('/site/')) {
        return rawHref;
      }

      if (rawHref.startsWith('/#')) {
        return `${siteBase}${rawHref.slice(1)}`;
      }

      if (rawHref.startsWith('#')) {
        return rawHref;
      }

      if (rawHref === '/') {
        return siteBase;
      }

      const cleanPath = rawHref.startsWith('/') ? rawHref : `/${rawHref}`;
      return `${siteBase}${cleanPath}`;
    },
    [tenantSlug],
  );

  const handleLinkClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, rawHref: string | undefined | null) => {
      if (isEditing) {
        e.preventDefault();
        return;
      }

      if (!rawHref || rawHref === '#') {
        e.preventDefault();
        return;
      }

      if (/^(https?:|\/\/|mailto:|tel:)/i.test(rawHref)) {
        return;
      }

      // Check if it's an anchor link (e.g. #contact or /#contact)
      if (rawHref.startsWith('#') || rawHref.startsWith('/#')) {
        const hash = rawHref.startsWith('/#') ? rawHref.slice(1) : rawHref;
        const targetId = hash.replace(/^#/, '');

        // Check if we are currently on a subpage (e.g. /site/[tenantSlug]/about)
        const isSubpage =
          typeof window !== 'undefined' &&
          tenantSlug &&
          window.location.pathname.replace(new RegExp(`^/site/${tenantSlug}`), '').replace(/^\//, '').length > 0;

        if (!isSubpage) {
          e.preventDefault();
          const el =
            document.getElementById(targetId) ||
            document.querySelector(hash) ||
            document.querySelector(`[data-node-name*="${targetId}" i]`) ||
            document.querySelector(`section[id="${targetId}"]`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            if (typeof window !== 'undefined') {
              const currentPath = tenantSlug ? `/site/${tenantSlug}` : window.location.pathname;
              window.history.pushState(null, '', `${currentPath}#${targetId}`);
            }
          }
          return;
        }
      }

      if (onNavigate) {
        e.preventDefault();
        if (rawHref.startsWith('#')) {
          onNavigate(rawHref);
        } else if (rawHref.startsWith('/#')) {
          onNavigate(rawHref.slice(1));
        } else {
          let path = rawHref;
          if (tenantSlug && path.startsWith(`/site/${tenantSlug}`)) {
            path = path.slice(`/site/${tenantSlug}`.length) || '/';
          }
          onNavigate(path);
        }
      }
    },
    [isEditing, onNavigate, tenantSlug],
  );

  return { resolveHref, handleLinkClick };
}

function useNodeAnimation(
  nodeId: string,
  animation: WebsiteNode['animations'],
  isPreviewing: boolean,
) {
  const [element, setElement] = React.useState<HTMLElement | null>(null);
  const [inView, setInView] = React.useState(false);

  const preset = animation?.preset;
  const trigger = animation?.trigger || 'on-load';
  const hasPreset = Boolean(preset && preset !== 'none');

  // Attach ref — stable callback that stores the element in state so effects can depend on it
  const attachRef = React.useCallback((el: unknown) => {
    setElement((el as HTMLElement | null) || null);
  }, []);

  React.useEffect(() => {
    if (!hasPreset || isPreviewing) return;
    if (trigger !== 'on-scroll') {
      setInView(true);
      return;
    }

    if (!element || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasPreset, isPreviewing, trigger, element]);

  const isHoverTrigger = trigger === 'on-hover';

  // For scroll: hide until in-view; for load/hover: animate immediately
  const shouldAnimate = isPreviewing || (hasPreset && (
    trigger === 'on-scroll' ? inView :
    trigger === 'on-hover' ? false :  // hover is handled purely in CSS
    true  // on-load
  ));

  const animKeyframe = isPreviewing
    ? (hasPreset ? `kdba-${preset}` : 'kdba-fade-up')
    : shouldAnimate && !isHoverTrigger
      ? `kdba-${preset}`
      : undefined;

  const animStyle: React.CSSProperties = animKeyframe
    ? {
        animationName: animKeyframe,
        animationDuration: `${animation?.duration ?? 600}ms`,
        animationDelay: `${animation?.delay ?? 0}ms`,
        animationTimingFunction: animation?.easing || 'cubic-bezier(0.16, 1, 0.3, 1)',
        animationFillMode: 'both',
      }
    : (hasPreset && trigger === 'on-scroll' && !inView && !isPreviewing)
      ? { opacity: 0 }
      : {};

  const hoverDataAttr = isHoverTrigger && hasPreset ? `kdba-${preset}` : undefined;
  const hoverCssVars: React.CSSProperties = isHoverTrigger && hasPreset
    ? ({
        '--kdba-hover-anim-name': `kdba-${preset}`,
        '--kdba-hover-anim-duration': `${animation?.duration ?? 600}ms`,
        '--kdba-hover-anim-delay': `${animation?.delay ?? 0}ms`,
        '--kdba-hover-anim-easing': animation?.easing || 'cubic-bezier(0.16, 1, 0.3, 1)',
      } as React.CSSProperties)
    : {};

  return { animStyle, attachRef, hoverDataAttr, hoverCssVars };
}

function RichTextRuns({ runs, fallback }: { runs?: unknown; fallback: string }) {
  const { resolveHref, handleLinkClick } = useResolvedLink();
  const normalized = normalizeRuns(runs);
  if (!normalized.length) return <>{fallback}</>;
  return (
    <>
      {normalized.map((run, index) => {
        let content: React.ReactNode = run.text;
        if (run.italic) content = <em>{content}</em>;
        if (run.bold) content = <strong>{content}</strong>;
        if (run.underline) content = <u>{content}</u>;
        if (run.href) {
          const resolved = resolveHref(run.href);
          return (
            <a
              key={index}
              href={resolved}
              onClick={(e) => handleLinkClick(e, run.href)}
              className="underline underline-offset-2"
            >
              {content}
            </a>
          );
        }
        return <React.Fragment key={index}>{content}</React.Fragment>;
      })}
    </>
  );
}

/**
 * Resolves final CSS styles by merging desktop styles with responsive overrides
 * and active component interaction states (e.g. Hover, Active, Focus in preview)
 */
export function resolveNodeStyles(
  styles?: StyleDefinition,
  responsive?: ResponsiveStyleDefinition,
  viewport: 'desktop' | 'tablet' | 'mobile' = 'desktop',
  stateOverride?: Partial<StyleDefinition>
): React.CSSProperties {
  if (!styles && !responsive && !stateOverride) return {};

  const base = styles || {};
  const tabletOverride = viewport === 'tablet' || viewport === 'mobile' ? responsive?.tablet || {} : {};
  const mobileOverride = viewport === 'mobile' ? responsive?.mobile || {} : {};

  // Merge layout
  const layout = { ...base.layout, ...tabletOverride.layout, ...mobileOverride.layout, ...stateOverride?.layout };
  const flex = { ...base.flex, ...tabletOverride.flex, ...mobileOverride.flex, ...stateOverride?.flex };
  const grid = { ...base.grid, ...tabletOverride.grid, ...mobileOverride.grid, ...stateOverride?.grid };
  const size = { ...base.size, ...tabletOverride.size, ...mobileOverride.size, ...stateOverride?.size };
  const spacing = {
    margin: { ...base.spacing?.margin, ...tabletOverride.spacing?.margin, ...mobileOverride.spacing?.margin, ...stateOverride?.spacing?.margin },
    padding: { ...base.spacing?.padding, ...tabletOverride.spacing?.padding, ...mobileOverride.spacing?.padding, ...stateOverride?.spacing?.padding },
  };
  const typography = { ...base.typography, ...tabletOverride.typography, ...mobileOverride.typography, ...stateOverride?.typography };
  const background = { ...base.background, ...tabletOverride.background, ...mobileOverride.background, ...stateOverride?.background };
  const border = { ...base.border, ...tabletOverride.border, ...mobileOverride.border, ...stateOverride?.border };
  const effects = { ...base.effects, ...tabletOverride.effects, ...mobileOverride.effects, ...stateOverride?.effects };
  const transform = { ...base.transform, ...tabletOverride.transform, ...mobileOverride.transform, ...stateOverride?.transform };

  const css: React.CSSProperties = {};

  // Layout & Positioning
  if (layout.display) css.display = layout.display;
  if (layout.position) css.position = layout.position;
  if (layout.width) css.width = layout.width;
  if (layout.height) css.height = layout.height;
  if (layout.minWidth) css.minWidth = layout.minWidth;
  if (layout.maxWidth) css.maxWidth = layout.maxWidth;
  if (layout.minHeight) css.minHeight = layout.minHeight;
  if (layout.maxHeight) css.maxHeight = layout.maxHeight;
  if (layout.top) css.top = layout.top;
  if (layout.right) css.right = layout.right;
  if (layout.bottom) css.bottom = layout.bottom;
  if (layout.left) css.left = layout.left;
  if (typeof layout.zIndex === 'number') css.zIndex = layout.zIndex;
  if (layout.overflow) css.overflow = layout.overflow;

  // Flexbox
  if (flex.direction) css.flexDirection = flex.direction;
  if (flex.wrap) css.flexWrap = flex.wrap;
  if (flex.justifyContent) css.justifyContent = flex.justifyContent;
  if (flex.alignItems) css.alignItems = flex.alignItems;
  if (flex.alignContent) css.alignContent = flex.alignContent;
  if (asCss(flex.gap)) css.gap = asCss(flex.gap);
  if (asCss(flex.rowGap)) css.rowGap = asCss(flex.rowGap);
  if (asCss(flex.columnGap)) css.columnGap = asCss(flex.columnGap);
  if (typeof flex.grow === 'number') css.flexGrow = flex.grow;
  if (typeof flex.shrink === 'number') css.flexShrink = flex.shrink;
  if (flex.basis) css.flexBasis = flex.basis;

  // CSS Grid
  if (grid.autoFit) {
    css.gridTemplateColumns = `repeat(auto-fit, minmax(${grid.minColumnWidth || '240px'}, 1fr))`;
  } else if (grid.gridTemplateColumns) {
    css.gridTemplateColumns = grid.gridTemplateColumns;
  } else if (grid.columns) {
    css.gridTemplateColumns = `repeat(${grid.columns}, minmax(0, 1fr))`;
  }
  if (grid.columnGap) css.columnGap = grid.columnGap;
  if (grid.rowGap) css.rowGap = grid.rowGap;
  if (grid.columnSpan) css.gridColumn = `span ${grid.columnSpan} / span ${grid.columnSpan}`;

  // Sizing
  if (size.width) css.width = size.width;
  if (size.height) css.height = size.height;
  if (size.minWidth) css.minWidth = size.minWidth;
  if (size.maxWidth) css.maxWidth = size.maxWidth;
  if (size.minHeight) css.minHeight = size.minHeight;
  if (size.maxHeight) css.maxHeight = size.maxHeight;
  if (size.aspectRatio) css.aspectRatio = size.aspectRatio;

  // Spacing (Margin & Padding)
  if (asCss(spacing.margin.top)) css.marginTop = asCss(spacing.margin.top);
  if (asCss(spacing.margin.right)) css.marginRight = asCss(spacing.margin.right);
  if (asCss(spacing.margin.bottom)) css.marginBottom = asCss(spacing.margin.bottom);
  if (asCss(spacing.margin.left)) css.marginLeft = asCss(spacing.margin.left);

  if (asCss(spacing.padding.top)) css.paddingTop = asCss(spacing.padding.top);
  if (asCss(spacing.padding.right)) css.paddingRight = asCss(spacing.padding.right);
  if (asCss(spacing.padding.bottom)) css.paddingBottom = asCss(spacing.padding.bottom);
  if (asCss(spacing.padding.left)) css.paddingLeft = asCss(spacing.padding.left);

  // Typography
  if (typography.fontFamily) css.fontFamily = typography.fontFamily;
  if (asCss(typography.fontSize)) css.fontSize = asCss(typography.fontSize);
  if (typography.fontWeight) css.fontWeight = typography.fontWeight;
  if (typography.lineHeight) css.lineHeight = typography.lineHeight;
  if (typography.letterSpacing) css.letterSpacing = typography.letterSpacing;
  if (typography.textAlign) css.textAlign = typography.textAlign;
  if (typography.textTransform) css.textTransform = typography.textTransform;
  if (typography.textDecoration) css.textDecoration = typography.textDecoration;
  if (typography.fontStyle) css.fontStyle = typography.fontStyle;
  if (typography.color) css.color = resolveThemeColor(typography.color);

  // Background
  if (background.color) css.backgroundColor = resolveThemeColor(background.color);
  if (background.gradient) {
    const angle = background.gradient.angle || 135;
    const stops = background.gradient.stops
      .map((s) => `${resolveThemeColor(s.color) || s.color} ${s.offset}%`)
      .join(', ');
    css.backgroundImage = `linear-gradient(${angle}deg, ${stops})`;
  } else if (background.image) {
    css.backgroundImage = `url(${background.image})`;
    css.backgroundPosition = background.position || 'center';
    css.backgroundSize = background.size || 'cover';
    css.backgroundRepeat = background.repeat || 'no-repeat';
  }

  // Border & Radius
  if (border.width) css.borderWidth = border.width;
  if (border.style) css.borderStyle = border.style;
  if (border.color) css.borderColor = resolveThemeColor(border.color);
  if (border.radius?.all) {
    css.borderRadius = border.radius.all;
  } else if (border.radius) {
    if (border.radius.topLeft) css.borderTopLeftRadius = border.radius.topLeft;
    if (border.radius.topRight) css.borderTopRightRadius = border.radius.topRight;
    if (border.radius.bottomRight) css.borderBottomRightRadius = border.radius.bottomRight;
    if (border.radius.bottomLeft) css.borderBottomLeftRadius = border.radius.bottomLeft;
  }

  // Effects & Shadows
  if (effects.boxShadow) {
    if (Array.isArray(effects.boxShadow)) {
      css.boxShadow = effects.boxShadow
        .map((s) => `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${resolveThemeColor(s.color) || s.color}`)
        .join(', ');
    } else {
      const s = effects.boxShadow;
      css.boxShadow = `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${resolveThemeColor(s.color) || s.color}`;
    }
  }
  if (typeof effects.opacity === 'number') css.opacity = effects.opacity;

  // Transform
  if (transform) {
    const transforms: string[] = [];
    if (transform.translateX || transform.translateY) {
      transforms.push(`translate(${transform.translateX || '0'}, ${transform.translateY || '0'})`);
    }
    if (typeof transform.scale === 'number') transforms.push(`scale(${transform.scale})`);
    if (transform.rotate) transforms.push(`rotate(${transform.rotate})`);
    if (transforms.length > 0) css.transform = transforms.join(' ');
  }

  return css;
}


function CmsRecordCard({
  record,
  collectionSlug,
  presentation,
  cms,
  isEditing,
  onNavigate,
}: {
  record: any;
  collectionSlug: string;
  presentation: string;
  cms: any;
  isEditing: boolean;
  onNavigate?: (url: string) => void;
}) {
  const title = String(record.data.title || record.data.name || 'Untitled');
  const excerpt = String(record.data.excerpt || record.data.description || '');
  const imageValue = record.data.featuredImage || record.data.image || record.data.avatar;
  const imageUrl = resolveCmsMediaValue(imageValue, cms, collectionSlug);
  const date = record.data.publishedAt
    ? new Date(String(record.data.publishedAt)).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : record.createdAt
      ? new Date(record.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '';

  const isListStyle = presentation === 'list';
  const postSlug = record.slug || record.id;

  const cardStyle: React.CSSProperties = isListStyle
    ? {
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid var(--kdba-border)',
        backgroundColor: 'var(--kdba-surface)',
        overflow: 'hidden',
        cursor: isEditing ? 'default' : 'pointer',
        transition: 'border-color 0.2s ease, transform 0.2s ease',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        border: '1px solid var(--kdba-border)',
        backgroundColor: 'var(--kdba-surface)',
        overflow: 'hidden',
        cursor: isEditing ? 'default' : 'pointer',
        transition: 'border-color 0.2s ease, transform 0.2s ease',
      };

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) return;
    if (onNavigate) {
      e.preventDefault();
      onNavigate(`/blog/${postSlug}`);
    }
  };

  return (
    <div
      style={cardStyle}
      data-cms-record={record.id}
      onClick={handleClick}
      className={!isEditing ? 'hover:border-primary/50 hover:shadow-lg transition-all' : ''}
    >
      {imageUrl && (
        <div
          style={
            isListStyle
              ? {
                  width: '120px',
                  minWidth: '120px',
                  aspectRatio: '4/3',
                  overflow: 'hidden',
                  borderRadius: '8px',
                }
              : { aspectRatio: '16/9', overflow: 'hidden' }
          }
        >
          <img
            src={imageUrl}
            alt={String(record.data.imageAlt || title)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}
      <div
        style={{
          flex: 1,
          padding: isListStyle ? '0' : '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--kdba-font-heading)',
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--kdba-text)',
            margin: 0,
          }}
        >
          {title}
        </h3>
        {excerpt && (
          <p
            style={{
              color: 'var(--kdba-muted)',
              fontSize: '14px',
              lineHeight: '1.5',
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {excerpt}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '4px' }}>
          {date && <span style={{ color: 'var(--kdba-muted)', fontSize: '12px' }}>{date}</span>}
          {!isEditing && (
            <span style={{ color: 'var(--kdba-primary, #6366F1)', fontSize: '12px', fontWeight: 600 }}>
              Read more →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function NodeRendererInner({
  node,
  isEditing = false,
  viewport = 'desktop',
  inlineEditingNodeId = null,
  onCommitProps,
  onEndInlineEdit,
  onStartInlineEdit,
  className = '',
}: NodeRendererProps) {
  const renderContext = useV3RenderContext();
  const isInlineEditing = isEditing && inlineEditingNodeId === node.id;

  const isHiddenOnDevice = node.visibility && node.visibility[viewport] === false;
  if (isHiddenOnDevice && !isEditing) {
    return null;
  }

  const storedGradient = node.props?.[GRADIENT_PROP];
  const mergedStyles: StyleDefinition = {
    ...node.styles,
    background: {
      ...(node.styles?.background || {}),
      ...(storedGradient && !node.styles?.background?.gradient
        ? { gradient: storedGradient as NonNullable<StyleDefinition['background']>['gradient'] }
        : {}),
    },
  };
  const activeStateMode = useV3EditorStore((s) => s.activeStateMode);
  const selectedNodeId = useV3EditorStore((s) => s.selectedNodeId);
  const activeAnimationPreviewId = useV3EditorStore((s) => s.activeAnimationPreviewId);

  const stateOverride = isEditing && selectedNodeId === node.id && activeStateMode !== 'default'
    ? (node.states?.[activeStateMode] as Partial<StyleDefinition> | undefined)
    : undefined;

  const resolvedStyles = resolveNodeStyles(mergedStyles, node.responsive, viewport, stateOverride);

  const { resolveHref, handleLinkClick } = useResolvedLink();
  const { animStyle, attachRef, hoverDataAttr, hoverCssVars } = useNodeAnimation(
    node.id,
    node.animations,
    activeAnimationPreviewId === node.id,
  );
  const props = applyBindingToProps(
    node,
    renderContext?.document || ({ business: {} } as any),
    renderContext?.cms,
    renderContext?.activeRecord,
  );

  const commitText = (key: string, value: string, extra?: Record<string, unknown>) => {
    onCommitProps?.(node.id, { [key]: value, ...extra });
    onEndInlineEdit?.();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isEditing) return;
    e.stopPropagation();
    onStartInlineEdit?.(node.id);
  };

  // Helper to render background color overlay
  const renderOverlay = () => {
    const overlay = (node.styles?.background as any)?.overlay;
    if (!overlay || !overlay.color) return null;
    return (
      <div
        className="absolute inset-0 pointer-events-none z-0 rounded-[inherit]"
        style={{
          backgroundColor: overlay.color,
          opacity: typeof overlay.opacity === 'number' ? overlay.opacity : 0.5,
        }}
      />
    );
  };

  // Helper to render section label pill tag when custom label exists in editor
  const renderSectionHeaderTag = () => {
    if (!isEditing || !node.label) return null;
    return (
      <div className="absolute top-2 left-3 z-20 pointer-events-none flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-primary text-primary-foreground shadow-sm">
        <span>{node.label}</span>
        {node.locked && <span className="text-[10px]">🔒</span>}
      </div>
    );
  };

  const renderChildren = (filterChrome = false) => {
    const hasGlobalHeader = Boolean(renderContext?.document.global?.headerNode);
    const hasGlobalFooter = Boolean(renderContext?.document.global?.footerNode);
    const children = (node.children || []).filter((child) => {
      if (!filterChrome) return true;
      if (hasGlobalHeader && (child.type === 'navbar' || isNavbarNode(child))) return false;
      if (hasGlobalFooter && (child.type === 'footer' || isFooterNode(child))) return false;
      return true;
    });

    if (node.type === 'page-root' && isEditing) {
      return (
        <>
          <SectionDividerAdd key="div-start" index={0} targetParentId={node.id} />
          {children.map((child, idx) => (
            <React.Fragment key={child.id}>
              <NodeRenderer
                node={child}
                isEditing={isEditing}
                viewport={viewport}
                inlineEditingNodeId={inlineEditingNodeId}
                onCommitProps={onCommitProps}
                onEndInlineEdit={onEndInlineEdit}
                onStartInlineEdit={onStartInlineEdit}
              />
              <SectionDividerAdd key={`div-${child.id}`} index={idx + 1} targetParentId={node.id} />
            </React.Fragment>
          ))}
        </>
      );
    }

    if (children.length === 0) {
      if (isEditing && (node.type === 'container' || node.type === 'section' || node.type === 'column' || node.type === 'stack' || node.type === 'row' || node.type === 'grid')) {
        return (
          <div className="flex items-center justify-center p-6 border border-dashed border-border rounded-xl bg-muted/20 text-muted-foreground text-xs select-none pointer-events-none">
            <span>Empty {node.type} — Drop or add elements here</span>
          </div>
        );
      }
      return null;
    }

    return children.map((child) => (
      <NodeRenderer
        key={child.id}
        node={child}
        isEditing={isEditing}
        viewport={viewport}
        inlineEditingNodeId={inlineEditingNodeId}
        onCommitProps={onCommitProps}
        onEndInlineEdit={onEndInlineEdit}
        onStartInlineEdit={onStartInlineEdit}
      />
    ));
  };

  const hover = node.styles?.states?.hover;
  const disabled = Boolean(props.disabled);
  const hoverCss: React.CSSProperties = hover
    ? {
        ['--kdba-hover-bg' as string]: resolveThemeColor(hover.background?.color),
        ['--kdba-hover-color' as string]: resolveThemeColor(hover.typography?.color),
        ['--kdba-hover-opacity' as string]: hover.effects?.opacity,
      }
    : {};

  const editorClasses = isEditing
    ? `relative ${isHiddenOnDevice ? 'opacity-30 grayscale' : ''}`
    : '';

  const commonProps = {
    ref: attachRef,
    'data-node-id': node.id,
    'data-node-type': node.type,
    'data-node-name': node.name || node.type,
    'data-has-hover': hover ? 'true' : undefined,
    'data-disabled': disabled ? 'true' : undefined,
    'data-locked': node.locked ? 'true' : undefined,
    ...(hoverDataAttr ? { 'data-anim-hover': hoverDataAttr } : {}),
    style: {
      ...resolvedStyles,
      ...animStyle,
      ...hoverCss,
      ...hoverCssVars,
    },
    className: `kdba-node ${editorClasses} ${className}`.trim(),
  };

  // ─── COMPONENT TYPE DISPATCH ────────────────────────────────────────────────

  switch (node.type) {

    case 'cms-collection': {
      const collectionSlug = String(props.collectionSlug || 'blog-posts');
      const limit = Number(props.limit) || 6;
      const columns = Number(props.columns) || 3;
      const presentation = String(props.presentation || 'grid');
      const orderBy = String(props.orderBy || 'newest');
      
      const collection = renderContext?.cms?.collections.find(c => c.slug === collectionSlug);
      let records = collection?.records || [];
      
      if (orderBy === 'newest') records = [...records].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      else if (orderBy === 'oldest') records = [...records].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      else if (orderBy === 'alphabetical') records = [...records].sort((a, b) => String(a.data.title || a.data.name || '').localeCompare(String(b.data.title || b.data.name || '')));
      
      records = records.slice(0, limit);
      
      const gridStyle: React.CSSProperties = {
        display: presentation === 'list' ? 'flex' : 'grid',
        flexDirection: presentation === 'list' ? 'column' : undefined,
        gridTemplateColumns: presentation !== 'list' ? `repeat(${columns}, minmax(0, 1fr))` : undefined,
        gap: '24px',
        ...commonProps.style,
      };

      if (isEditing && records.length === 0) {
        return (
          <div {...commonProps} style={{ ...commonProps.style, minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed', borderColor: 'var(--kdba-border)', borderRadius: '12px', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>📝</span>
            <p style={{ color: 'var(--kdba-muted)', fontSize: '14px' }}>CMS Collection: <strong>{collectionSlug}</strong></p>
            <p style={{ color: 'var(--kdba-muted)', fontSize: '12px' }}>No records found. Create content in the CMS to see it here.</p>
          </div>
        );
      }

      return (
        <div {...commonProps} style={gridStyle}>
          {records.map(record => (
            <CmsRecordCard
              key={record.id}
              record={record}
              collectionSlug={collectionSlug}
              presentation={presentation}
              cms={renderContext?.cms}
              isEditing={isEditing}
              onNavigate={renderContext?.onNavigate}
            />
          ))}
        </div>
      );
    }
    case 'page-root':
      return (
        <div {...commonProps} className={`w-full min-h-screen flex flex-col ${commonProps.className}`}>
          {renderChildren(true)}
        </div>
      );

    case 'section': {
      const heroVariant = String(props.variant || '');
      const heroClass =
        heroVariant === 'split'
          ? '[&>*]:md:flex [&>*]:md:flex-row [&>*]:md:items-center'
          : heroVariant === 'image-background' || heroVariant === 'media'
            ? 'bg-cover bg-center'
            : '';
      const listRecords = recordsForList(node, renderContext?.cms);
      const sectionAnchor =
        (props.anchorId as string) ||
        (typeof node.name === 'string' && /^[a-zA-Z0-9_-]+$/.test(node.name.toLowerCase().trim())
          ? node.name.toLowerCase().trim()
          : undefined) ||
        (props.variant && typeof props.variant === 'string' && /^[a-zA-Z0-9_-]+$/.test(props.variant)
          ? String(props.variant)
          : undefined) ||
        (typeof node.name === 'string' && node.name.toLowerCase().includes('contact')
          ? 'contact'
          : undefined);

      if (props.cmsList) {
        const layout = String(props.layout || 'cards');
        const gridClass =
          layout === 'list'
            ? 'grid grid-cols-1 gap-4'
            : layout === 'featured'
              ? 'grid grid-cols-1 gap-6 md:grid-cols-2'
              : 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3';
        return (
          <section
            {...commonProps}
            id={sectionAnchor || undefined}
            className={`relative w-full ${commonProps.className}`}
          >
            <div className="mx-auto max-w-[var(--kdba-container-max)] px-6 py-12">
              {isEditing && listRecords.length === 0 ? (
                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  Collection list — publish CMS records to populate this block.
                </div>
              ) : (
                <div className={gridClass}>
                  {listRecords.map((record) => {
                    const data = record.data || {};
                    const collectionSlug = String(props.collectionSlug || '');
                    const title = String(data.title || data.name || data.question || record.slug || 'Untitled');
                    const body = String(
                      data.description || data.excerpt || data.summary || data.quote || data.answer || '',
                    );
                    const image = resolveCmsMediaValue(
                      data.image || data.coverImage || data.photo || data.avatar || data.featuredImage,
                      renderContext?.cms,
                      collectionSlug,
                    ) || '';
                    const hrefBase = collectionSlug ? `/${collectionSlug}` : '';
                    const rawHref = record.slug ? `${hrefBase}/${record.slug}`.replace(/\/+/g, '/') : undefined;
                    const href = rawHref ? resolveHref(rawHref) : undefined;
                    return (
                      <article
                        key={record.id}
                        className="rounded-2xl border bg-[var(--kdba-surface)] p-5 shadow-sm"
                      >
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={image} alt="" className="mb-4 h-40 w-full rounded-xl object-cover" />
                        ) : null}
                        <h3 className="text-lg font-semibold text-[var(--kdba-text)]">
                          {href && !isEditing ? (
                            <a href={href} onClick={(e) => handleLinkClick(e, rawHref)} className="hover:underline">
                              {title}
                            </a>
                          ) : (
                            title
                          )}
                        </h3>
                        {body ? (
                          <p className="mt-2 text-sm text-[var(--kdba-muted)] line-clamp-4">{body}</p>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
            {renderChildren()}
          </section>
        );
      }
      return (
        <section
          {...commonProps}
          id={sectionAnchor || undefined}
          className={`relative ${props.fullWidth === false ? 'mx-auto max-w-[var(--kdba-container-max)]' : 'w-full'} ${heroClass} ${commonProps.className}`}
        >
          {renderOverlay()}
          {renderSectionHeaderTag()}
          {renderChildren()}
        </section>
      );
    }

    case 'container':
      return (
        <div
          {...commonProps}
          style={{
            ...commonProps.style,
            maxWidth: commonProps.style.maxWidth || 'var(--kdba-container-max)',
          }}
          className={`w-full mx-auto relative ${commonProps.className}`}
        >
          {renderChildren()}
        </div>
      );

    case 'row':
      return (
        <div {...commonProps} className={`flex flex-wrap items-center ${commonProps.className}`}>
          {renderChildren()}
        </div>
      );

    case 'column':
      return (
        <div {...commonProps} className={`flex flex-col ${commonProps.className}`}>
          {renderChildren()}
        </div>
      );

    case 'grid':
      return (
        <div {...commonProps} className={`grid ${commonProps.className}`}>
          {renderChildren()}
        </div>
      );

    case 'stack': {
      const isCard = props.role === 'card' || ['default', 'elevated', 'minimal', 'bordered'].includes(String(props.variant || ''));
      return (
        <div
          {...commonProps}
          style={isCard ? { ...cardVariantStyle(String(props.variant || 'default')), ...commonProps.style } : commonProps.style}
          className={`flex flex-col ${commonProps.className}`}
        >
          {renderChildren()}
        </div>
      );
    }

    case 'heading': {
      const level = Number(props.level) || 2;
      const HeadingTag = level === 1 ? 'h1' : level === 3 ? 'h3' : level === 4 ? 'h4' : level === 5 ? 'h5' : level === 6 ? 'h6' : 'h2';
      const headingStyle: React.CSSProperties = {
        ...commonProps.style,
        fontFamily: commonProps.style.fontFamily
          ? formatFontFamilyWithFallback(commonProps.style.fontFamily as string)
          : 'var(--kdba-font-heading)',
        fontSize: commonProps.style.fontSize || (level === 1 ? 'var(--kdba-h1)' : level === 3 ? 'var(--kdba-h3)' : 'var(--kdba-h2)'),
        lineHeight: commonProps.style.lineHeight || 'var(--kdba-heading-line)',
        letterSpacing: commonProps.style.letterSpacing || 'var(--kdba-tracking)',
      };
      const headingText = textFromRuns(props[TEXT_RUNS_PROP]) || String(props.text || 'Heading Text');
      if (isInlineEditing) {
        return (
          <HeadingTag
            {...commonProps}
            style={headingStyle}
            contentEditable
            suppressContentEditableWarning
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData('text/plain');
              document.execCommand('insertText', false, text);
            }}
            onBlur={(e) => {
              commitText('text', e.currentTarget.textContent || '', { [TEXT_RUNS_PROP]: undefined });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.currentTarget.blur();
              } else if (e.key === 'Escape') {
                onEndInlineEdit?.();
              }
            }}
            className={`font-bold tracking-tight outline-none ring-2 ring-indigo-500 rounded px-1 bg-indigo-950/40 cursor-text ${commonProps.className}`}
          >
            {headingText}
          </HeadingTag>
        );
      }
      return (
        <HeadingTag
          {...commonProps}
          style={headingStyle}
          onDoubleClick={handleDoubleClick}
          className={`font-bold tracking-tight ${commonProps.className}`}
        >
          <RichTextRuns runs={props[TEXT_RUNS_PROP]} fallback={headingText} />
        </HeadingTag>
      );
    }

    case 'paragraph': {
      const paragraphText = textFromRuns(props[TEXT_RUNS_PROP]) || String(props.text || 'Paragraph body copy text.');
      const paragraphStyle: React.CSSProperties = {
        ...commonProps.style,
        fontFamily: commonProps.style.fontFamily
          ? formatFontFamilyWithFallback(commonProps.style.fontFamily as string)
          : 'var(--kdba-font-body)',
        fontSize: commonProps.style.fontSize || 'var(--kdba-body-size)',
        lineHeight: commonProps.style.lineHeight || 'var(--kdba-body-line)',
      };
      if (isInlineEditing) {
        return (
          <p
            {...commonProps}
            style={paragraphStyle}
            contentEditable
            suppressContentEditableWarning
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData('text/plain');
              document.execCommand('insertText', false, text);
            }}
            onBlur={(e) => {
              commitText('text', e.currentTarget.textContent || '', { [TEXT_RUNS_PROP]: undefined });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onEndInlineEdit?.();
              } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
            className={`leading-relaxed outline-none ring-2 ring-indigo-500 rounded px-1 bg-indigo-950/40 cursor-text ${commonProps.className}`}
          >
            {paragraphText}
          </p>
        );
      }
      const ListTag = props.list === 'ol' ? 'ol' : 'ul';
      if (props.list === 'ul' || props.list === 'ol') {
        return (
          <ListTag
            {...commonProps}
            style={paragraphStyle}
            onDoubleClick={handleDoubleClick}
            className={`list-inside pl-4 leading-relaxed ${commonProps.className}`}
          >
            <li>
              <RichTextRuns runs={props[TEXT_RUNS_PROP]} fallback={paragraphText} />
            </li>
          </ListTag>
        );
      }
      return (
        <p
          {...commonProps}
          style={paragraphStyle}
          onDoubleClick={handleDoubleClick}
          className={`leading-relaxed ${commonProps.className}`}
        >
          <RichTextRuns runs={props[TEXT_RUNS_PROP]} fallback={paragraphText} />
        </p>
      );
    }

    case 'rich-text':
      return (
        <div
          {...commonProps}
          onDoubleClick={handleDoubleClick}
          className={`max-w-none ${commonProps.className}`}
        >
          <RichTextRuns
            runs={props[TEXT_RUNS_PROP]}
            fallback={textFromRuns(props[TEXT_RUNS_PROP]) || String(props.text || '')}
          />
        </div>
      );

    case 'text': {
      if (isInlineEditing) {
        return (
          <span
            {...commonProps}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              commitText('text', e.currentTarget.textContent || '');
            }}
            className={`outline-none ring-2 ring-indigo-500 rounded px-1 bg-indigo-950/40 cursor-text ${commonProps.className}`}
          >
            {String(props.text || '')}
          </span>
        );
      }
      return (
        <span {...commonProps} onDoubleClick={handleDoubleClick} className={commonProps.className}>
          {String(props.text || '')}
        </span>
      );
    }

    case 'button': {
      const variantStyle = buttonVariantStyle(String(props.variant || 'primary'));
      const buttonStyle: React.CSSProperties = {
        ...variantStyle,
        ...commonProps.style,
        fontFamily: commonProps.style.fontFamily
          ? formatFontFamilyWithFallback(commonProps.style.fontFamily as string)
          : 'var(--kdba-font-heading)',
        backgroundColor: commonProps.style.backgroundColor || variantStyle.backgroundColor,
        color: commonProps.style.color || variantStyle.color,
        borderRadius: commonProps.style.borderRadius || 'var(--kdba-button-radius)',
      };
      if (isInlineEditing) {
        return (
          <span
            {...commonProps}
            style={buttonStyle}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const val = e.currentTarget.textContent || '';
              commitText('label', val, { text: val });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
            className={`inline-flex items-center justify-center font-medium outline-none ring-2 ring-indigo-500 rounded px-2 bg-indigo-950/40 cursor-text ${commonProps.className}`}
          >
            {String(props.label || props.text || 'Button')}
          </span>
        );
      }
      const rawHref = (props.href as string) || '#';
      const resolvedHref = isEditing ? undefined : resolveHref(rawHref);
      return (
        <a
          {...commonProps}
          style={buttonStyle}
          href={resolvedHref}
          onClick={(e) => handleLinkClick(e, rawHref)}
          onDoubleClick={handleDoubleClick}
          className={`inline-flex items-center justify-center font-medium transition-transform active:scale-95 cursor-pointer ${commonProps.className}`}
        >
          {String(props.label || props.text || 'Button')}
        </a>
      );
    }

    case 'link': {
      const rawHref = (props.href as string) || '#';
      const resolvedHref = isEditing ? undefined : resolveHref(rawHref);
      return (
        <a
          {...commonProps}
          href={resolvedHref}
          onClick={(e) => handleLinkClick(e, rawHref)}
          className={`inline-flex items-center hover:underline cursor-pointer ${commonProps.className}`}
        >
          {String(props.label || props.text || 'Link')}
        </a>
      );
    }

    case 'image': {
      const image = (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          {...commonProps}
          src={String(props.src || props.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80')}
          alt={String(props.alt || 'Section Image')}
          loading="lazy"
          draggable={false}
          style={{
            ...commonProps.style,
            objectFit: (props.objectFit as React.CSSProperties['objectFit']) || 'cover',
            objectPosition: String(props.objectPosition || 'center'),
          }}
          className={`block max-w-full h-auto ${commonProps.className}`}
        />
      );
      const rawHref = String(props.href || '');
      const href = !isEditing && rawHref ? resolveHref(sanitizeHref(rawHref)) : undefined;
      if (href) {
        return (
          <a
            href={href}
            onClick={(e) => handleLinkClick(e, rawHref)}
            target={props.target === '_blank' ? '_blank' : undefined}
            rel={props.target === '_blank' ? 'noreferrer' : undefined}
          >
            {image}
          </a>
        );
      }
      return image;
    }

    case 'video':
      return (
        <div {...commonProps} className={`relative overflow-hidden ${commonProps.className}`}>
          <iframe
            src={String(props.src || 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')}
            className="w-full h-full border-0 aspect-video rounded-xl"
            allowFullScreen
          />
        </div>
      );

    case 'badge': {
      if (isInlineEditing) {
        return (
          <span
            {...commonProps}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              commitText('text', e.currentTarget.textContent || '');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.currentTarget.blur();
              } else if (e.key === 'Escape') {
                onEndInlineEdit?.();
              }
            }}
            className={`inline-flex items-center rounded-full text-xs font-semibold outline-none ring-2 ring-indigo-500 rounded px-1.5 py-0.5 bg-indigo-950/40 cursor-text ${commonProps.className}`}
          >
            {String(props.text || 'Subheading / Badge')}
          </span>
        );
      }
      return (
        <span
          {...commonProps}
          onDoubleClick={handleDoubleClick}
          className={`inline-flex items-center rounded-full text-xs font-semibold ${commonProps.className}`}
        >
          {String(props.text || 'Subheading / Badge')}
        </span>
      );
    }

    case 'list': {
      const items: string[] = Array.isArray(props.items) && props.items.length > 0
        ? props.items
        : ['Instant visual manipulation', 'Zero-config responsive layouts', 'Enterprise grade performance'];
      const styleType = props.listStyle || 'bullet';

      return (
        <ul {...commonProps} onDoubleClick={handleDoubleClick} className={`space-y-2 list-none p-0 m-0 ${commonProps.className}`}>
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              {styleType === 'check' ? (
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  ✓
                </span>
              ) : styleType === 'number' ? (
                <span className="w-4 h-4 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold font-mono">
                  {idx + 1}
                </span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
              )}
              <span className="flex-1">{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    case 'quote': {
      if (isInlineEditing) {
        return (
          <blockquote
            {...commonProps}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const quote = e.currentTarget.textContent || '';
              commitText('quote', quote, { text: quote });
            }}
            className={`border-l-4 border-indigo-500 pl-4 py-1 italic outline-none ring-2 ring-indigo-500 rounded bg-indigo-950/40 cursor-text ${commonProps.className}`}
          >
            {String(props.quote || props.text || 'Editorial quote')}
          </blockquote>
        );
      }
      return (
        <blockquote
          {...commonProps}
          onDoubleClick={handleDoubleClick}
          className={`border-l-4 border-indigo-500 pl-4 py-1 italic ${commonProps.className}`}
        >
          <p className="text-base font-medium">{String(props.quote || props.text || 'Editorial quote')}</p>
          {Boolean(props.author) && (
            <cite className="block text-xs text-slate-400 not-italic mt-1">— {String(props.author)}</cite>
          )}
        </blockquote>
      );
    }

    case 'divider':
      return <hr {...commonProps} className={`border-0 border-t border-slate-800 my-4 ${commonProps.className}`} />;

    case 'spacer':
      return <div {...commonProps} aria-hidden="true" />;

    case 'pricing':
      return (
        <div
          {...commonProps}
          className={`flex flex-col p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl ${commonProps.className}`}
        >
          {Boolean(props.isPopular) && (
            <span className="self-start px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-full">
              Most Popular
            </span>
          )}
          <h3 className="text-xl font-bold text-white">{String(props.planName || 'Plan')}</h3>
          <div className="flex items-baseline gap-1 my-4">
            <span className="text-4xl font-black text-white">{String(props.price || '$29')}</span>
            <span className="text-sm text-slate-400">/{String(props.billingPeriod || 'mo')}</span>
          </div>
          <p className="text-sm text-slate-400 mb-6">{String(props.description || '')}</p>
          <ul className="space-y-2.5 mb-8 flex-1">
            {Array.isArray(props.features) &&
              props.features.map((f: unknown, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-emerald-400">✓</span>
                  <span>{String(f)}</span>
                </li>
              ))}
          </ul>
          <button className="w-full py-3 px-4 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">
            {String(props.ctaLabel || 'Get Started')}
          </button>
        </div>
      );

    case 'testimonial':
      return (
        <div
          {...commonProps}
          className={`flex flex-col p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 shadow-lg ${commonProps.className}`}
        >
          <div className="flex gap-1 text-amber-400 text-sm mb-3">
            {Array.from({ length: Number(props.rating || 5) }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <blockquote className="text-slate-200 text-sm italic mb-6 leading-relaxed flex-1">
            &ldquo;{String(props.quote || '')}&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            {Boolean(props.avatarUrl) && (
              <img
                src={String(props.avatarUrl)}
                alt={String(props.author)}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
            )}
            <div>
              <div className="text-sm font-semibold text-white">{String(props.author || 'Customer')}</div>
              <div className="text-xs text-slate-400">{String(props.role || '')}</div>
            </div>
          </div>
        </div>
      );

    case 'contact-form':
    case 'form':
      return (
        <div {...commonProps}>
          <ContactFormPrimitive
            variant={String(props.variant || 'stacked')}
            headline={String(props.headline || props.title || '')}
            description={props.description ? String(props.description) : undefined}
            fields={Array.isArray(props.fields) ? (props.fields as string[]) : undefined}
            submitLabel={String(props.buttonText || props.submitText || props.submitLabel || 'Send message')}
            successMessage={props.successMessage ? String(props.successMessage) : undefined}
            isEditing={isEditing}
            tenantSlug={renderContext?.tenantSlug}
          />
        </div>
      );

    case 'navbar': {
      const siteNav = renderContext?.document.navigation?.header || [];
      const useSiteNav = props.useSiteNavigation !== false && siteNav.length > 0;
      const links = useSiteNav
        ? siteNav.map((item) => ({
            href: item.href,
            label: item.label,
            target: item.target,
          }))
        : Array.isArray(props.links)
          ? (props.links as Array<{ href?: string; label?: string; target?: string }>)
          : [];
      const variant = String(props.variant || 'standard');
      const sticky = props.sticky !== false;
      const rawCtaHref = String(props.ctaHref || renderContext?.document.navigation?.ctaButton?.href || '#contact');
      const ctaHref = isEditing
        ? undefined
        : resolveHref(sanitizeHref(rawCtaHref));
      const ctaLabel = String(
        props.ctaText || renderContext?.document.navigation?.ctaButton?.label || 'Get Started',
      );
      const brand = String(props.brandName || renderContext?.document.site?.name || 'Studio');

      const navLinks = (
        <>
          {links.length > 0 ? (
            links.map((link, i) => {
              const rawHref = String(link.href || '');
              const resolvedHref = isEditing ? undefined : resolveHref(sanitizeHref(rawHref));
              return (
                <a
                  key={`${link.href || 'link'}-${i}`}
                  href={resolvedHref || '#'}
                  onClick={(e) => handleLinkClick(e, rawHref)}
                  target={!isEditing && link.target === '_blank' ? '_blank' : undefined}
                  rel={!isEditing && link.target === '_blank' ? 'noreferrer' : undefined}
                  className="hover:text-white transition-colors"
                >
                  {link.label || 'Link'}
                </a>
              );
            })
          ) : (
            <>
              <a href={isEditing ? undefined : resolveHref('#features')} onClick={(e) => handleLinkClick(e, '#features')} className="hover:text-white transition-colors">Features</a>
              <a href={isEditing ? undefined : resolveHref('#pricing')} onClick={(e) => handleLinkClick(e, '#pricing')} className="hover:text-white transition-colors">Pricing</a>
              <a href={isEditing ? undefined : resolveHref('#contact')} onClick={(e) => handleLinkClick(e, '#contact')} className="hover:text-white transition-colors">Contact</a>
            </>
          )}
        </>
      );

      const brandBlock = (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--kdba-primary)] flex items-center justify-center font-bold text-white text-sm">
            {brand.charAt(0)}
          </div>
          <span className="font-bold text-white text-base tracking-tight">{brand}</span>
        </div>
      );

      const cta = (
        <a
          href={ctaHref || (isEditing ? undefined : resolveHref('#contact'))}
          onClick={(e) => handleLinkClick(e, rawCtaHref)}
          className="px-4 py-2 rounded-[var(--kdba-button-radius)] bg-[var(--kdba-button-bg)] hover:opacity-90 text-[var(--kdba-button-fg)] text-xs font-semibold transition-colors"
        >
          {ctaLabel}
        </a>
      );

      return (
        <header
          {...commonProps}
          className={`w-full border-b border-[var(--kdba-border)] bg-[var(--kdba-background)]/80 backdrop-blur-md ${
            sticky ? 'sticky top-0 z-30' : ''
          } ${commonProps.className}`}
        >
          {variant === 'centered' ? (
            <div className="mx-auto flex max-w-[var(--kdba-container-max)] flex-col items-center gap-3 px-6 py-4">
              {brandBlock}
              <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--kdba-muted)]">{navLinks}</nav>
              {cta}
            </div>
          ) : variant === 'minimal' ? (
            <div className="mx-auto flex max-w-[var(--kdba-container-max)] items-center justify-between px-6 py-4">
              {brandBlock}
              {cta}
            </div>
          ) : (
            <div className="mx-auto flex max-w-[var(--kdba-container-max)] items-center justify-between px-6 py-4">
              {brandBlock}
              <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--kdba-muted)]">{navLinks}</nav>
              <div className="flex items-center gap-3">
                {cta}
              </div>
            </div>
          )}
          <details className="md:hidden border-t border-[var(--kdba-border)] px-6 py-2">
            <summary className="cursor-pointer text-xs font-semibold text-[var(--kdba-muted)]">Menu</summary>
            <nav className="mt-2 flex flex-col gap-2 pb-3 text-sm text-[var(--kdba-muted)]">{navLinks}</nav>
          </details>
        </header>
      );
    }

    case 'footer': {
      const footerLinks = Array.isArray(props.links)
        ? (props.links as Array<{ href?: string; label?: string }>)
        : (renderContext?.document.navigation?.footer || []).flatMap((column) => column.links || []);
      return (
        <footer
          {...commonProps}
          className={`w-full py-8 px-6 border-t border-[var(--kdba-border)] bg-[var(--kdba-background)] text-[var(--kdba-muted)] text-sm ${commonProps.className}`}
        >
          <div className="max-w-[var(--kdba-container-max)] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>{String(props.copyright || `© ${new Date().getFullYear()} ${renderContext?.document.site?.name || 'KDBA'}. All rights reserved.`)}</div>
            <div className="flex flex-wrap gap-6 text-xs">
              {footerLinks.length > 0 ? (
                footerLinks.map((link, i) => {
                  const rawHref = String(link.href || '');
                  const resolvedHref = isEditing ? undefined : resolveHref(sanitizeHref(rawHref));
                  return (
                    <a
                      key={i}
                      href={resolvedHref || '#'}
                      onClick={(e) => handleLinkClick(e, rawHref)}
                      className="hover:text-slate-300 transition-colors"
                    >
                      {link.label || 'Link'}
                    </a>
                  );
                })
              ) : (
                <>
                  <a href={isEditing ? undefined : resolveHref('#privacy')} onClick={(e) => handleLinkClick(e, '#privacy')} className="hover:text-slate-300">Privacy</a>
                  <a href={isEditing ? undefined : resolveHref('#terms')} onClick={(e) => handleLinkClick(e, '#terms')} className="hover:text-slate-300">Terms</a>
                  <a href={isEditing ? undefined : resolveHref('#contact')} onClick={(e) => handleLinkClick(e, '#contact')} className="hover:text-slate-300">Support</a>
                </>
              )}
            </div>
          </div>
        </footer>
      );
    }

    default:
      return (
        <div {...commonProps} className={`p-2 border border-slate-800 rounded-lg ${commonProps.className}`}>
          {renderChildren()}
        </div>
      );
  }
}

export const NodeRenderer = React.memo(NodeRendererInner);
