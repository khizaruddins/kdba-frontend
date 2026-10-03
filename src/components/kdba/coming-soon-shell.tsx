import * as React from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/kdba/page-header';

interface ComingSoonShellProps {
  title: string;
  description: string;
}

export function ComingSoonShell({ title, description }: ComingSoonShellProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <EmptyState
        icon={<Sparkles className="size-6 text-muted-foreground" />}
        title="Coming Soon"
        description="This feature is under active development and will be available shortly."
      />
    </div>
  );
}
