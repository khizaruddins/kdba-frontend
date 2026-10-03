import * as React from 'react';
import { PageHeader } from '@/components/kdba/page-header';
import { NavigationBuilder } from '@/components/website/navigation-builder';

export default function NavigationPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Navigation Builder"
        description="Manage your website's header navigation. Drag and drop to reorder items."
      />
      <NavigationBuilder />
    </div>
  );
}
