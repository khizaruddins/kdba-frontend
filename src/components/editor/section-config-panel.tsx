'use client';

import * as React from 'react';
import { Section, Product } from '@/types';
import { useEditorStore } from '@/stores/editor-store';
import { apiClient } from '@/lib/api/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { MediaPickerModal } from '@/components/ui/media-picker-modal';
import {
  ArrowLeft,
  Sparkles,
  Image as ImageIcon,
  Link,
  Type,
  Plus,
  ShoppingBag,
  Check,
  RefreshCw,
  Trash2,
} from 'lucide-react';

export interface SectionConfigPanelProps {
  pageId: string;
  section: Section;
  products?: Product[];
  onProductCreated?: (product: Product) => void;
  onBack: () => void;
}

export function SectionConfigPanel({
  pageId,
  section,
  products = [],
  onProductCreated,
  onBack,
}: SectionConfigPanelProps) {
  const { updateSectionConfig } = useEditorStore();
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = React.useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = React.useState(false);
  const [productImageModalOpen, setProductImageModalOpen] = React.useState(false);

  const [newProductForm, setNewProductForm] = React.useState({
    name: '',
    price: 19.99,
    category: 'General',
    description: '',
    imageUrl: '',
    ctaText: 'Order Now',
    ctaUrl: '#contact',
  });

  const config = section.draftConfig || {};

  const handleChange = (key: string, value: any) => {
    updateSectionConfig(pageId, section.id, {
      [key]: value,
    });
  };

  const handleCreateQuickProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name) return;

    setIsSubmittingProduct(true);
    try {
      const created: any = await apiClient.post('/products', {
        name: newProductForm.name,
        price: parseFloat(newProductForm.price as any) || 0,
        category: newProductForm.category || 'General',
        description: newProductForm.description || '',
        imageUrl: newProductForm.imageUrl || '',
        ctaText: newProductForm.ctaText || 'Order Now',
        ctaUrl: newProductForm.ctaUrl || '#contact',
        isActive: true,
      });

      if (onProductCreated) {
        onProductCreated(created);
      }

      // Add to selected products if list is filtered
      if (Array.isArray(config.selectedProductIds)) {
        handleChange('selectedProductIds', [...config.selectedProductIds, created.id]);
      }

      setIsAddProductOpen(false);
      setNewProductForm({
        name: '',
        price: 19.99,
        category: 'General',
        description: '',
        imageUrl: '',
        ctaText: 'Order Now',
        ctaUrl: '#contact',
      });
    } catch (err) {
      console.error('Failed to create quick product:', err);
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Back button */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          title="Back to sections list"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h3 className="text-sm font-bold text-white">
            {section.title || section.type}
          </h3>
          <p className="text-[10px] uppercase tracking-wider text-indigo-400 font-semibold">
            {section.type} SECTION
          </p>
        </div>
      </div>

      {/* Dynamic Controls based on Section Type */}
      <div className="space-y-4 text-xs">
        {/* Badge field */}
        {config.badge !== undefined && (
          <Input
            label="Badge / Tagline"
            value={config.badge || ''}
            onChange={(e) => handleChange('badge', e.target.value)}
            placeholder="e.g. Next-Gen Digital Branding"
          />
        )}

        {/* Headline */}
        {config.headline !== undefined && (
          <Input
            label="Headline Title"
            value={config.headline || ''}
            onChange={(e) => handleChange('headline', e.target.value)}
            placeholder="Main Section Title"
          />
        )}

        {/* Subheadline */}
        {config.subheadline !== undefined && (
          <Textarea
            label="Subheadline / Intro"
            value={config.subheadline || ''}
            onChange={(e) => handleChange('subheadline', e.target.value)}
            placeholder="Section subtitle or supporting message..."
          />
        )}

        {/* Description / Story text */}
        {config.description !== undefined && (
          <Textarea
            label="Detailed Body Content"
            rows={4}
            value={config.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Detailed description or brand story..."
          />
        )}

        {/* Image URL with Media Picker */}
        {config.imageUrl !== undefined && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">
                Image URL
              </label>
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(true)}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                + Choose from Media Library
              </button>
            </div>
            <div className="flex gap-2">
              <Input
                value={config.imageUrl || ''}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                placeholder="https://... or choose media"
                leftIcon={<ImageIcon className="h-4 w-4 text-slate-400" />}
              />
            </div>

            {config.imageUrl && (
              <div className="mt-2 relative h-28 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                <img
                  src={config.imageUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* Products Section Catalog Management */}
        {section.type === 'PRODUCTS' && (
          <div className="space-y-4 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-200">Catalog Products</h4>
                <p className="text-[11px] text-slate-400">
                  Select and arrange products for this section
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsAddProductOpen(true)}
                leftIcon={<Plus className="h-3 w-3" />}
                className="text-[11px] h-7 px-2.5"
              >
                + Add Product
              </Button>
            </div>

            {products.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center">
                <ShoppingBag className="h-6 w-6 text-slate-500 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-slate-300">
                  No products in catalog yet
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Click below to quickly create your first product.
                </p>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsAddProductOpen(true)}
                  className="mt-3 text-xs"
                >
                  Create Product Now
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1">
                  <span>Catalog items ({products.length})</span>
                  <button
                    type="button"
                    onClick={() => handleChange('selectedProductIds', [])}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    Select All
                  </button>
                </div>

                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {products.map((prod) => {
                    const isSelected =
                      !config.selectedProductIds ||
                      config.selectedProductIds.length === 0 ||
                      config.selectedProductIds.includes(prod.id);

                    return (
                      <div
                        key={prod.id}
                        onClick={() => {
                          const currentSelected =
                            config.selectedProductIds || products.map((p) => p.id);
                          const nextSelected = currentSelected.includes(prod.id)
                            ? currentSelected.filter((id: string) => id !== prod.id)
                            : [...currentSelected, prod.id];
                          handleChange('selectedProductIds', nextSelected);
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-500/60 bg-indigo-500/10'
                            : 'border-slate-800 bg-slate-900/40 opacity-40 hover:opacity-75'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {prod.imageUrl ? (
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className="h-8 w-8 rounded-lg object-cover shrink-0 border border-slate-700"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 text-slate-400">
                              <ShoppingBag className="h-4 w-4" />
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <span className="text-xs font-semibold text-white truncate block">
                              {prod.name}
                            </span>
                            <span className="text-[10px] text-indigo-300 font-mono">
                              ${parseFloat(prod.price as any).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 ml-2">
                          <div
                            className={`h-4 w-4 rounded flex items-center justify-center border transition-all ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                : 'border-slate-700 bg-slate-800'
                            }`}
                          >
                            {isSelected && <Check className="h-2.5 w-2.5" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Primary CTA */}
        {config.primaryCtaText !== undefined && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h4 className="font-semibold text-slate-300">Primary Button</h4>
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Label"
                value={config.primaryCtaText || ''}
                onChange={(e) => handleChange('primaryCtaText', e.target.value)}
                placeholder="Button Label"
              />
              <Input
                label="URL"
                value={config.primaryCtaUrl || ''}
                onChange={(e) => handleChange('primaryCtaUrl', e.target.value)}
                placeholder="/contact"
              />
            </div>
          </div>
        )}

        {/* Secondary CTA */}
        {config.secondaryCtaText !== undefined && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h4 className="font-semibold text-slate-300">Secondary Button</h4>
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Label"
                value={config.secondaryCtaText || ''}
                onChange={(e) => handleChange('secondaryCtaText', e.target.value)}
                placeholder="Button Label"
              />
              <Input
                label="URL"
                value={config.secondaryCtaUrl || ''}
                onChange={(e) => handleChange('secondaryCtaUrl', e.target.value)}
                placeholder="#services"
              />
            </div>
          </div>
        )}

        {/* Contact fields */}
        {section.type === 'CONTACT' && (
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="font-semibold text-slate-300">Contact Details</h4>
            <Input
              label="Email"
              value={config.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="hello@example.com"
            />
            <Input
              label="Phone"
              value={config.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
            <Input
              label="Physical Address"
              value={config.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="123 Main Street"
            />
            <Input
              label="Working Hours"
              value={config.businessHours || ''}
              onChange={(e) => handleChange('businessHours', e.target.value)}
              placeholder="Mon - Fri: 9:00 AM - 6:00 PM"
            />
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-800">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="w-full"
        >
          Done Editing Section
        </Button>
      </div>

      {/* Media Picker for Section Image */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => handleChange('imageUrl', url)}
      />

      {/* Quick Add Product Dialog */}
      <Dialog
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        title="Add Product to Catalog"
        description="Quickly create a new product to showcase on your website."
      >
        <form onSubmit={handleCreateQuickProduct} className="space-y-3.5 pt-2">
          <Input
            label="Product Name"
            required
            value={newProductForm.name}
            onChange={(e) =>
              setNewProductForm({ ...newProductForm, name: e.target.value })
            }
            placeholder="e.g. iPhone 14 Pro Max"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              required
              value={newProductForm.price}
              onChange={(e) =>
                setNewProductForm({
                  ...newProductForm,
                  price: parseFloat(e.target.value) || 0,
                })
              }
            />
            <Input
              label="Category"
              value={newProductForm.category}
              onChange={(e) =>
                setNewProductForm({
                  ...newProductForm,
                  category: e.target.value,
                })
              }
              placeholder="e.g. Electronics, Bakery"
            />
          </div>

          <Textarea
            label="Description"
            rows={2}
            value={newProductForm.description}
            onChange={(e) =>
              setNewProductForm({
                ...newProductForm,
                description: e.target.value,
              })
            }
            placeholder="Product details, condition, specs..."
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">
                Product Image
              </label>
              <button
                type="button"
                onClick={() => setProductImageModalOpen(true)}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                + Choose from Media Library
              </button>
            </div>
            <Input
              value={newProductForm.imageUrl}
              onChange={(e) =>
                setNewProductForm({
                  ...newProductForm,
                  imageUrl: e.target.value,
                })
              }
              placeholder="https://... or choose media"
              leftIcon={<ImageIcon className="h-4 w-4 text-slate-400" />}
            />
            {newProductForm.imageUrl && (
              <div className="mt-2 relative h-20 w-20 rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                <img
                  src={newProductForm.imageUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddProductOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isSubmittingProduct}
            >
              Create & Add to Section
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Media Picker for Product Image */}
      <MediaPickerModal
        isOpen={productImageModalOpen}
        onClose={() => setProductImageModalOpen(false)}
        onSelect={(url) =>
          setNewProductForm({ ...newProductForm, imageUrl: url })
        }
      />
    </div>
  );
}
