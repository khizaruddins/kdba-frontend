import { AuthorsManager } from '@/components/cms/authors-manager';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authors | KDBA',
};

export default function AuthorsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <AuthorsManager />
        </div>
      </div>
    </div>
  );
}
