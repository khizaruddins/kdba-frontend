import * as React from 'react';
import { PageHeader } from '@/components/kdba/page-header';
import { SeoForm } from '@/components/website/seo-form';

export default function SeoPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="SEO Settings"
        description="Manage global and per-page search engine optimization."
      />
      <SeoForm />
    </div>
  );
}
