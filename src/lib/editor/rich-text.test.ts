import { describe, expect, it } from 'vitest';
import { normalizeRuns, sanitizeHref, sanitizePlainText, textFromRuns } from './rich-text';

describe('rich text sanitization', () => {
  it('strips tags and javascript urls', () => {
    expect(sanitizePlainText('<strong>Hello</strong>')).toBe('Hello');
    expect(sanitizeHref('javascript:alert(1)')).toBeUndefined();
    expect(sanitizeHref('https://kdba.test')).toBe('https://kdba.test');
  });

  it('normalizes runs without keeping empty or unsafe values', () => {
    const runs = normalizeRuns([
      { text: 'Bold', bold: true },
      { text: '', italic: true },
      { text: 'Link', href: 'javascript:void(0)' },
    ]);
    expect(runs).toHaveLength(2);
    expect(runs[0].bold).toBe(true);
    expect(runs[1].href).toBeUndefined();
    expect(textFromRuns(runs)).toBe('BoldLink');
  });
});
