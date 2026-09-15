'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, ShoppingBag, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import { Product } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { discountPercent, productNumber } from '@/lib/workspace';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/kdba/page-header';
import { StatCard } from '@/components/kdba/stat-card';
import { useConfirm } from '@/components/kdba/confirm-dialog';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { confirm, dialog } = useConfirm();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!params.id) return;
    apiClient
      .get(`/products/${params.id}`)
      .then((data) => setProduct(data as unknown as Product))
      .catch(() => toast.error('Product not found'))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  const handleDelete = () => {
    if (!product) return;
    confirm({
      title: 'Delete this product?',
      description: 'It will be removed from your catalog and website listings.',
      confirmLabel: 'Delete product',
      destructive: true,
      onConfirm: async () => {
        await apiClient.delete(`/products/${product.id}`);
        toast.success('Product deleted');
        router.push('/products');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">This product could not be loaded.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/products">Back to products</Link>
        </Button>
      </div>
    );
  }

  const price = productNumber(product.price);
  const discount = discountPercent(product.price, product.compareAtPrice);

  return (
    <div className="space-y-6">
      {dialog}
      <PageHeader
        title={product.name}
        description={`${product.brand || 'No brand'} · ${product.sku || 'No SKU'} · updated ${formatDate(product.updatedAt)}`}
        actions={
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/products">
                <ArrowLeft />
                Products
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/products/${product.id}/edit`}>
                <Pencil />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 />
              Delete
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Card>
          <CardContent className="pt-4">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="aspect-square w-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-xl bg-muted">
                <ShoppingBag className="size-12 text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard title="Price" value={formatCurrency(price, product.currency || 'USD')} />
            <StatCard
              title="Compare-at"
              value={
                product.compareAtPrice
                  ? formatCurrency(productNumber(product.compareAtPrice), product.currency || 'USD')
                  : '—'
              }
              description={discount != null ? `${discount}% off` : undefined}
            />
            <StatCard title="Stock" value={product.stock == null ? 'Not tracked' : product.stock} />
            <StatCard
              title="Status"
              value={product.isActive ? 'Active' : 'Draft'}
              description={product.category || 'Uncategorized'}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="whitespace-pre-wrap text-muted-foreground">
                {product.description || 'No description yet.'}
              </p>
              <dl className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="font-medium">{product.category || '—'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Brand</dt>
                  <dd className="font-medium">{product.brand || '—'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">SKU</dt>
                  <dd className="font-medium">{product.sku || '—'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Listing</dt>
                  <dd>
                    <Badge variant={product.stock === 0 ? 'warning' : product.isActive ? 'success' : 'secondary'}>
                      {product.stock === 0 ? 'Out of stock' : product.isActive ? 'Active' : 'Draft'}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
