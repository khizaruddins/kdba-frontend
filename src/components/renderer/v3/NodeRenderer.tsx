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
import { buttonVariantStyle, cardVariantStyle } from '@/lib/editor/variants';
import { normalizeRuns, sanitizeHref, TEXT_RUNS_PROP, textFromRuns } from '@/lib/editor/rich-text';

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

function RichTextRuns({ runs, fallback }: { runs?: unknown; fallback: string }) {
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
          return (
            <a key={index} href={run.href} className="underline underline-offset-2">
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
 */
export function resolveNodeStyles(
  styles?: StyleDefinition,
  responsive?: ResponsiveStyleDefinition,
  viewport: 'desktop' | 'tablet' | 'mobile' = 'desktop',
): React.CSSProperties {
  if (!styles && !responsive) return {};

  const base = styles || {};
  const tabletOverride = viewport === 'tablet' || viewport === 'mobile' ? responsive?.tablet || {} : {};
  const mobileOverride = viewport === 'mobile' ? responsive?.mobile || {} : {};

  // Merge layout
  const layout = { ...base.layout, ...tabletOverride.layout, ...mobileOverride.layout };
  const flex = { ...base.flex, ...tabletOverride.flex, ...mobileOverride.flex };
  const grid = { ...base.grid, ...tabletOverride.grid, ...mobileOverride.grid };
  const size = { ...base.size, ...tabletOverride.size, ...mobileOverride.size };
  const spacing = {
    margin: { ...base.spacing?.margin, ...tabletOverride.spacing?.margin, ...mobileOverride.spacing?.margin },
    padding: { ...base.spacing?.padding, ...tabletOverride.spacing?.padding, ...mobileOverride.spacing?.padding },
  };
  const typography = { ...base.typography, ...tabletOverride.typography, ...mobileOverride.typography };
  const background = { ...base.background, ...tabletOverride.background, ...mobileOverride.background };
  const border = { ...base.border, ...tabletOverride.border, ...mobileOverride.border };
  const effects = { ...base.effects, ...tabletOverride.effects, ...mobileOverride.effects };
  const transform = { ...base.transform, ...tabletOverride.transform, ...mobileOverride.transform };

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
  const resolvedStyles = resolveNodeStyles(mergedStyles, node.responsive, viewport);
  const props = node.props || {};

  const commitText = (key: string, value: string, extra?: Record<string, unknown>) => {
    onCommitProps?.(node.id, { [key]: value, ...extra });
    onEndInlineEdit?.();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isEditing) return;
    e.stopPropagation();
    onStartInlineEdit?.(node.id);
  };

  const renderChildren = (filterChrome = false) => {
    const hasGlobalHeader = Boolean(renderContext?.document.global?.headerNode);
    const hasGlobalFooter = Boolean(renderContext?.document.global?.footerNode);
    const children = (node.children || []).filter((child) => {
      if (!filterChrome) return true;
      if (hasGlobalHeader && child.type === 'navbar') return false;
      if (hasGlobalFooter && child.type === 'footer') return false;
      return true;
    });
    if (children.length === 0) {
      if (isEditing && (node.type === 'container' || node.type === 'section' || node.type === 'column' || node.type === 'stack' || node.type === 'row' || node.type === 'grid')) {
        return (
          <div className="flex items-center justify-center p-6 border border-dashed border-slate-700/60 rounded-xl bg-slate-900/20 text-slate-500 text-xs select-none pointer-events-none">
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
    'data-node-id': node.id,
    'data-node-type': node.type,
    'data-node-name': node.name || node.type,
    'data-has-hover': hover ? 'true' : undefined,
    'data-disabled': disabled ? 'true' : undefined,
    'data-locked': node.locked ? 'true' : undefined,
    style: { ...resolvedStyles, ...hoverCss },
    className: `kdba-node ${editorClasses} ${className}`.trim(),
  };

  // ─── COMPONENT TYPE DISPATCH ────────────────────────────────────────────────

  switch (node.type) {
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
      return (
        <section
          {...commonProps}
          id={(props.anchorId as string) || undefined}
          className={`relative ${props.fullWidth === false ? 'mx-auto max-w-[var(--kdba-container-max)]' : 'w-full'} ${heroClass} ${commonProps.className}`}
        >
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
        fontFamily: commonProps.style.fontFamily || 'var(--kdba-font-heading)',
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
        fontFamily: commonProps.style.fontFamily || 'var(--kdba-font-body)',
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
      return (
        <a
          {...commonProps}
          style={buttonStyle}
          href={isEditing ? undefined : (props.href as string) || '#'}
          onDoubleClick={handleDoubleClick}
          className={`inline-flex items-center justify-center font-medium transition-transform active:scale-95 cursor-pointer ${commonProps.className}`}
        >
          {String(props.label || props.text || 'Button')}
        </a>
      );
    }

    case 'link':
      return (
        <a
          {...commonProps}
          href={isEditing ? undefined : (props.href as string) || '#'}
          className={`inline-flex items-center hover:underline cursor-pointer ${commonProps.className}`}
        >
          {String(props.label || props.text || 'Link')}
        </a>
      );

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
      const href = !isEditing ? sanitizeHref(String(props.href || '')) : undefined;
      if (href) {
        return (
          <a href={href} target={props.target === '_blank' ? '_blank' : undefined} rel={props.target === '_blank' ? 'noreferrer' : undefined}>
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
        <form
          {...commonProps}
          onSubmit={(e) => {
            if (isEditing) e.preventDefault();
          }}
          className={`space-y-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 ${commonProps.className}`}
        >
          {Boolean(props.title || props.headline) && (
            <h4 className="text-lg font-bold text-white mb-2">{String(props.title || props.headline)}</h4>
          )}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your Name"
              disabled={isEditing}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              disabled={isEditing}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <textarea
              rows={3}
              placeholder="Your Message"
              disabled={isEditing}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={isEditing}
            className="w-full py-2.5 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition-colors cursor-pointer"
          >
            {String(props.buttonText || props.submitText || props.submitLabel || 'Send Message')}
          </button>
        </form>
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
      const ctaHref = isEditing
        ? undefined
        : sanitizeHref(String(props.ctaHref || renderContext?.document.navigation?.ctaButton?.href || '')) || undefined;
      const ctaLabel = String(
        props.ctaText || renderContext?.document.navigation?.ctaButton?.label || 'Get Started',
      );
      const brand = String(props.brandName || renderContext?.document.site?.name || 'Studio');

      const navLinks = (
        <>
          {links.length > 0 ? (
            links.map((link, i) => (
              <a
                key={`${link.href || 'link'}-${i}`}
                href={isEditing ? undefined : sanitizeHref(String(link.href || '')) || '#'}
                target={!isEditing && link.target === '_blank' ? '_blank' : undefined}
                rel={!isEditing && link.target === '_blank' ? 'noreferrer' : undefined}
                className="hover:text-white transition-colors"
              >
                {link.label || 'Link'}
              </a>
            ))
          ) : (
            <>
              <a href={isEditing ? undefined : '#features'} className="hover:text-white transition-colors">Features</a>
              <a href={isEditing ? undefined : '#pricing'} className="hover:text-white transition-colors">Pricing</a>
              <a href={isEditing ? undefined : '#contact'} className="hover:text-white transition-colors">Contact</a>
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
          href={ctaHref || (isEditing ? undefined : '#contact')}
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
                footerLinks.map((link, i) => (
                  <a
                    key={i}
                    href={isEditing ? undefined : sanitizeHref(String(link.href || '')) || '#'}
                    className="hover:text-slate-300 transition-colors"
                  >
                    {link.label || 'Link'}
                  </a>
                ))
              ) : (
                <>
                  <a href={isEditing ? undefined : '#privacy'} className="hover:text-slate-300">Privacy</a>
                  <a href={isEditing ? undefined : '#terms'} className="hover:text-slate-300">Terms</a>
                  <a href={isEditing ? undefined : '#contact'} className="hover:text-slate-300">Support</a>
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
