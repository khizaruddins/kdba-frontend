'use client';

import { Badge } from '@/components/ui/badge';
import { CmsRecordStatus } from '@/types/cms';

export function RecordStatusBadge({ status }: { status: CmsRecordStatus | string }) {
  if (status === 'PUBLISHED') return <Badge variant="success">Published</Badge>;
  if (status === 'ARCHIVED') return <Badge variant="secondary">Archived</Badge>;
  return <Badge variant="outline">Draft</Badge>;
}
