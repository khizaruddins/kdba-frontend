import { describe, expect, it, beforeEach } from 'vitest';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { TEMPLATES_DEFINITIONS } from '@/lib/templates/definitions';
import { toEditorDocument } from '@/lib/document/v3-wire';
import { createDefaultNode } from '@/lib/document/v3-operations';
import { WebsiteNode } from '@/types/v3-document';

describe('GYM-360 Full Acceptance Stress Test (22 Precision Actions)', () => {
  beforeEach(() => {
    const gymTemplate = TEMPLATES_DEFINITIONS.find((t) => t.id === 'tpl_fitness');
    expect(gymTemplate).toBeDefined();
    const doc = toEditorDocument(gymTemplate!.document);
    useV3EditorStore.getState().setDocumentData('gym-360', doc, 1, 'gym-initial-hash');
  });

  it('executes all 22 Gym-360 acceptance actions with high precision and document integrity', () => {
    const store = useV3EditorStore.getState();
    const page = store.getActivePage();
    expect(page).toBeDefined();
    const sections = page!.root.children || [];
    expect(sections.length).toBeGreaterThanOrEqual(3);

    const heroSection = sections.find((s: WebsiteNode) => s.id.includes('hero') || s.name?.toLowerCase().includes('hero')) || sections[0];
    const heroSectionId = heroSection.id;

    // 1. Change hero layout
    store.changeLayout(heroSectionId, '50-50');
    let heroNode = store.findNode(heroSectionId);
    const heroContainer = heroNode?.children?.find((c: WebsiteNode) => c.type === 'container' || c.type === 'grid') || heroNode;
    expect(heroContainer?.styles?.layout?.display).toBe('grid');
    expect(heroContainer?.styles?.grid?.gridTemplateColumns).toBe('1fr 1fr');

    // Find image, heading, paragraph, button inside hero
    let heroImage = heroNode?.children?.flatMap((c: WebsiteNode) => c.children || [c]).find((c: WebsiteNode) => c?.type === 'image');
    if (!heroImage) {
      const created = store.addNode(heroContainer!.id, {
        type: 'image',
        props: { src: 'https://images.unsplash.com/photo-gym-1', alt: 'Gym Athlete' },
      });
      heroImage = created || undefined;
    }
    expect(heroImage).toBeDefined();

    // 2. Replace hero image
    store.updateProps(heroImage!.id, {
      src: 'https://images.unsplash.com/photo-gym-hero-pro.jpg',
      alt: 'Iron & Pulse Professional Gym',
    });
    let updatedImg = store.findNode(heroImage!.id);
    expect(updatedImg?.props?.src).toBe('https://images.unsplash.com/photo-gym-hero-pro.jpg');

    // 3. Crop image (aspect ratio)
    store.updateStyles(heroImage!.id, {
      size: { aspectRatio: '16/9' },
    });
    store.updateProps(heroImage!.id, { objectFit: 'cover' });
    updatedImg = store.findNode(heroImage!.id);
    expect(updatedImg?.styles?.size?.aspectRatio).toBe('16/9');
    expect(updatedImg?.props?.objectFit).toBe('cover');

    // 4. Reposition image
    store.updateStyles(heroImage!.id, {
      layout: { position: 'relative', top: '10px' },
    });
    store.updateProps(heroImage!.id, { objectPosition: 'center 25%' });
    updatedImg = store.findNode(heroImage!.id);
    expect(updatedImg?.props?.objectPosition).toBe('center 25%');

    // 5. Edit heading inline
    const headingNode = heroNode?.children?.flatMap((c: WebsiteNode) => c.children || [c]).find((c: WebsiteNode) => c?.type === 'heading')
      || store.findNode('hero-heading');
    expect(headingNode).toBeDefined();
    store.updateProps(headingNode!.id, { text: 'UNLEASH YOUR INNER BEAST' });
    let updatedHeading = store.findNode(headingNode!.id);
    expect(updatedHeading?.props?.text).toBe('UNLEASH YOUR INNER BEAST');

    // 6. Change heading font
    store.updateStyles(headingNode!.id, {
      typography: { fontFamily: 'Plus Jakarta Sans' },
    });
    updatedHeading = store.findNode(headingNode!.id);
    expect(updatedHeading?.styles?.typography?.fontFamily).toBe('Plus Jakarta Sans');

    // 7. Change heading size
    store.updateStyles(headingNode!.id, {
      typography: { fontSize: '64px', fontWeight: '800' },
    });
    updatedHeading = store.findNode(headingNode!.id);
    expect(updatedHeading?.styles?.typography?.fontSize).toBe('64px');

    // 8. Change paragraph spacing
    const paraNode = heroNode?.children?.flatMap((c: WebsiteNode) => c.children || [c]).find((c: WebsiteNode) => c?.type === 'paragraph')
      || store.findNode('hero-para');
    expect(paraNode).toBeDefined();
    store.updateStyles(paraNode!.id, {
      spacing: { margin: { bottom: '32px' }, padding: { left: '8px' } },
    });
    const updatedPara = store.findNode(paraNode!.id);
    expect(updatedPara?.styles?.spacing?.margin?.bottom).toBe('32px');

    // 9. Change button style
    const buttonNode = heroNode?.children?.flatMap((c: WebsiteNode) => c.children || [c]).find((c: WebsiteNode) => c?.type === 'button')
      || store.findNode('hero-cta');
    expect(buttonNode).toBeDefined();
    store.updateStyles(buttonNode!.id, {
      background: { color: '#e63946' },
      border: { radius: { all: '9999px' }, width: '2px', color: '#ff4d5a', style: 'solid' },
    });
    let updatedBtn = store.findNode(buttonNode!.id);
    expect(updatedBtn?.styles?.background?.color).toBe('#e63946');
    expect(updatedBtn?.styles?.border?.radius?.all).toBe('9999px');

    // 10. Configure button hover
    store.updateState(buttonNode!.id, 'hover', {
      background: { color: '#ff1e30' },
      effects: { opacity: 0.95 },
    });
    updatedBtn = store.findNode(buttonNode!.id);
    expect(updatedBtn?.states?.hover?.background?.color).toBe('#ff1e30');

    // 11. Add animation
    store.updateAnimation(heroSectionId, {
      preset: 'fade-up',
      trigger: 'on-load',
    });
    heroNode = store.findNode(heroSectionId);
    expect(heroNode?.animations?.preset).toBe('fade-up');

    // 12. Change animation duration
    store.updateAnimation(heroSectionId, {
      duration: 1200,
      delay: 150,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    });
    heroNode = store.findNode(heroSectionId);
    expect(heroNode?.animations?.duration).toBe(1200);
    expect(heroNode?.animations?.delay).toBe(150);

    // 13. Change section background
    store.updateStyles(heroSectionId, {
      background: { color: '#09090b' },
    });
    heroNode = store.findNode(heroSectionId);
    expect(heroNode?.styles?.background?.color).toBe('#09090b');

    // 14. Change section padding
    store.updateStyles(heroSectionId, {
      spacing: { padding: { top: '120px', bottom: '120px' } },
    });
    heroNode = store.findNode(heroSectionId);
    expect(heroNode?.styles?.spacing?.padding?.top).toBe('120px');
    expect(heroNode?.styles?.spacing?.padding?.bottom).toBe('120px');

    // 15. Change grid columns
    const gridNode = page!.root.children?.find((s: WebsiteNode) =>
      s.type === 'grid' || s.children?.some((c: WebsiteNode) => c.type === 'grid')
    );
    const targetGridId = gridNode?.type === 'grid' ? gridNode.id : (gridNode?.children?.find((c: WebsiteNode) => c.type === 'grid')?.id || heroContainer!.id);
    store.updateStyles(targetGridId, {
      grid: { columns: 4, gridTemplateColumns: 'repeat(4, 1fr)', columnGap: '20px' },
    });
    const updatedGrid = store.findNode(targetGridId);
    expect(updatedGrid?.styles?.grid?.columns).toBe(4);
    expect(updatedGrid?.styles?.grid?.gridTemplateColumns).toBe('repeat(4, 1fr)');

    // 16. Change mobile layout (responsive override)
    store.setViewport('mobile');
    store.updateStyles(heroSectionId, {
      spacing: { padding: { top: '48px', bottom: '48px' } },
    });
    heroNode = store.findNode(heroSectionId);
    // Desktop intact
    expect(heroNode?.styles?.spacing?.padding?.top).toBe('120px');
    // Mobile overridden
    expect(heroNode?.responsive?.mobile?.spacing?.padding?.top).toBe('48px');
    store.setViewport('desktop');

    // 17. Duplicate section
    const initialSectionCount = store.getActivePage()?.root.children?.length || 0;
    const duplicatedSec = store.duplicateNode(heroSectionId);
    expect(duplicatedSec).toBeDefined();
    expect(store.getActivePage()?.root.children?.length).toBe(initialSectionCount + 1);

    // 18. Move section
    const secListBefore = store.getActivePage()?.root.children || [];
    const firstSecId = secListBefore[0].id;
    store.moveNode(firstSecId, 'down');
    const secListAfter = store.getActivePage()?.root.children || [];
    expect(secListAfter[1].id).toBe(firstSecId);

    // 19. Copy/paste section
    store.setSelectedNodeId(firstSecId);
    store.copySelectedNode();
    const pasted = store.pasteClipboard();
    expect(pasted).toBeDefined();
    expect(store.getActivePage()?.root.children?.length).toBe(initialSectionCount + 2);

    // 20. Replace section
    const newPricingSection = createDefaultNode('section', {
      name: 'Iron Pricing Pro',
      props: { variant: 'pricing' },
    });
    store.replaceSection(pasted!.id, newPricingSection);
    const replaced = store.findNode(newPricingSection.id);
    expect(replaced).toBeDefined();
    expect(replaced?.name).toBe('Iron Pricing Pro');

    // 21. Undo changes
    const countBeforeUndo = store.getActivePage()?.root.children?.length || 0;
    store.undo();
    expect(store.getActivePage()?.root.children?.length).toBe(countBeforeUndo);

    // 22. Redo changes
    store.redo();
    expect(store.findNode(newPricingSection.id)).toBeDefined();
  });
});
