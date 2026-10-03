import { describe, expect, it, beforeEach } from 'vitest';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { createDefaultNode } from '@/lib/document/v3-operations';
import { toEditorDocument } from '@/lib/document/v3-wire';
import { WebsiteDocumentV3, WebsiteNode } from '@/types/v3-document';

function createTestDocument(): WebsiteDocumentV3 {
  const heading = createDefaultNode('heading', {
    id: 'hero-heading',
    props: { text: 'Train Harder', level: 1 },
    styles: { typography: { fontSize: '48px', color: '#ffffff' } },
  });

  const paragraph = createDefaultNode('paragraph', {
    id: 'hero-para',
    props: { text: 'Join our fitness community' },
    styles: { typography: { fontSize: '16px', color: '#a1a1aa' } },
  });

  const image = createDefaultNode('image', {
    id: 'hero-img',
    props: { src: '/gym.jpg', alt: 'Gym' },
  });

  const button = createDefaultNode('button', {
    id: 'hero-btn',
    props: { text: 'Join Now' },
    styles: { background: { color: '#e63946' } },
  });

  const heroContainer = createDefaultNode('container', {
    id: 'hero-container',
    children: [heading, paragraph, button, image],
  });

  const heroSection = createDefaultNode('section', {
    id: 'hero-section',
    name: 'Hero Section',
    children: [heroContainer],
  });

  const featuresSection = createDefaultNode('section', {
    id: 'features-section',
    name: 'Features Section',
    children: [],
  });

  const root: WebsiteNode = createDefaultNode('page-root', {
    id: 'page-root',
    children: [heroSection, featuresSection],
  });

  return toEditorDocument({
    schemaVersion: '3.0',
    site: { name: 'Gym 360', language: 'en' },
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

describe('M3.1 Editor Precision & Customization Features', () => {
  beforeEach(() => {
    const doc = createTestDocument();
    useV3EditorStore.getState().setDocumentData('test-site', doc, 1, 'hash-1');
  });

  describe('Section Contextual Controls (Add Above / Add Below)', () => {
    it('adds a section above a reference section', () => {
      const store = useV3EditorStore.getState();
      store.addSectionAbove('features-section', 'hero');

      const updatedPage = useV3EditorStore.getState().getActivePage();
      const sections = updatedPage?.root.children || [];
      expect(sections.length).toBe(3);
      expect(sections[0].id).toBe('hero-section');
      expect(sections[1].name).toBe('Hero');
      expect(sections[2].id).toBe('features-section');
    });

    it('adds a section below a reference section', () => {
      const store = useV3EditorStore.getState();
      store.addSectionBelow('hero-section', 'cta');

      const updatedPage = useV3EditorStore.getState().getActivePage();
      const sections = updatedPage?.root.children || [];
      expect(sections.length).toBe(3);
      expect(sections[0].id).toBe('hero-section');
      expect(sections[1].name).toBe('Call to Action');
      expect(sections[2].id).toBe('features-section');
    });
  });

  describe('Change Layout Experience (Preserving Existing Content)', () => {
    it('converts container to 2-column grid preserving all children', () => {
      const store = useV3EditorStore.getState();
      store.changeLayout('hero-container', '2-col');

      const node = useV3EditorStore.getState().findNode('hero-container');
      expect(node).toBeDefined();
      expect(node?.styles?.layout?.display).toBe('grid');
      expect(node?.styles?.grid?.gridTemplateColumns).toBe('1fr 1fr');
      // All 4 original children must be preserved
      expect(node?.children?.length).toBe(4);
      expect(node?.children?.[0].id).toBe('hero-heading');
      expect(node?.children?.[3].id).toBe('hero-img');
    });

    it('converts container to 40/60 layout preserving children', () => {
      const store = useV3EditorStore.getState();
      store.changeLayout('hero-container', '40-60');

      const node = useV3EditorStore.getState().findNode('hero-container');
      expect(node?.styles?.layout?.display).toBe('grid');
      expect(node?.styles?.grid?.gridTemplateColumns).toBe('4fr 6fr');
      expect(node?.children?.length).toBe(4);
    });

    it('converts container to 60/40 layout preserving children', () => {
      const store = useV3EditorStore.getState();
      store.changeLayout('hero-container', '60-40');

      const node = useV3EditorStore.getState().findNode('hero-container');
      expect(node?.styles?.grid?.gridTemplateColumns).toBe('6fr 4fr');
      expect(node?.children?.length).toBe(4);
    });

    it('converts container to 3-column grid preserving children', () => {
      const store = useV3EditorStore.getState();
      store.changeLayout('hero-container', '3-col');

      const node = useV3EditorStore.getState().findNode('hero-container');
      expect(node?.styles?.grid?.gridTemplateColumns).toBe('1fr 1fr 1fr');
      expect(node?.children?.length).toBe(4);
    });

    it('converts container to bento grid preserving children', () => {
      const store = useV3EditorStore.getState();
      store.changeLayout('hero-container', 'bento');

      const node = useV3EditorStore.getState().findNode('hero-container');
      expect(node?.styles?.grid?.gridTemplateColumns).toBe('repeat(3, 1fr)');
      expect(node?.styles?.grid?.columnGap).toBe('20px');
      expect(node?.children?.length).toBe(4);
    });

    it('converts container to stack layout', () => {
      const store = useV3EditorStore.getState();
      store.changeLayout('hero-container', 'stack');

      const node = useV3EditorStore.getState().findNode('hero-container');
      expect(node?.styles?.layout?.display).toBe('flex');
      expect(node?.styles?.flex?.direction).toBe('column');
      expect(node?.children?.length).toBe(4);
    });

    it('reverses order of children without losing any nodes', () => {
      const store = useV3EditorStore.getState();
      store.changeLayout('hero-container', 'reverse');

      const node = useV3EditorStore.getState().findNode('hero-container');
      expect(node?.children?.length).toBe(4);
      expect(node?.children?.[0].id).toBe('hero-img');
      expect(node?.children?.[3].id).toBe('hero-heading');
    });
  });

  describe('Component States Customization (Hover / Active)', () => {
    it('configures hover state styles cleanly', () => {
      const store = useV3EditorStore.getState();
      store.updateState('hero-btn', 'hover', {
        background: { color: '#ff4d5a' },
        typography: { color: '#ffffff' },
      });

      const node = useV3EditorStore.getState().findNode('hero-btn');
      expect(node?.states?.hover?.background?.color).toBe('#ff4d5a');
      // Default styles remain intact
      expect(node?.styles?.background?.color).toBe('#e63946');
    });

    it('configures active state styles cleanly', () => {
      const store = useV3EditorStore.getState();
      store.updateState('hero-btn', 'active', {
        effects: { opacity: 0.85 },
      });

      const node = useV3EditorStore.getState().findNode('hero-btn');
      expect(node?.states?.active?.effects?.opacity).toBe(0.85);
    });
  });

  describe('Animation Customization', () => {
    it('sets animation presets, duration, delay, easing, and trigger', () => {
      const store = useV3EditorStore.getState();
      store.updateAnimation('hero-heading', {
        preset: 'fade-up',
        duration: 800,
        delay: 200,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        trigger: 'on-scroll',
      });

      const node = useV3EditorStore.getState().findNode('hero-heading');
      expect(node?.animations?.preset).toBe('fade-up');
      expect(node?.animations?.duration).toBe(800);
      expect(node?.animations?.delay).toBe(200);
      expect(node?.animations?.trigger).toBe('on-scroll');
    });
  });

  describe('Responsive Overrides (Desktop vs Mobile)', () => {
    it('stores mobile style overrides without overwriting desktop styles', () => {
      const store = useV3EditorStore.getState();
      store.setViewport('mobile');

      store.updateStyles('hero-heading', {
        typography: { fontSize: '28px' },
      });

      const node = useV3EditorStore.getState().findNode('hero-heading');
      // Desktop font size preserved
      expect(node?.styles?.typography?.fontSize).toBe('48px');
      // Mobile override registered
      expect(node?.responsive?.mobile?.typography?.fontSize).toBe('28px');

      // Swapping viewport to desktop inspects desktop styles
      store.setViewport('desktop');
      const desktopStyles = store.getInspectorStyles('hero-heading');
      expect(desktopStyles.typography?.fontSize).toBe('48px');

      // Swapping viewport to mobile inspects combined/overridden styles
      store.setViewport('mobile');
      const mobileStyles = store.getInspectorStyles('hero-heading');
      expect(mobileStyles.typography?.fontSize).toBe('28px');
    });
  });

  describe('Duplication and Node Integrity', () => {
    it('duplicates a node and generates fresh unique IDs', () => {
      const store = useV3EditorStore.getState();
      store.duplicateNode('hero-btn');

      const container = store.findNode('hero-container');
      expect(container?.children?.length).toBe(5);
      // Button duplicated after index 2 is placed at index 3
      const duplicateBtn = container?.children?.[3];
      expect(duplicateBtn?.id).not.toBe('hero-btn');
      expect(duplicateBtn?.props?.text).toBe('Join Now');
      expect(duplicateBtn?.styles?.background?.color).toBe('#e63946');
    });
  });

  describe('Undo and Redo', () => {
    it('correctly reverts and reapplies operations', () => {
      const store = useV3EditorStore.getState();
      // Initially 2 sections
      expect(store.getActivePage()?.root.children?.length).toBe(2);

      store.addSectionBelow('hero-section', 'faq');
      expect(useV3EditorStore.getState().getActivePage()?.root.children?.length).toBe(3);

      store.undo();
      expect(useV3EditorStore.getState().getActivePage()?.root.children?.length).toBe(2);

      store.redo();
      expect(useV3EditorStore.getState().getActivePage()?.root.children?.length).toBe(3);
    });
  });
});
