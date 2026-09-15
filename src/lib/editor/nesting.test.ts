import { describe, expect, it } from 'vitest';
import { canAcceptChild } from './nesting';
import { SECTION_PRESETS } from './section-presets';

describe('editor nesting', () => {
  it('allows valid layout nesting and rejects invalid parents', () => {
    expect(canAcceptChild('page-root', 'section')).toBe(true);
    expect(canAcceptChild('section', 'container')).toBe(true);
    expect(canAcceptChild('container', 'heading')).toBe(true);
    expect(canAcceptChild('stack', 'grid')).toBe(true);
    expect(canAcceptChild('grid', 'stack')).toBe(true);
    expect(canAcceptChild('heading', 'button')).toBe(false);
    expect(canAcceptChild('page-root', 'heading')).toBe(false);
  });
});

describe('section presets', () => {
  it('includes the UPDATE 2 starter library as normal document subtrees', () => {
    const ids = SECTION_PRESETS.map((preset) => preset.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        'hero',
        'about',
        'features',
        'services',
        'testimonials',
        'pricing',
        'gallery',
        'faq',
        'cta',
        'contact',
        'footer',
      ]),
    );

    for (const preset of SECTION_PRESETS) {
      const node = preset.build();
      expect(node.type).toBe('section');
      expect(node.id).toBeTruthy();
      expect(node.children?.length).toBeGreaterThan(0);
    }
  });

  it('includes a real contact-form node in contact presets', () => {
    const contact = SECTION_PRESETS.find((preset) => preset.id === 'contact');
    expect(contact).toBeTruthy();
    const tree = JSON.stringify(contact!.build());
    expect(tree).toContain('"type":"contact-form"');
  });
});
