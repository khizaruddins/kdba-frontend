import { CategoriesManager } from '@/components/cms/categories-manager';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories | KDBA',
};

export default function CategoriesPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <CategoriesManager />
        </div>
      </div>
    </div>
  );
}
