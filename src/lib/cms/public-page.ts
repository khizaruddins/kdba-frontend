import { PageDocumentV3, WebsiteDocumentV3 } from '@/types/v3-document';
import { CmsRecord } from '@/types/cms';
import { CmsRenderPayload } from '@/lib/cms/bindings';

function normalizePath(path: string): string {
  if (!path || path === '/') return '/';
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  return withSlash.replace(/\/+$/, '') || '/';
}

function patternToRegex(pattern: string): RegExp {
  const escaped = normalizePath(pattern)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/:slug/g, '([^/]+)');
  return new RegExp(`^${escaped}$`);
}

export interface ResolvedPublicPage {
  page: PageDocumentV3;
  recordSlug?: string;
  activeRecord?: CmsRecord | null;
}

export function resolvePublicPage(
  document: WebsiteDocumentV3,
  path: string,
  cms?: CmsRenderPayload | null,
): ResolvedPublicPage | null {
  const normalized = normalizePath(path);
  const pages = [...(document.pages || [])].filter((page) => page.enabled !== false);

  const exact = pages.find((page) => normalizePath(page.slug) === normalized);
  if (exact && exact.kind !== 'collection-item') {
    return { page: exact };
  }

  for (const page of pages) {
    if (page.kind !== 'collection-item') continue;
    const pattern = page.slug.includes(':slug')
      ? page.slug
      : `${normalizePath(page.slug)}/:slug`;
    const match = normalized.match(patternToRegex(pattern));
    if (!match) continue;
    const recordSlug = match[1];
    const collectionSlug = page.collection?.slug;
    const record =
      (collectionSlug &&
        cms?.collections
          .find((item) => item.slug === collectionSlug)
          ?.records.find((item) => item.slug === recordSlug)) ||
      null;
    return { page, recordSlug, activeRecord: record };
  }

  if (exact) return { page: exact };
  return null;
}

export function withBusinessOnDocument(
  document: WebsiteDocumentV3,
  business: Record<string, unknown> | null | undefined,
): WebsiteDocumentV3 {
  if (!business) return document;
  return {
    ...document,
    business: {
      ...(document.business || {}),
      ...business,
    },
  };
}
