'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { PublicSiteView } from '@/components/renderer/PublicSiteView';

export default function PublicSiteHomePage() {
  const params = useParams();
  const tenantSlug = params?.tenantSlug as string;
  return <PublicSiteView tenantSlug={tenantSlug} />;
}
