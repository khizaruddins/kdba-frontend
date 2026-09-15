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

  it('wraps a grid inside a stack so backend nesting validation can accept it', () => {
    const section = createDefaultNode('section', {
      id: 'features',
      children: [
        createDefaultNode('container', {
          id: 'box',
          children: [
            createDefaultNode('stack', {
              id: 'stack',
              children: [
                createDefaultNode('heading', { id: 'title', props: { text: 'Features' } }),
                createDefaultNode('grid', {
                  id: 'grid',
                  children: [createDefaultNode('stack', { id: 'card' })],
                }),
              ],
            }),
          ],
        }),
      ],
    });
    const wire = toWireDocument(documentWith([section]));
    const root = (wire.pages as Array<Record<string, unknown>>)[0].root as Record<string, unknown>;
    const wireSection = (root.children as Array<Record<string, unknown>>)[0];
    const wireContainer = (wireSection.children as Array<Record<string, unknown>>)[0];
    const wireStack = (wireContainer.children as Array<Record<string, unknown>>)[0];
    const stackChildren = wireStack.children as Array<Record<string, unknown>>;
    expect(stackChildren.map((child) => child.type)).toEqual(['heading', 'container']);
    expect((stackChildren[1].children as Array<Record<string, unknown>>)[0].type).toBe('grid');

    const restored = toEditorDocument(wire);
    const restoredStack = restored.pages[0].root.children?.[0].children?.[0].children?.[0];
    expect(restoredStack?.children?.map((child) => child.type)).toEqual(['heading', 'grid']);
  });

  it('does not emit nested section nodes when a navbar lives inside a section', () => {
    const section = createDefaultNode('section', {
      id: 'hero',
      children: [
        createDefaultNode('navbar', { id: 'nav' }),
        createDefaultNode('container', { id: 'box' }),
      ],
    });
    const wire = toWireDocument(documentWith([section]));
    const root = (wire.pages as Array<Record<string, unknown>>)[0].root as Record<string, unknown>;
    const wireSection = (root.children as Array<Record<string, unknown>>)[0];
    const children = wireSection.children as Array<Record<string, unknown>>;
    expect(children.map((child) => child.type)).not.toContain('section');
    expect(children[0].type).toBe('stack');
  });

  it('recovers navbar type when public publish stripped kdbaEditorType', () => {
    const restored = toEditorDocument({
      schemaVersion: '3.0',
      site: { name: 'Studio', language: 'en' },
      global: {
        headerNode: {
          id: 'global_header',
          type: 'section',
          props: {
            brandName: 'Photography Merkhiz',
            sticky: true,
            useSiteNavigation: true,
            ctaText: 'Get Started',
            links: [{ href: '#', label: 'Home' }],
          },
          children: [],
        },
      },
      pages: [
        {
          id: 'page_home',
          title: 'Home',
          slug: '/',
          root: { id: 'root', type: 'page-root', children: [] },
        },
      ],
    });

    expect(restored.global?.headerNode?.type).toBe('navbar');
    expect(restored.global?.headerNode?.props?.brandName).toBe('Photography Merkhiz');
  });
});
