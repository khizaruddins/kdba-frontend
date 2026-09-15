'use client';

import * as React from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';
import { Product } from '@/types';
import { productNumber } from '@/lib/workspace';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MediaPickerModal } from '@/components/ui/media-picker-modal';

export type ProductFormValues = {
  name: string;
  sku: string;
  brand: string;
  category: string;
  description: string;
  imageUrl: string;
  price: string;
  compareAtPrice: string;
  currency: string;
  stock: string;
  ctaText: string;
  ctaUrl: string;
  isActive: boolean;
};

export const EMPTY_PRODUCT_FORM: ProductFormValues = {
  name: '',
  sku: '',
  brand: '',
  category: '',
  description: '',
  imageUrl: '',
  price: '',
  compareAtPrice: '',
  currency: 'USD',
  stock: '',
  ctaText: 'Order Now',
  ctaUrl: '#contact',
  isActive: true,
};

export function valuesFromProduct(product: Product): ProductFormValues {
  return {
    name: product.name,
    sku: product.sku || '',
    brand: product.brand || '',
    category: product.category || '',
    description: product.description || '',
    imageUrl: product.imageUrl || '',
    price: String(productNumber(product.price) || ''),
    compareAtPrice:
      product.compareAtPrice == null ? '' : String(productNumber(product.compareAtPrice)),
    currency: product.currency || 'USD',
    stock: product.stock == null ? '' : String(product.stock),
    ctaText: product.ctaText || 'Order Now',
    ctaUrl: product.ctaUrl || '#contact',
    isActive: product.isActive,
  };
}

function optionalNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function payloadFromValues(values: ProductFormValues) {
  return {
    name: values.name.trim(),
    sku: values.sku.trim() || null,
    brand: values.brand.trim() || null,
    category: values.category.trim() || null,
    description: values.description.trim() || null,
    imageUrl: values.imageUrl.trim() || null,
    price: Number(values.price) || 0,
    compareAtPrice: optionalNumber(values.compareAtPrice),
    currency: values.currency || 'USD',
    stock: optionalNumber(values.stock),
    ctaText: values.ctaText.trim() || null,
    ctaUrl: values.ctaUrl.trim() || null,
    isActive: values.isActive,
  };
}

export function ProductForm({
  values,
  onChange,
}: {
  values: ProductFormValues;
  onChange: (next: ProductFormValues) => void;
}) {
  const [mediaOpen, setMediaOpen] = React.useState(false);
  const patch = (partial: Partial<ProductFormValues>) => onChange({ ...values, ...partial });

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Name"
                required
                value={values.name}
                onChange={(event) => patch({ name: event.target.value })}
                placeholder="Acme Prism T-Shirt"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="SKU"
                  value={values.sku}
                  onChange={(event) => patch({ sku: event.target.value })}
                  placeholder="WH1000XM4"
                />
                <Input
                  label="Brand"
                  value={values.brand}
                  onChange={(event) => patch({ brand: event.target.value })}
                  placeholder="Acme"
                />
              </div>
              <Textarea
                label="Description"
                rows={5}
                value={values.description}
                onChange={(event) => patch({ description: event.target.value })}
                placeholder="What customers should know about this item."
                helperText="Shown on the live website catalog when this product is published."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Product images</CardTitle>
              <button
                type="button"
                onClick={() => setMediaOpen(true)}
                className="text-xs font-medium text-primary hover:underline"
              >
                Add from media library
              </button>
            </CardHeader>
            <CardContent>
              {values.imageUrl ? (
                <div className="overflow-hidden rounded-xl border bg-muted">
                  <img src={values.imageUrl} alt="" className="h-56 w-full object-cover" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setMediaOpen(true)}
                  className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-sm text-muted-foreground hover:bg-muted/40"
                >
                  <Upload className="size-5" />
                  Drop an image here or select from the library
                </button>
              )}
              <div className="mt-3">
                <Input
                  value={values.imageUrl}
                  onChange={(event) => patch({ imageUrl: event.target.value })}
                  placeholder="https://…"
                  leftIcon={<ImageIcon />}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Base price"
                type="number"
                min="0"
                step="0.01"
                required
                value={values.price}
                onChange={(event) => patch({ price: event.target.value })}
              />
              <Input
                label="Compare-at price"
                type="number"
                min="0"
                step="0.01"
                value={values.compareAtPrice}
                onChange={(event) => patch({ compareAtPrice: event.target.value })}
                helperText="Optional. Used to show a discount on the catalog."
              />
              <Input
                label="Currency"
                value={values.currency}
                onChange={(event) => patch({ currency: event.target.value.toUpperCase() })}
              />
              <Input
                label="Stock"
                type="number"
                min="0"
                step="1"
                value={values.stock}
                onChange={(event) => patch({ stock: event.target.value })}
                helperText="Leave blank if you do not track inventory."
              />
              <Switch
                label="In stock / visible"
                description="Active products appear on published websites."
                checked={values.isActive}
                onCheckedChange={(checked) => patch({ isActive: checked })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status & listing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Category"
                value={values.category}
                onChange={(event) => patch({ category: event.target.value })}
                placeholder="Apparel"
              />
              <Input
                label="Button text"
                value={values.ctaText}
                onChange={(event) => patch({ ctaText: event.target.value })}
              />
              <Input
                label="Button link"
                value={values.ctaUrl}
                onChange={(event) => patch({ ctaUrl: event.target.value })}
                placeholder="#contact"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <MediaPickerModal
        isOpen={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={(url) => patch({ imageUrl: url })}
      />
    </>
  );
}
