'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Plus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import { Product, ProductStats } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { discountPercent, productNumber } from '@/lib/workspace';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/kdba/page-header';
import { StatCard } from '@/components/kdba/stat-card';
import { useConfirm } from '@/components/kdba/confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const EMPTY_STATS: ProductStats = {
  total: 0,
  active: 0,
  inactive: 0,
  catalogValue: 0,
  discounted: 0,
  outOfStock: 0,
  byCategory: [],
};

export default function ProductsPage() {
  const router = useRouter();
  const { confirm, dialog } = useConfirm();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [stats, setStats] = React.useState<ProductStats>(EMPTY_STATS);
  const [search, setSearch] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    try {
      const [list, nextStats] = await Promise.all([
        apiClient.get('/products'),
        apiClient.get('/products/stats').catch(() => EMPTY_STATS),
      ]);
      setProducts(Array.isArray(list) ? list : []);
      if (nextStats && typeof nextStats === 'object') setStats(nextStats as unknown as ProductStats);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const filtered = products.filter((product) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [product.name, product.sku, product.category, product.brand]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(q));
  });

  const handleDelete = (id: string) => {
    confirm({
      title: 'Delete this product?',
      description: 'It will be removed from your catalog and website listings.',
      confirmLabel: 'Delete product',
      destructive: true,
      onConfirm: async () => {
        await apiClient.delete(`/products/${id}`);
        toast.success('Product deleted');
        await load();
      },
    });
  };

  return (
    <div className="space-y-6">
      {dialog}
      <PageHeader
        title="Products"
        description="Catalog items that can appear on published websites."
        actions={
          <Button size="sm" asChild>
            <Link href="/products/new">
              <Plus />
              Add product
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Catalog value" value={formatCurrency(stats.catalogValue)} loading={isLoading} />
        <StatCard title="Active products" value={stats.active} loading={isLoading} />
        <StatCard title="Discounted" value={stats.discounted} loading={isLoading} />
        <StatCard title="Out of stock" value={stats.outOfStock} loading={isLoading} />
      </div>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              className="sm:max-w-xs"
              placeholder="Search products…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag className="h-8 w-8 text-muted-foreground" />}
              title={search ? 'No matching products' : 'No products yet'}
              description={
                search
                  ? 'Try a different name, SKU, or category.'
                  : 'Add your first item to display it in website product sections.'
              }
              actionLabel={search ? undefined : 'Add product'}
              onAction={search ? undefined : () => router.push('/products/new')}
              className="min-h-0 border-0 bg-transparent"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((product) => {
                  const discount = discountPercent(product.price, product.compareAtPrice);
                  const out = product.stock === 0;
                  return (
                    <TableRow
                      key={product.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt=""
                              className="size-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                              <ShoppingBag className="size-4 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.sku || 'No SKU'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.category || 'Uncategorized'}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(productNumber(product.price), product.currency || 'USD')}
                        </div>
                        {discount != null ? (
                          <p className="text-xs text-emerald-600">↓ {discount}%</p>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {product.stock == null ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          product.stock
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={out ? 'warning' : product.isActive ? 'success' : 'secondary'}>
                          {out ? 'Out of stock' : product.isActive ? 'Active' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
                            <DropdownMenuItem onClick={() => router.push(`/products/${product.id}`)}>
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/products/${product.id}/edit`)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDelete(product.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
