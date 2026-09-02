import { NodeType, StyleDefinition } from '@/types/v3-document';

export interface ComponentManifestItem {
  type: NodeType;
  name: string;
  category: 'Layout' | 'Text' | 'Buttons' | 'Media' | 'Components' | 'Forms' | 'Navigation';
  icon: string; // Lucide icon name
  description: string;
  allowedParents: NodeType[];
  allowedChildren?: NodeType[];
  isLeaf?: boolean;
  defaultProps: Record<string, unknown>;
  defaultStyles: StyleDefinition;
}

export const COMPONENT_CATEGORIES = [
  'Layout',
  'Text',
  'Buttons',
  'Media',
  'Components',
  'Forms',
  'Navigation',
] as const;

export const COMPONENT_MANIFEST: Record<NodeType, ComponentManifestItem> = {
  'page-root': {
    type: 'page-root',
    name: 'Page Root',
    category: 'Layout',
    icon: 'LayoutTemplate',
    description: 'The root container of the page.',
    allowedParents: [],
    allowedChildren: ['section', 'navbar', 'footer'],
    defaultProps: {},
    defaultStyles: {
      layout: { display: 'flex', position: 'relative', width: '100%' },
      flex: { direction: 'column' },
    },
  },

  section: {
    type: 'section',
    name: 'Section',
    category: 'Layout',
    icon: 'Maximize2',
    description: 'Full-width visual section block.',
    allowedParents: ['page-root'],
    allowedChildren: ['container', 'row', 'grid', 'stack', 'heading', 'paragraph', 'button', 'image'],
    defaultProps: { fullWidth: true },
    defaultStyles: {
      layout: { position: 'relative', width: '100%' },
      spacing: { padding: { top: '80px', bottom: '80px', left: '24px', right: '24px' } },
      background: { color: 'transparent' },
    },
  },

  container: {
    type: 'container',
    name: 'Container',
    category: 'Layout',
    icon: 'Box',
    description: 'Centered content containment box.',
    allowedParents: ['section', 'container', 'column'],
    allowedChildren: ['row', 'grid', 'stack', 'column', 'heading', 'paragraph', 'rich-text', 'button', 'image', 'video', 'card', 'form' as any],
    defaultProps: { maxWidth: '1200px' },
    defaultStyles: {
      layout: { position: 'relative', width: '100%', maxWidth: '1200px' },
      spacing: { margin: { left: 'auto', right: 'auto' }, padding: { left: '24px', right: '24px' } },
    },
  },

  grid: {
    type: 'grid',
    name: 'Grid',
    category: 'Layout',
    icon: 'Grid',
    description: 'CSS grid layout with customizable columns.',
    allowedParents: ['section', 'container', 'column'],
    allowedChildren: ['container', 'column', 'card' as any, 'image', 'heading', 'paragraph', 'pricing', 'testimonial'],
    defaultProps: { columns: 3 },
    defaultStyles: {
      layout: { display: 'grid', width: '100%' },
      grid: { columns: 3, columnGap: '24px', rowGap: '24px' },
    },
  },

  row: {
    type: 'row',
    name: 'Row',
    category: 'Layout',
    icon: 'Columns',
    description: 'Horizontal flexbox container.',
    allowedParents: ['section', 'container', 'column'],
    allowedChildren: ['column', 'container', 'button', 'badge'],
    defaultProps: {},
    defaultStyles: {
      layout: { display: 'flex', width: '100%' },
      flex: { direction: 'row', wrap: 'wrap', alignItems: 'center', gap: '16px' },
    },
  },

  column: {
    type: 'column',
    name: 'Column',
    category: 'Layout',
    icon: 'SplitVertical',
    description: 'Vertical column container within rows or grids.',
    allowedParents: ['row', 'grid', 'container'],
    allowedChildren: ['heading', 'paragraph', 'rich-text', 'button', 'image', 'icon', 'list'],
    defaultProps: {},
    defaultStyles: {
      layout: { display: 'flex', width: '100%' },
      flex: { direction: 'column', gap: '12px' },
    },
  },

  stack: {
    type: 'stack',
    name: 'Stack',
    category: 'Layout',
    icon: 'Layers',
    description: 'Vertical or horizontal auto-spaced stack.',
    allowedParents: ['section', 'container', 'column'],
    allowedChildren: ['heading', 'paragraph', 'button', 'image', 'badge', 'divider', 'spacer'],
    defaultProps: { direction: 'column', gap: '16px' },
    defaultStyles: {
      layout: { display: 'flex', width: '100%' },
      flex: { direction: 'column', gap: '16px' },
    },
  },

  heading: {
    type: 'heading',
    name: 'Heading',
    category: 'Text',
    icon: 'Heading',
    description: 'SEO title or section header.',
    allowedParents: ['section', 'container', 'column', 'stack', 'row'],
    isLeaf: true,
    defaultProps: { text: 'Craft Something Iconic', level: 2 },
    defaultStyles: {
      typography: {
        fontFamily: 'Inter',
        fontSize: '40px',
        fontWeight: 700,
        lineHeight: 1.15,
        color: '#FFFFFF',
      },
      spacing: { margin: { bottom: '16px' } },
    },
  },

  paragraph: {
    type: 'paragraph',
    name: 'Paragraph',
    category: 'Text',
    icon: 'Pilcrow',
    description: 'Body copy and descriptive text.',
    allowedParents: ['section', 'container', 'column', 'stack'],
    isLeaf: true,
    defaultProps: { text: 'Elevate your online presence with a responsive, high-performance visual website engineered for conversion.' },
    defaultStyles: {
      typography: {
        fontFamily: 'Inter',
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: 1.6,
        color: '#94A3B8',
      },
      spacing: { margin: { bottom: '24px' } },
    },
  },

  'rich-text': {
    type: 'rich-text',
    name: 'Rich Text',
    category: 'Text',
    icon: 'FileText',
    description: 'Formatted multi-paragraph text with inline links.',
    allowedParents: ['section', 'container', 'column'],
    isLeaf: true,
    defaultProps: { html: '<p>Comprehensive text block with <strong>formatting</strong>.</p>' },
    defaultStyles: {
      typography: { fontSize: '16px', lineHeight: 1.6, color: '#CBD5E1' },
    },
  },

  text: {
    type: 'text',
    name: 'Text Block',
    category: 'Text',
    icon: 'Type',
    description: 'Compact inline text block.',
    allowedParents: ['section', 'container', 'column', 'stack', 'row'],
    isLeaf: true,
    defaultProps: { text: 'Short label or description' },
    defaultStyles: {
      typography: { fontSize: '14px', color: '#94A3B8' },
    },
  },

  button: {
    type: 'button',
    name: 'Button',
    category: 'Buttons',
    icon: 'SquarePlay',
    description: 'Interactive call-to-action button.',
    allowedParents: ['section', 'container', 'column', 'row', 'stack'],
    isLeaf: true,
    defaultProps: { label: 'Get Started', href: '#contact', variant: 'primary' },
    defaultStyles: {
      layout: { display: 'inline-flex' },
      spacing: { padding: { top: '12px', bottom: '12px', left: '24px', right: '24px' } },
      background: { color: '#4F46E5' },
      typography: { fontSize: '15px', fontWeight: 600, color: '#FFFFFF' },
      border: { radius: { all: '8px' } },
    },
  },

  link: {
    type: 'link',
    name: 'Text Link',
    category: 'Buttons',
    icon: 'Link',
    description: 'Hyperlink with custom destination.',
    allowedParents: ['section', 'container', 'column', 'stack', 'row'],
    isLeaf: true,
    defaultProps: { label: 'Learn more →', href: '#' },
    defaultStyles: {
      typography: { fontSize: '14px', fontWeight: 500, color: '#6366F1' },
    },
  },

  image: {
    type: 'image',
    name: 'Image',
    category: 'Media',
    icon: 'Image',
    description: 'Optimized raster or vector image.',
    allowedParents: ['section', 'container', 'column', 'grid', 'stack'],
    isLeaf: true,
    defaultProps: {
      src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
      alt: 'Visual builder showcase',
      objectFit: 'cover',
    },
    defaultStyles: {
      layout: { width: '100%' },
      size: { maxHeight: '480px' },
      border: { radius: { all: '12px' } },
    },
  },

  video: {
    type: 'video',
    name: 'Video',
    category: 'Media',
    icon: 'Video',
    description: 'Embedded YouTube, Vimeo, or MP4 video.',
    allowedParents: ['section', 'container', 'column'],
    isLeaf: true,
    defaultProps: { src: '', autoplay: false, controls: true },
    defaultStyles: {
      layout: { width: '100%' },
      size: { aspectRatio: '16/9' },
      border: { radius: { all: '12px' } },
    },
  },

  gallery: {
    type: 'gallery',
    name: 'Gallery',
    category: 'Media',
    icon: 'Images',
    description: 'Multi-image responsive media gallery.',
    allowedParents: ['section', 'container'],
    isLeaf: true,
    defaultProps: {
      images: [
        { url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&q=80', caption: 'Creative Design' },
        { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', caption: 'Data Insights' },
        { url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80', caption: 'Global Team' },
      ],
    },
    defaultStyles: { layout: { width: '100%' } },
  },

  carousel: {
    type: 'carousel',
    name: 'Carousel',
    category: 'Media',
    icon: 'SlidersHorizontal',
    description: 'Horizontal sliding cards or slides.',
    allowedParents: ['section', 'container'],
    isLeaf: true,
    defaultProps: { autoplay: true, interval: 4000 },
    defaultStyles: { layout: { width: '100%' } },
  },

  'background-media': {
    type: 'background-media',
    name: 'Background Media',
    category: 'Media',
    icon: 'Wallpaper',
    description: 'Full-cover decorative background media.',
    allowedParents: ['section', 'container'],
    isLeaf: true,
    defaultProps: { opacity: 0.2 },
    defaultStyles: { layout: { position: 'absolute', width: '100%', height: '100%' } },
  },

  icon: {
    type: 'icon',
    name: 'Icon',
    category: 'Media',
    icon: 'Sparkles',
    description: 'Scalable vector icon with color customization.',
    allowedParents: ['section', 'container', 'column', 'row', 'button'],
    isLeaf: true,
    defaultProps: { iconName: 'Sparkles', size: 24, color: '#6366F1' },
    defaultStyles: {},
  },

  logo: {
    type: 'logo',
    name: 'Logo',
    category: 'Media',
    icon: 'Shield',
    description: 'Brand or partner company logo.',
    allowedParents: ['section', 'container', 'navbar', 'footer', 'row'],
    isLeaf: true,
    defaultProps: { text: 'Brand', logoUrl: '' },
    defaultStyles: {},
  },

  badge: {
    type: 'badge',
    name: 'Badge',
    category: 'Text',
    icon: 'Tag',
    description: 'Small status pill or feature tag.',
    allowedParents: ['section', 'container', 'column', 'row', 'stack'],
    isLeaf: true,
    defaultProps: { text: '✨ NEW FEATURE' },
    defaultStyles: {
      layout: { display: 'inline-flex' },
      spacing: { padding: { top: '4px', bottom: '4px', left: '12px', right: '12px' } },
      background: { color: 'rgba(99, 102, 241, 0.15)' },
      typography: { fontSize: '12px', fontWeight: 600, color: '#818CF8' },
      border: { radius: { all: '9999px' }, width: '1px', color: 'rgba(99, 102, 241, 0.3)', style: 'solid' },
    },
  },

  divider: {
    type: 'divider',
    name: 'Divider',
    category: 'Layout',
    icon: 'Minus',
    description: 'Subtle horizontal hairline line.',
    allowedParents: ['section', 'container', 'column', 'stack'],
    isLeaf: true,
    defaultProps: {},
    defaultStyles: {
      layout: { width: '100%' },
      border: { bottom: { width: '1px', style: 'solid', color: '#1E293B' } },
      spacing: { margin: { top: '24px', bottom: '24px' } },
    },
  },

  spacer: {
    type: 'spacer',
    name: 'Spacer',
    category: 'Layout',
    icon: 'MoveVertical',
    description: 'Empty vertical spacing cushion.',
    allowedParents: ['section', 'container', 'column', 'stack'],
    isLeaf: true,
    defaultProps: { height: '32px' },
    defaultStyles: { size: { height: '32px' } },
  },

  list: {
    type: 'list',
    name: 'List',
    category: 'Text',
    icon: 'List',
    description: 'Bulleted or icon checkmark list.',
    allowedParents: ['section', 'container', 'column'],
    isLeaf: true,
    defaultProps: { items: ['Instant visual manipulation', 'Zero-config responsive layouts', 'Enterprise grade performance'] },
    defaultStyles: { typography: { fontSize: '15px', color: '#94A3B8' } },
  },

  quote: {
    type: 'quote',
    name: 'Quote',
    category: 'Text',
    icon: 'Quote',
    description: 'Editorial blockquote with citation.',
    allowedParents: ['section', 'container', 'column'],
    isLeaf: true,
    defaultProps: { quote: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
    defaultStyles: {
      typography: { fontSize: '20px', fontWeight: 500, color: '#E2E8F0' },
      border: { left: { width: '3px', style: 'solid', color: '#6366F1' } },
      spacing: { padding: { left: '16px' } },
    },
  },

  form: {
    type: 'form',
    name: 'Custom Form',
    category: 'Forms',
    icon: 'ClipboardList',
    description: 'Custom inquiry or lead generation form.',
    allowedParents: ['section', 'container', 'column'],
    isLeaf: true,
    defaultProps: { title: 'Contact Us', submitLabel: 'Submit Message' },
    defaultStyles: { layout: { width: '100%' } },
  },

  'contact-form': {
    type: 'contact-form',
    name: 'Contact Form',
    category: 'Forms',
    icon: 'Mail',
    description: 'Pre-wired lead intake form connected to CRM.',
    allowedParents: ['section', 'container', 'column'],
    isLeaf: true,
    defaultProps: { headline: 'Get in Touch', fields: ['name', 'email', 'phone', 'message'] },
    defaultStyles: { layout: { width: '100%' } },
  },

  map: {
    type: 'map',
    name: 'Map',
    category: 'Components',
    icon: 'MapPin',
    description: 'Interactive Google Maps location embed.',
    allowedParents: ['section', 'container', 'column'],
    isLeaf: true,
    defaultProps: { address: 'Chicago, IL', zoom: 14 },
    defaultStyles: { layout: { width: '100%' }, size: { height: '360px' }, border: { radius: { all: '12px' } } },
  },

  'opening-hours': {
    type: 'opening-hours',
    name: 'Opening Hours',
    category: 'Components',
    icon: 'Clock',
    description: 'Business hours table with open/closed indicator.',
    allowedParents: ['section', 'container', 'column'],
    isLeaf: true,
    defaultProps: {},
    defaultStyles: {},
  },

  pricing: {
    type: 'pricing',
    name: 'Pricing Card',
    category: 'Components',
    icon: 'CreditCard',
    description: 'Pricing tier card with features list and CTA.',
    allowedParents: ['section', 'container', 'grid', 'row', 'column'],
    isLeaf: true,
    defaultProps: {
      planName: 'Pro Studio',
      price: '$49',
      billingPeriod: 'month',
      description: 'Everything you need to grow.',
      features: ['Unlimited Pages', 'Custom Domain', '24/7 Priority Support'],
      ctaLabel: 'Choose Plan',
      isPopular: true,
    },
    defaultStyles: {
      spacing: { padding: { top: '32px', bottom: '32px', left: '28px', right: '28px' } },
      background: { color: '#131620' },
      border: { radius: { all: '16px' }, width: '1px', style: 'solid', color: '#2A3042' },
    },
  },

  product: {
    type: 'product',
    name: 'Product Card',
    category: 'Components',
    icon: 'ShoppingBag',
    description: 'E-commerce product card with price and CTA.',
    allowedParents: ['section', 'container', 'grid', 'column'],
    isLeaf: true,
    defaultProps: { name: 'Featured Item', price: '$89.00' },
    defaultStyles: {},
  },

  testimonial: {
    type: 'testimonial',
    name: 'Testimonial',
    category: 'Components',
    icon: 'MessageSquareQuote',
    description: 'Customer quote card with avatar, rating, and role.',
    allowedParents: ['section', 'container', 'grid', 'column'],
    isLeaf: true,
    defaultProps: {
      quote: 'KDBA transformed how we design and launch our client projects in record time.',
      author: 'Sarah Jenkins',
      role: 'Head of Product, Acme Corp',
      rating: 5,
    },
    defaultStyles: {
      spacing: { padding: { top: '28px', bottom: '28px', left: '24px', right: '24px' } },
      background: { color: '#131620' },
      border: { radius: { all: '16px' }, width: '1px', style: 'solid', color: '#2A3042' },
    },
  },

  team: {
    type: 'team',
    name: 'Team Member',
    category: 'Components',
    icon: 'Users',
    description: 'Staff member card with photo and bio.',
    allowedParents: ['section', 'container', 'grid', 'column'],
    isLeaf: true,
    defaultProps: { name: 'Alex Rivera', role: 'Lead Architect' },
    defaultStyles: {},
  },

  service: {
    type: 'service',
    name: 'Service Card',
    category: 'Components',
    icon: 'Briefcase',
    description: 'Service offering card with icon and description.',
    allowedParents: ['section', 'container', 'grid', 'column'],
    isLeaf: true,
    defaultProps: { title: 'Brand Identity', description: 'Comprehensive visual design systems.' },
    defaultStyles: {},
  },

  navbar: {
    type: 'navbar',
    name: 'Navigation Bar',
    category: 'Navigation',
    icon: 'PanelTop',
    description: 'Site header navigation bar with logo and links.',
    allowedParents: ['page-root', 'section'],
    isLeaf: true,
    defaultProps: { brandName: 'KDBA Studio', sticky: true },
    defaultStyles: {
      layout: { width: '100%', position: 'sticky', top: '0px', zIndex: 50 },
      background: { color: '#0B0D13' },
      spacing: { padding: { top: '16px', bottom: '16px', left: '24px', right: '24px' } },
      border: { bottom: { width: '1px', style: 'solid', color: '#1E2430' } },
    },
  },

  navigation: {
    type: 'navigation',
    name: 'Navigation Links',
    category: 'Navigation',
    icon: 'Compass',
    description: 'Menu link items list.',
    allowedParents: ['navbar', 'footer', 'section', 'container'],
    isLeaf: true,
    defaultProps: {},
    defaultStyles: {},
  },

  footer: {
    type: 'footer',
    name: 'Footer',
    category: 'Navigation',
    icon: 'PanelBottom',
    description: 'Site bottom footer with copyright and links.',
    allowedParents: ['page-root', 'section'],
    isLeaf: true,
    defaultProps: { copyright: '© 2026 KDBA Inc. All rights reserved.' },
    defaultStyles: {
      layout: { width: '100%' },
      spacing: { padding: { top: '64px', bottom: '48px', left: '24px', right: '24px' } },
      background: { color: '#0B0D13' },
      border: { top: { width: '1px', style: 'solid', color: '#1E2430' } },
    },
  },
};
