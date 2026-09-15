'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { PublicSiteView } from '@/components/renderer/PublicSiteView';

export default function PublicSitePathPage() {
  const params = useParams();
  const tenantSlug = params?.tenantSlug as string;
  const path = params?.path;
  const pathSegments = Array.isArray(path) ? path.map(String) : path ? [String(path)] : [];
  return <PublicSiteView tenantSlug={tenantSlug} pathSegments={pathSegments} />;
}
