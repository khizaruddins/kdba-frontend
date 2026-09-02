// =============================================================================
// KDBA V2 — Pure Document Mutation Functions
// =============================================================================

import {
  WebsiteDocument,
  ThemeConfig,
  BusinessInfo,
  PageDocument,
  SectionDocument,
  SectionType,
} from '@/types';

/**
 * Updates the global theme configuration of a WebsiteDocument.
 */
export function updateDocumentTheme(
  doc: WebsiteDocument,
  themeUpdate: Partial<ThemeConfig>,
): WebsiteDocument {
  return {
    ...doc,
    theme: {
      ...doc.theme,
      ...themeUpdate,
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Updates centralized business information.
 */
export function updateDocumentBusiness(
  doc: WebsiteDocument,
  businessUpdate: Partial<BusinessInfo>,
): WebsiteDocument {
  return {
    ...doc,
    business: {
      ...doc.business,
      ...businessUpdate,
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Updates root SEO and site meta settings.
 */
export function updateDocumentMeta(
  doc: WebsiteDocument,
  metaUpdate: { name?: string; seoTitle?: string; seoDescription?: string; favicon?: string | null },
): WebsiteDocument {
  return {
    ...doc,
    ...metaUpdate,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Updates a specific page's metadata or settings.
 */
export function updateDocumentPage(
  doc: WebsiteDocument,
  pageId: string,
  pageUpdate: Partial<PageDocument>,
): WebsiteDocument {
  return {
    ...doc,
    pages: doc.pages.map((p) => (p.id === pageId ? { ...p, ...pageUpdate } : p)),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Adds a new page to the document.
 */
export function addDocumentPage(
  doc: WebsiteDocument,
  page: { title: string; slug: string; sections?: SectionDocument[]; seoTitle?: string; seoDescription?: string; id?: string },
): WebsiteDocument {
  const newPageId = page.id || `page_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const newPage: PageDocument = {
    id: newPageId,
    title: page.title || 'New Page',
    slug: page.slug || `/page-${doc.pages.length + 1}`,
    sortOrder: doc.pages.length,
    isActive: true,
    sections: page.sections || [],
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
  };

  return {
    ...doc,
    pages: [...doc.pages, newPage],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Deletes a page from the document.
 */
export function deleteDocumentPage(
  doc: WebsiteDocument,
  pageId: string,
): WebsiteDocument {
  // Prevent deleting the only page
  if (doc.pages.length <= 1) return doc;

  return {
    ...doc,
    pages: doc.pages.filter((p) => p.id !== pageId),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Updates props for a specific section on a page.
 */
export function updateDocumentSectionProps(
  doc: WebsiteDocument,
  pageId: string,
  sectionId: string,
  propsUpdate: Record<string, any>,
): WebsiteDocument {
  return {
    ...doc,
    pages: doc.pages.map((p) => {
      if (p.id !== pageId) return p;
      return {
        ...p,
        sections: p.sections.map((s) => {
          if (s.id !== sectionId) return s;
          return {
            ...s,
            props: {
              ...s.props,
              ...propsUpdate,
            },
          };
        }),
      };
    }),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Changes the active variant of a section while preserving compatible props.
 */
export function changeDocumentSectionVariant(
  doc: WebsiteDocument,
  pageId: string,
  sectionId: string,
  variant: string,
): WebsiteDocument {
  return {
    ...doc,
    pages: doc.pages.map((p) => {
      if (p.id !== pageId) return p;
      return {
        ...p,
        sections: p.sections.map((s) => {
          if (s.id !== sectionId) return s;
          return {
            ...s,
            variant,
          };
        }),
      };
    }),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Toggles a section's enabled/visible status.
 */
export function toggleDocumentSection(
  doc: WebsiteDocument,
  pageId: string,
  sectionId: string,
): WebsiteDocument {
  return {
    ...doc,
    pages: doc.pages.map((p) => {
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
    }),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Moves a section up or down in the section array.
 */
export function moveDocumentSection(
  doc: WebsiteDocument,
  pageId: string,
  index: number,
  direction: 'up' | 'down',
): WebsiteDocument {
  return {
    ...doc,
    pages: doc.pages.map((p) => {
      if (p.id !== pageId) return p;
      const sections = [...p.sections];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= sections.length) return p;

      const [moved] = sections.splice(index, 1);
      sections.splice(targetIndex, 0, moved);

      return {
        ...p,
        sections: sections.map((s, idx) => ({ ...s, sortOrder: idx })),
      };
    }),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Reorders all sections of a page.
 */
export function reorderDocumentSections(
  doc: WebsiteDocument,
  pageId: string,
  sections: SectionDocument[],
): WebsiteDocument {
  return {
    ...doc,
    pages: doc.pages.map((p) => {
      if (p.id !== pageId) return p;
      return {
        ...p,
        sections: sections.map((s, idx) => ({ ...s, sortOrder: idx })),
      };
    }),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Adds a new section to a specific page.
 */
export function addDocumentSection(
  doc: WebsiteDocument,
  pageId: string,
  section: {
    type: SectionType | string;
    variant?: string;
    title?: string;
    props?: Record<string, any>;
  },
): { document: WebsiteDocument; newSectionId: string } {
  const newSectionId = `sec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const newSection: SectionDocument = {
    id: newSectionId,
    type: section.type,
    variant: section.variant || 'default',
    enabled: true,
    sortOrder: 0,
    props: section.props || {},
  };

  const document: WebsiteDocument = {
    ...doc,
    pages: doc.pages.map((p) => {
      if (p.id !== pageId) return p;
      const sections = [...p.sections];
      // Insert before footer if present, otherwise append
      const footerIndex = sections.findIndex(
        (s) => s.type.toLowerCase() === 'footer',
      );
      if (footerIndex !== -1) {
        sections.splice(footerIndex, 0, newSection);
      } else {
        sections.push(newSection);
      }
      return {
        ...p,
        sections: sections.map((s, idx) => ({ ...s, sortOrder: idx })),
      };
    }),
    updatedAt: new Date().toISOString(),
  };

  return { document, newSectionId };
}

/**
 * Deletes a section from a page.
 */
export function deleteDocumentSection(
  doc: WebsiteDocument,
  pageId: string,
  sectionId: string,
): WebsiteDocument {
  return {
    ...doc,
    pages: doc.pages.map((p) => {
      if (p.id !== pageId) return p;
      return {
        ...p,
        sections: p.sections.filter((s) => s.id !== sectionId),
      };
    }),
    updatedAt: new Date().toISOString(),
  };
}
