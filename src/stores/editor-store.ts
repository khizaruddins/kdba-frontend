// =============================================================================
// KDBA V2 — Editor State Store (Zustand)
// =============================================================================

import { create } from 'zustand';
import {
  WebsiteDocument,
  ThemeConfig,
  BusinessInfo,
  SectionDocument,
  PageDocument,
  SectionType,
} from '@/types';
import {
  updateDocumentTheme,
  updateDocumentBusiness,
  updateDocumentMeta,
  updateDocumentPage,
  addDocumentPage,
  deleteDocumentPage,
  updateDocumentSectionProps,
  changeDocumentSectionVariant,
  toggleDocumentSection,
  moveDocumentSection,
  reorderDocumentSections,
  addDocumentSection,
  deleteDocumentSection,
} from '@/lib/document/mutations';
import { SECTION_METADATA_MAP } from '@/lib/document/defaults';

export type ViewMode = 'desktop' | 'tablet' | 'mobile';

interface EditorState {
  website: any | null; // Can hold WebsiteDocument or legacy Website
  activePageId: string | null;
  activeSectionId: string | null;
  viewMode: ViewMode;
  isSaving: boolean;
  isPublishing: boolean;
  isDirty: boolean;

  // Setters
  setWebsite: (website: any) => void;
  setActivePageId: (pageId: string) => void;
  setActiveSectionId: (sectionId: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setIsSaving: (saving: boolean) => void;
  setIsPublishing: (publishing: boolean) => void;
  setIsDirty: (dirty: boolean) => void;

  // Document Mutations
  updateTheme: (themeUpdate: Partial<ThemeConfig>) => void;
  updateBusiness: (businessUpdate: Partial<BusinessInfo>) => void;
  updateWebsiteMeta: (meta: { name?: string; seoTitle?: string; seoDescription?: string; favicon?: string | null }) => void;
  updatePage: (pageId: string, update: Partial<PageDocument>) => void;
  addPage: (page: { title: string; slug: string }) => void;
  deletePage: (pageId: string) => void;

  // Section Mutations
  updateSectionConfig: (pageId: string, sectionId: string, config: Record<string, any>) => void;
  changeSectionVariant: (pageId: string, sectionId: string, variant: string) => void;
  toggleSection: (pageId: string, sectionId: string) => void;
  moveSection: (pageId: string, index: number, direction: 'up' | 'down') => void;
  reorderSections: (pageId: string, sections: any[]) => void;
  addSection: (pageId: string, sectionType: SectionType | string, title?: string, variant?: string) => void;
  deleteSection: (pageId: string, sectionId: string) => void;
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
    const firstPageId = website?.pages?.[0]?.id || null;
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

  setIsDirty: (isDirty) => {
    set({ isDirty });
  },

  updateTheme: (themeUpdate) => {
    const current = get().website;
    if (!current) return;
    const updated = updateDocumentTheme(current, themeUpdate);
    set({ website: updated, isDirty: true });
  },

  updateBusiness: (businessUpdate) => {
    const current = get().website;
    if (!current) return;
    const updated = updateDocumentBusiness(current, businessUpdate);
    set({ website: updated, isDirty: true });
  },

  updateWebsiteMeta: (meta) => {
    const current = get().website;
    if (!current) return;
    const updated = updateDocumentMeta(current, meta);
    set({ website: updated, isDirty: true });
  },

  updatePage: (pageId, update) => {
    const current = get().website;
    if (!current) return;
    const updated = updateDocumentPage(current, pageId, update);
    set({ website: updated, isDirty: true });
  },

  addPage: (page) => {
    const current = get().website;
    if (!current) return;
    const updated = addDocumentPage(current, page);
    const newPage = updated.pages[updated.pages.length - 1];
    set({
      website: updated,
      activePageId: newPage.id,
      activeSectionId: null,
      isDirty: true,
    });
  },

  deletePage: (pageId) => {
    const current = get().website;
    if (!current) return;
    const updated = deleteDocumentPage(current, pageId);
    set({
      website: updated,
      activePageId: updated.pages[0]?.id || null,
      activeSectionId: null,
      isDirty: true,
    });
  },

  updateSectionConfig: (pageId, sectionId, config) => {
    const current = get().website;
    if (!current) return;
    const updated = updateDocumentSectionProps(current, pageId, sectionId, config);
    set({ website: updated, isDirty: true });
  },

  changeSectionVariant: (pageId, sectionId, variant) => {
    const current = get().website;
    if (!current) return;
    const updated = changeDocumentSectionVariant(current, pageId, sectionId, variant);
    set({ website: updated, isDirty: true });
  },

  toggleSection: (pageId, sectionId) => {
    const current = get().website;
    if (!current) return;
    const updated = toggleDocumentSection(current, pageId, sectionId);
    set({ website: updated, isDirty: true });
  },

  moveSection: (pageId, index, direction) => {
    const current = get().website;
    if (!current) return;
    const updated = moveDocumentSection(current, pageId, index, direction);
    set({ website: updated, isDirty: true });
  },

  reorderSections: (pageId, sections) => {
    const current = get().website;
    if (!current) return;
    const updated = reorderDocumentSections(current, pageId, sections);
    set({ website: updated, isDirty: true });
  },

  addSection: (pageId, sectionType, title, variant) => {
    const current = get().website;
    if (!current) return;
    const normalizedType = sectionType.toLowerCase() as SectionType;
    const metadata = SECTION_METADATA_MAP[normalizedType];
    const defaultProps = metadata?.defaultProps || {};
    const defaultVariant = variant || metadata?.defaultVariant || 'default';

    const { document: updated, newSectionId } = addDocumentSection(current, pageId, {
      type: normalizedType,
      variant: defaultVariant,
      title: title || metadata?.name || sectionType,
      props: defaultProps,
    });

    set({
      website: updated,
      activeSectionId: newSectionId,
      isDirty: true,
    });
  },

  deleteSection: (pageId, sectionId) => {
    const current = get().website;
    if (!current) return;
    const updated = deleteDocumentSection(current, pageId, sectionId);
    set({
      website: updated,
      activeSectionId: get().activeSectionId === sectionId ? null : get().activeSectionId,
      isDirty: true,
    });
  },
}));
