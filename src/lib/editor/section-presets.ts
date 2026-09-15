import { WebsiteNode } from '@/types/v3-document';
import { COMPONENT_MANIFEST } from '@/lib/editor/component-manifest';
import { createDefaultNode } from '@/lib/document/v3-operations';

export interface SectionPreset {
  id: string;
  name: string;
  description: string;
  build: () => WebsiteNode;
}

function heading(text: string, level: number, fontSize: string): WebsiteNode {
  const item = COMPONENT_MANIFEST.heading;
  return createDefaultNode('heading', {
    name: 'Heading',
    props: { ...item.defaultProps, text, level },
    styles: {
      ...item.defaultStyles,
      typography: { ...item.defaultStyles.typography, fontSize },
    },
  });
}

function paragraph(text: string): WebsiteNode {
  const item = COMPONENT_MANIFEST.paragraph;
  return createDefaultNode('paragraph', {
    name: 'Paragraph',
    props: { ...item.defaultProps, text },
    styles: item.defaultStyles,
  });
}

function button(label: string, href = '#contact'): WebsiteNode {
  const item = COMPONENT_MANIFEST.button;
  return createDefaultNode('button', {
    name: 'Button',
    props: { ...item.defaultProps, label, text: label, href },
    styles: item.defaultStyles,
  });
}

function container(children: WebsiteNode[]): WebsiteNode {
  const item = COMPONENT_MANIFEST.container;
  return createDefaultNode('container', {
    name: 'Container',
    props: item.defaultProps,
    styles: item.defaultStyles,
    children,
  });
}

function stack(children: WebsiteNode[]): WebsiteNode {
  const item = COMPONENT_MANIFEST.stack;
  return createDefaultNode('stack', {
    name: 'Stack',
    props: item.defaultProps,
    styles: item.defaultStyles,
    children,
  });
}

function section(name: string, children: WebsiteNode[], background?: string): WebsiteNode {
  const item = COMPONENT_MANIFEST.section;
  return createDefaultNode('section', {
    name,
    props: { ...item.defaultProps, preset: name.toLowerCase() },
    styles: {
      ...item.defaultStyles,
      background: { color: background || item.defaultStyles.background?.color },
    },
    children,
  });
}

function image(src: string, alt: string): WebsiteNode {
  const item = COMPONENT_MANIFEST.image;
  return createDefaultNode('image', {
    name: 'Image',
    props: { ...item.defaultProps, src, alt },
    styles: item.defaultStyles,
  });
}

function grid(columns: number, children: WebsiteNode[]): WebsiteNode {
  return createDefaultNode('grid', {
    name: 'Grid',
    props: { columns },
    styles: {
      ...COMPONENT_MANIFEST.grid.defaultStyles,
      grid: { columns, columnGap: '24px', rowGap: '24px' },
    },
    children,
  });
}

export const SECTION_PRESETS: SectionPreset[] = [
  {
    id: 'hero',
    name: 'Hero',
    description: 'Headline, supporting copy, and a primary action.',
    build: () =>
      section('Hero', [
        container([
          stack([
            heading('Grow Your Business', 1, '56px'),
            paragraph(
              'A premium digital presence that converts visitors into customers — without rebuilding from scratch.',
            ),
            button('Get Started'),
          ]),
        ]),
      ]),
  },
  {
    id: 'about',
    name: 'About',
    description: 'Short brand story with supporting paragraph.',
    build: () =>
      section(
        'About',
        [
          container([
            stack([
              heading('About the Studio', 2, '40px'),
              paragraph(
                'We help ambitious brands launch polished websites that feel custom — and stay easy to edit.',
              ),
            ]),
          ]),
        ],
        '#0F172A',
      ),
  },
  {
    id: 'features',
    name: 'Features',
    description: 'Three-column feature grid.',
    build: () =>
      section('Features', [
        container([
          stack([heading('Why teams choose KDBA', 2, '40px')]),
          createDefaultNode('grid', {
            name: 'Grid',
            props: COMPONENT_MANIFEST.grid.defaultProps,
            styles: COMPONENT_MANIFEST.grid.defaultStyles,
            children: ['Visual editing', 'Responsive by default', 'Publish in minutes'].map(
              (title) =>
                stack([
                  heading(title, 3, '22px'),
                  paragraph('Edit the real website on a canvas — not a form of locked template fields.'),
                ]),
            ),
          }),
        ]),
      ]),
  },
  {
    id: 'services',
    name: 'Services',
    description: 'Service overview with call to action.',
    build: () =>
      section(
        'Services',
        [
          container([
            stack([
              heading('Services', 2, '40px'),
              paragraph('Strategy, design, and a visual editor your team can actually use.'),
              button('View services', '#contact'),
            ]),
          ]),
        ],
        '#111827',
      ),
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    description: 'Customer quote cards.',
    build: () =>
      section('Testimonials', [
        container([
          stack([heading('What clients say', 2, '40px')]),
          createDefaultNode('grid', {
            name: 'Grid',
            props: { columns: 2 },
            styles: { ...COMPONENT_MANIFEST.grid.defaultStyles, grid: { columns: 2, columnGap: '24px', rowGap: '24px' } },
            children: [
              stack([
                paragraph(
                  'KDBA transformed how we design and launch our client projects in record time.',
                ),
                heading('Sarah Jenkins', 4, '16px'),
              ]),
              stack([
                paragraph('We finally stopped waiting on developers for copy and layout tweaks.'),
                heading('Maya Chen', 4, '16px'),
              ]),
            ],
          }),
        ]),
      ]),
  },
  {
    id: 'cta',
    name: 'CTA',
    description: 'Centered conversion banner.',
    build: () =>
      section(
        'CTA',
        [
          container([
            stack([
              heading('Ready to launch?', 2, '40px'),
              paragraph('Publish a live site today and keep editing visually after it goes live.'),
              button('Publish your site'),
            ]),
          ]),
        ],
        '#1E1B4B',
      ),
  },
  {
    id: 'contact',
    name: 'Contact',
    description: 'Lead form section.',
    build: () =>
      section('Contact', [
        container([
          stack([
            heading('Get in touch', 2, '40px'),
            paragraph('Tell us about your project. We typically reply within one business day.'),
            button('Send message', '#contact'),
          ]),
        ]),
      ]),
  },
  {
    id: 'footer',
    name: 'Footer',
    description: 'Site footer with copyright.',
    build: () =>
      section(
        'Footer',
        [
          container([
            stack([
              heading('KDBA Studio', 3, '22px'),
              paragraph('A structured website document for brands that care about quality.'),
              createDefaultNode('text', {
                name: 'Copyright',
                props: { text: '© 2026 KDBA Studio. All rights reserved.' },
                styles: COMPONENT_MANIFEST.text.defaultStyles,
              }),
            ]),
          ]),
        ],
        '#0B0D13',
      ),
  },
  {
    id: 'pricing',
    name: 'Pricing',
    description: 'Three simple pricing tiers.',
    build: () =>
      section('Pricing', [
        container([
          stack([
            heading('Simple pricing', 2, '40px'),
            paragraph('Start with the plan that matches your studio. Upgrade when you grow.'),
          ]),
          grid(3, [
            stack([
              heading('Starter', 3, '22px'),
              heading('$29', 4, '32px'),
              paragraph('One published site and visual editing for a small team.'),
              button('Choose Starter', '#contact'),
            ]),
            stack([
              heading('Studio', 3, '22px'),
              heading('$79', 4, '32px'),
              paragraph('Multiple sites, custom domains, and client-ready templates.'),
              button('Choose Studio', '#contact'),
            ]),
            stack([
              heading('Agency', 3, '22px'),
              heading('$149', 4, '32px'),
              paragraph('White-label publishing and a workspace for every client.'),
              button('Choose Agency', '#contact'),
            ]),
          ]),
        ]),
      ]),
  },
  {
    id: 'gallery',
    name: 'Gallery',
    description: 'Image grid for work or destinations.',
    build: () =>
      section(
        'Gallery',
        [
          container([
            stack([
              heading('Selected work', 2, '40px'),
              paragraph('Replace these images with your own photography or product shots.'),
            ]),
            grid(3, [
              image(
                'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
                'Studio workspace',
              ),
              image(
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                'Analytics dashboard',
              ),
              image(
                'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
                'Team collaboration',
              ),
            ]),
          ]),
        ],
        '#111827',
      ),
  },
  {
    id: 'faq',
    name: 'FAQ',
    description: 'Common questions in a stacked layout.',
    build: () =>
      section('FAQ', [
        container([
          stack([
            heading('Frequently asked questions', 2, '40px'),
            stack([
              heading('Can I edit a published site?', 3, '20px'),
              paragraph('Yes. The same WebsiteDocument powers the editor, preview, and live site.'),
            ]),
            stack([
              heading('Will mobile changes overwrite desktop?', 3, '20px'),
              paragraph('No. Tablet and mobile values are stored as overrides on each node.'),
            ]),
            stack([
              heading('Can I add my own sections?', 3, '20px'),
              paragraph('Add a preset or insert layout elements, then restyle them like any other content.'),
            ]),
          ]),
        ]),
      ]),
  },
];
