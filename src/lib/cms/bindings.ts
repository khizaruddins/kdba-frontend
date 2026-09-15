import { CmsRecord } from '@/types/cms';
import { NodeBinding, WebsiteDocumentV3, WebsiteNode } from '@/types/v3-document';

export interface CmsRenderMedia {
  url: string;
  altText?: string | null;
  mimeType?: string | null;
}

export interface CmsRenderCollection {
  id: string;
  slug: string;
  name: string;
  records: CmsRecord[];
  fields?: Array<{ id: string; name: string; type: string }>;
  media?: Record<string, CmsRenderMedia>;
}

export interface CmsRenderPayload {
  collections: CmsRenderCollection[];
  media?: Record<string, CmsRenderMedia>;
}

function mediaMap(cms: CmsRenderPayload | null | undefined, collectionSlug?: string) {
  const fromCollection = collectionSlug
    ? cms?.collections.find((item) => item.slug === collectionSlug)?.media
    : undefined;
  return { ...(cms?.media || {}), ...(fromCollection || {}) };
}

export function resolveCmsMediaValue(
  value: unknown,
  cms: CmsRenderPayload | null | undefined,
  collectionSlug?: string,
): string | undefined {
  if (value == null) return undefined;
  if (typeof value === 'string') {
    if (value.startsWith('http') || value.startsWith('/') || value.startsWith('data:')) {
      return value;
    }
    const map = mediaMap(cms, collectionSlug);
    return map[value]?.url || value;
  }
  if (Array.isArray(value)) {
    const first = value.find((item) => typeof item === 'string');
    return resolveCmsMediaValue(first, cms, collectionSlug);
  }
  if (typeof value === 'object' && value && 'url' in value) {
    const url = (value as { url?: unknown }).url;
    return typeof url === 'string' ? url : undefined;
  }
  return undefined;
}

export function getBoundValue(
  binding: NodeBinding | undefined,
  document: WebsiteDocumentV3,
  cms: CmsRenderPayload | null | undefined,
  record?: CmsRecord | null,
): unknown {
  if (!binding) return undefined;

  if (binding.source === 'business') {
    const business = document.business as unknown as Record<string, unknown> | undefined;
    const value = binding.field ? business?.[binding.field] : undefined;
    return value ?? binding.fallback;
  }

  if (binding.source === 'record') {
    const collection = cms?.collections.find((item) => item.slug === binding.collection);
    const found =
      collection?.records.find((item) => item.slug === binding.recordSlug) ||
      record ||
      collection?.records[0];
    const value = binding.field ? found?.data?.[binding.field] : undefined;
    const media = resolveCmsMediaValue(value, cms, binding.collection);
    if (media && value !== media) return media;
    return value ?? binding.fallback;
  }

  if (binding.source === 'collection') {
    const value = binding.field ? record?.data?.[binding.field] : undefined;
    const media = resolveCmsMediaValue(value, cms, binding.collection);
    if (media && value !== media) return media;
    return value ?? binding.fallback;
  }

  return binding.fallback;
}

export function applyBindingToProps(
  node: WebsiteNode,
  document: WebsiteDocumentV3,
  cms: CmsRenderPayload | null | undefined,
  record?: CmsRecord | null,
): Record<string, unknown> {
  const props = { ...(node.props || {}) };
  const value = getBoundValue(node.binding, document, cms, record);
  if (value === undefined || value === null) return props;

  if (node.type === 'image' || node.type === 'logo' || node.type === 'background-media') {
    props.src = String(value);
    props.url = String(value);
    return props;
  }

  if (node.type === 'button' || node.type === 'link') {
    if (node.binding?.field === 'href' || node.binding?.field === 'url') {
      props.href = String(value);
    } else {
      props.label = String(value);
      props.text = String(value);
    }
    return props;
  }

  props.text = String(value);
  props.content = String(value);
  return props;
}

export function recordsForList(
  node: WebsiteNode,
  cms: CmsRenderPayload | null | undefined,
): CmsRecord[] {
  if (!node.props?.cmsList) return [];
  const slug = String(node.props.collectionSlug || '');
  const limit = Number(node.props.limit || 6);
  const collection = cms?.collections.find((item) => item.slug === slug);
  return (collection?.records || []).slice(0, Math.max(1, limit));
}

export function resolveRecordFieldDisplay(
  record: CmsRecord,
  fieldIds: string[],
  cms: CmsRenderPayload | null | undefined,
  collectionSlug?: string,
): string {
  for (const fieldId of fieldIds) {
    const raw = record.data?.[fieldId];
    const media = resolveCmsMediaValue(raw, cms, collectionSlug);
    if (media) return media;
    if (typeof raw === 'string' && raw.trim()) return raw;
    if (typeof raw === 'number') return String(raw);
  }
  return '';
}

export function collectCmsSlugsFromDocument(document: WebsiteDocumentV3 | null | undefined): string[] {
  if (!document) return [];
  const slugs = new Set<string>();
  for (const page of document.pages || []) {
    if (page.collection?.slug) slugs.add(page.collection.slug);
  }
  const walk = (node: WebsiteNode | undefined) => {
    if (!node) return;
    if (node.binding?.collection) slugs.add(node.binding.collection);
    if (node.props?.cmsList && typeof node.props.collectionSlug === 'string') {
      slugs.add(node.props.collectionSlug);
    }
    (node.children || []).forEach(walk);
  };
  for (const page of document.pages || []) walk(page.root);
  walk(document.global?.headerNode);
  walk(document.global?.footerNode);
  return [...slugs];
}
