import { WebsiteNode } from '@/types/v3-document';
import { COMPONENT_MANIFEST } from '@/lib/editor/component-manifest';
import { createDefaultNode } from '@/lib/document/v3-operations';

export interface SectionPreset {
  id: string;
  name: string;
  description: string;
  category?: string;
  variantLabel?: string;
  build: () => WebsiteNode;
}

export function getPresetCategory(preset: SectionPreset): string {
  if (preset.category) return preset.category;
  const id = preset.id;
  if (id.startsWith('contact')) return 'Contact';
  if (id === 'hero' || id.startsWith('hero-')) return 'Hero';
  if (id === 'features' || id.startsWith('features-')) return 'Features';
  if (id === 'services' || id.startsWith('services-')) return 'Services';
  if (id === 'testimonials' || id.startsWith('testimonials-')) return 'Testimonials';
  if (id === 'pricing' || id.startsWith('pricing-')) return 'Pricing';
  if (id === 'gallery' || id.startsWith('gallery-')) return 'Gallery';
  if (id === 'faq' || id.startsWith('faq-')) return 'FAQ';
  if (id === 'cta' || id.startsWith('cta-')) return 'CTA';
  if (id === 'footer' || id.startsWith('footer-')) return 'Footer';
  if (id === 'about') return 'About';
  if (id.startsWith('collection') || id === 'cms') return 'CMS';
  return 'Sections';
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

function contactForm(variant = 'stacked'): WebsiteNode {
  const item = COMPONENT_MANIFEST['contact-form'];
  return createDefaultNode('contact-form', {
    name: 'Contact Form',
    props: { ...item.defaultProps, variant },
    styles: item.defaultStyles,
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
    id: 'collection-list',
    name: 'CMS collection list',
    description: 'Dynamic cards powered by a CMS collection.',
    category: 'CMS',
    build: () => {
      const item = COMPONENT_MANIFEST.section;
      return createDefaultNode('section', {
        name: 'Collection list',
        props: {
          ...item.defaultProps,
          cmsList: true,
          collectionSlug: 'services',
          limit: 6,
          layout: 'cards',
        },
        styles: item.defaultStyles,
        children: [
          container([
            stack([
              heading('Our services', 2, '36px'),
              paragraph('Live CMS records appear here after you publish them.'),
            ]),
          ]),
        ],
      });
    },
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
    description: 'Centered heading with a lead form.',
    build: () =>
      section('Contact', [
        container([
          stack([
            heading('Get in touch', 2, '40px'),
            paragraph('Tell us about your project. We typically reply within one business day.'),
            contactForm('stacked'),
          ]),
        ]),
      ]),
  },
  {
    id: 'contact-split',
    name: 'Contact split',
    description: 'Copy on the left, form on the right.',
    build: () =>
      section('Contact', [
        container([
          grid(2, [
            stack([
              heading('Let’s talk', 2, '36px'),
              paragraph('Share a few details and we will follow up with next steps.'),
            ]),
            contactForm('card'),
          ]),
        ]),
      ]),
  },
  {
    id: 'contact-with-info',
    name: 'Contact with details',
    description: 'Business details beside the form.',
    build: () =>
      section('Contact', [
        container([
          grid(2, [
            stack([
              heading('Visit or write', 2, '32px'),
              paragraph('Email, phone, and hours from your business profile appear on the live site.'),
              createDefaultNode('opening-hours', {
                name: 'Hours',
                props: COMPONENT_MANIFEST['opening-hours'].defaultProps,
                styles: COMPONENT_MANIFEST['opening-hours'].defaultStyles,
              }),
            ]),
            contactForm('bordered'),
          ]),
        ]),
      ]),
  },
  {
    id: 'contact-with-image',
    name: 'Contact with image',
    description: 'Photo column plus a compact form.',
    build: () =>
      section('Contact', [
        container([
          grid(2, [
            image(
              'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
              'Studio workspace',
            ),
            stack([heading('Book a conversation', 2, '32px'), contactForm('compact')]),
          ]),
        ]),
      ]),
  },
  {
    id: 'contact-narrow',
    name: 'Contact narrow',
    description: 'A focused, single-column lead form.',
    build: () =>
      section('Contact', [
        container([
          stack([heading('Send a note', 2, '32px'), contactForm('minimal')]),
        ]),
      ]),
  },
  {
    id: 'contact-full',
    name: 'Contact full width',
    description: 'Wide two-column field layout.',
    build: () =>
      section('Contact', [
        container([
          stack([
            heading('Start a project', 2, '40px'),
            contactForm('two-column'),
          ]),
        ]),
      ]),
  },
  {
    id: 'contact-inline',
    name: 'Contact inline',
    description: 'Name, email, and submit in one row.',
    build: () =>
      section('Contact', [
        container([
          stack([heading('Stay in the loop', 2, '32px'), contactForm('inline')]),
        ]),
      ]),
  },
  {
    id: 'contact-pill',
    name: 'Contact rounded',
    description: 'Rounded fields and a pill-shaped submit button.',
    build: () =>
      section('Contact', [
        container([
          stack([heading('Say hello', 2, '32px'), contactForm('pill')]),
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
  {
    id: 'hero-split',
    name: 'Hero split',
    category: 'Hero',
    variantLabel: 'Split',
    description: 'Copy on one side, image on the other.',
    build: () =>
      section('Hero', [
        container([
          grid(2, [
            stack([
              heading('A site that looks custom', 1, '48px'),
              paragraph('Start from a layout, then restyle every node like a professional visual builder.'),
              button('Start building'),
            ]),
            image(
              'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
              'Studio team',
            ),
          ]),
        ]),
      ]),
  },
  {
    id: 'hero-image-left',
    name: 'Hero image left',
    category: 'Hero',
    variantLabel: 'Image left',
    description: 'Photograph first, then headline and action.',
    build: () =>
      section('Hero', [
        container([
          grid(2, [
            image(
              'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
              'Workspace',
            ),
            stack([
              heading('Designed for operators', 1, '44px'),
              paragraph('Edit the live document. Publish when the page is ready.'),
              button('View templates'),
            ]),
          ]),
        ]),
      ]),
  },
  {
    id: 'hero-image-right',
    name: 'Hero image right',
    category: 'Hero',
    variantLabel: 'Image right',
    description: 'Headline first, photograph on the right.',
    build: () =>
      section('Hero', [
        container([
          grid(2, [
            stack([
              heading('Launch with confidence', 1, '44px'),
              paragraph('Responsive overrides stay on the same WebsiteDocument — never a second site.'),
              button('Open the editor'),
            ]),
            image(
              'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
              'Analytics',
            ),
          ]),
        ]),
      ]),
  },
  {
    id: 'hero-minimal',
    name: 'Hero minimal',
    category: 'Hero',
    variantLabel: 'Minimal',
    description: 'A short headline and a single action.',
    build: () =>
      section('Hero', [
        container([
          stack([heading('Build it once.', 1, '52px'), button('Get started')]),
        ]),
      ]),
  },
  {
    id: 'features-four',
    name: 'Features four column',
    category: 'Features',
    variantLabel: 'Four column',
    description: 'Four equal feature cards.',
    build: () =>
      section('Features', [
        container([
          stack([heading('Everything in one workspace', 2, '36px')]),
          grid(4, [
            stack([heading('Pages', 3, '20px'), paragraph('Multiple pages, one document.')]),
            stack([heading('Blocks', 3, '20px'), paragraph('Insert, then fully restyle.')]),
            stack([heading('Responsive', 3, '20px'), paragraph('Overrides, not copies.')]),
            stack([heading('Publish', 3, '20px'), paragraph('Save, preview, go live.')]),
          ]),
        ]),
      ]),
  },
  {
    id: 'features-icon-grid',
    name: 'Features icon grid',
    category: 'Features',
    variantLabel: 'Icon grid',
    description: 'Compact icon-style feature tiles.',
    build: () =>
      section('Features', [
        container([
          stack([heading('Capabilities', 2, '36px')]),
          grid(3, [
            stack([heading('01', 4, '14px'), heading('Visual canvas', 3, '20px'), paragraph('Select any node and edit it.')]),
            stack([heading('02', 4, '14px'), heading('Layers', 3, '20px'), paragraph('Rename, hide, and reorder.')]),
            stack([heading('03', 4, '14px'), heading('Inspector', 3, '20px'), paragraph('Content, layout, and type.')]),
          ]),
        ]),
      ]),
  },
  {
    id: 'features-bento',
    name: 'Features bento',
    category: 'Features',
    variantLabel: 'Bento',
    description: 'A featured tile plus supporting points.',
    build: () =>
      section('Features', [
        container([
          grid(2, [
            stack([
              heading('The editor is the product', 2, '36px'),
              paragraph('Blocks become normal document nodes the moment you insert them.'),
            ]),
            stack([
              heading('Inspector', 3, '20px'),
              paragraph('Only relevant controls for the selected node.'),
              heading('Responsive', 3, '20px'),
              paragraph('Inherited desktop values, explicit mobile overrides.'),
            ]),
          ]),
        ]),
      ]),
  },
  {
    id: 'features-alternating',
    name: 'Features alternating',
    category: 'Features',
    variantLabel: 'Alternating',
    description: 'Image and copy in alternating rows.',
    build: () =>
      section('Features', [
        container([
          grid(2, [
            image(
              'https://images.unsplash.com/photo-1553877522-43269d4ea809?auto=format&fit=crop&w=1200&q=80',
              'Planning',
            ),
            stack([
              heading('Plan the structure', 2, '32px'),
              paragraph('Pages, navigation, and global chrome live on the WebsiteDocument.'),
            ]),
          ]),
          grid(2, [
            stack([
              heading('Then refine the details', 2, '32px'),
              paragraph('Typography, spacing, and visibility can change per breakpoint.'),
            ]),
            image(
              'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1200&q=80',
              'Design details',
            ),
          ]),
        ]),
      ]),
  },
  {
    id: 'services-cards',
    name: 'Services cards',
    category: 'Services',
    variantLabel: 'Cards',
    description: 'Three service cards with actions.',
    build: () =>
      section('Services', [
        container([
          stack([heading('How we help', 2, '36px')]),
          grid(3, [
            stack([heading('Strategy', 3, '22px'), paragraph('Positioning and information architecture.'), button('Learn more', '#contact')]),
            stack([heading('Design', 3, '22px'), paragraph('Layouts that stay editable after launch.'), button('Learn more', '#contact')]),
            stack([heading('Build', 3, '22px'), paragraph('A visual editor your team can own.'), button('Learn more', '#contact')]),
          ]),
        ]),
      ]),
  },
  {
    id: 'services-list',
    name: 'Services list',
    category: 'Services',
    variantLabel: 'List',
    description: 'Stacked service rows.',
    build: () =>
      section('Services', [
        container([
          stack([
            heading('Services', 2, '36px'),
            heading('Brand sites', 3, '22px'),
            paragraph('Marketing pages with a structured document behind them.'),
            heading('Client workspaces', 3, '22px'),
            paragraph('Duplicate a site, then tailor every block.'),
          ]),
        ]),
      ]),
  },
  {
    id: 'services-split',
    name: 'Services split',
    category: 'Services',
    variantLabel: 'Split',
    description: 'Intro copy beside a service list.',
    build: () =>
      section('Services', [
        container([
          grid(2, [
            stack([
              heading('What we deliver', 2, '36px'),
              paragraph('A professional website your operators can keep current.'),
              button('Book a call', '#contact'),
            ]),
            stack([
              heading('Discovery', 3, '20px'),
              paragraph('Goals, pages, and the first publish.'),
              heading('Build', 3, '20px'),
              paragraph('Blocks, theme tokens, and responsive overrides.'),
              heading('Handoff', 3, '20px'),
              paragraph('Your team edits the same document after launch.'),
            ]),
          ]),
        ]),
      ]),
  },
  {
    id: 'testimonials-quote',
    name: 'Testimonials quote',
    category: 'Testimonials',
    variantLabel: 'Quote',
    description: 'A single featured quote.',
    build: () =>
      section('Testimonials', [
        container([
          stack([
            heading('“We stopped waiting on a developer for copy changes.”', 2, '32px'),
            paragraph('Operations lead, professional services firm'),
          ]),
        ]),
      ]),
  },
  {
    id: 'testimonials-grid',
    name: 'Testimonials grid',
    category: 'Testimonials',
    variantLabel: 'Grid',
    description: 'Three short client notes.',
    build: () =>
      section('Testimonials', [
        container([
          stack([heading('Client notes', 2, '36px')]),
          grid(3, [
            stack([paragraph('The inspector finally matches how we think about layout.'), heading('Priya N.', 4, '16px')]),
            stack([paragraph('Pages and navigation stay in one place.'), heading('James L.', 4, '16px')]),
            stack([paragraph('Publishing is a confirmation, not a ritual.'), heading('Elena V.', 4, '16px')]),
          ]),
        ]),
      ]),
  },
  {
    id: 'pricing-highlighted',
    name: 'Pricing highlighted',
    category: 'Pricing',
    variantLabel: 'Highlighted',
    description: 'Three tiers with a featured middle plan.',
    build: () =>
      section('Pricing', [
        container([
          stack([heading('Choose a plan', 2, '36px')]),
          grid(3, [
            stack([heading('Starter', 3, '22px'), heading('$29', 4, '32px'), paragraph('One site.'), button('Choose Starter', '#contact')]),
            stack([heading('Studio', 3, '22px'), heading('$79', 4, '32px'), paragraph('Most teams start here.'), button('Choose Studio', '#contact')]),
            stack([heading('Agency', 3, '22px'), heading('$149', 4, '32px'), paragraph('Every client workspace.'), button('Choose Agency', '#contact')]),
          ]),
        ]),
      ]),
  },
  {
    id: 'pricing-comparison',
    name: 'Pricing comparison',
    category: 'Pricing',
    variantLabel: 'Comparison',
    description: 'Feature rows under each plan.',
    build: () =>
      section('Pricing', [
        container([
          stack([heading('Compare plans', 2, '36px')]),
          grid(3, [
            stack([
              heading('Starter', 3, '22px'),
              paragraph('Visual editor'),
              paragraph('One published site'),
              paragraph('Email support'),
            ]),
            stack([
              heading('Studio', 3, '22px'),
              paragraph('Everything in Starter'),
              paragraph('Custom domain'),
              paragraph('Form submissions'),
            ]),
            stack([
              heading('Agency', 3, '22px'),
              paragraph('Everything in Studio'),
              paragraph('Multiple workspaces'),
              paragraph('Priority support'),
            ]),
          ]),
        ]),
      ]),
  },
  {
    id: 'gallery-featured',
    name: 'Gallery featured',
    category: 'Gallery',
    variantLabel: 'Featured',
    description: 'One large image plus a supporting pair.',
    build: () =>
      section('Gallery', [
        container([
          stack([heading('Selected work', 2, '36px')]),
          image(
            'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
            'Featured project',
          ),
          grid(2, [
            image(
              'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80',
              'Collaboration',
            ),
            image(
              'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
              'Product',
            ),
          ]),
        ]),
      ]),
  },
  {
    id: 'faq-two-column',
    name: 'FAQ two column',
    category: 'FAQ',
    variantLabel: 'Two column',
    description: 'Questions in two columns.',
    build: () =>
      section('FAQ', [
        container([
          stack([heading('Questions', 2, '36px')]),
          grid(2, [
            stack([
              heading('Is the block locked?', 3, '20px'),
              paragraph('No. After insert it is a normal document subtree.'),
            ]),
            stack([
              heading('Can I change contact layout later?', 3, '20px'),
              paragraph('Yes. The form logic stays shared; only the variant changes.'),
            ]),
          ]),
        ]),
      ]),
  },
  {
    id: 'cta-split',
    name: 'CTA split',
    category: 'CTA',
    variantLabel: 'Split',
    description: 'Message on the left, action on the right.',
    build: () =>
      section('CTA', [
        container([
          grid(2, [
            stack([
              heading('Ready when you are', 2, '36px'),
              paragraph('Preview on every breakpoint, then publish the same document.'),
            ]),
            stack([button('Publish your site')]),
          ]),
        ]),
      ]),
  },
  {
    id: 'cta-minimal',
    name: 'CTA minimal',
    category: 'CTA',
    variantLabel: 'Minimal',
    description: 'A short line and a button.',
    build: () =>
      section('CTA', [
        container([stack([heading('Let’s build it.', 2, '32px'), button('Start')])]),
      ]),
  },
  {
    id: 'footer-multi',
    name: 'Footer multi column',
    category: 'Footer',
    variantLabel: 'Multi column',
    description: 'Brand plus three link columns.',
    build: () =>
      section(
        'Footer',
        [
          container([
            grid(4, [
              stack([heading('KDBA', 3, '20px'), paragraph('Professional websites, visually edited.')]),
              stack([heading('Product', 4, '14px'), paragraph('Editor'), paragraph('Templates')]),
              stack([heading('Company', 4, '14px'), paragraph('About'), paragraph('Contact')]),
              stack([heading('Legal', 4, '14px'), paragraph('Privacy'), paragraph('Terms')]),
            ]),
          ]),
        ],
        '#0B0D13',
      ),
  },
  {
    id: 'footer-centered',
    name: 'Footer centered',
    category: 'Footer',
    variantLabel: 'Centered',
    description: 'Centered brand line and copyright.',
    build: () =>
      section(
        'Footer',
        [
          container([
            stack([
              heading('KDBA Studio', 3, '22px'),
              paragraph('© 2026 KDBA. All rights reserved.'),
            ]),
          ]),
        ],
        '#0B0D13',
      ),
  },
];

export const CONTACT_LAYOUT_PRESETS = [
  { id: 'contact', name: 'Simple', description: 'Centered heading with a stacked form.' },
  { id: 'contact-split', name: 'Split', description: 'Copy on the left, form on the right.' },
  { id: 'contact-with-image', name: 'Image', description: 'Photo column plus a compact form.' },
  { id: 'contact-with-info', name: 'Contact information', description: 'Business details beside the form.' },
  { id: 'contact-pill', name: 'Centered', description: 'Rounded fields and a centered layout.' },
  { id: 'contact-inline', name: 'Business', description: 'A compact inline layout for operators.' },
  { id: 'contact-narrow', name: 'Minimal', description: 'A focused single-column form.' },
  { id: 'contact-full', name: 'Full width', description: 'Wide two-column field layout.' },
] as const;

export const BLOCK_LIBRARY_CATEGORIES = [
  'Hero',
  'Features',
  'Services',
  'CMS',
  'Testimonials',
  'Pricing',
  'Gallery',
  'FAQ',
  'Contact',
  'CTA',
  'Footer',
  'About',
] as const;

export function presetsMatchingSection(nodeName?: string | null): SectionPreset[] {
  const name = (nodeName || '').trim().toLowerCase();
  if (!name) return SECTION_PRESETS;
  const matched = SECTION_PRESETS.filter((preset) => {
    const category = getPresetCategory(preset).toLowerCase();
    return name === category || name.includes(category) || category.includes(name);
  });
  return matched.length > 0 ? matched : SECTION_PRESETS;
}
