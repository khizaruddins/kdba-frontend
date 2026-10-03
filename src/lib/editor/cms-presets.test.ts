import { describe, it, expect } from 'vitest';
import { CMS_SECTION_PRESETS } from './cms-presets';
import { COMPONENT_MANIFEST } from './component-manifest';
import { toWireDocument } from '@/lib/document/v3-wire';

describe('CMS Presets & Manifest Integration', () => {
  it('registers cms-collection in COMPONENT_MANIFEST', () => {
    const item = COMPONENT_MANIFEST['cms-collection'];
    expect(item).toBeDefined();
    expect(item.type).toBe('cms-collection');
    expect(item.allowedParents).toContain('container');
    expect(item.defaultProps.collectionSlug).toBe('blog-posts');
  });

  it('builds valid node trees for each CMS preset', () => {
    expect(CMS_SECTION_PRESETS.length).toBeGreaterThan(0);

    for (const preset of CMS_SECTION_PRESETS) {
      expect(preset.category).toBe('CMS');
      const rootNode = preset.build();

      expect(rootNode.type).toBe('section');
      expect(rootNode.children).toBeDefined();
      expect(rootNode.children!.length).toBeGreaterThan(0);

      // Section child should be container
      const container = rootNode.children![0];
      expect(container.type).toBe('container');
      expect(container.children).toBeDefined();

      // Ensure cms-collection is present inside container
      const hasCmsCollection = container.children!.some(
        (child) => child.type === 'cms-collection',
      );
      expect(hasCmsCollection).toBe(true);

      // Test wire conversion via document roundtrip
      const doc = {
        schemaVersion: '3.0' as const,
        site: { name: 'Gym 360' },
        pages: [{
          id: 'test-page',
          title: 'Test',
          slug: '/',
          type: 'home' as const,
          sortOrder: 0,
          enabled: true,
          root: rootNode,
        }],
      };
      const wire = toWireDocument(doc as any);
      expect(wire.schemaVersion).toBe('3.0');
    }
  });
});
