import { create } from 'zustand';
import { Website, Page, Section, ThemeConfig } from '@/types';

export type ViewMode = 'desktop' | 'tablet' | 'mobile';

interface EditorState {
  website: Website | null;
  activePageId: string | null;
  activeSectionId: string | null;
  viewMode: ViewMode;
  isSaving: boolean;
  isPublishing: boolean;
  isDirty: boolean;

  setWebsite: (website: Website) => void;
  setActivePageId: (pageId: string) => void;
  setActiveSectionId: (sectionId: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setIsSaving: (saving: boolean) => void;
  setIsPublishing: (publishing: boolean) => void;
  
  updateSectionConfig: (pageId: string, sectionId: string, config: Record<string, any>) => void;
  toggleSection: (pageId: string, sectionId: string) => void;
  reorderSections: (pageId: string, sections: Section[]) => void;
  addSection: (pageId: string, sectionType: string, title?: string) => void;
  deleteSection: (pageId: string, sectionId: string) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  updateWebsiteMeta: (meta: { name?: string; seoTitle?: string; seoDescription?: string }) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  website: null,
  activePageId: null,
  activeSectionId: null,
  viewMode: 'desktop',
  isSaving: false,
  isPublishing: false,
  isDirty: false,

  setWebsite: (website) => {
    const firstPageId = website.pages?.[0]?.id || null;
    set({
      website,
      activePageId: firstPageId,
      activeSectionId: null,
      isDirty: false,
    });
  },

  setActivePageId: (activePageId) => {
    set({ activePageId, activeSectionId: null });
  },

  setActiveSectionId: (activeSectionId) => {
    set({ activeSectionId });
  },

  setViewMode: (viewMode) => {
    set({ viewMode });
  },

  setIsSaving: (isSaving) => {
    set({ isSaving });
  },

  setIsPublishing: (isPublishing) => {
    set({ isPublishing });
  },

  updateSectionConfig: (pageId, sectionId, config) => {
    const current = get().website;
    if (!current) return;

    const updatedPages = current.pages.map((p) => {
      if (p.id !== pageId) return p;
      return {
        ...p,
        sections: p.sections.map((s) => {
          if (s.id !== sectionId) return s;
          return {
            ...s,
            draftConfig: { ...s.draftConfig, ...config },
          };
        }),
      };
    });

    set({
      website: { ...current, pages: updatedPages },
      isDirty: true,
    });
  },

  toggleSection: (pageId, sectionId) => {
    const current = get().website;
    if (!current) return;

    const updatedPages = current.pages.map((p) => {
      if (p.id !== pageId) return p;
      return {
        ...p,
        sections: p.sections.map((s) => {
          if (s.id !== sectionId) return s;
          return {
            ...s,
            enabled: !s.enabled,
          };
        }),
      };
    });

    set({
      website: { ...current, pages: updatedPages },
      isDirty: true,
    });
  },

  reorderSections: (pageId, sections) => {
    const current = get().website;
    if (!current) return;

    const updatedPages = current.pages.map((p) => {
      if (p.id !== pageId) return p;
      return {
        ...p,
        sections: sections.map((s, index) => ({
          ...s,
          sortOrder: index,
        })),
      };
    });

    set({
      website: { ...current, pages: updatedPages },
      isDirty: true,
    });
  },

  addSection: (pageId, sectionType, title) => {
    const current = get().website;
    if (!current) return;

    const defaultConfigs: Record<string, any> = {
      PRODUCTS: {
        badge: 'Catalog & Menu',
        headline: 'Featured Products & Offerings',
        subheadline: 'Explore our latest items, dishes, and curated products.',
      },
      SERVICES: {
        badge: 'Services',
        headline: 'What We Offer',
        subheadline: 'Professional solutions built to elevate your business.',
        items: [
          { title: 'Strategic Advisory', description: 'Comprehensive roadmap and leadership consulting.', icon: 'Briefcase' },
          { title: 'Brand & Growth', description: 'Transformational branding and digital strategy.', icon: 'Zap' },
          { title: 'Enterprise Solutions', description: 'Custom implementations tailored for your organization.', icon: 'ShieldCheck' },
        ],
      },
      PRICING: {
        badge: 'Pricing & Plans',
        headline: 'Transparent Engagement Plans',
        subheadline: 'Predictable pricing tiers tailored to your scale and requirements.',
      },
      GALLERY: {
        badge: 'Visual Gallery',
        headline: 'Selected Highlights',
        images: [
          'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80',
        ],
      },
      TESTIMONIALS: {
        badge: 'Testimonials',
        headline: 'Client Success Stories',
        items: [
          { quote: 'Exceptional quality and speed of execution.', author: 'Jonathan Vance', role: 'Managing Partner', rating: 5 },
          { quote: 'Transformational impact on our market presence.', author: 'Sarah Jenkins', role: 'Chief Executive', rating: 5 },
        ],
      },
      TEAM: {
        badge: 'Our People',
        headline: 'Executive Leadership',
        items: [
          { name: 'Alex Sterling', role: 'Managing Director', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80' },
          { name: 'Claire Thornton', role: 'Head of Growth', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' },
        ],
      },
      ABOUT: {
        badge: 'Who We Are',
        headline: 'Built with Precision & Purpose',
        description: 'We deliver uncompromised quality, blending human expertise and modern technology.',
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
        features: ['Unmatched track record', 'Dedicated support', 'Strategic clarity'],
      },
      CTA: {
        headline: 'Ready to Elevate Your Business?',
        subheadline: 'Connect with our specialists today and take the next step.',
        primaryCtaText: 'Get Started',
        primaryCtaUrl: '/contact',
      },
    };

    const newSectionId = `sec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newSection: any = {
      id: newSectionId,
      pageId,
      type: sectionType,
      title: title || `${sectionType.charAt(0) + sectionType.slice(1).toLowerCase()} Section`,
      draftConfig: defaultConfigs[sectionType] || {},
      publishedConfig: null,
      enabled: true,
      sortOrder: 1,
    };

    const updatedPages = current.pages.map((p) => {
      if (p.id !== pageId) return p;
      // Insert before FOOTER if exists, otherwise at the end
      const footerIndex = p.sections.findIndex((s) => s.type === 'FOOTER');
      const updatedSections = [...p.sections];
      if (footerIndex !== -1) {
        updatedSections.splice(footerIndex, 0, newSection);
      } else {
        updatedSections.push(newSection);
      }
      return {
        ...p,
        sections: updatedSections.map((s, idx) => ({ ...s, sortOrder: idx })),
      };
    });

    set({
      website: { ...current, pages: updatedPages },
      activeSectionId: newSectionId,
      isDirty: true,
    });
  },

  deleteSection: (pageId, sectionId) => {
    const current = get().website;
    if (!current) return;

    const updatedPages = current.pages.map((p) => {
      if (p.id !== pageId) return p;
      return {
        ...p,
        sections: p.sections.filter((s) => s.id !== sectionId),
      };
    });

    set({
      website: { ...current, pages: updatedPages },
      activeSectionId: get().activeSectionId === sectionId ? null : get().activeSectionId,
      isDirty: true,
    });
  },

  updateTheme: (themeUpdate) => {
    const current = get().website;
    if (!current) return;

    set({
      website: {
        ...current,
        theme: {
          ...current.theme,
          ...themeUpdate,
        },
      },
      isDirty: true,
    });
  },

  updateWebsiteMeta: (meta) => {
    const current = get().website;
    if (!current) return;

    set({
      website: {
        ...current,
        ...meta,
      },
      isDirty: true,
    });
  },
}));
