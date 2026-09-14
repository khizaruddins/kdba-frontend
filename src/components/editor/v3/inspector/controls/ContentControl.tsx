'use client';

import * as React from 'react';
import { WebsiteNode } from '@/types/v3-document';
import {
  Image as ImageIcon,
  Upload,
  Link,
  Sparkles,
  Check,
  Trash2,
  Plus,
} from 'lucide-react';

export interface ContentControlProps {
  node: WebsiteNode;
  onChangeProps: (propsPatch: Record<string, unknown>) => void;
}

const CURATED_STOCK_IMAGES = [
  {
    category: 'Travel & Safari',
    url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    label: 'Sunset Safari',
  },
  {
    category: 'Travel & Safari',
    url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    label: 'Savannah Wildlife',
  },
  {
    category: 'Travel & Safari',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    label: 'Tropical Coast',
  },
  {
    category: 'Luxury & Resorts',
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    label: 'Luxury Resort',
  },
  {
    category: 'Luxury & Resorts',
    url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    label: 'Villa Poolside',
  },
  {
    category: 'Modern Business',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    label: 'Skyscraper Architecture',
  },
  {
    category: 'Modern Business',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    label: 'Creative Studio Office',
  },
  {
    category: 'Minimal Nature',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    label: 'Mountain Fog',
  },
];

export function ContentControl({ node, onChangeProps }: ContentControlProps) {
  const props = node.props || {};
  const [showImageLibrary, setShowImageLibrary] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to local Data URL for instant live preview and persistence
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChangeProps({ src: reader.result, url: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  // 1. Heading Content Controls
  if (node.type === 'heading') {
    const currentText = String(props.text || '');
    const currentLevel = Number(props.level) || 2;

    return (
      <div className="space-y-3 select-none text-xs">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-medium text-slate-400">Heading Text</label>
            <span className="text-[10px] text-slate-500">{currentText.length} chars</span>
          </div>
          <textarea
            rows={3}
            value={currentText}
            onChange={(e) => onChangeProps({ text: e.target.value })}
            placeholder="Enter heading text..."
            className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Heading Level Tag (H1 to H6) */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Heading Tag (SEO)</label>
          <div className="grid grid-cols-6 gap-1 h-8 rounded-lg bg-slate-900 p-0.5 border border-slate-800">
            {[1, 2, 3, 4, 5, 6].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onChangeProps({ level: lvl })}
                className={`flex items-center justify-center rounded font-semibold text-xs transition-colors ${
                  currentLevel === lvl
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                H{lvl}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Paragraph & Text Content Controls
  if (node.type === 'paragraph' || node.type === 'text' || node.type === 'rich-text') {
    const currentText = String(props.text || props.html || '');

    return (
      <div className="space-y-3 select-none text-xs">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-medium text-slate-400">Paragraph Content</label>
            <span className="text-[10px] text-slate-500">{currentText.length} chars</span>
          </div>
          <textarea
            rows={4}
            value={currentText}
            onChange={(e) => onChangeProps({ text: e.target.value, html: e.target.value })}
            placeholder="Enter paragraph copy text..."
            className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none transition-colors resize-none leading-relaxed"
          />
        </div>
      </div>
    );
  }

  // 3. Image Element Controls
  if (node.type === 'image') {
    const currentSrc = String(props.src || props.url || '');
    const currentAlt = String(props.alt || '');
    const objectFit = String(props.objectFit || 'cover');

    return (
      <div className="space-y-3.5 select-none text-xs">
        {/* Thumbnail Preview */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Current Image</label>
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video group">
            {currentSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentSrc}
                alt={currentAlt || 'Selected image'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <ImageIcon className="w-6 h-6 mb-1 text-slate-600" />
                <span className="text-[11px]">No image selected</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Buttons: Replace & Upload */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setShowImageLibrary(!showImageLibrary)}
            className="flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Replace Image</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium text-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Upload File</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Curated Stock Photo Library Drawer */}
        {showImageLibrary && (
          <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-900/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Curated High-Res Photos
              </span>
              <button
                type="button"
                onClick={() => setShowImageLibrary(false)}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {CURATED_STOCK_IMAGES.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChangeProps({ src: item.url, url: item.url, alt: item.label });
                    setShowImageLibrary(false);
                  }}
                  className={`group relative rounded-lg overflow-hidden aspect-video border text-left transition-all ${
                    currentSrc === item.url ? 'border-indigo-500 ring-2 ring-indigo-500/40' : 'border-slate-800 hover:border-slate-600'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                    <span className="text-[9px] font-medium text-white truncate drop-shadow">
                      {item.label}
                    </span>
                  </div>
                  {currentSrc === item.url && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Direct Image URL Input */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Image Source URL</label>
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={currentSrc}
              onChange={(e) => onChangeProps({ src: e.target.value, url: e.target.value })}
              placeholder="https://example.com/photo.jpg"
              className="flex-1 h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
            />
            {currentSrc && (
              <button
                type="button"
                onClick={() => onChangeProps({ src: '', url: '' })}
                title="Clear image URL"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Alt Text (SEO & Accessibility) */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Alt Text (Accessibility & SEO)</label>
          <input
            type="text"
            value={currentAlt}
            onChange={(e) => onChangeProps({ alt: e.target.value })}
            placeholder="Describe image for search engines..."
            className="w-full h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Object Fit */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Image Fit</label>
          <div className="grid grid-cols-3 gap-1 h-8 rounded-lg bg-slate-900 p-0.5 border border-slate-800">
            {['cover', 'contain', 'fill'].map((fit) => (
              <button
                key={fit}
                type="button"
                onClick={() => onChangeProps({ objectFit: fit })}
                className={`capitalize flex items-center justify-center rounded text-xs transition-colors ${
                  objectFit === fit ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {fit}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 4. Button Element Controls
  if (node.type === 'button') {
    const currentLabel = String(props.label || props.text || 'Button');
    const currentHref = String(props.href || '#');
    const isNewTab = props.target === '_blank';

    return (
      <div className="space-y-3 select-none text-xs">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Button Name / Label</label>
          <input
            type="text"
            value={currentLabel}
            onChange={(e) => onChangeProps({ label: e.target.value, text: e.target.value })}
            placeholder="Click here"
            className="w-full h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Link Destination</label>
          <div className="flex items-center gap-1.5">
            <Link className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="text"
              value={currentHref}
              onChange={(e) => onChangeProps({ href: e.target.value })}
              placeholder="https://... or #section"
              className="flex-1 h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400">Open in New Tab</span>
          <button
            type="button"
            onClick={() => onChangeProps({ target: isNewTab ? '_self' : '_blank' })}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
              isNewTab ? 'bg-indigo-600 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </button>
        </div>
      </div>
    );
  }

  // 5. Quote / Testimonial Controls
  if (node.type === 'quote' || node.type === 'testimonial') {
    const currentQuote = String(props.quote || props.text || '');
    const currentAuthor = String(props.author || '');
    const currentRole = String(props.role || '');

    return (
      <div className="space-y-3 select-none text-xs">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Quote Text</label>
          <textarea
            rows={3}
            value={currentQuote}
            onChange={(e) => onChangeProps({ quote: e.target.value, text: e.target.value })}
            placeholder="Customer testimonial or quote..."
            className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">Author</label>
            <input
              type="text"
              value={currentAuthor}
              onChange={(e) => onChangeProps({ author: e.target.value })}
              placeholder="Full Name"
              className="w-full h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">Role / Company</label>
            <input
              type="text"
              value={currentRole}
              onChange={(e) => onChangeProps({ role: e.target.value })}
              placeholder="CEO, Nomad & Silk"
              className="w-full h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    );
  }

  // 6. Pricing Tier Controls
  if (node.type === 'pricing') {
    return (
      <div className="space-y-3 select-none text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">Plan Name</label>
            <input
              type="text"
            value={String(props.planName || props.plan || '')}
            onChange={(e) => onChangeProps({ planName: e.target.value, plan: e.target.value })}
              placeholder="Pro Studio"
              className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">Price</label>
            <input
              type="text"
              value={String(props.price || '')}
              onChange={(e) => onChangeProps({ price: e.target.value })}
              placeholder="$99 / mo"
              className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Highlighted Feature</label>
          <input
            type="text"
            value={String(props.feature || '')}
            onChange={(e) => onChangeProps({ feature: e.target.value })}
            placeholder="Unlimited access"
            className="w-full h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>
    );
  }

  // 7. Badge & Subheading Element Controls
  if (node.type === 'badge') {
    return (
      <div className="space-y-3 select-none text-xs">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Subheading / Badge Text</label>
          <textarea
            rows={2}
            value={String(props.text || '')}
            onChange={(e) => onChangeProps({ text: e.target.value })}
            placeholder="e.g. Global Offices, Practice Areas, Our Leadership"
            className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
          />
        </div>
      </div>
    );
  }

  // 8. List Element Controls
  if (node.type === 'list') {
    const currentItems: string[] = Array.isArray(props.items) && props.items.length > 0
      ? props.items
      : ['Instant visual manipulation', 'Zero-config responsive layouts', 'Enterprise grade performance'];
    const listStyle = String(props.listStyle || 'bullet');

    const handleUpdateItem = (index: number, val: string) => {
      const next = [...currentItems];
      next[index] = val;
      onChangeProps({ items: next });
    };

    const handleAddItem = () => {
      onChangeProps({ items: [...currentItems, `List item ${currentItems.length + 1}`] });
    };

    const handleRemoveItem = (index: number) => {
      if (currentItems.length <= 1) return;
      onChangeProps({ items: currentItems.filter((_, i) => i !== index) });
    };

    return (
      <div className="space-y-3 select-none text-xs">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-medium text-slate-400">List Items</label>
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
          >
            <Plus className="w-3 h-3" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-2">
          {currentItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="w-4 text-center text-[10px] text-slate-500 font-mono">{idx + 1}</span>
              <input
                type="text"
                value={item}
                onChange={(e) => handleUpdateItem(idx, e.target.value)}
                placeholder="Enter list item..."
                className="flex-1 h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                title="Remove item"
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-500 hover:text-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-1 pt-1 border-t border-slate-800/60">
          <label className="text-[11px] font-medium text-slate-400">List Marker Style</label>
          <div className="grid grid-cols-3 gap-1 h-8 rounded-lg bg-slate-900 p-0.5 border border-slate-800">
            {[
              { id: 'bullet', label: 'Bulleted' },
              { id: 'check', label: 'Checkmarks' },
              { id: 'number', label: 'Numbered' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onChangeProps({ listStyle: st.id })}
                className={`flex items-center justify-center rounded text-xs transition-colors ${
                  listStyle === st.id ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 9. Navbar Element Controls
  if (node.type === 'navbar') {
    const currentBrand = String(props.brandName || 'Apex Advisory');
    const currentCta = String(props.ctaText || 'Get Started');
    const currentCtaHref = String(props.ctaHref || '#contact');
    const currentLinks: Array<{ label?: string; href?: string }> = Array.isArray(props.links) && props.links.length > 0
      ? props.links
      : [
          { label: 'Home', href: '#' },
          { label: 'About', href: '#about' },
          { label: 'Contact', href: '#contact' },
        ];

    const handleUpdateLink = (index: number, patch: Partial<{ label: string; href: string }>) => {
      const next = [...currentLinks];
      next[index] = { ...next[index], ...patch };
      onChangeProps({ links: next });
    };

    const handleAddLink = () => {
      onChangeProps({
        links: [...currentLinks, { label: `Link`, href: '#section' }],
      });
    };

    const handleRemoveLink = (index: number) => {
      onChangeProps({ links: currentLinks.filter((_, i) => i !== index) });
    };

    return (
      <div className="space-y-3.5 select-none text-xs">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Brand Name</label>
          <input
            type="text"
            value={currentBrand}
            onChange={(e) => onChangeProps({ brandName: e.target.value })}
            placeholder="Brand Name"
            className="w-full h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* CTA Button */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/60">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">CTA Button Name</label>
            <input
              type="text"
              value={currentCta}
              onChange={(e) => onChangeProps({ ctaText: e.target.value })}
              placeholder="Client Portal"
              className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">CTA Destination URL</label>
            <input
              type="text"
              value={currentCtaHref}
              onChange={(e) => onChangeProps({ ctaHref: e.target.value })}
              placeholder="#contact"
              className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Menu Navigation Links */}
        <div className="space-y-2 pt-1 border-t border-slate-800/60">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-slate-400">Navbar Menu Links</label>
            <button
              type="button"
              onClick={handleAddLink}
              className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
            >
              <Plus className="w-3 h-3" />
              <span>Add Link</span>
            </button>
          </div>

          <div className="space-y-2">
            {currentLinks.map((link, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={link.label || ''}
                    onChange={(e) => handleUpdateLink(idx, { label: e.target.value })}
                    placeholder="Link Name"
                    className="flex-1 h-7 px-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(idx)}
                    title="Delete link"
                    className="p-1 rounded bg-slate-950 border border-slate-800 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={link.href || ''}
                  onChange={(e) => handleUpdateLink(idx, { href: e.target.value })}
                  placeholder="URL (e.g. #about)"
                  className="w-full h-7 px-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 10. Footer Element Controls
  if (node.type === 'footer') {
    const currentCopyright = String(props.copyright || '© 2026 Apex Advisory Partners LLC. All rights reserved.');
    const currentLinks: Array<{ label?: string; href?: string }> = Array.isArray(props.links) && props.links.length > 0
      ? props.links
      : [
          { label: 'Privacy', href: '#privacy' },
          { label: 'Terms', href: '#terms' },
          { label: 'Support', href: '#support' },
        ];

    const handleUpdateLink = (index: number, patch: Partial<{ label: string; href: string }>) => {
      const next = [...currentLinks];
      next[index] = { ...next[index], ...patch };
      onChangeProps({ links: next });
    };

    const handleAddLink = () => {
      onChangeProps({
        links: [...currentLinks, { label: `Link`, href: '#link' }],
      });
    };

    const handleRemoveLink = (index: number) => {
      onChangeProps({ links: currentLinks.filter((_, i) => i !== index) });
    };

    return (
      <div className="space-y-3.5 select-none text-xs">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Copyright Text</label>
          <input
            type="text"
            value={currentCopyright}
            onChange={(e) => onChangeProps({ copyright: e.target.value })}
            placeholder="© 2026 Company Name. All rights reserved."
            className="w-full h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Footer Navigation Links */}
        <div className="space-y-2 pt-1 border-t border-slate-800/60">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-slate-400">Footer Links</label>
            <button
              type="button"
              onClick={handleAddLink}
              className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
            >
              <Plus className="w-3 h-3" />
              <span>Add Link</span>
            </button>
          </div>

          <div className="space-y-2">
            {currentLinks.map((link, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={link.label || ''}
                    onChange={(e) => handleUpdateLink(idx, { label: e.target.value })}
                    placeholder="Link name (e.g. Privacy)"
                    className="flex-1 h-7 px-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(idx)}
                    title="Delete link"
                    className="p-1 rounded bg-slate-950 border border-slate-800 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={link.href || ''}
                  onChange={(e) => handleUpdateLink(idx, { href: e.target.value })}
                  placeholder="URL or anchor (e.g. #privacy)"
                  className="w-full h-7 px-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 11. Form & Contact Form Controls
  if (node.type === 'form' || node.type === 'contact-form') {
    const currentTitle = String(props.title || 'Send a Message');
    const currentBtn = String(props.buttonText || props.submitText || 'Send Message');

    return (
      <div className="space-y-3 select-none text-xs">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Form Heading / Title</label>
          <input
            type="text"
            value={currentTitle}
            onChange={(e) => onChangeProps({ title: e.target.value })}
            placeholder="Send a Message"
            className="w-full h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Submit Button Text</label>
          <input
            type="text"
            value={currentBtn}
            onChange={(e) => onChangeProps({ buttonText: e.target.value, submitText: e.target.value })}
            placeholder="Send Message"
            className="w-full h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>
    );
  }

  // 12. Video Element Controls
  if (node.type === 'video') {
    return (
      <div className="space-y-3 select-none text-xs">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">Video URL</label>
          <input
            type="text"
            value={String(props.url || props.src || '')}
            onChange={(e) => onChangeProps({ url: e.target.value, src: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>
    );
  }

  // Generic fallback if no specific props editor
  return (
    <div className="p-3 text-center text-slate-500 text-xs">
      <p>Configure appearance in Layout and Spacing below.</p>
    </div>
  );
}
