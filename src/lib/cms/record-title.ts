import { CmsRecord } from '@/types/cms';

export function recordTitle(record: CmsRecord): string {
  const data = record.data || {};
  for (const key of ['title', 'name', 'question', 'quote', 'authorName']) {
    const value = data[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  if (record.slug) return record.slug;
  return record.id.slice(0, 8);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
