import { TagsManager } from '@/components/cms/tags-manager';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tags | KDBA',
};

export default function TagsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <TagsManager />
        </div>
      </div>
    </div>
  );
}
