export const THEME_COLOR_TOKEN_KEYS = [
  'primary',
  'secondary',
  'accent',
  'background',
  'surface',
  'text',
  'muted',
  'border',
] as const;

export type ThemeColorToken = (typeof THEME_COLOR_TOKEN_KEYS)[number];

export const THEME_COLOR_TOKEN_LABELS: Record<ThemeColorToken, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  accent: 'Accent',
  background: 'Background',
  surface: 'Surface',
  text: 'Text',
  muted: 'Muted',
  border: 'Border',
};

export const THEME_COLOR_FALLBACKS: Record<ThemeColorToken, string> = {
  primary: '#4F46E5',
  secondary: '#0F172A',
  accent: '#06B6D4',
  background: '#0B0D13',
  surface: '#131620',
  text: '#FFFFFF',
  muted: '#94A3B8',
  border: '#212636',
};

export function isThemeColorToken(value?: string | null): value is ThemeColorToken {
  return Boolean(value && (THEME_COLOR_TOKEN_KEYS as readonly string[]).includes(value));
}

export function resolveThemeColor(value?: string): string | undefined {
  if (!value) return undefined;
  if (isThemeColorToken(value)) return `var(--kdba-${value})`;
  return value;
}

export const DEFAULT_THEME_LAYOUT_TOKENS = {
  containerMaxWidth: '1200px',
  buttonRadius: '12px',
  buttonBackground: 'primary',
  buttonColor: '#FFFFFF',
  radius: 'md',
  shadow: 'subtle',
  spaceScale: '8px',
  headingScale: '1',
  bodyScale: '1',
  headingLineHeight: '1.15',
  bodyLineHeight: '1.6',
  letterSpacing: '0',
};

export const RADIUS_SCALE: Record<string, string> = {
  none: '0px',
  sm: '6px',
  md: '12px',
  lg: '20px',
  full: '999px',
  pill: '999px',
};

export const SHADOW_SCALE: Record<string, string> = {
  none: 'none',
  subtle: '0 10px 30px rgba(0,0,0,0.22)',
  medium: '0 18px 44px rgba(0,0,0,0.32)',
  strong: '0 28px 64px rgba(0,0,0,0.45)',
  dramatic: '0 28px 64px rgba(0,0,0,0.45)',
};

export interface ThemeLayoutTokens {
  containerMaxWidth: string;
  buttonRadius: string;
  buttonBackground: string;
  buttonColor: string;
  radius: string;
  shadow: string;
  spaceScale: string;
  headingScale: string;
  bodyScale: string;
  headingLineHeight: string;
  bodyLineHeight: string;
  letterSpacing: string;
}

export function getThemeLayoutTokens(tokens?: Record<string, unknown> | null): ThemeLayoutTokens {
  const radiusKey = typeof tokens?.radius === 'string' ? tokens.radius : DEFAULT_THEME_LAYOUT_TOKENS.radius;
  const shadowKey = typeof tokens?.shadow === 'string' ? tokens.shadow : DEFAULT_THEME_LAYOUT_TOKENS.shadow;
  return {
    containerMaxWidth:
      typeof tokens?.containerMaxWidth === 'string' && tokens.containerMaxWidth
        ? tokens.containerMaxWidth
        : DEFAULT_THEME_LAYOUT_TOKENS.containerMaxWidth,
    buttonRadius:
      typeof tokens?.buttonRadius === 'string' && tokens.buttonRadius
        ? tokens.buttonRadius
        : RADIUS_SCALE[radiusKey] || DEFAULT_THEME_LAYOUT_TOKENS.buttonRadius,
    buttonBackground:
      typeof tokens?.buttonBackground === 'string' && tokens.buttonBackground
        ? tokens.buttonBackground
        : DEFAULT_THEME_LAYOUT_TOKENS.buttonBackground,
    buttonColor:
      typeof tokens?.buttonColor === 'string' && tokens.buttonColor
        ? tokens.buttonColor
        : DEFAULT_THEME_LAYOUT_TOKENS.buttonColor,
    radius: RADIUS_SCALE[radiusKey] || RADIUS_SCALE.md,
    shadow: SHADOW_SCALE[shadowKey] || SHADOW_SCALE.subtle,
    spaceScale:
      typeof tokens?.spaceScale === 'string' && tokens.spaceScale
        ? tokens.spaceScale
        : DEFAULT_THEME_LAYOUT_TOKENS.spaceScale,
    headingScale:
      typeof tokens?.headingScale === 'string' && tokens.headingScale
        ? tokens.headingScale
        : DEFAULT_THEME_LAYOUT_TOKENS.headingScale,
    bodyScale:
      typeof tokens?.bodyScale === 'string' && tokens.bodyScale
        ? tokens.bodyScale
        : DEFAULT_THEME_LAYOUT_TOKENS.bodyScale,
    headingLineHeight:
      typeof tokens?.headingLineHeight === 'string' && tokens.headingLineHeight
        ? tokens.headingLineHeight
        : DEFAULT_THEME_LAYOUT_TOKENS.headingLineHeight,
    bodyLineHeight:
      typeof tokens?.bodyLineHeight === 'string' && tokens.bodyLineHeight
        ? tokens.bodyLineHeight
        : DEFAULT_THEME_LAYOUT_TOKENS.bodyLineHeight,
    letterSpacing:
      typeof tokens?.letterSpacing === 'string' && tokens.letterSpacing
        ? tokens.letterSpacing
        : DEFAULT_THEME_LAYOUT_TOKENS.letterSpacing,
  };
}

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6 && clean.length !== 3) return hex;
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return hex;
  if (alpha >= 1) return `#${full.toUpperCase()}`;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function parseCssColor(value?: string): { hex: string; opacity: number } {
  if (!value || value === 'transparent') return { hex: '#000000', opacity: 0 };
  const rgba = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgba) {
    const r = Number(rgba[1]).toString(16).padStart(2, '0');
    const g = Number(rgba[2]).toString(16).padStart(2, '0');
    const b = Number(rgba[3]).toString(16).padStart(2, '0');
    return { hex: `#${r}${g}${b}`, opacity: rgba[4] !== undefined ? Number(rgba[4]) : 1 };
  }
  if (value.startsWith('#') && (value.length === 7 || value.length === 4)) {
    const hex =
      value.length === 4
        ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
        : value;
    return { hex, opacity: 1 };
  }
  return { hex: '#FFFFFF', opacity: 1 };
}
