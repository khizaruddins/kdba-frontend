'use client';

import * as React from 'react';
import { useEditorStore } from '@/stores/editor-store';
import {
  FileText,
  Layers,
  Palette,
  Eye,
  EyeOff,
  ChevronRight,
  Settings,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Plus,
} from 'lucide-react';
import { Tabs } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SectionConfigPanel } from './section-config-panel';
import { apiClient } from '@/lib/api/client';
import { MediaItem, Product } from '@/types';
import {
  Upload,
  Image as ImageIcon,
  Check,
  Copy,
  Trash2,
  ExternalLink,
  Loader2,
} from 'lucide-react';

const AVAILABLE_SECTION_TYPES = [
  { type: 'PRODUCTS', name: 'Products Catalog & Menu', description: 'Showcase e-commerce items, restaurant dishes, or product offerings.' },
  { type: 'SERVICES', name: 'Services & Capabilities', description: 'Highlight practice areas, consulting solutions, and offerings.' },
  { type: 'PRICING', name: 'Pricing & Retainers', description: 'Display transparent pricing tiers and subscription options.' },
  { type: 'GALLERY', name: 'Visual Media Gallery', description: 'Grid of portfolio photography, restaurant dishes, or office scenes.' },
  { type: 'TESTIMONIALS', name: 'Client Testimonials', description: 'Build trust with customer quotes, reviews, and star ratings.' },
  { type: 'TEAM', name: 'Leadership & Team', description: 'Introduce partners, founders, chefs, and key personnel.' },
  { type: 'ABOUT', name: 'About & Brand Story', description: 'Highlight company history, mission values, and key achievements.' },
  { type: 'CTA', name: 'Call to Action Banner', description: 'Encourage direct conversion and lead inquiries.' },
];

export interface EditorSidebarProps {
  products?: Product[];
  onProductCreated?: (product: Product) => void;
}

export function EditorSidebar({
  products = [],
  onProductCreated,
}: EditorSidebarProps) {
  const {
    website,
    activePageId,
    setActivePageId,
    activeSectionId,
    setActiveSectionId,
    toggleSection,
    reorderSections,
    addSection,
    deleteSection,
    updateTheme,
    updateWebsiteMeta,
    updateSectionConfig,
  } = useEditorStore();

  const [activeTab, setActiveTab] = React.useState('structure');
  const [isAddSectionOpen, setIsAddSectionOpen] = React.useState(false);

  // Media Library state inside sidebar
  const [mediaList, setMediaList] = React.useState<MediaItem[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = React.useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = React.useState(false);
  const [copyFeedback, setCopyFeedback] = React.useState<string | null>(null);

  const loadMedia = React.useCallback(async () => {
    setIsLoadingMedia(true);
    try {
      const data: any = await apiClient.get('/media');
      setMediaList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load media in sidebar:', err);
    } finally {
      setIsLoadingMedia(false);
    }
  }, []);

  React.useEffect(() => {
    if (activeTab === 'media') {
      loadMedia();
    }
  }, [activeTab, loadMedia]);

  const handleSidebarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await apiClient.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await loadMedia();
    } catch (err) {
      console.error('Failed to upload media:', err);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleApplyMediaToActiveSection = (mediaUrl: string) => {
    if (!activePageId || !activeSectionId) return;
    const fullUrl = mediaUrl.startsWith('http')
      ? mediaUrl
      : `http://localhost:4000${mediaUrl}`;

    updateSectionConfig(activePageId, activeSectionId, {
      imageUrl: fullUrl,
    });
    setCopyFeedback('Applied to active section!');
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleCopyMediaUrl = (mediaUrl: string) => {
    const fullUrl = mediaUrl.startsWith('http')
      ? mediaUrl
      : `http://localhost:4000${mediaUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopyFeedback('URL Copied!');
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      await apiClient.delete(`/media/${id}`);
      setMediaList((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Failed to delete media:', err);
    }
  };

  if (!website) return null;

  const activePage =
    website.pages.find((p) => p.id === activePageId) || website.pages[0];

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (!activePage) return;
    const sections = [...activePage.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const [moved] = sections.splice(index, 1);
    sections.splice(targetIndex, 0, moved);

    reorderSections(activePage.id, sections);
  };

  // If a section is selected for editing, show its property panel
  const selectedSection = activePage?.sections.find(
    (s) => s.id === activeSectionId,
  );

  return (
    <aside className="flex h-full w-80 flex-col border-r border-slate-800 bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top tabs */}
      <div className="border-b border-slate-800 p-2.5">
        <Tabs
          tabs={[
            { id: 'structure', label: 'Sections', icon: <Layers className="h-3 w-3" /> },
            { id: 'media', label: 'Media', icon: <ImageIcon className="h-3 w-3" /> },
            { id: 'theme', label: 'Theme', icon: <Palette className="h-3 w-3" /> },
            { id: 'seo', label: 'SEO', icon: <Settings className="h-3 w-3" /> },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="w-full justify-between text-xs"
        />
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {selectedSection ? (
          <SectionConfigPanel
            pageId={activePage.id}
            section={selectedSection}
            products={products}
            onProductCreated={onProductCreated}
            onBack={() => setActiveSectionId(null)}
          />
        ) : activeTab === 'structure' ? (
          <div className="space-y-6">
            {/* Page Switcher */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
                Select Page
              </label>
              <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-slate-800 bg-slate-900 p-1">
                {website.pages.map((page) => (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => setActivePageId(page.id)}
                    className={`rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      page.id === activePage?.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {page.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Sections List for Selected Page */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {activePage?.title} Page Sections
                </label>
                <span className="text-[11px] text-slate-500">
                  {activePage?.sections.length || 0} sections
                </span>
              </div>

              <div className="space-y-2">
                {activePage?.sections.map((section, idx) => (
                  <div
                    key={section.id}
                    className={`group flex items-center justify-between rounded-xl border p-3 transition-all ${
                      section.enabled
                        ? 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                        : 'border-slate-900 bg-slate-950/60 opacity-60'
                    }`}
                  >
                    {/* Clickable section title to edit */}
                    <button
                      type="button"
                      onClick={() => setActiveSectionId(section.id)}
                      className="flex items-center gap-2.5 text-left flex-1 cursor-pointer overflow-hidden"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold">
                        {idx + 1}
                      </div>
                      <span className="text-xs font-semibold text-slate-200 truncate group-hover:text-white">
                        {section.title || section.type}
                      </span>
                    </button>

                    {/* Section controls */}
                    <div className="flex items-center gap-1">
                      {/* Reorder Up */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveSection(idx, 'up')}
                        className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300 disabled:opacity-20 cursor-pointer"
                        title="Move up"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>

                      {/* Reorder Down */}
                      <button
                        type="button"
                        disabled={idx === activePage.sections.length - 1}
                        onClick={() => handleMoveSection(idx, 'down')}
                        className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300 disabled:opacity-20 cursor-pointer"
                        title="Move down"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>

                      {/* Toggle enable */}
                      <button
                        type="button"
                        onClick={() => toggleSection(activePage.id, section.id)}
                        className={`rounded p-1 transition-colors cursor-pointer ${
                          section.enabled
                            ? 'text-slate-400 hover:text-white'
                            : 'text-slate-600 hover:text-slate-400'
                        }`}
                        title={section.enabled ? 'Disable section' : 'Enable section'}
                      >
                        {section.enabled ? (
                          <Eye className="h-3.5 w-3.5" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5" />
                        )}
                      </button>

                      {/* Open Edit */}
                      <button
                        type="button"
                        onClick={() => setActiveSectionId(section.id)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer ml-1"
                        title="Edit properties"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Section Button */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddSectionOpen(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 py-2.5 text-xs font-semibold text-indigo-400 hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-300 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Section</span>
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'media' ? (
          /* Media Library Sidebar Tab */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Media Catalog
                </h3>
                <p className="text-[11px] text-slate-500">
                  Upload and insert assets into your site
                </p>
              </div>

              <label className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow hover:bg-indigo-500 cursor-pointer">
                {isUploadingMedia ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                <span>{isUploadingMedia ? 'Uploading...' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSidebarUpload}
                  disabled={isUploadingMedia}
                />
              </label>
            </div>

            {copyFeedback && (
              <div className="rounded-lg bg-emerald-500/20 border border-emerald-500/30 p-2 text-center text-xs font-semibold text-emerald-400">
                {copyFeedback}
              </div>
            )}

            {isLoadingMedia ? (
              <div className="flex h-36 items-center justify-center text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-500 mr-2" />
                <span className="text-xs">Loading media assets...</span>
              </div>
            ) : mediaList.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-slate-500">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-semibold text-slate-300">
                  No media uploaded yet
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Upload product photography, logos, and banners above.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                {mediaList.map((media) => {
                  const fileUrl = media.url.startsWith('http')
                    ? media.url
                    : `http://localhost:4000${media.url}`;

                  return (
                    <div
                      key={media.id}
                      className="group rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden hover:border-slate-700 transition-all p-2.5 flex flex-col gap-2"
                    >
                      <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                        <img
                          src={fileUrl}
                          alt={media.altText || media.filename}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white truncate max-w-[140px]">
                          {media.filename}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {(media.size / 1024).toFixed(0)} KB
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-800/80">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleApplyMediaToActiveSection(fileUrl)}
                          className="text-[11px] h-7 px-1.5"
                          title="Apply this image to current active section"
                        >
                          Use in Section
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyMediaUrl(fileUrl)}
                          leftIcon={<Copy className="h-3 w-3" />}
                          className="text-[11px] h-7 px-1.5"
                        >
                          Copy URL
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : activeTab === 'theme' ? (
          /* Theme Styling Tab */
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Brand Palette
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Accent / Brand Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={website.theme.accentColor || '#6366f1'}
                      onChange={(e) =>
                        updateTheme({ accentColor: e.target.value })
                      }
                      className="h-9 w-12 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <Input
                      value={website.theme.accentColor || '#6366f1'}
                      onChange={(e) =>
                        updateTheme({ accentColor: e.target.value })
                      }
                      placeholder="#6366f1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Primary Dark Background
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={website.theme.primaryColor || '#0f172a'}
                      onChange={(e) =>
                        updateTheme({ primaryColor: e.target.value })
                      }
                      className="h-9 w-12 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <Input
                      value={website.theme.primaryColor || '#0f172a'}
                      onChange={(e) =>
                        updateTheme({ primaryColor: e.target.value })
                      }
                      placeholder="#0f172a"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Typography & Style
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Heading Font
                  </label>
                  <select
                    value={website.theme.headingFont || 'Inter'}
                    onChange={(e) =>
                      updateTheme({ headingFont: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="Inter">Inter (Modern Clean)</option>
                    <option value="Playfair Display">Playfair Display (Serif Luxury)</option>
                    <option value="Roboto">Roboto (Corporate Sans)</option>
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Tech)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Border Radius
                  </label>
                  <select
                    value={website.theme.borderRadius || '8px'}
                    onChange={(e) =>
                      updateTheme({ borderRadius: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="4px">Slight (4px)</option>
                    <option value="8px">Standard (8px)</option>
                    <option value="16px">Rounded (16px)</option>
                    <option value="24px">Extra Rounded (24px)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* SEO & Settings Tab */
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              SEO & Social Metadata
            </h3>

            <Input
              label="Website Name"
              value={website.name}
              onChange={(e) => updateWebsiteMeta({ name: e.target.value })}
            />

            <Input
              label="Meta Title (Browser Tab & Google)"
              value={website.seoTitle || ''}
              onChange={(e) => updateWebsiteMeta({ seoTitle: e.target.value })}
              placeholder="e.g. Apex Advisory | Corporate Growth & M&A"
            />

            <Textarea
              label="Meta Description"
              value={website.seoDescription || ''}
              onChange={(e) =>
                updateWebsiteMeta({ seoDescription: e.target.value })
              }
              placeholder="Brief description for search engine listings..."
            />
          </div>
        )}
      </div>

      {/* Add Section Dialog */}
      <Dialog
        isOpen={isAddSectionOpen}
        onClose={() => setIsAddSectionOpen(false)}
        title={`Add Section to ${activePage?.title || 'Page'}`}
        description="Choose a pre-designed section to instantly add to your page."
      >
        <div className="space-y-3 pt-2 max-h-96 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-2.5">
            {AVAILABLE_SECTION_TYPES.map((sec) => (
              <div
                key={sec.type}
                onClick={() => {
                  if (activePage) {
                    addSection(activePage.id, sec.type, sec.name);
                    setIsAddSectionOpen(false);
                  }
                }}
                className="group flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 hover:border-indigo-500 hover:bg-indigo-500/10 transition-all cursor-pointer text-left"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors text-xs font-bold">
                  {sec.type.slice(0, 2)}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-white block group-hover:text-indigo-200">
                    {sec.name}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug">
                    {sec.description}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddSectionOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
    </aside>
  );
}
