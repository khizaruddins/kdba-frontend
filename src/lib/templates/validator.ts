// =============================================================================
// KDBA V2 — Template & Document Runtime Validator
// =============================================================================

import { TEMPLATES_DEFINITIONS } from './definitions';
import { SECTION_REGISTRY, resolveSectionComponent } from '@/components/renderer/registry';
import { WebsiteDocument, SectionDocument } from '@/types';

export interface ValidationIssue {
  templateId: string;
  pageId?: string;
  sectionId?: string;
  sectionType?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  totalTemplates: number;
  totalSectionsChecked: number;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

/**
 * Validates a single section against the component registry.
 */
export function validateSection(
  section: SectionDocument | Record<string, any>,
  templateId: string,
  pageId: string,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!section.type) {
    issues.push({
      templateId,
      pageId,
      sectionId: section.id,
      message: 'Section is missing a "type" field.',
      severity: 'error',
    });
    return issues;
  }

  const component = resolveSectionComponent(section.type);
  if (!component) {
    issues.push({
      templateId,
      pageId,
      sectionId: section.id,
      sectionType: section.type,
      message: `Unknown section type "${section.type}". Not registered in SECTION_REGISTRY.`,
      severity: 'error',
    });
  }

  return issues;
}

/**
 * Validates an entire WebsiteDocument.
 */
export function validateDocument(
  doc: WebsiteDocument,
  templateId: string = 'user_document',
): { isValid: boolean; errors: ValidationIssue[]; warnings: ValidationIssue[] } {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  if (!doc.id || !doc.name) {
    errors.push({
      templateId,
      message: 'Document missing id or name.',
      severity: 'error',
    });
  }

  if (!Array.isArray(doc.pages) || doc.pages.length === 0) {
    errors.push({
      templateId,
      message: 'Document contains no pages.',
      severity: 'error',
    });
  } else {
    for (const page of doc.pages) {
      if (Array.isArray(page.sections)) {
        for (const section of page.sections) {
          const sectionIssues = validateSection(section, templateId, page.id);
          errors.push(...sectionIssues.filter((i) => i.severity === 'error'));
          warnings.push(...sectionIssues.filter((i) => i.severity === 'warning'));
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates all 20 predefined templates.
 */
export function validateAllTemplates(): ValidationResult {
  const allErrors: ValidationIssue[] = [];
  const allWarnings: ValidationIssue[] = [];
  let totalSections = 0;

  for (const tpl of TEMPLATES_DEFINITIONS) {
    const doc = tpl.document;
    if (doc?.pages) {
      for (const page of doc.pages) {
        if (page.sections) {
          totalSections += page.sections.length;
          for (const sec of page.sections) {
            const issues = validateSection(sec, tpl.id, page.id);
            allErrors.push(...issues.filter((i) => i.severity === 'error'));
            allWarnings.push(...issues.filter((i) => i.severity === 'warning'));
          }
        }
      }
    }
  }

  return {
    isValid: allErrors.length === 0,
    totalTemplates: TEMPLATES_DEFINITIONS.length,
    totalSectionsChecked: totalSections,
    errors: allErrors,
    warnings: allWarnings,
  };
}
