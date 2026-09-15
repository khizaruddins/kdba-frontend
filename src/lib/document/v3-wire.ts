import {
  ALL_NODE_TYPES,
  GradientDefinition,
  NodeType,
  StyleDefinition,
  ThemeSystemV3,
  TypographySystemV3,
  WebsiteDocumentV3,
  WebsiteNode,
} from '@/types/v3-document';
import { DEFAULT_THEME_LAYOUT_TOKENS } from '@/lib/editor/theme-tokens';
import { COMPONENT_MANIFEST } from '@/lib/editor/component-manifest';
import { STATES_PROP } from '@/lib/editor/rich-text';

export const WIRE_NODE_TYPES = [
  'page-root',
  'section',
  'container',
  'row',
  'column',
  'grid',
  'stack',
  'heading',
  'paragraph',
  'text',
  'button',
  'link',
  'image',
  'divider',
  'spacer',
  'legacy-section',
] as const;

export type WireNodeType = (typeof WIRE_NODE_TYPES)[number];
export const EDITOR_TYPE_PROP = 'kdbaEditorType';
export const GRADIENT_PROP = 'kdbaGradient';
export const WIRE_WRAP_PROP = 'kdbaWireWrap';

const WIRE_TYPE_SET = new Set<string>(WIRE_NODE_TYPES);
const EDITOR_TYPE_SET = new Set<string>(ALL_NODE_TYPES);

const TYPE_FALLBACK: Record<string, WireNodeType> = {
  navbar: 'section',
  footer: 'section',
  navigation: 'stack',
  badge: 'text',
  'rich-text': 'paragraph',
  quote: 'paragraph',
  list: 'paragraph',
  'contact-form': 'stack',
  form: 'stack',
  testimonial: 'stack',
  team: 'stack',
  service: 'stack',
  pricing: 'stack',
  product: 'stack',
  video: 'image',
  gallery: 'grid',
  carousel: 'grid',
  icon: 'text',
  logo: 'text',
  map: 'stack',
  'opening-hours': 'stack',
  'background-media': 'stack',
};

const WIRE_CHILDREN: Record<string, readonly string[]> = {
  'page-root': ['section', 'legacy-section'],
  section: ['container', 'row', 'grid', 'stack'],
  container: [
    'container',
    'row',
    'column',
    'grid',
    'stack',
    'heading',
    'paragraph',
    'text',
    'button',
    'link',
    'image',
    'divider',
    'spacer',
  ],
  row: ['column'],
  column: [
    'container',
    'row',
    'grid',
    'stack',
    'heading',
    'paragraph',
    'text',
    'button',
    'link',
    'image',
    'divider',
    'spacer',
  ],
  grid: [
    'container',
    'stack',
    'column',
    'heading',
    'paragraph',
    'text',
    'button',
    'link',
    'image',
    'divider',
    'spacer',
  ],
  stack: [
    'container',
    'row',
    'column',
    'stack',
    'heading',
    'paragraph',
    'text',
    'button',
    'link',
    'image',
    'divider',
    'spacer',
  ],
};

const WIRE_LEAVES = new Set([
  'heading',
  'paragraph',
  'text',
  'button',
  'link',
  'image',
  'divider',
  'spacer',
  'legacy-section',
]);

function isWireType(type: string): type is WireNodeType {
  return WIRE_TYPE_SET.has(type);
}

function canWireNest(parent: string, child: string): boolean {
  return (WIRE_CHILDREN[parent] || []).includes(child);
}

function parseCssNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim().toLowerCase();
  if (!trimmed || trimmed === 'auto' || trimmed === 'inherit') return undefined;
  const match = trimmed.match(/^(-?\d+(?:\.\d+)?)(px|rem|em)?$/);
  if (!match) return undefined;
  let amount = parseFloat(match[1]);
  if (match[2] === 'rem' || match[2] === 'em') amount *= 16;
  return Number.isFinite(amount) ? amount : undefined;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function bounded(value: unknown, min: number, max: number): number | undefined {
  const parsed = parseCssNumber(value);
  if (parsed === undefined) return undefined;
  return clamp(parsed, min, max);
}

function px(value: unknown): string | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return `${value}px`;
  if (typeof value === 'string' && value.trim()) return value;
  return undefined;
}

function defaultTypography(headingFont: string, bodyFont: string): TypographySystemV3 {
  const heading = {
    fontFamily: headingFont,
    fontSize: '40px',
    fontWeight: 700,
    lineHeight: 1.15,
  };
  const body = {
    fontFamily: bodyFont,
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.6,
  };
  return {
    headingFont,
    bodyFont,
    h1: { ...heading, fontSize: '56px' },
    h2: heading,
    h3: { ...heading, fontSize: '28px' },
    h4: { ...heading, fontSize: '22px' },
    h5: { ...heading, fontSize: '18px' },
    h6: { ...heading, fontSize: '16px' },
    body,
    caption: { ...body, fontSize: '13px' },
    label: { ...body, fontSize: '12px', fontWeight: 600 },
    button: { fontFamily: headingFont, fontSize: '15px', fontWeight: 600, lineHeight: 1.2 },
    quote: { ...heading, fontSize: '22px', fontWeight: 500 },
  };
}

function fontFromUnknown(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value;
  if (value && typeof value === 'object' && 'fontFamily' in value) {
    const family = (value as { fontFamily?: unknown }).fontFamily;
    if (typeof family === 'string' && family.trim()) return family;
  }
  return undefined;
}

export function toEditorTheme(theme: Record<string, unknown> | ThemeSystemV3 | undefined): ThemeSystemV3 {
  const raw = (theme || {}) as Record<string, unknown>;
  const colorsIn = (raw.colors || {}) as Record<string, string>;
  const headingFont =
    fontFromUnknown(raw.headingFont) ||
    fontFromUnknown((raw.typography as Record<string, unknown> | undefined)?.headingFont) ||
    fontFromUnknown((raw.typography as Record<string, unknown> | undefined)?.h1) ||
    'Inter';
  const bodyFont =
    fontFromUnknown(raw.bodyFont) ||
    fontFromUnknown((raw.typography as Record<string, unknown> | undefined)?.bodyFont) ||
    fontFromUnknown((raw.typography as Record<string, unknown> | undefined)?.body) ||
    'Inter';

  const tokens = defaultTypography(headingFont, bodyFont);
  const existing = raw.typography as Partial<TypographySystemV3> | undefined;

  return {
    primaryColor: String(raw.primaryColor || colorsIn.primary || '#4F46E5'),
    secondaryColor: String(raw.secondaryColor || colorsIn.secondary || '#0F172A'),
    accentColor: String(raw.accentColor || colorsIn.accent || '#6366F1'),
    backgroundColor: String(raw.backgroundColor || colorsIn.background || '#0B0D13'),
    textColor: String(raw.textColor || colorsIn.text || '#FFFFFF'),
    headingFont,
    bodyFont,
    colors: {
      primary: colorsIn.primary || String(raw.primaryColor || '#4F46E5'),
      secondary: colorsIn.secondary || String(raw.secondaryColor || '#0F172A'),
      accent: colorsIn.accent || String(raw.accentColor || '#6366F1'),
      background: colorsIn.background || String(raw.backgroundColor || '#0B0D13'),
      surface: colorsIn.surface || '#131620',
      text: colorsIn.text || String(raw.textColor || '#FFFFFF'),
      muted: colorsIn.muted || '#94A3B8',
      border: colorsIn.border || '#212636',
      success: colorsIn.success || '#10B981',
      warning: colorsIn.warning || '#F59E0B',
      error: colorsIn.error || '#EF4444',
      custom: colorsIn.custom as unknown as Record<string, string> | undefined,
    },
    typography: {
      ...tokens,
      ...existing,
      headingFont,
      bodyFont,
      h1: { ...tokens.h1, ...(existing?.h1 || {}), fontFamily: existing?.h1?.fontFamily || headingFont },
      h2: { ...tokens.h2, ...(existing?.h2 || {}), fontFamily: existing?.h2?.fontFamily || headingFont },
      h3: { ...tokens.h3, ...(existing?.h3 || {}), fontFamily: existing?.h3?.fontFamily || headingFont },
      body: { ...tokens.body, ...(existing?.body || {}), fontFamily: existing?.body?.fontFamily || bodyFont },
    },
    breakpoints:
      (raw.breakpoints as ThemeSystemV3['breakpoints']) || {
        desktop: 1200,
        tablet: 768,
        mobile: 480,
      },
    borderRadius: (raw.borderRadius as ThemeSystemV3['borderRadius']) || 'md',
    shadows: (raw.shadows as ThemeSystemV3['shadows']) || 'subtle',
    customCss: typeof raw.customCss === 'string' ? raw.customCss : undefined,
    tokens: {
      ...DEFAULT_THEME_LAYOUT_TOKENS,
      ...((raw.tokens as Record<string, unknown>) || {}),
    },
  };
}

function edgesToEditor(input: unknown): StyleDefinition['spacing'] extends infer T
  ? T extends { margin?: infer M }
    ? M
    : never
  : never {
  const source = (input || {}) as Record<string, unknown>;
  const next: Record<string, string> = {};
  for (const side of ['top', 'right', 'bottom', 'left'] as const) {
    const value = px(source[side]);
    if (value) next[side] = value;
  }
  return next;
}

function toEditorGradient(value: unknown): GradientDefinition | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const source = value as Record<string, unknown>;
  if (!Array.isArray(source.stops) || source.stops.length < 2) return undefined;
  return {
    type: source.type === 'radial' ? 'radial' : 'linear',
    angle: typeof source.angle === 'number' ? source.angle : 135,
    stops: source.stops
      .filter((stop): stop is Record<string, unknown> => Boolean(stop) && typeof stop === 'object')
      .map((stop) => ({
        color: String(stop.color || '#000000'),
        offset: Number(stop.offset ?? 0),
      })),
  };
}

function toEditorStyles(styles: unknown): StyleDefinition {
  if (!styles || typeof styles !== 'object') return {};
  const source = styles as Record<string, unknown>;
  const layoutIn = (source.layout || {}) as Record<string, unknown>;
  const flexIn = (source.flex || {}) as Record<string, unknown>;
  const gridIn = (source.grid || {}) as Record<string, unknown>;
  const sizeIn = (source.size || {}) as Record<string, unknown>;
  const spacingIn = (source.spacing || {}) as Record<string, unknown>;
  const typographyIn = (source.typography || {}) as Record<string, unknown>;
  const colorIn = (source.color || {}) as Record<string, unknown>;
  const backgroundIn = (source.background || {}) as Record<string, unknown>;
  const borderIn = (source.border || {}) as Record<string, unknown>;
  const radiusIn = (source.radius || (borderIn.radius as object) || {}) as Record<string, unknown>;
  const shadowIn = (source.shadow ||
    (source.effects as Record<string, unknown> | undefined)?.boxShadow ||
    {}) as Record<string, unknown>;
  const effectsIn = (source.effects || {}) as Record<string, unknown>;

  const gap = px(flexIn.gap ?? layoutIn.gap);
  const displayRaw = layoutIn.display;

  return {
    layout: {
      display:
        displayRaw === 'flex' ||
        displayRaw === 'grid' ||
        displayRaw === 'block' ||
        displayRaw === 'inline-block' ||
        displayRaw === 'inline-flex' ||
        displayRaw === 'none'
          ? displayRaw
          : undefined,
      position: layoutIn.position as NonNullable<StyleDefinition['layout']>['position'],
      width: px(layoutIn.width) || (typeof sizeIn.width === 'string' ? sizeIn.width : px(sizeIn.width)),
      height: px(layoutIn.height) || (typeof sizeIn.height === 'string' ? sizeIn.height : px(sizeIn.height)),
      minWidth: px(sizeIn.minWidth) || px(layoutIn.minWidth),
      maxWidth: px(sizeIn.maxWidth) || px(layoutIn.maxWidth),
      minHeight: px(sizeIn.minHeight) || px(layoutIn.minHeight),
      maxHeight: px(sizeIn.maxHeight) || px(layoutIn.maxHeight),
      top: px(layoutIn.top),
      right: px(layoutIn.right),
      bottom: px(layoutIn.bottom),
      left: px(layoutIn.left),
      zIndex: typeof layoutIn.zIndex === 'number' ? layoutIn.zIndex : undefined,
      overflow:
        layoutIn.overflow === 'visible' ||
        layoutIn.overflow === 'hidden' ||
        layoutIn.overflow === 'scroll' ||
        layoutIn.overflow === 'auto'
          ? layoutIn.overflow
          : undefined,
    },
    flex: {
      direction: ((flexIn.direction || layoutIn.direction) as NonNullable<StyleDefinition['flex']>['direction']) || undefined,
      wrap:
        flexIn.wrap === 'wrap' || flexIn.wrap === 'nowrap' || flexIn.wrap === 'wrap-reverse'
          ? flexIn.wrap
          : layoutIn.flexWrap === 'wrap' || layoutIn.flexWrap === 'nowrap'
            ? layoutIn.flexWrap
            : undefined,
      justifyContent: (flexIn.justifyContent || layoutIn.justifyContent) as NonNullable<StyleDefinition['flex']>['justifyContent'],
      alignItems: (flexIn.alignItems || layoutIn.alignItems) as NonNullable<StyleDefinition['flex']>['alignItems'],
      gap,
      rowGap: px(flexIn.rowGap ?? layoutIn.rowGap),
      columnGap: px(flexIn.columnGap ?? layoutIn.columnGap),
      grow: typeof flexIn.grow === 'number' ? flexIn.grow : undefined,
      shrink: typeof flexIn.shrink === 'number' ? flexIn.shrink : undefined,
      basis: typeof flexIn.basis === 'string' ? flexIn.basis : px(flexIn.basis),
    },
    grid: {
      columns: typeof gridIn.columns === 'number' ? gridIn.columns : typeof layoutIn.columns === 'number' ? layoutIn.columns : undefined,
      rows: typeof gridIn.rows === 'number' ? gridIn.rows : undefined,
      gridTemplateColumns: typeof gridIn.gridTemplateColumns === 'string' ? gridIn.gridTemplateColumns : undefined,
      columnGap: px(gridIn.columnGap ?? layoutIn.columnGap),
      rowGap: px(gridIn.rowGap ?? layoutIn.rowGap),
      autoFit: layoutIn.autoFit === true || gridIn.autoFit === true || undefined,
      minColumnWidth:
        typeof gridIn.minColumnWidth === 'string'
          ? gridIn.minColumnWidth
          : typeof layoutIn.minColumnWidth === 'string'
            ? layoutIn.minColumnWidth
            : undefined,
      columnSpan: gridIn.columnSpan as NonNullable<StyleDefinition['grid']>['columnSpan'],
    },
    size: {
      width: typeof sizeIn.width === 'string' ? sizeIn.width : px(sizeIn.width),
      height: typeof sizeIn.height === 'string' ? sizeIn.height : px(sizeIn.height),
      minWidth: typeof sizeIn.minWidth === 'string' ? sizeIn.minWidth : px(sizeIn.minWidth),
      maxWidth: typeof sizeIn.maxWidth === 'string' ? sizeIn.maxWidth : px(sizeIn.maxWidth),
      minHeight: typeof sizeIn.minHeight === 'string' ? sizeIn.minHeight : px(sizeIn.minHeight),
      maxHeight: typeof sizeIn.maxHeight === 'string' ? sizeIn.maxHeight : px(sizeIn.maxHeight),
      aspectRatio: typeof sizeIn.aspectRatio === 'string' ? sizeIn.aspectRatio : undefined,
    },
    spacing: {
      margin: edgesToEditor(spacingIn.margin),
      padding: edgesToEditor(spacingIn.padding),
    },
    typography: {
      fontFamily: typeof typographyIn.fontFamily === 'string' ? typographyIn.fontFamily : undefined,
      fontSize: px(typographyIn.fontSize),
      fontWeight: typographyIn.fontWeight as NonNullable<StyleDefinition['typography']>['fontWeight'],
      lineHeight: typographyIn.lineHeight as NonNullable<StyleDefinition['typography']>['lineHeight'],
      letterSpacing:
        typeof typographyIn.letterSpacing === 'number'
          ? `${typographyIn.letterSpacing}px`
          : typeof typographyIn.letterSpacing === 'string'
            ? typographyIn.letterSpacing
            : undefined,
      textAlign: typographyIn.textAlign as NonNullable<StyleDefinition['typography']>['textAlign'],
      textTransform: typographyIn.textTransform as NonNullable<StyleDefinition['typography']>['textTransform'],
      textDecoration: typographyIn.textDecoration as NonNullable<StyleDefinition['typography']>['textDecoration'],
      fontStyle: typographyIn.fontStyle === 'italic' || typographyIn.fontStyle === 'normal' ? typographyIn.fontStyle : undefined,
      color: typeof colorIn.color === 'string' ? colorIn.color : (typographyIn.color as string | undefined),
    },
    background: {
      color: typeof backgroundIn.color === 'string' ? backgroundIn.color : undefined,
      gradient: toEditorGradient(backgroundIn.gradient),
      image: typeof backgroundIn.src === 'string' ? backgroundIn.src : (backgroundIn.image as string | undefined),
      mediaId: typeof backgroundIn.mediaId === 'string' ? backgroundIn.mediaId : undefined,
      position: typeof backgroundIn.position === 'string' ? backgroundIn.position : undefined,
      size: (backgroundIn.fit as NonNullable<StyleDefinition['background']>['size']) || (backgroundIn.size as NonNullable<StyleDefinition['background']>['size']),
      repeat: backgroundIn.repeat as NonNullable<StyleDefinition['background']>['repeat'],
      opacity: typeof backgroundIn.opacity === 'number' ? backgroundIn.opacity : undefined,
    },
    border: {
      ...(typeof source.border === 'object' && source.border ? (source.border as StyleDefinition['border']) : {}),
      width: px(borderIn.width) || (typeof borderIn.width === 'string' ? borderIn.width : undefined),
      style: borderIn.style as NonNullable<StyleDefinition['border']>['style'],
      color: typeof borderIn.color === 'string' ? borderIn.color : undefined,
      radius: {
        all: px(radiusIn.all),
        topLeft: px(radiusIn.topLeft),
        topRight: px(radiusIn.topRight),
        bottomRight: px(radiusIn.bottomRight),
        bottomLeft: px(radiusIn.bottomLeft),
      },
    },
    effects: Object.keys(shadowIn).length || Object.keys(effectsIn).length
      ? {
          ...effectsIn,
          boxShadow: {
            x: Number((shadowIn as Record<string, unknown>).x || 0),
            y: Number((shadowIn as Record<string, unknown>).y || 0),
            blur: Number((shadowIn as Record<string, unknown>).blur || 0),
            spread: Number((shadowIn as Record<string, unknown>).spread || 0),
            color: String((shadowIn as Record<string, unknown>).color || '#000000'),
          },
        }
      : undefined,
  };
}

function boxToWire(input: unknown): Record<string, number> | undefined {
  const source = (input || {}) as Record<string, unknown>;
  const next: Record<string, number> = {};
  for (const side of ['top', 'right', 'bottom', 'left'] as const) {
    const value = bounded(source[side], 0, 400);
    if (value !== undefined) next[side] = value;
  }
  return Object.keys(next).length ? next : undefined;
}

function toWireStyles(styles: StyleDefinition | undefined): Record<string, unknown> {
  if (!styles) return {};
  const layout: Record<string, unknown> = {};
  const display = styles.layout?.display;
  if (display === 'inline-block') layout.display = 'block';
  else if (
    display === 'flex' ||
    display === 'grid' ||
    display === 'block' ||
    display === 'inline-flex' ||
    display === 'none'
  ) {
    layout.display = display;
  }
  const direction = styles.flex?.direction;
  if (
    direction === 'row' ||
    direction === 'column' ||
    direction === 'row-reverse' ||
    direction === 'column-reverse'
  ) {
    layout.direction = direction;
  }
  const gap = bounded(styles.flex?.gap, 0, 200);
  if (gap !== undefined) layout.gap = gap;
  const rowGap = bounded(styles.flex?.rowGap || styles.grid?.rowGap, 0, 200);
  const columnGap = bounded(styles.flex?.columnGap || styles.grid?.columnGap, 0, 200);
  if (rowGap !== undefined) layout.rowGap = rowGap;
  if (columnGap !== undefined) layout.columnGap = columnGap;
  if (styles.flex?.alignItems) layout.alignItems = styles.flex.alignItems;
  if (styles.flex?.justifyContent) layout.justifyContent = styles.flex.justifyContent;
  if (styles.flex?.wrap === 'wrap' || styles.flex?.wrap === 'nowrap') layout.flexWrap = styles.flex.wrap;
  if (typeof styles.grid?.columns === 'number') layout.columns = styles.grid.columns;
  if (styles.grid?.autoFit) layout.autoFit = true;
  if (styles.grid?.minColumnWidth) layout.minColumnWidth = styles.grid.minColumnWidth;
  if (
    styles.layout?.overflow === 'visible' ||
    styles.layout?.overflow === 'hidden' ||
    styles.layout?.overflow === 'scroll' ||
    styles.layout?.overflow === 'auto'
  ) {
    layout.overflow = styles.layout.overflow;
  }

  const size: Record<string, unknown> = {};
  for (const key of ['width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight'] as const) {
    const value = styles.size?.[key] ?? styles.layout?.[key];
    if (value !== undefined) size[key] = value;
  }

  const spacing: Record<string, unknown> = {};
  const margin = boxToWire(styles.spacing?.margin);
  const padding = boxToWire(styles.spacing?.padding);
  if (margin) spacing.margin = margin;
  if (padding) spacing.padding = padding;

  const typography: Record<string, unknown> = {};
  if (styles.typography?.fontFamily) typography.fontFamily = styles.typography.fontFamily.slice(0, 80);
  const fontSize = bounded(styles.typography?.fontSize, 8, 160);
  if (fontSize !== undefined) typography.fontSize = fontSize;
  const weight = bounded(styles.typography?.fontWeight, 100, 900);
  if (weight !== undefined) typography.fontWeight = weight;
  const lineHeight = parseCssNumber(styles.typography?.lineHeight);
  if (lineHeight !== undefined) {
    typography.lineHeight = clamp(lineHeight > 3 ? lineHeight / 16 : lineHeight, 0.8, 3);
  }
  const tracking = bounded(styles.typography?.letterSpacing, -5, 20);
  if (tracking !== undefined) typography.letterSpacing = tracking;
  if (styles.typography?.textAlign) typography.textAlign = styles.typography.textAlign;
  if (styles.typography?.fontStyle === 'italic' || styles.typography?.fontStyle === 'normal') {
    typography.fontStyle = styles.typography.fontStyle;
  }
  if (
    styles.typography?.textTransform === 'none' ||
    styles.typography?.textTransform === 'uppercase' ||
    styles.typography?.textTransform === 'lowercase' ||
    styles.typography?.textTransform === 'capitalize'
  ) {
    typography.textTransform = styles.typography.textTransform;
  }

  const background: Record<string, unknown> = {};
  if (styles.background?.color) background.color = styles.background.color.slice(0, 80);
  if (styles.background?.mediaId) background.mediaId = styles.background.mediaId;
  if (styles.background?.image) background.src = styles.background.image;
  if (
    styles.background?.size === 'cover' ||
    styles.background?.size === 'contain' ||
    styles.background?.size === 'auto'
  ) {
    background.fit = styles.background.size === 'auto' ? 'none' : styles.background.size;
  }
  if (styles.background?.position) background.position = String(styles.background.position).slice(0, 40);

  const border: Record<string, unknown> = {};
  const borderWidth = bounded(styles.border?.width, 0, 40);
  if (borderWidth !== undefined) border.width = borderWidth;
  if (
    styles.border?.style === 'solid' ||
    styles.border?.style === 'dashed' ||
    styles.border?.style === 'dotted' ||
    styles.border?.style === 'none'
  ) {
    border.style = styles.border.style;
  }
  if (styles.border?.color) border.color = styles.border.color.slice(0, 80);

  const radius: Record<string, unknown> = {};
  const all = bounded(styles.border?.radius?.all, 0, 200);
  for (const corner of ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'] as const) {
    const value = bounded(styles.border?.radius?.[corner], 0, 200) ?? all;
    if (value !== undefined) radius[corner] = value;
  }

  const next: Record<string, unknown> = {};
  if (Object.keys(layout).length) next.layout = layout;
  if (Object.keys(size).length) next.size = size;
  if (Object.keys(spacing).length) next.spacing = spacing;
  if (Object.keys(typography).length) next.typography = typography;
  if (styles.typography?.color) next.color = { color: styles.typography.color.slice(0, 80) };
  if (Object.keys(background).length) next.background = background;
  if (Object.keys(border).length) next.border = border;
  if (Object.keys(radius).length) next.radius = radius;
  return next;
}

function resolveWireType(rawType: string, parentType: string | null): WireNodeType {
  if (isWireType(rawType)) return rawType;
  return TYPE_FALLBACK[rawType] || (parentType === 'page-root' ? 'section' : 'stack');
}

function wrapForParent(parentType: string, wire: Record<string, unknown>): Record<string, unknown> {
  const type = String(wire.type);
  if (canWireNest(parentType, type)) return wire;

  const wrappers =
    parentType === 'page-root'
      ? (['section'] as WireNodeType[])
      : parentType === 'row'
        ? (['column'] as WireNodeType[])
        : (['container', 'stack', 'column'] as WireNodeType[]);

  for (const wrapper of wrappers) {
    if (!canWireNest(parentType, wrapper) || !canWireNest(wrapper, type)) continue;
    const childId = String(wire.id || 'node');
    return {
      id: `w_${childId}`.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 100),
      type: wrapper,
      props: { [WIRE_WRAP_PROP]: true },
      styles: {},
      responsive: {},
      children: [wire],
      enabled: true,
    };
  }

  return wire;
}

function flattenWireWrappers(nodes: WebsiteNode[]): WebsiteNode[] {
  const flattened: WebsiteNode[] = [];
  for (const node of nodes) {
    const wrap = Boolean(node.props?.[WIRE_WRAP_PROP]) || /^w_[a-zA-Z0-9_-]+$/.test(node.id);
    if (
      wrap &&
      (node.type === 'container' || node.type === 'column' || node.type === 'section') &&
      node.children?.length === 1
    ) {
      flattened.push(node.children[0]);
    } else {
      flattened.push(node);
    }
  }
  return flattened;
}

function toEditorNode(node: Record<string, unknown>, _parentType: string | null): WebsiteNode {
  const props = { ...((node.props as Record<string, unknown>) || {}) };
  const storedType = typeof props[EDITOR_TYPE_PROP] === 'string' ? String(props[EDITOR_TYPE_PROP]) : '';
  const rawType = typeof node.type === 'string' ? node.type : 'stack';
  let type = storedType && EDITOR_TYPE_SET.has(storedType) ? (storedType as NodeType) : (rawType as NodeType);
  if (!EDITOR_TYPE_SET.has(type) && !WIRE_TYPE_SET.has(type)) {
    type = (TYPE_FALLBACK[rawType] || 'stack') as NodeType;
  }

  const children = flattenWireWrappers(
    Array.isArray(node.children)
      ? node.children
          .filter((child) => child && typeof child === 'object')
          .map((child) => toEditorNode(child as Record<string, unknown>, type))
      : [],
  );

  const styles = toEditorStyles(node.styles);
  const storedGradient = toEditorGradient(props[GRADIENT_PROP]);
  if (storedGradient && !styles.background?.gradient) {
    styles.background = { ...styles.background, gradient: storedGradient };
  }
  const storedStates = props[STATES_PROP];
  if (storedStates && typeof storedStates === 'object') {
    styles.states = storedStates as StyleDefinition['states'];
  }

  return {
    id: String(node.id || `node_${Math.random().toString(36).slice(2, 9)}`),
    type,
    name: typeof node.name === 'string' ? node.name : (typeof props.name === 'string' ? props.name : undefined),
    props,
    styles,
    responsive: {
      tablet: toEditorStyles((node.responsive as Record<string, unknown> | undefined)?.tablet),
      mobile: toEditorStyles((node.responsive as Record<string, unknown> | undefined)?.mobile),
    },
    visibility: (node.visibility as WebsiteNode['visibility']) || { desktop: true, tablet: true, mobile: true },
    children,
    locked: Boolean(node.locked),
  };
}

function toWireNode(node: WebsiteNode, parentType: string | null): Record<string, unknown> {
  const originalType = node.type;
  const type = resolveWireType(originalType, parentType);
  const props = { ...(node.props || {}) };
  if (typeof node.name === 'string' && props.name === undefined) props.name = node.name;
  if (originalType !== type) props[EDITOR_TYPE_PROP] = originalType;
  if (node.styles?.background?.gradient) props[GRADIENT_PROP] = node.styles.background.gradient;
  if (node.styles?.states) props[STATES_PROP] = node.styles.states;

  const children = WIRE_LEAVES.has(type)
    ? []
    : (node.children || []).map((child) => toWireNode(child, type));

  const wire: Record<string, unknown> = {
    id: node.id,
    type,
    props,
    styles: toWireStyles(node.styles),
    responsive: {
      tablet: toWireStyles(node.responsive?.tablet),
      mobile: toWireStyles(node.responsive?.mobile),
    },
    children,
    enabled: true,
    locked: Boolean(node.locked),
  };

  return parentType ? wrapForParent(parentType, wire) : wire;
}

function parseGlobal(raw: unknown): WebsiteDocumentV3['global'] {
  const source = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const reusableIn = (source.reusableNodes && typeof source.reusableNodes === 'object'
    ? source.reusableNodes
    : {}) as Record<string, unknown>;
  const reusableNodes: Record<string, WebsiteNode> = {};
  for (const [id, node] of Object.entries(reusableIn)) {
    if (node && typeof node === 'object') {
      reusableNodes[id] = toEditorNode(node as Record<string, unknown>, null);
    }
  }
  return {
    headerNode:
      source.headerNode && typeof source.headerNode === 'object'
        ? toEditorNode(source.headerNode as Record<string, unknown>, null)
        : undefined,
    footerNode:
      source.footerNode && typeof source.footerNode === 'object'
        ? toEditorNode(source.footerNode as Record<string, unknown>, null)
        : undefined,
    reusableNodes,
    headerDisabled: source.headerDisabled === true,
    footerDisabled: source.footerDisabled === true,
  };
}

export function extractWebsiteDocument(payload: unknown): unknown | null {
  if (!payload || typeof payload !== 'object') return null;
  const record = payload as Record<string, unknown>;
  return (
    record.document ||
    record.draftDocument ||
    record.publishedDocument ||
    (record.data && typeof record.data === 'object'
      ? extractWebsiteDocument(record.data)
      : null)
  );
}

export function toEditorDocument(raw: unknown): WebsiteDocumentV3 {
  const source = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const theme = toEditorTheme(source.theme as Record<string, unknown> | undefined);
  const pagesIn = Array.isArray(source.pages) ? source.pages : [];

  return {
    schemaVersion: '3.0',
    site: {
      id: (source.site as Record<string, unknown> | undefined)?.id as string | undefined,
      name: String((source.site as Record<string, unknown> | undefined)?.name || 'Untitled website'),
      businessType: String((source.site as Record<string, unknown> | undefined)?.businessType || 'business'),
      language: String((source.site as Record<string, unknown> | undefined)?.language || 'en'),
      favicon: (source.site as Record<string, unknown> | undefined)?.favicon as string | undefined,
    },
    theme,
    business: (source.business as WebsiteDocumentV3['business']) || { name: 'My Business' },
    navigation: (source.navigation as WebsiteDocumentV3['navigation']) || { header: [], footer: [] },
    pages: pagesIn
      .filter((page) => page && typeof page === 'object')
      .map((page, index) => {
        const item = page as Record<string, unknown>;
        const slugRaw = typeof item.slug === 'string' && item.slug.trim() ? item.slug : '/';
        const slug = slugRaw.startsWith('/') ? slugRaw : `/${slugRaw}`;
        const root = item.root && typeof item.root === 'object'
          ? toEditorNode(item.root as Record<string, unknown>, null)
          : {
              id: `root_${index}`,
              type: 'page-root' as NodeType,
              children: [],
              props: {},
              styles: {},
            };
        return {
          id: String(item.id || `page_${index}`),
          title: String(item.title || item.name || 'Page'),
          slug,
          type: (String(item.type || 'custom').toLowerCase() as WebsiteDocumentV3['pages'][number]['type']),
          sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : index,
          enabled: item.enabled !== false,
          seo: item.seo as WebsiteDocumentV3['pages'][number]['seo'],
          root,
        };
      }),
    global: parseGlobal(source.global),
    seo: (source.seo as WebsiteDocumentV3['seo']) || {
      metaTitle: String((source.site as Record<string, unknown> | undefined)?.name || 'Website'),
      metaDescription: '',
    },
    settings: (source.settings as WebsiteDocumentV3['settings']) || {
      enableContactForm: true,
      language: 'en',
    },
  };
}

export function toWireDocument(document: WebsiteDocumentV3): Record<string, unknown> {
  const theme = toEditorTheme(document.theme as unknown as Record<string, unknown>);
  return {
    schemaVersion: '3.0',
    site: {
      ...document.site,
      businessType: document.site.businessType || 'business',
      language: document.site.language || 'en',
    },
    theme: {
      primaryColor: theme.primaryColor || theme.colors.primary,
      secondaryColor: theme.secondaryColor || theme.colors.secondary,
      accentColor: theme.accentColor || theme.colors.accent,
      backgroundColor: theme.backgroundColor || theme.colors.background,
      textColor: theme.textColor || theme.colors.text,
      headingFont: theme.headingFont || theme.typography.headingFont || theme.typography.h1?.fontFamily || 'Inter',
      bodyFont: theme.bodyFont || theme.typography.bodyFont || theme.typography.body?.fontFamily || 'Inter',
      borderRadius: theme.borderRadius || 'md',
      shadows: theme.shadows || 'subtle',
      customCss: theme.customCss,
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        accent: theme.colors.accent,
        background: theme.colors.background,
        surface: theme.colors.surface,
        text: theme.colors.text,
        muted: theme.colors.muted,
        border: theme.colors.border,
      },
      typography: {
        headingFont: theme.headingFont || theme.typography.headingFont || theme.typography.h1?.fontFamily || 'Inter',
        bodyFont: theme.bodyFont || theme.typography.bodyFont || theme.typography.body?.fontFamily || 'Inter',
      },
      tokens: theme.tokens || { borderRadius: theme.borderRadius, shadows: theme.shadows },
    },
    business: {
      name: document.business?.name || document.site.name,
      legalName: document.business?.legalName,
      tagline: document.business?.tagline,
      description: document.business?.description,
      category: document.business?.category,
      logoUrl: document.business?.logoUrl || '',
      email: document.business?.email || '',
      phone: document.business?.phone,
      whatsapp: document.business?.whatsapp,
      address: document.business?.address,
      city: document.business?.city,
      state: document.business?.state,
      country: document.business?.country,
      zipCode: document.business?.zipCode,
      socialMedia: document.business?.socialMedia || {},
      businessHours: document.business?.businessHours || {},
    },
    navigation: document.navigation || { header: [], footer: [] },
    global: {
      headerDisabled: Boolean(document.global?.headerDisabled),
      footerDisabled: Boolean(document.global?.footerDisabled),
      headerNode: document.global?.headerNode ? toWireNode(document.global.headerNode, null) : undefined,
      footerNode: document.global?.footerNode ? toWireNode(document.global.footerNode, null) : undefined,
      reusableNodes: Object.fromEntries(
        Object.entries(document.global?.reusableNodes || {}).map(([id, node]) => [id, toWireNode(node, null)]),
      ),
    },
    pages: document.pages.map((page, index) => ({
      id: page.id,
      name: page.title,
      title: page.title,
      slug: page.slug?.startsWith('/') ? page.slug : `/${page.slug || ''}`,
      type: page.type,
      sortOrder: page.sortOrder ?? index,
      enabled: page.enabled !== false,
      seo: page.seo,
      root: toWireNode(page.root, null),
    })),
    seo: document.seo,
    settings: {
      enableContactForm: document.settings?.enableContactForm !== false,
      enableLiveChat: document.settings?.enableLiveChat || false,
      language: document.settings?.language || 'en',
      analyticsId: document.settings?.analyticsId,
      customDomain: document.settings?.customDomain,
    },
  };
}

export function isPersistableNodeType(type: NodeType): boolean {
  return isWireType(type) && type !== 'page-root' && type !== 'legacy-section';
}

export function persistableManifestItems() {
  return Object.values(COMPONENT_MANIFEST).filter((item) => isPersistableNodeType(item.type));
}
