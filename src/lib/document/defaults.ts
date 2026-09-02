// =============================================================================
// KDBA V2 — Default Section Configurations & Field Metadata
// =============================================================================

import { SectionMetadata, SectionType } from '@/types';

export const SECTION_METADATA_MAP: Record<SectionType, SectionMetadata> = {
  navbar: {
    type: 'navbar',
    name: 'Navigation Bar',
    description: 'Top header navigation, logo, menu links, and primary action button.',
    variants: [
      { id: 'standard', label: 'Standard (Logo Left, Links Right)' },
      { id: 'centered', label: 'Centered (Logo Center, Split Links)' },
      { id: 'floating', label: 'Floating Glass Bar' },
      { id: 'minimal', label: 'Minimal (Logo & CTA only)' },
      { id: 'split', label: 'Split (Fullwidth Bordered)' },
    ],
    defaultVariant: 'standard',
    editableFields: [
      { key: 'brandName', label: 'Brand Name', type: 'text', placeholder: 'My Business' },
      { key: 'logoUrl', label: 'Logo Image URL', type: 'image' },
      { key: 'ctaText', label: 'CTA Button Label', type: 'text', placeholder: 'Get in Touch' },
      { key: 'ctaUrl', label: 'CTA Button URL', type: 'link', placeholder: '/contact' },
    ],
    defaultProps: {
      brandName: 'Apex Brand',
      links: [
        { label: 'Home', url: '/' },
        { label: 'About', url: '/about' },
        { label: 'Services', url: '#services' },
        { label: 'Contact', url: '/contact' },
      ],
      ctaText: 'Get in Touch',
      ctaUrl: '/contact',
    },
  },

  hero: {
    type: 'hero',
    name: 'Hero Section',
    description: 'High-impact banner with headline, value proposition, CTAs, and showcase media.',
    variants: [
      { id: 'split-image', label: 'Split Image (2 Columns)' },
      { id: 'centered', label: 'Centered (High Impact)' },
      { id: 'fullscreen', label: 'Fullscreen (Immersive)' },
      { id: 'image-background', label: 'Image Background (Overlay)' },
      { id: 'editorial', label: 'Editorial (Minimalist Serif)' },
      { id: 'minimal', label: 'Minimal Clean' },
    ],
    defaultVariant: 'split-image',
    editableFields: [
      { key: 'badge', label: 'Badge / Tagline', type: 'text', placeholder: 'Transform Your Business' },
      { key: 'headline', label: 'Main Headline', type: 'text', placeholder: 'Elevate Your Business Presence' },
      { key: 'subheadline', label: 'Subheadline / Value Prop', type: 'textarea', placeholder: 'We build enterprise solutions...' },
      { key: 'primaryCtaText', label: 'Primary Button Label', type: 'text', placeholder: 'Get Started' },
      { key: 'primaryCtaUrl', label: 'Primary Button Link', type: 'link', placeholder: '/contact' },
      { key: 'secondaryCtaText', label: 'Secondary Button Label', type: 'text', placeholder: 'Explore Solutions' },
      { key: 'secondaryCtaUrl', label: 'Secondary Button Link', type: 'link', placeholder: '#services' },
      { key: 'imageUrl', label: 'Hero Image URL', type: 'image' },
    ],
    defaultProps: {
      badge: 'Next-Generation Excellence',
      headline: 'Transforming Ideas Into Market Leadership',
      subheadline: 'We combine visionary strategy, elite craft, and modern engineering to scale remarkable brands.',
      primaryCtaText: 'Get Started',
      primaryCtaUrl: '/contact',
      secondaryCtaText: 'Explore Offerings',
      secondaryCtaUrl: '#services',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
    },
  },

  about: {
    type: 'about',
    name: 'About Section',
    description: 'Brand narrative, founding mission, executive bio, and core values.',
    variants: [
      { id: 'split', label: 'Split Story & Visual' },
      { id: 'story', label: 'Editorial Story' },
      { id: 'stats-grid', label: 'Narrative with Stats' },
      { id: 'timeline', label: 'Milestone Timeline' },
      { id: 'minimal', label: 'Minimal Focus' },
    ],
    defaultVariant: 'split',
    editableFields: [
      { key: 'badge', label: 'Badge', type: 'text', placeholder: 'About Us' },
      { key: 'headline', label: 'Headline', type: 'text', placeholder: 'Built With Purpose & Precision' },
      { key: 'description', label: 'Story & Narrative', type: 'textarea', placeholder: 'Founded on principles of quality...' },
      { key: 'imageUrl', label: 'Featured Image', type: 'image' },
    ],
    defaultProps: {
      badge: 'Who We Are',
      headline: 'Built with Precision & Purpose',
      description: 'We deliver uncompromised quality, blending human expertise, deep strategic clarity, and modern execution to propel our clients forward.',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
      features: ['Unmatched track record', 'Dedicated client advisory', 'Strategic clarity'],
    },
  },

  services: {
    type: 'services',
    name: 'Services & Capabilities',
    description: 'Highlight practice areas, consulting solutions, and core offerings.',
    variants: [
      { id: 'grid', label: 'Cards Grid (3 Columns)' },
      { id: 'cards-accent', label: 'Accent Border Cards' },
      { id: 'list-detailed', label: 'Detailed Row List' },
      { id: 'minimal-icons', label: 'Minimal Icon Grid' },
      { id: 'carousel', label: 'Horizontal Cards' },
    ],
    defaultVariant: 'grid',
    editableFields: [
      { key: 'badge', label: 'Badge', type: 'text', placeholder: 'Capabilities' },
      { key: 'headline', label: 'Headline', type: 'text', placeholder: 'What We Deliver' },
      { key: 'subheadline', label: 'Subheadline', type: 'textarea', placeholder: 'End-to-end expertise tailored to your goals.' },
    ],
    defaultProps: {
      badge: 'Capabilities',
      headline: 'Tailored Solutions for Ambitious Clients',
      subheadline: 'End-to-end expertise designed to unlock efficiency, create differentiation, and deliver compounding growth.',
      items: [
        { title: 'Strategic Advisory', description: 'Comprehensive roadmaps and executive leadership consulting.', icon: 'Briefcase' },
        { title: 'Brand & Growth', description: 'Transformational branding, positioning, and digital strategy.', icon: 'Zap' },
        { title: 'Enterprise Solutions', description: 'Custom implementations and technical infrastructure.', icon: 'ShieldCheck' },
      ],
    },
  },

  features: {
    type: 'features',
    name: 'Features & Benefits',
    description: 'Detailed feature breakdowns, bento-grid highlights, and product advantages.',
    variants: [
      { id: 'grid-3col', label: '3-Column Grid' },
      { id: 'alternating', label: 'Alternating Rows' },
      { id: 'bento-grid', label: 'Bento Grid Layout' },
      { id: 'cards', label: 'Feature Cards' },
    ],
    defaultVariant: 'bento-grid',
    editableFields: [
      { key: 'badge', label: 'Badge', type: 'text', placeholder: 'Features' },
      { key: 'headline', label: 'Headline', type: 'text', placeholder: 'Engineered for Performance' },
      { key: 'subheadline', label: 'Subheadline', type: 'textarea', placeholder: 'Everything you need to succeed.' },
    ],
    defaultProps: {
      badge: 'Core Advantages',
      headline: 'Engineered for Seamless Performance',
      subheadline: 'Every feature is meticulously crafted to deliver speed, reliability, and unparalleled client satisfaction.',
      items: [
        { title: 'Blazing Fast Performance', description: 'Optimized rendering and infrastructure ensure instant responsiveness.', icon: 'Zap' },
        { title: 'Bank-Grade Security', description: 'End-to-end encryption and compliance across all customer touchpoints.', icon: 'ShieldCheck' },
        { title: 'Real-Time Insights', description: 'Comprehensive analytics dashboards to track key conversion metrics.', icon: 'TrendingUp' },
        { title: 'Seamless Integrations', description: 'Connect effortlessly with your existing CRM, tools, and workflows.', icon: 'Layers' },
      ],
    },
  },

  products: {
    type: 'products',
    name: 'Products & Menu Catalog',
    description: 'Showcase e-commerce products, restaurant dishes, or specialized packages.',
    variants: [
      { id: 'grid', label: 'Product Card Grid' },
      { id: 'catalog', label: 'Catalog with Filters' },
      { id: 'menu-list', label: 'Restaurant Menu List' },
      { id: 'featured-card', label: 'Featured Product Hero' },
    ],
    defaultVariant: 'grid',
    editableFields: [
      { key: 'badge', label: 'Badge', type: 'text', placeholder: 'Catalog' },
      { key: 'headline', label: 'Headline', type: 'text', placeholder: 'Featured Offerings' },
      { key: 'subheadline', label: 'Subheadline', type: 'textarea', placeholder: 'Browse our curated selection.' },
    ],
    defaultProps: {
      badge: 'Catalog & Menu',
      headline: 'Curated Selections & Offerings',
      subheadline: 'Explore our latest items, crafted with premium materials and exacting standards.',
      items: [
        { name: 'Signature Offering A', price: '$120.00', description: 'Handcrafted with premium materials.', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', ctaText: 'Order Now' },
        { name: 'Artisan Selection B', price: '$85.00', description: 'Freshly prepared and curated daily.', imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop&q=80', ctaText: 'Order Now' },
        { name: 'Premium Package C', price: '$240.00', description: 'Complete comprehensive experience.', imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80', ctaText: 'Order Now' },
      ],
    },
  },

  portfolio: {
    type: 'portfolio',
    name: 'Portfolio & Projects',
    description: 'Showcase recent case studies, client works, architecture projects, and visual triumphs.',
    variants: [
      { id: 'masonry', label: 'Masonry Grid' },
      { id: 'grid-hover', label: 'Interactive Hover Cards' },
      { id: 'carousel', label: 'Horizontal Showcase' },
      { id: 'minimal-list', label: 'Editorial Project List' },
    ],
    defaultVariant: 'grid-hover',
    editableFields: [
      { key: 'badge', label: 'Badge', type: 'text', placeholder: 'Selected Work' },
      { key: 'headline', label: 'Headline', type: 'text', placeholder: 'Featured Case Studies' },
      { key: 'subheadline', label: 'Subheadline', type: 'textarea', placeholder: 'A selection of our landmark projects.' },
    ],
    defaultProps: {
      badge: 'Selected Work',
      headline: 'Architectural & Digital Milestones',
      subheadline: 'Explore landmark projects delivered across hospitality, finance, luxury retail, and tech.',
      items: [
        { title: 'The Obsidian Pavilion', category: 'Architecture', year: '2026', imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80' },
        { title: 'Vanguard FinTech Platform', category: 'Product Design', year: '2025', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80' },
        { title: 'Komorebi Wellness Retreat', category: 'Interior Design', year: '2025', imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80' },
      ],
    },
  },

  gallery: {
    type: 'gallery',
    name: 'Visual Media Gallery',
    description: 'Edge-to-edge photography, studio scenes, food photography, or showroom displays.',
    variants: [
      { id: 'grid', label: 'Balanced Photo Grid' },
      { id: 'masonry', label: 'Dynamic Masonry' },
      { id: 'carousel', label: 'Scrollable Carousel' },
      { id: 'fullwidth-strip', label: 'Fullwidth Cinematic Strip' },
    ],
    defaultVariant: 'grid',
    editableFields: [
      { key: 'badge', label: 'Badge', type: 'text', placeholder: 'Gallery' },
      { key: 'headline', label: 'Headline', type: 'text', placeholder: 'Visual Highlights' },
    ],
    defaultProps: {
      badge: 'Gallery',
      headline: 'Atmosphere & Craftsmanship',
      images: [
        'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
      ],
    },
  },

  team: {
    type: 'team',
    name: 'Team & Leadership',
    description: 'Introduce partners, founders, medical doctors, chefs, or creative directors.',
    variants: [
      { id: 'grid-cards', label: 'Profile Cards Grid' },
      { id: 'editorial-list', label: 'Editorial Bio List' },
      { id: 'minimal-round', label: 'Minimal Avatars' },
    ],
    defaultVariant: 'grid-cards',
    editableFields: [
      { key: 'badge', label: 'Badge', type: 'text', placeholder: 'Our People' },
      { key: 'headline', label: 'Headline', type: 'text', placeholder: 'Meet the Leadership Team' },
      { key: 'subheadline', label: 'Subheadline', type: 'textarea', placeholder: 'Guided by decades of collective experience.' },
    ],
    defaultProps: {
      badge: 'Our People',
      headline: 'Guided by Leaders & Visionaries',
      subheadline: 'Our multidisciplinary team brings deep domain insight, relentless dedication, and unmatched craft.',
      items: [
        { name: 'Dr. Evelyn Sterling', role: 'Managing Partner', bio: 'Former senior advisor with 18+ years leading enterprise transformation.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
        { name: 'Marcus Vance', role: 'Creative Director', bio: 'Award-winning design director specialized in architectural aesthetics.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80' },
        { name: 'Dr. Sophia Bennett', role: 'Lead Clinician', bio: 'Board-certified medical specialist dedicated to patient outcomes.', avatar: 'https://images.unsplash.com/photo-1594824813624-9b59695d73fa?w=400&auto=format&fit=crop&q=80' },
      ],
    },
  },

  testimonials: {
    type: 'testimonials',
    name: 'Client Testimonials & Reviews',
    description: 'Build credibility with customer quotes, star ratings, and enterprise success stories.',
    variants: [
      { id: 'cards-grid', label: 'Testimonial Cards Grid' },
      { id: 'quote-slider', label: 'Single Prominent Quote' },
      { id: 'single-featured', label: 'Featured Client Case' },
      { id: 'compact-marquee', label: 'Compact Review Marquee' },
    ],
    defaultVariant: 'cards-grid',
    editableFields: [
      { key: 'badge', label: 'Badge', type: 'text', placeholder: 'Testimonials' },
      { key: 'headline', label: 'Headline', type: 'text', placeholder: 'Trusted by Industry Leaders' },
      { key: 'subheadline', label: 'Subheadline', type: 'textarea', placeholder: 'What our clients say about our partnership.' },
    ],
    defaultProps: {
      badge: 'Client Endorsements',
      headline: 'Trusted by Leaders Worldwide',
      subheadline: 'Discover how our partnership transforms organizations and creates lasting value.',
      items: [
        { quote: 'KDBA delivered extraordinary quality and unparalleled velocity. Truly best in class.', author: 'Jonathan Vance', role: 'Chief Executive, Sterling Capital', rating: 5 },
        { quote: 'Their strategic clarity and design execution elevated our market positioning immediately.', author: 'Elena Rostova', role: 'Founder, Lumina Studio', rating: 5 },
        { quote: 'A flawless engagement from kickoff to deployment. Exceeded all our KPI expectations.', author: 'David Chen', role: 'Managing Partner, Apex Ventures', rating: 5 },
      ],
    },
  },

  stats: {
    type: 'stats',
    name: 'Stats & Metrics',
    description: 'Display quantifiable proof points, metrics, and business milestones.',
    variants: [
      { id: 'counter-grid', label: 'Metrics Grid (4 Columns)' },
      { id: 'banner-strip', label: 'Cinematic Metric Banner' },
      { id: 'cards', label: 'Metric Cards' },
      { id: 'minimal', label: 'Minimal Stat Bar' },
    ],
    defaultVariant: 'counter-grid',
    editableFields: [
      { key: 'badge', label: 'Badge', type: 'text', placeholder: 'Track Record' },
      { key: 'headline', label: 'Headline', type: 'text', placeholder: 'Impact by the Numbers' },
    ],
    defaultProps: {
      badge: 'Track Record',
      headline: 'Proven Impact Across Every Engagement',
      items: [
        { value: '$450M+', label: 'Client Value Generated' },
        { value: '99.8%', label: 'On-Time Project Delivery' },
        { value: '140+', label: 'Global Enterprise Clients' },
        { value: '18+', label: 'Years of Market Leadership' },
      ],
    },
  },

  pricing: {
    type: 'pricing',
    name: 'Pricing & Retainers',
    description: 'Display transparent pricing tiers, retainer plans, or service packages.',
    variants: [
      { id: 'cards-comparison', label: 'Tier Comparison Cards' },
      { id: 'tier-cards', label: 'Highlighted Tier Cards' },
      { id: 'simple-list', label: 'Simple Rate List' },
      { id: 'minimal', label: 'Minimal Table' },
    ],
    defaultVariant: 'tier-cards',
    editableFields: [
      { key: 'badge', label: 'Badge', type: 'text', placeholder: 'Transparent Pricing' },
      { key: 'headline', label: 'Headline', type: 'text', placeholder: 'Predictable Investment Plans' },
      { key: 'subheadline', label: 'Subheadline', type: 'textarea', placeholder: 'Choose the tier suited for your current scale.' },
    ],
    defaultProps: {
      badge: 'Transparent Pricing',
      headline: 'Simple, Transparent Investment Plans',
      subheadline: 'Choose the engagement tier tailored to your operational scale and business milestones.',
      items: [
        { name: 'Starter Tier', price: '$1,900', period: '/month', description: 'Essential setup and advisory for early-stage initiatives.', features: ['Dedicated advisor', 'Core digital platform', 'Monthly strategy review'], ctaText: 'Select Plan', isPopular: false },
        { name: 'Enterprise Pro', price: '$4,500', period: '/month', description: 'Comprehensive roadmap, bespoke builds, and dedicated support.', features: ['Senior leadership access', 'Custom integrations', '24/7 Priority SLA', 'Unlimited updates'], ctaText: 'Select Plan', isPopular: true },
        { name: 'Custom Retainer', price: 'Custom', period: '', description: 'Bespoke high-volume enterprise transformation.', features: ['Dedicated pod', 'Custom SLA contracts', 'Multi-tenant architecture'], ctaText: 'Contact Advisory', isPopular: false },
      ],
    },
  },

  faq: {
    type: 'faq',
    name: 'Frequently Asked Questions',
    description: 'Answer common buyer questions, booking procedures, and consultation FAQs.',
    variants: [
      { id: 'accordion', label: 'Accordion Accordion' },
      { id: 'two-column', label: 'Two-Column Grid' },
      { id: 'cards', label: 'FAQ Cards' },
      { id: 'minimal', label: 'Minimal List' },
    ],
    defaultVariant: 'accordion',
    editableFields: [
      { key: 'badge', label: 'Badge', type: 'text', placeholder: 'FAQ' },
      { key: 'headline', label: 'Headline', type: 'text', placeholder: 'Common Questions & Answers' },
      { key: 'subheadline', label: 'Subheadline', type: 'textarea', placeholder: 'Everything you need to know before getting started.' },
    ],
    defaultProps: {
      badge: 'Frequently Asked Questions',
      headline: 'Clear Answers to Important Questions',
      subheadline: 'Everything you need to know about our engagement model, timelines, and deliverables.',
      items: [
        { question: 'What is your typical project turnaround timeline?', answer: 'Most standard engagements launch within 2 to 4 weeks, with expedited 10-day sprints available for urgent requirements.' },
        { question: 'Do you offer ongoing retainer maintenance and support?', answer: 'Yes, we provide continuous monitoring, performance optimization, and content updates under flexible retainer agreements.' },
        { question: 'Can we migrate our existing domain and customer data seamlessly?', answer: 'Absolutely. Our migration engineers handle domain routing, DNS configuration, and data import with zero downtime.' },
        { question: 'How are inbound leads and inquiries routed?', answer: 'All form inquiries are instantly delivered via email, synchronized to your KDBA CRM dashboard, and can trigger automated WhatsApp alerts.' },
      ],
    },
  },

  process: {
    type: 'process',
    name: 'How It Works / Process',
    description: 'Step-by-step roadmap showing client journey, methodology, or workflow.',
    variants: [
      { id: 'steps-timeline', label: 'Step-by-Step Timeline' },
      { id: 'numbered-cards', label: 'Numbered Process Cards' },
      { id: 'horizontal-flow', label: 'Horizontal Journey Flow' },
    ],
    defaultVariant: 'steps-timeline',
    editableFields: [
      { key: 'badge', label: 'Badge', type: 'text', placeholder: 'Our Methodology' },
      { key: 'headline', label: 'Headline', type: 'text', placeholder: 'How We Achieve Success' },
      { key: 'subheadline', label: 'Subheadline', type: 'textarea', placeholder: 'A structured approach from discovery to deployment.' },
    ],
    defaultProps: {
      badge: 'Our Methodology',
      headline: 'A Proven, Structured Path to Results',
      subheadline: 'From initial diagnostic discovery to live market deployment, our 4-step framework guarantees precision.',
      items: [
        { step: '01', title: 'Discovery & Audit', description: 'Deep-dive into your market landscape, competitive moat, and core user expectations.' },
        { step: '02', title: 'Architecture & Strategy', description: 'Formulating high-converting layouts, design tokens, and technical architecture.' },
        { step: '03', title: 'Execution & Craft', description: 'Precision development and visual refinement matching world-class standards.' },
        { step: '04', title: 'Launch & Growth', description: 'Live deployment, analytics tracking, and ongoing optimization.' },
      ],
    },
  },

  contact: {
    type: 'contact',
    name: 'Contact & Inquiry Form',
    description: 'Capture inbound customer leads, consultation inquiries, and support requests.',
    variants: [
      { id: 'split-form', label: 'Split Form & Details' },
      { id: 'card-centered', label: 'Centered Form Card' },
      { id: 'minimal-details', label: 'Minimal Contact Info' },
    ],
    defaultVariant: 'split-form',
    editableFields: [
      { key: 'badge', label: 'Badge', type: 'text', placeholder: 'Get in Touch' },
      { key: 'headline', label: 'Headline', type: 'text', placeholder: 'Start a Conversation' },
      { key: 'subheadline', label: 'Subheadline', type: 'textarea', placeholder: 'Fill out the form below or reach out directly.' },
      { key: 'email', label: 'Direct Email', type: 'text', placeholder: 'hello@example.com' },
      { key: 'phone', label: 'Phone Number', type: 'text', placeholder: '+1 (555) 000-0000' },
      { key: 'address', label: 'Physical Address', type: 'text', placeholder: '100 Main Street, Suite 400' },
      { key: 'buttonText', label: 'Submit Button Text', type: 'text', placeholder: 'Send Inquiry' },
    ],
    defaultProps: {
      badge: 'Get In Touch',
      headline: 'Let’s Build Something Exceptional Together',
      subheadline: 'Have a project in mind or need executive advisory? Send us a message and our partners will respond within 24 hours.',
      email: 'advisory@apexbrand.com',
      phone: '+1 (555) 382-9100',
      address: '750 Montgomery Street, Financial District, SF',
      businessHours: 'Mon – Fri: 9:00 AM – 6:00 PM PST',
      buttonText: 'Submit Inquiry',
    },
  },

  map: {
    type: 'map',
    name: 'Location Map & Directions',
    description: 'Showcase physical studio, restaurant, clinic, or office location.',
    variants: [
      { id: 'embed-card', label: 'Interactive Map with Card' },
      { id: 'fullwidth-banner', label: 'Fullwidth Map Banner' },
      { id: 'split-info', label: 'Split Map & Info' },
    ],
    defaultVariant: 'embed-card',
    editableFields: [
      { key: 'badge', label: 'Badge', type: 'text', placeholder: 'Our Location' },
      { key: 'headline', label: 'Headline', type: 'text', placeholder: 'Visit Our Flagship Space' },
      { key: 'address', label: 'Full Address', type: 'text', placeholder: '123 Avenue of the Americas, New York' },
      { key: 'mapEmbedUrl', label: 'Google Maps Embed URL', type: 'text' },
    ],
    defaultProps: {
      badge: 'Location',
      headline: 'Visit Our Flagship Space',
      address: '100 Montgomery St, Financial District, San Francisco, CA 94104',
      phone: '+1 (555) 234-5678',
      mapEmbedUrl: 'https://maps.google.com/maps?q=San+Francisco+Financial+District&t=&z=13&ie=UTF8&iwloc=&output=embed',
    },
  },

  'opening-hours': {
    type: 'opening-hours',
    name: 'Opening & Operating Hours',
    description: 'Display dining hours, clinic schedule, gym sessions, or salon availability.',
    variants: [
      { id: 'card-table', label: 'Weekly Schedule Table' },
      { id: 'badge-list', label: 'Modern Badge List' },
      { id: 'split-schedule', label: 'Split Hours & Booking CTA' },
    ],
    defaultVariant: 'card-table',
    editableFields: [
      { key: 'badge', label: 'Badge', type: 'text', placeholder: 'Hours & Availability' },
      { key: 'headline', label: 'Headline', type: 'text', placeholder: 'Operating Schedule' },
      { key: 'note', label: 'Special Notice / Holiday Info', type: 'text', placeholder: 'Walk-ins welcomed daily.' },
    ],
    defaultProps: {
      badge: 'Hours of Operation',
      headline: 'Weekly Schedule & Availability',
      note: 'Reservations recommended for evening seatings and consultations.',
      schedule: [
        { days: 'Monday – Thursday', hours: '8:00 AM – 9:00 PM' },
        { days: 'Friday & Saturday', hours: '8:00 AM – 11:00 PM' },
        { days: 'Sunday', hours: '9:00 AM – 8:00 PM' },
      ],
    },
  },

  cta: {
    type: 'cta',
    name: 'Call to Action Banner',
    description: 'High-conversion banner driving bookings, calls, purchases, or appointments.',
    variants: [
      { id: 'banner-split', label: 'Split Banner with Image' },
      { id: 'centered-card', label: 'Centered Glowing Card' },
      { id: 'minimal-bar', label: 'Minimal Accent Strip' },
      { id: 'glow-card', label: 'Glow Card with Action' },
    ],
    defaultVariant: 'centered-card',
    editableFields: [
      { key: 'headline', label: 'Headline', type: 'text', placeholder: 'Ready to Elevate Your Business?' },
      { key: 'subheadline', label: 'Subheadline', type: 'textarea', placeholder: 'Connect with our specialists today.' },
      { key: 'primaryCtaText', label: 'Primary Button Text', type: 'text', placeholder: 'Get Started Today' },
      { key: 'primaryCtaUrl', label: 'Primary Button URL', type: 'link', placeholder: '/contact' },
    ],
    defaultProps: {
      headline: 'Ready to Transform Your Brand Presence?',
      subheadline: 'Schedule an executive discovery consultation today and unlock your market potential.',
      primaryCtaText: 'Schedule Consultation',
      primaryCtaUrl: '/contact',
      secondaryCtaText: 'Call (555) 382-9100',
      secondaryCtaUrl: 'tel:+15553829100',
    },
  },

  footer: {
    type: 'footer',
    name: 'Website Footer',
    description: 'Site-wide footer with copyright, navigation links, address, and social links.',
    variants: [
      { id: 'multi-column', label: 'Multi-Column Links & Brand' },
      { id: 'brand-rich', label: 'Brand Rich with Newsletter' },
      { id: 'minimal-centered', label: 'Centered Minimalist' },
      { id: 'compact', label: 'Compact Single Row' },
    ],
    defaultVariant: 'multi-column',
    editableFields: [
      { key: 'brandName', label: 'Brand Name', type: 'text', placeholder: 'Apex Advisory' },
      { key: 'tagline', label: 'Footer Tagline', type: 'text', placeholder: 'Engineering enduring digital experiences.' },
      { key: 'copyright', label: 'Copyright Text', type: 'text', placeholder: '© 2026 Apex Brand. All rights reserved.' },
    ],
    defaultProps: {
      brandName: 'Apex Advisory',
      tagline: 'Delivering uncompromised strategy, craft, and technology worldwide.',
      copyright: `© ${new Date().getFullYear()} Apex Advisory. All rights reserved.`,
      columns: [
        {
          title: 'Company',
          links: [
            { label: 'About Us', url: '/about' },
            { label: 'Our Work', url: '#portfolio' },
            { label: 'Leadership', url: '#team' },
            { label: 'Careers', url: '/contact' },
          ],
        },
        {
          title: 'Capabilities',
          links: [
            { label: 'Strategic Advisory', url: '#services' },
            { label: 'Brand Architecture', url: '#services' },
            { label: 'Enterprise Systems', url: '#services' },
          ],
        },
        {
          title: 'Connect',
          links: [
            { label: 'Schedule Consultation', url: '/contact' },
            { label: 'Client Portal', url: '/login' },
            { label: 'Support SLA', url: '/contact' },
          ],
        },
      ],
    },
  },
};
