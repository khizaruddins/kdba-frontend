'use client';

import * as React from 'react';
import { SectionDocument, Product } from '@/types';
import { useEditorStore } from '@/stores/editor-store';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MediaPickerModal } from '@/components/ui/media-picker-modal';
import { SECTION_METADATA_MAP } from '@/lib/document/defaults';
import {
  ArrowLeft,
  Image as ImageIcon,
  Sparkles,
  Plus,
  Trash2,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';

export interface SectionConfigPanelProps {
  pageId: string;
  section: SectionDocument | any;
  products?: Product[];
  onProductCreated?: (product: Product) => void;
  onBack: () => void;
}

export function SectionConfigPanel({
  pageId,
  section,
  onBack,
}: SectionConfigPanelProps) {
  const { updateSectionConfig, changeSectionVariant, toggleSection } =
    useEditorStore();

  const [mediaPickerKey, setMediaPickerKey] = React.useState<string | null>(null);

  const normalizedType = (section.type || '').toLowerCase();
  const metadata = SECTION_METADATA_MAP[normalizedType as keyof typeof SECTION_METADATA_MAP];
  const config =
    section.props ||
    section.draftConfig ||
    section.publishedConfig ||
    section.config ||
    {};
  const currentVariant = section.variant || metadata?.defaultVariant || 'default';

  const handleChange = (key: string, value: any) => {
    updateSectionConfig(pageId, section.id, {
      [key]: value,
    });
  };

  const handleArrayItemChange = (arrayKey: string, index: number, field: string, value: any) => {
    const list = Array.isArray(config[arrayKey]) ? [...config[arrayKey]] : [];
    if (list[index]) {
      list[index] = { ...list[index], [field]: value };
      handleChange(arrayKey, list);
    }
  };

  const handleAddArrayItem = (arrayKey: string, defaultItem: Record<string, any>) => {
    const list = Array.isArray(config[arrayKey]) ? [...config[arrayKey]] : [];
    list.push(defaultItem);
    handleChange(arrayKey, list);
  };

  const handleDeleteArrayItem = (arrayKey: string, index: number) => {
    const list = Array.isArray(config[arrayKey]) ? [...config[arrayKey]] : [];
    list.splice(index, 1);
    handleChange(arrayKey, list);
  };

  return (
    <div className="space-y-6">
      {/* Header with Back button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
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
              {section.title || metadata?.name || section.type}
            </h3>
            <p className="text-[10px] uppercase tracking-wider text-indigo-400 font-semibold">
              {section.type} SECTION
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggleSection(pageId, section.id)}
          className={`p-1.5 rounded-lg border transition-colors text-xs flex items-center gap-1 ${
            section.enabled !== false
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-slate-800 bg-slate-900 text-slate-500'
          }`}
          title="Toggle Visibility"
        >
          {section.enabled !== false ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          <span>{section.enabled !== false ? 'Visible' : 'Hidden'}</span>
        </button>
      </div>

      {/* Variant Selector */}
      {metadata && metadata.variants && metadata.variants.length > 1 && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Section Layout Variant
          </label>
          <select
            value={currentVariant}
            onChange={(e) => changeSectionVariant(pageId, section.id, e.target.value)}
            className="w-full rounded-xl border border-indigo-500/40 bg-slate-900 px-3.5 py-2 text-xs text-white focus:outline-hidden font-medium"
          >
            {metadata.variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Text Content Controls */}
      <div className="space-y-4 text-xs">
        {/* Badge */}
        {config.badge !== undefined && (
          <Input
            label="Badge / Tagline"
            value={config.badge || ''}
            onChange={(e) => handleChange('badge', e.target.value)}
            placeholder="e.g. Next-Gen Experience"
          />
        )}

        {/* Headline */}
        {config.headline !== undefined && (
          <Input
            label="Main Headline"
            value={config.headline || ''}
            onChange={(e) => handleChange('headline', e.target.value)}
            placeholder="Headline Title"
          />
        )}

        {/* Subheadline */}
        {config.subheadline !== undefined && (
          <Textarea
            label="Subheadline / Intro"
            rows={2}
            value={config.subheadline || ''}
            onChange={(e) => handleChange('subheadline', e.target.value)}
            placeholder="Subheadline message..."
          />
        )}

        {/* Description / Body Story */}
        {config.description !== undefined && (
          <Textarea
            label="Body Story / Description"
            rows={4}
            value={config.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Detailed narrative or story..."
          />
        )}

        {/* Image URL with Media Picker */}
        {config.imageUrl !== undefined && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">
                Featured Image URL
              </label>
              <button
                type="button"
                onClick={() => setMediaPickerKey('imageUrl')}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                + Choose from Media
              </button>
            </div>
            <Input
              value={config.imageUrl || ''}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              placeholder="https://..."
              leftIcon={<ImageIcon className="h-4 w-4 text-slate-400" />}
            />
            {config.imageUrl && (
              <div className="mt-2 relative h-28 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                <img
                  src={config.imageUrl}
                  alt="Section preview"
                  className="h-full w-full object-cover"
                />
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

        {/* Array Items Manager (Services, Features, Products, Team, Testimonials, FAQ, Stats, Process) */}
        {Array.isArray(config.items) && (
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-200">
                Items List ({config.items.length})
              </h4>
              <button
                type="button"
                onClick={() =>
                  handleAddArrayItem('items', {
                    title: 'New Item',
                    description: 'Description of the new offering...',
                    name: 'New Item',
                    price: '$99.00',
                    quote: 'Outstanding partnership and results.',
                    author: 'Client Name',
                    role: 'Title, Company',
                    question: 'New Frequently Asked Question?',
                    answer: 'Detailed clear response...',
                    step: `0${config.items.length + 1}`,
                    value: '100+',
                    label: 'Metric proof point',
                  })
                }
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {config.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300">
                      #{idx + 1} {item.title || item.name || item.question || item.author || 'Item'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteArrayItem('items', idx)}
                      className="text-slate-500 hover:text-rose-400 p-0.5"
                      title="Delete item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Dynamic field per item type */}
                  {(item.title !== undefined || item.name !== undefined) && (
                    <Input
                      label="Title / Name"
                      value={item.title || item.name || ''}
                      onChange={(e) =>
                        handleArrayItemChange('items', idx, item.title !== undefined ? 'title' : 'name', e.target.value)
                      }
                    />
                  )}

                  {item.price !== undefined && (
                    <Input
                      label="Price / Rate"
                      value={item.price || ''}
                      onChange={(e) => handleArrayItemChange('items', idx, 'price', e.target.value)}
                    />
                  )}

                  {item.role !== undefined && (
                    <Input
                      label="Role / Title"
                      value={item.role || ''}
                      onChange={(e) => handleArrayItemChange('items', idx, 'role', e.target.value)}
                    />
                  )}

                  {item.question !== undefined && (
                    <Input
                      label="Question"
                      value={item.question || ''}
                      onChange={(e) => handleArrayItemChange('items', idx, 'question', e.target.value)}
                    />
                  )}

                  {item.answer !== undefined && (
                    <Textarea
                      label="Answer"
                      rows={2}
                      value={item.answer || ''}
                      onChange={(e) => handleArrayItemChange('items', idx, 'answer', e.target.value)}
                    />
                  )}

                  {item.quote !== undefined && (
                    <Textarea
                      label="Testimonial Quote"
                      rows={2}
                      value={item.quote || ''}
                      onChange={(e) => handleArrayItemChange('items', idx, 'quote', e.target.value)}
                    />
                  )}

                  {item.value !== undefined && (
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="Metric Value"
                        value={item.value || ''}
                        onChange={(e) => handleArrayItemChange('items', idx, 'value', e.target.value)}
                      />
                      <Input
                        label="Label"
                        value={item.label || ''}
                        onChange={(e) => handleArrayItemChange('items', idx, 'label', e.target.value)}
                      />
                    </div>
                  )}

                  {item.description !== undefined && item.answer === undefined && (
                    <Textarea
                      label="Description"
                      rows={2}
                      value={item.description || ''}
                      onChange={(e) => handleArrayItemChange('items', idx, 'description', e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-800">
        <Button variant="outline" size="sm" onClick={onBack} className="w-full">
          Done Editing Section
        </Button>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={!!mediaPickerKey}
        onClose={() => setMediaPickerKey(null)}
        onSelect={(url) => {
          if (mediaPickerKey) {
            handleChange(mediaPickerKey, url);
            setMediaPickerKey(null);
          }
        }}
      />
    </div>
  );
}
