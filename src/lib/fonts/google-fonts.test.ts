import { describe, expect, it } from 'vitest';
import {
  buildGoogleFontsUrl,
  cleanFontFamilyName,
  extractAllDocumentFonts,
  formatFontFamilyWithFallback,
} from './google-fonts';

describe('google fonts utilities', () => {
  describe('formatFontFamilyWithFallback', () => {
    it('appends serif fallback for serif fonts', () => {
      expect(formatFontFamilyWithFallback('Playfair Display')).toBe('"Playfair Display", Georgia, serif');
      expect(formatFontFamilyWithFallback('Lora')).toBe('"Lora", Georgia, serif');
      expect(formatFontFamilyWithFallback('Cinzel')).toBe('"Cinzel", Georgia, serif');
    });

    it('appends sans-serif fallback for sans-serif fonts', () => {
      expect(formatFontFamilyWithFallback('Plus Jakarta Sans')).toBe(
        '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
      );
      expect(formatFontFamilyWithFallback('Inter')).toBe('"Inter", system-ui, -apple-system, sans-serif');
      expect(formatFontFamilyWithFallback('Sora')).toBe('"Sora", system-ui, -apple-system, sans-serif');
    });

    it('keeps fonts that already include fallbacks unchanged', () => {
      expect(formatFontFamilyWithFallback('Playfair Display, Georgia, serif')).toBe(
        'Playfair Display, Georgia, serif',
      );
    });

    it('handles system fonts directly', () => {
      expect(formatFontFamilyWithFallback('Georgia')).toBe('Georgia');
      expect(formatFontFamilyWithFallback('Arial')).toBe('Arial');
    });
  });

  describe('cleanFontFamilyName', () => {
    it('extracts primary font family and removes quotes', () => {
      expect(cleanFontFamilyName('"Playfair Display", serif')).toBe('Playfair Display');
      expect(cleanFontFamilyName('Plus Jakarta Sans')).toBe('Plus Jakarta Sans');
      expect(cleanFontFamilyName('Arial')).toBeNull(); // system font ignored
    });
  });

  describe('buildGoogleFontsUrl', () => {
    it('creates a combined Google Fonts v2 URL for requested fonts', () => {
      const url = buildGoogleFontsUrl(['Playfair Display', 'Plus Jakarta Sans', 'Arial']);
      expect(url).not.toBeNull();
      expect(url).toContain('https://fonts.googleapis.com/css2?');
      expect(url).toContain('family=Playfair+Display');
      expect(url).toContain('family=Plus+Jakarta+Sans');
      expect(url).not.toContain('family=Arial');
    });

    it('returns null if only system fonts or empty', () => {
      expect(buildGoogleFontsUrl(['Arial', 'Georgia'])).toBeNull();
      expect(buildGoogleFontsUrl([])).toBeNull();
    });
  });

  describe('extractAllDocumentFonts', () => {
    it('scans theme and nodes for all custom fonts', () => {
      const doc = {
        theme: {
          headingFont: 'Playfair Display',
          bodyFont: 'Plus Jakarta Sans',
          typography: {
            h1: { fontFamily: 'Cinzel' },
          },
        },
        pages: [
          {
            root: {
              type: 'page-root',
              children: [
                {
                  type: 'heading',
                  styles: { typography: { fontFamily: 'Sora' } },
                },
              ],
            },
          },
        ],
      };

      const fonts = extractAllDocumentFonts(doc);
      expect(fonts).toContain('Playfair Display');
      expect(fonts).toContain('Plus Jakarta Sans');
      expect(fonts).toContain('Cinzel');
      expect(fonts).toContain('Sora');
    });
  });
});
