import { SECTION_PRESETS, SectionPreset } from '@/lib/editor/section-presets';

export type BlockCategory =
  | 'Hero'
  | 'Content'
  | 'Media'
  | 'Business'
  | 'Contact'
  | 'Navigation';

export interface BlockDefinition extends SectionPreset {
  category: BlockCategory;
}

const CATEGORY_BY_ID: Record<string, BlockCategory> = {
  hero: 'Hero',
  about: 'Content',
  features: 'Content',
  services: 'Business',
  testimonials: 'Content',
  cta: 'Content',
  pricing: 'Business',
  gallery: 'Media',
  faq: 'Content',
  footer: 'Navigation',
  contact: 'Contact',
  'contact-split': 'Contact',
  'contact-with-info': 'Contact',
  'contact-with-image': 'Contact',
  'contact-narrow': 'Contact',
  'contact-full': 'Contact',
  'contact-inline': 'Contact',
  'contact-pill': 'Contact',
};

export const BLOCK_REGISTRY: BlockDefinition[] = SECTION_PRESETS.map((preset) => ({
  ...preset,
  category: CATEGORY_BY_ID[preset.id] ?? 'Content',
}));

export function getBlocksByCategory(category?: BlockCategory) {
  if (!category) return BLOCK_REGISTRY;
  return BLOCK_REGISTRY.filter((block) => block.category === category);
}
