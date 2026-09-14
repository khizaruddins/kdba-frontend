import { describe, expect, it } from 'vitest';
import {
  applyDocumentOperation,
  applyStylesForViewport,
  cloneNodeWithFreshIds,
  createDefaultNode,
  findNode,
} from './v3-operations';
import { toEditorDocument } from './v3-wire';
import { WebsiteDocumentV3, WebsiteNode } from '@/types/v3-document';

function sampleDocument(): WebsiteDocumentV3 {
  const heading = createDefaultNode('heading', {
    id: 'heading',
    props: { text: 'Grow Your Business', level: 1 },
    styles: { typography: { fontSize: '56px' } },
  });
  const paragraph = createDefaultNode('paragraph', {
    id: 'paragraph',
    props: { text: 'Supporting copy' },
  });
  const container = createDefaultNode('container', {
    id: 'container',
    children: [heading, paragraph],
  });
  const section = createDefaultNode('section', {
    id: 'section',
    children: [container],
  });
  const root: WebsiteNode = createDefaultNode('page-root', {
    id: 'root',
    children: [section],
  });

  return toEditorDocument({
    schemaVersion: '3.0',
    site: { name: 'Test Site', language: 'en' },
    pages: [
      {
        id: 'page_home',
        title: 'Home',
        slug: '/',
        type: 'home',
        root,
      },
    ],
  });
}

describe('v3 document operations', () => {
  it('adds, duplicates, moves, and removes nodes through the operation engine', () => {
    const doc = sampleDocument();
    const pageId = doc.pages[0].id;
    const button = createDefaultNode('button', {
      id: 'cta',
      props: { label: 'Get Started' },
    });

    const withButton = applyDocumentOperation(doc, {
      type: 'addNode',
      pageId,
      parentId: 'container',
      node: button,
    });
    expect(findNode(withButton.pages[0].root, 'cta')?.props?.label).toBe('Get Started');

    const duplicated = applyDocumentOperation(withButton, {
      type: 'duplicateNode',
      pageId,
      nodeId: 'cta',
    });
    const buttons = duplicated.pages[0].root.children?.[0].children?.[0].children?.filter((n) => n.type === 'button') || [];
    expect(buttons).toHaveLength(2);
    expect(buttons[1].id).not.toBe('cta');
    expect(buttons[1].id).not.toBe(buttons[0].id);

    const moved = applyDocumentOperation(duplicated, {
      type: 'moveNode',
      pageId,
      nodeId: 'cta',
      targetParentId: 'container',
      targetIndex: 0,
    });
    expect(moved.pages[0].root.children?.[0].children?.[0].children?.[0].id).toBe('cta');

    const removed = applyDocumentOperation(moved, {
      type: 'removeNode',
      pageId,
      nodeId: 'cta',
    });
    expect(findNode(removed.pages[0].root, 'cta')).toBeNull();
    expect(findNode(removed.pages[0].root, 'heading')).not.toBeNull();
  });

  it('stores mobile typography as an override without changing desktop', () => {
    const doc = sampleDocument();
    const pageId = doc.pages[0].id;
    const desktop = applyStylesForViewport(doc, pageId, 'heading', 'desktop', {
      typography: { fontSize: '56px' },
    });
    const mobile = applyStylesForViewport(desktop, pageId, 'heading', 'mobile', {
      typography: { fontSize: '36px' },
    });

    const heading = findNode(mobile.pages[0].root, 'heading');
    expect(heading?.styles?.typography?.fontSize).toBe('56px');
    expect(heading?.responsive?.mobile?.typography?.fontSize).toBe('36px');
    expect(heading?.responsive?.tablet?.typography?.fontSize).toBeUndefined();
    expect(heading?.responsive?.mobile?.typography?.color).toBeUndefined();
  });

  it('generates new ids when cloning a subtree for paste', () => {
    const original = createDefaultNode('stack', {
      children: [
        createDefaultNode('heading', { props: { text: 'A' } }),
        createDefaultNode('paragraph', { props: { text: 'B' } }),
      ],
    });
    const cloned = cloneNodeWithFreshIds(original);
    expect(cloned.id).not.toBe(original.id);
    expect(cloned.children?.[0].id).not.toBe(original.children?.[0].id);
    expect(cloned.children?.[1].props?.text).toBe('B');
  });
});
