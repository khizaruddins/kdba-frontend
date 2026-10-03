import { SectionPreset } from './section-presets';
import { createDefaultNode } from '@/lib/document/v3-operations';
import { COMPONENT_MANIFEST } from './component-manifest';

export const CMS_SECTION_PRESETS: SectionPreset[] = [
  {
    id: 'cms-blog-grid',
    name: 'Blog Grid',
    description: 'Grid of blog posts from your CMS',
    category: 'CMS',
    build: () => {
      const section = createDefaultNode('section', {
        name: 'Blog Grid',
        props: { ...COMPONENT_MANIFEST.section.defaultProps },
        styles: {
          ...COMPONENT_MANIFEST.section.defaultStyles,
          spacing: { padding: { top: '80px', bottom: '80px', left: '24px', right: '24px' } },
        },
      });
      const container = createDefaultNode('container', {
        name: 'Container',
        props: { ...COMPONENT_MANIFEST.container.defaultProps },
        styles: COMPONENT_MANIFEST.container.defaultStyles,
      });
      const heading = createDefaultNode('heading', {
        name: 'Blog Heading',
        props: { text: 'Latest Posts', level: 2 },
        styles: {
          ...COMPONENT_MANIFEST.heading.defaultStyles,
          spacing: { margin: { bottom: '40px' } },
          typography: { textAlign: 'center', fontSize: '40px' },
        },
      });
      const cmsBlock = createDefaultNode('cms-collection', {
        name: 'Blog Grid',
        props: {
          collectionSlug: 'blog-posts',
          limit: 6,
          columns: 3,
          presentation: 'grid',
          orderBy: 'newest',
        },
        styles: COMPONENT_MANIFEST['cms-collection'].defaultStyles,
      });
      container.children = [heading, cmsBlock];
      section.children = [container];
      return section;
    },
  },
  {
    id: 'cms-blog-list',
    name: 'Blog List',
    description: 'Vertical list of blog posts',
    category: 'CMS',
    build: () => {
      const section = createDefaultNode('section', {
        name: 'Blog List',
        props: { ...COMPONENT_MANIFEST.section.defaultProps },
        styles: { ...COMPONENT_MANIFEST.section.defaultStyles, spacing: { padding: { top: '80px', bottom: '80px', left: '24px', right: '24px' } } },
      });
      const container = createDefaultNode('container', {
        name: 'Container',
        props: COMPONENT_MANIFEST.container.defaultProps,
        styles: COMPONENT_MANIFEST.container.defaultStyles,
      });
      const cmsBlock = createDefaultNode('cms-collection', {
        name: 'Blog List',
        props: { collectionSlug: 'blog-posts', limit: 5, columns: 1, presentation: 'list', orderBy: 'newest' },
        styles: COMPONENT_MANIFEST['cms-collection'].defaultStyles,
      });
      container.children = [cmsBlock];
      section.children = [container];
      return section;
    },
  },
  {
    id: 'cms-featured-posts',
    name: 'Featured Posts',
    description: 'Large featured post card with secondary posts',
    category: 'CMS',
    build: () => {
      const section = createDefaultNode('section', {
        name: 'Featured Posts',
        props: COMPONENT_MANIFEST.section.defaultProps,
        styles: { ...COMPONENT_MANIFEST.section.defaultStyles, spacing: { padding: { top: '80px', bottom: '80px', left: '24px', right: '24px' } } },
      });
      const container = createDefaultNode('container', { name: 'Container', props: COMPONENT_MANIFEST.container.defaultProps, styles: COMPONENT_MANIFEST.container.defaultStyles });
      const cmsBlock = createDefaultNode('cms-collection', {
        name: 'Featured Posts',
        props: { collectionSlug: 'blog-posts', limit: 3, columns: 3, presentation: 'featured', orderBy: 'newest' },
        styles: COMPONENT_MANIFEST['cms-collection'].defaultStyles,
      });
      container.children = [cmsBlock];
      section.children = [container];
      return section;
    },
  },
  {
    id: 'cms-recent-posts',
    name: 'Recent Posts',
    description: '3 most recent blog posts in a row',
    category: 'CMS',
    build: () => {
      const section = createDefaultNode('section', { name: 'Recent Posts', props: COMPONENT_MANIFEST.section.defaultProps, styles: { ...COMPONENT_MANIFEST.section.defaultStyles, spacing: { padding: { top: '80px', bottom: '80px', left: '24px', right: '24px' } } } });
      const container = createDefaultNode('container', { name: 'Container', props: COMPONENT_MANIFEST.container.defaultProps, styles: COMPONENT_MANIFEST.container.defaultStyles });
      const cmsBlock = createDefaultNode('cms-collection', { name: 'Recent Posts', props: { collectionSlug: 'blog-posts', limit: 3, columns: 3, presentation: 'grid', orderBy: 'newest' }, styles: COMPONENT_MANIFEST['cms-collection'].defaultStyles });
      container.children = [cmsBlock];
      section.children = [container];
      return section;
    },
  },
  {
    id: 'cms-author-list',
    name: 'Author List',
    description: 'Grid of content authors',
    category: 'CMS',
    build: () => {
      const section = createDefaultNode('section', { name: 'Authors', props: COMPONENT_MANIFEST.section.defaultProps, styles: { ...COMPONENT_MANIFEST.section.defaultStyles, spacing: { padding: { top: '80px', bottom: '80px', left: '24px', right: '24px' } } } });
      const container = createDefaultNode('container', { name: 'Container', props: COMPONENT_MANIFEST.container.defaultProps, styles: COMPONENT_MANIFEST.container.defaultStyles });
      const cmsBlock = createDefaultNode('cms-collection', { name: 'Authors', props: { collectionSlug: 'authors', limit: 6, columns: 3, presentation: 'grid', orderBy: 'alphabetical' }, styles: COMPONENT_MANIFEST['cms-collection'].defaultStyles });
      container.children = [cmsBlock];
      section.children = [container];
      return section;
    },
  },
];
