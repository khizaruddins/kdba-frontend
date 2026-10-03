/**
 * Google Fonts Loader & Typography Utilities for KDBA
 */

const KNOWN_SYSTEM_FONTS = new Set([
  'system',
  'system-ui',
  '-apple-system',
  'blinkmacsystemfont',
  'segoe ui',
  'arial',
  'helvetica',
  'times new roman',
  'georgia',
  'courier new',
  'verdana',
  'tahoma',
  'trebuchet ms',
  'sans-serif',
  'serif',
  'monospace',
  'inherit',
  'initial',
]);

const KNOWN_SERIF_FONTS = new Set([
  'playfair display',
  'merriweather',
  'lora',
  'georgia',
  'cinzel',
  'bodoni moda',
  'eb garamond',
  'cormorant garamond',
  'prata',
  'pt serif',
  'libre baskerville',
  'spectral',
  'noto serif',
  'abril fatface',
  'josefin slab',
  'source serif 4',
]);

const KNOWN_MONO_FONTS = new Set([
  'fira code',
  'jetbrains mono',
  'source code pro',
  'roboto mono',
  'ibm plex mono',
  'courier new',
  'monospace',
  'space mono',
  'inconsolata',
]);

/**
 * Normalizes a raw font family string and adds appropriate CSS fallbacks.
 * e.g. "Playfair Display" -> '"Playfair Display", Georgia, serif'
 */
export function formatFontFamilyWithFallback(font: string | undefined | null): string {
  if (!font || typeof font !== 'string') {
    return 'Inter, system-ui, -apple-system, sans-serif';
  }

  const trimmed = font.trim();
  if (!trimmed) {
    return 'Inter, system-ui, -apple-system, sans-serif';
  }

  // If already contains fallbacks (e.g. "Playfair Display, Georgia, serif")
  if (trimmed.includes(',')) {
    return trimmed;
  }

  const clean = trimmed.replace(/^['"]+|['"]+$/g, '');
  const lower = clean.toLowerCase();

  if (KNOWN_SYSTEM_FONTS.has(lower)) {
    return clean;
  }

  if (KNOWN_SERIF_FONTS.has(lower) || lower.includes('serif')) {
    return `"${clean}", Georgia, serif`;
  }

  if (KNOWN_MONO_FONTS.has(lower) || lower.includes('mono')) {
    return `"${clean}", ui-monospace, monospace`;
  }

  return `"${clean}", system-ui, -apple-system, sans-serif`;
}

/**
 * Extracts the primary font family name from a font string that may contain quotes or fallbacks.
 * e.g. '"Playfair Display", Georgia, serif' -> 'Playfair Display'
 */
export function cleanFontFamilyName(font: string | undefined | null): string | null {
  if (!font || typeof font !== 'string') return null;
  const primary = font.split(',')[0].trim().replace(/^['"]+|['"]+$/g, '');
  if (!primary || KNOWN_SYSTEM_FONTS.has(primary.toLowerCase())) {
    return null;
  }
  return primary;
}

/**
 * Builds a Google Fonts stylesheet URL for a set of font names.
 */
export function buildGoogleFontsUrl(fonts: (string | undefined | null)[]): string | null {
  const families = new Set<string>();

  for (const f of fonts) {
    const clean = cleanFontFamilyName(f);
    if (clean && !KNOWN_SYSTEM_FONTS.has(clean.toLowerCase())) {
      families.add(clean);
    }
  }

  if (families.size === 0) return null;

  const familyParams = Array.from(families).map((family) => {
    const formatted = family.replace(/\s+/g, '+');
    // Request standard web weights
    return `family=${formatted}:wght@300;400;500;600;700;800`;
  });

  return `https://fonts.googleapis.com/css2?${familyParams.join('&')}&display=swap`;
}

/**
 * Recursively scans a document for all unique font families used across theme and nodes.
 */
export function extractAllDocumentFonts(document: Record<string, unknown> | null | undefined): string[] {
  if (!document) return [];

  const fonts = new Set<string>();

  const doc = document as any;
  const theme = doc.theme || {};

  if (theme.headingFont) fonts.add(theme.headingFont);
  if (theme.bodyFont) fonts.add(theme.bodyFont);

  if (theme.typography) {
    if (theme.typography.headingFont) fonts.add(theme.typography.headingFont);
    if (theme.typography.bodyFont) fonts.add(theme.typography.bodyFont);
    if (theme.typography.h1?.fontFamily) fonts.add(theme.typography.h1.fontFamily);
    if (theme.typography.h2?.fontFamily) fonts.add(theme.typography.h2.fontFamily);
    if (theme.typography.h3?.fontFamily) fonts.add(theme.typography.h3.fontFamily);
    if (theme.typography.body?.fontFamily) fonts.add(theme.typography.body.fontFamily);
  }

  function scanNode(node: any) {
    if (!node || typeof node !== 'object') return;
    if (node.styles?.typography?.fontFamily) {
      fonts.add(node.styles.typography.fontFamily);
    }
    if (node.props?.fontFamily) {
      fonts.add(node.props.fontFamily);
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        scanNode(child);
      }
    }
  }

  if (Array.isArray(doc.pages)) {
    for (const page of doc.pages) {
      if (page?.root) scanNode(page.root);
    }
  }

  if (doc.global?.headerNode) scanNode(doc.global.headerNode);
  if (doc.global?.footerNode) scanNode(doc.global.footerNode);

  return Array.from(fonts);
}
