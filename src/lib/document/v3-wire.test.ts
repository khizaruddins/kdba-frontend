import { describe, expect, it } from 'vitest';
import { createDefaultNode } from './v3-operations';
import { GRADIENT_PROP, toEditorDocument, toWireDocument } from './v3-wire';
import { WebsiteNode } from '@/types/v3-document';

function documentWith(rootChildren: WebsiteNode[]) {
  const root = createDefaultNode('page-root', {
    id: 'root',
    children: rootChildren,
  });
  return toEditorDocument({
    schemaVersion: '3.0',
    site: { name: 'Wire Test', language: 'en' },
    theme: {
      headingFont: 'Sora',
      bodyFont: 'Inter',
      colors: { primary: '#4F46E5' },
      tokens: { containerMaxWidth: '1100px', buttonRadius: '16px' },
    },
    pages: [{ id: 'page_home', title: 'Home', slug: '/', root }],
  });
}

describe('v3 wire adapter', () => {
  it('round-trips heading/body fonts and layout tokens', () => {
    const doc = documentWith([]);
    const wire = toWireDocument(doc);
    const theme = wire.theme as Record<string, unknown>;
    expect(theme.headingFont).toBe('Sora');
    expect(theme.bodyFont).toBe('Inter');
    const tokens = theme.tokens as Record<string, unknown>;
    expect(tokens.containerMaxWidth).toBe('1100px');
    expect(tokens.buttonRadius).toBe('16px');

    const restored = toEditorDocument(wire);
    expect(restored.theme.headingFont || restored.theme.typography.headingFont).toBe('Sora');
    expect(restored.theme.tokens?.containerMaxWidth).toBe('1100px');
  });

  it('persists gradients on nodes through props so backend style schema can drop them', () => {
    const section = createDefaultNode('section', {
      id: 'hero',
      styles: {
        background: {
          gradient: {
            type: 'linear',
            angle: 120,
            stops: [
              { color: '#0B0D13', offset: 0 },
              { color: 'primary', offset: 100 },
            ],
          },
        },
      },
      children: [createDefaultNode('container', { id: 'box' })],
    });
    const doc = documentWith([section]);
    const wire = toWireDocument(doc);
    const wireRoot = (wire.pages as Array<Record<string, unknown>>)[0].root as Record<string, unknown>;
    const wireSection = (wireRoot.children as Array<Record<string, unknown>>)[0];
    const props = wireSection.props as Record<string, unknown>;
    expect(props[GRADIENT_PROP]).toMatchObject({ type: 'linear', angle: 120 });

    const restored = toEditorDocument(wire);
    const restoredSection = restored.pages[0].root.children?.[0];
    expect(restoredSection?.styles?.background?.gradient?.angle).toBe(120);
    expect(restoredSection?.styles?.background?.gradient?.stops[1].color).toBe('primary');
  });
});
