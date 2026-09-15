import { cmsApi } from '@/lib/api/cms';
import {
  CmsRenderPayload,
  collectCmsSlugsFromDocument,
} from '@/lib/cms/bindings';
import { WebsiteDocumentV3 } from '@/types/v3-document';

/** Load published CMS records for editor preview / canvas bindings. */
export async function loadCmsRenderPayload(
  websiteId: string,
  document?: WebsiteDocumentV3 | null,
): Promise<CmsRenderPayload> {
  await cmsApi.bootstrap(websiteId).catch(() => undefined);
  const collections = await cmsApi.listCollections(websiteId);
  const wanted = new Set(collectCmsSlugsFromDocument(document));
  const targets = wanted.size
    ? collections.filter((item) => wanted.has(item.slug))
    : collections;

  const payload: CmsRenderPayload = { collections: [], media: {} };

  await Promise.all(
    targets.map(async (collection) => {
      const page = await cmsApi.listRecords(websiteId, collection.id, {
        status: 'PUBLISHED',
        page: 1,
        pageSize: collection.settings?.publicListLimit || 24,
        sort: 'sortOrder',
        order: 'asc',
      });
      payload.collections.push({
        id: collection.id,
        slug: collection.slug,
        name: collection.name,
        fields: collection.fields.map((field) => ({
          id: field.id,
          name: field.name,
          type: field.type,
        })),
        records: page.data,
      });
    }),
  );

  return payload;
}

export function normalizePublicCmsPayload(raw: unknown): CmsRenderPayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as {
    collections?: Array<{
      id: string;
      slug: string;
      name: string;
      records?: unknown[];
      fields?: Array<{ id: string; name: string; type: string }>;
      media?: Record<string, { url: string; altText?: string | null; mimeType?: string | null }>;
    }>;
  };
  if (!Array.isArray(data.collections)) return { collections: [] };

  const media: CmsRenderPayload['media'] = {};
  const collections = data.collections.map((collection) => {
    if (collection.media) Object.assign(media, collection.media);
    return {
      id: collection.id,
      slug: collection.slug,
      name: collection.name,
      fields: collection.fields,
      records: Array.isArray(collection.records) ? (collection.records as any) : [],
      media: collection.media,
    };
  });
  return { collections, media };
}
