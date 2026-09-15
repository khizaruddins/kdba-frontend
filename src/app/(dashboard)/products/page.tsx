'use client';

import * as React from 'react';
import { apiClient } from '@/lib/api/client';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { MediaPickerModal } from '@/components/ui/media-picker-modal';
import { PageHeader } from '@/components/kdba/page-header';
import { useConfirm } from '@/components/kdba/confirm-dialog';

export default function ProductsPage() {
  const { confirm, dialog } = useConfirm();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    imageUrl: '',
    category: '',
    ctaText: 'Buy Now',
    ctaUrl: '#contact',
    isActive: true,
  });

  const loadProducts = async () => {
    try {
      const data: any = await apiClient.get('/products');
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadProducts();
  }, []);

  const openCreateDialog = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 29.99,
      currency: 'USD',
      imageUrl: '',
      category: 'General',
      ctaText: 'Order Now',
      ctaUrl: '#contact',
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: Number(product.price),
      currency: product.currency || 'USD',
      imageUrl: product.imageUrl || '',
      category: product.category || '',
      ctaText: product.ctaText || 'Buy Now',
      ctaUrl: product.ctaUrl || '#contact',
      isActive: product.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await apiClient.patch(`/products/${editingProduct.id}`, formData);
      } else {
        await apiClient.post('/products', formData);
      }
      setIsDialogOpen(false);
      loadProducts();
    } catch (err) {
      console.error('Failed to save product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    confirm({
      title: 'Delete this product?',
      description: 'It will be removed from your catalog and website listings.',
      confirmLabel: 'Delete product',
      destructive: true,
      onConfirm: async () => {
        await apiClient.delete(`/products/${id}`);
        toast.success('Product deleted');
        await loadProducts();
      },
    });
  };

  return (
    <div className="flex-1 space-y-6">
      {dialog}
      <PageHeader
        title="Products"
        description="Catalog items that can appear on published websites."
        actions={
          <Button size="sm" onClick={openCreateDialog}>
            <Plus />
            Add product
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex space-x-4 items-center">
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag className="h-8 w-8 text-muted-foreground" />}
              title="No products yet"
              description="Add your first item to display it automatically in your website's products and menu sections."
              actionLabel="Add First Product"
              onAction={openCreateDialog}
              className="border-0 bg-transparent rounded-none my-8"
            />
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-muted-foreground font-medium">
                <tr>
                  <th className="py-3 px-6 h-10 align-middle">Product</th>
                  <th className="py-3 px-6 h-10 align-middle">Category</th>
                  <th className="py-3 px-6 h-10 align-middle">Price</th>
                  <th className="py-3 px-6 h-10 align-middle">Status</th>
                  <th className="py-3 px-6 h-10 align-middle text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover bg-muted"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                            <ShoppingBag className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-muted-foreground">
                      {product.category || 'General'}
                    </td>

                    <td className="py-4 px-6 font-medium">
                      {formatCurrency(product.price, product.currency || 'USD')}
                    </td>

                    <td className="py-4 px-6">
                      <Badge variant={product.isActive ? 'default' : 'secondary'}>
                        {product.isActive ? 'Active' : 'Hidden'}
                      </Badge>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Product Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        description="Enter product details to display on your website."
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <Input
            label="Product / Dish Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Artisanal Sourdough Bread"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price"
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
              }
            />
            <Input
              label="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              placeholder="e.g. Bakery, Entrees"
            />
          </div>

          <Textarea
            label="Description"
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Detailed product ingredients, sizing, or description..."
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-foreground">
                Product Image
              </label>
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(true)}
                className="text-xs font-medium text-primary hover:text-primary/80 cursor-pointer"
              >
                + Choose from Media Library
              </button>
            </div>
            <Input
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              placeholder="https://... or choose from media"
              leftIcon={<ImageIcon className="h-4 w-4 text-muted-foreground" />}
            />
            {formData.imageUrl && (
              <div className="mt-2 relative h-24 w-24 rounded-md overflow-hidden border bg-muted">
                <img
                  src={formData.imageUrl}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Button Text"
              value={formData.ctaText}
              onChange={(e) =>
                setFormData({ ...formData, ctaText: e.target.value })
              }
              placeholder="Buy Now"
            />
            <Input
              label="Button Link / URL"
              value={formData.ctaUrl}
              onChange={(e) =>
                setFormData({ ...formData, ctaUrl: e.target.value })
              }
              placeholder="#contact"
            />
          </div>

          <div className="pt-2 border-t">
            <Switch
              label="Active & Visible"
              description="Make this product visible in your website catalog"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
            >
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Dialog>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => setFormData({ ...formData, imageUrl: url })}
      />
    </div>
  );
}
