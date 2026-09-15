'use client';

import * as React from 'react';
import { WebsiteDocumentV3 } from '@/types/v3-document';
import { CmsRenderPayload } from '@/lib/cms/bindings';
import { CmsRecord } from '@/types/cms';

export interface V3RenderContextValue {
  document: WebsiteDocumentV3;
  isEditing: boolean;
  viewport: 'desktop' | 'tablet' | 'mobile';
  tenantSlug?: string | null;
  cms?: CmsRenderPayload | null;
  activeRecord?: CmsRecord | null;
}

const V3RenderContext = React.createContext<V3RenderContextValue | null>(null);

export function V3RenderProvider({
  value,
  children,
}: {
  value: V3RenderContextValue;
  children: React.ReactNode;
}) {
  return <V3RenderContext.Provider value={value}>{children}</V3RenderContext.Provider>;
}

export function useV3RenderContext(): V3RenderContextValue | null {
  return React.useContext(V3RenderContext);
}
