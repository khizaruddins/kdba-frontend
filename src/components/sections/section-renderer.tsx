'use client';

import * as React from 'react';
import { SectionRenderer as V2SectionRenderer } from '../renderer/SectionRenderer';
import { ThemeConfig, Business, Product, PricingPlan } from '@/types';

export interface SectionProps {
  id?: string;
  config: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<Business> | null;
  products?: Product[];
  pricingPlans?: PricingPlan[];
  isEditing?: boolean;
  tenantSlug?: string;
  onNavigate?: (url: string) => void;
}

export interface SectionRendererProps extends SectionProps {
  type: string;
}

export function SectionRenderer({ type, config, ...props }: SectionRendererProps) {
  const section = {
    id: props.id || 'sec_legacy',
    type,
    variant: config?.variant || 'default',
    enabled: true,
    props: config || {},
  };

  return <V2SectionRenderer section={section} {...(props as any)} />;
}
