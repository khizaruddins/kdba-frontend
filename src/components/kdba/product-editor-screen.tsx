'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/kdba/page-header';
import {
  EMPTY_PRODUCT_FORM,
  ProductForm,
  ProductFormValues,
  payloadFromValues,
  valuesFromProduct,
} from '@/components/kdba/product-form';

export function ProductEditorScreen({ productId }: { productId?: string }) {
  const router = useRouter();
  const [values, setValues] = React.useState<ProductFormValues>(EMPTY_PRODUCT_FORM);
  const [isLoading, setIsLoading] = React.useState(Boolean(productId));
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!productId) return;
    apiClient
      .get(`/products/${productId}`)
      .then((data) => setValues(valuesFromProduct(data as unknown as Product)))
      .catch(() => toast.error('Could not load this product'))
      .finally(() => setIsLoading(false));
  }, [productId]);

  const save = async (isActive: boolean) => {
    if (!values.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setIsSubmitting(true);
    const payload = { ...payloadFromValues(values), isActive };
    try {
      if (productId) {
        await apiClient.patch(`/products/${productId}`, payload);
        toast.success(isActive ? 'Product published' : 'Draft saved');
        router.push(`/products/${productId}`);
      } else {
        const created = (await apiClient.post('/products', payload)) as unknown as Product;
        toast.success(isActive ? 'Product published' : 'Draft saved');
        router.push(`/products/${created.id}`);
      }
    } catch {
      toast.error('Could not save the product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={productId ? 'Edit product' : 'Add products'}
        description="Catalog items appear on published website product sections."
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => router.push(productId ? `/products/${productId}` : '/products')}>
              <ArrowLeft />
              Discard
            </Button>
            <Button variant="outline" size="sm" disabled={isSubmitting || isLoading} onClick={() => save(false)}>
              Save draft
            </Button>
            <Button size="sm" disabled={isSubmitting || isLoading} isLoading={isSubmitting} onClick={() => save(true)}>
              Publish
            </Button>
          </>
        }
      />
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading product…</p>
      ) : (
        <ProductForm values={values} onChange={setValues} />
      )}
    </div>
  );
}
