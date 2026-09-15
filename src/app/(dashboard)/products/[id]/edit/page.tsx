'use client';

import { useParams } from 'next/navigation';
import { ProductEditorScreen } from '@/components/kdba/product-editor-screen';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  return <ProductEditorScreen productId={params.id} />;
}
