'use client';

import * as React from 'react';
import { useEditorStore } from '@/stores/editor-store';
import {
  Layers,
  Palette,
  Briefcase,
  FileText,
  Image as ImageIcon,
  Settings,
} from 'lucide-react';
import { Tabs } from '@/components/ui/tabs';
import { SectionConfigPanel } from './section-config-panel';
import { SectionsPanel } from './panels/SectionsPanel';
import { PagesPanel } from './panels/PagesPanel';
import { ThemePanel } from './panels/ThemePanel';
import { BusinessPanel } from './panels/BusinessPanel';
import { MediaPanel } from './panels/MediaPanel';
import { SEOPanel } from './panels/SEOPanel';
import { Product } from '@/types';

export interface EditorSidebarProps {
  products?: Product[];
  onProductCreated?: (product: Product) => void;
}

export function EditorSidebar({
  products = [],
  onProductCreated,
}: EditorSidebarProps) {
  const { website, activePageId, activeSectionId, setActiveSectionId } =
    useEditorStore();

  const [activeTab, setActiveTab] = React.useState('sections');

  if (!website) return null;

  const activePage =
    (website.pages || []).find((p: any) => p.id === activePageId) ||
    website.pages?.[0];

  const selectedSection = (activePage?.sections || []).find(
    (s: any) => s.id === activeSectionId,
  );

  return (
    <aside className="flex h-full w-84 shrink-0 flex-col border-r border-slate-800 bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Tab Navigation */}
      {!selectedSection && (
        <div className="border-b border-slate-800 p-2 overflow-x-auto">
          <Tabs
            tabs={[
              { id: 'sections', label: 'Sections', icon: <Layers className="h-3 w-3" /> },
              { id: 'pages', label: 'Pages', icon: <FileText className="h-3 w-3" /> },
              { id: 'theme', label: 'Theme', icon: <Palette className="h-3 w-3" /> },
              { id: 'business', label: 'Business', icon: <Briefcase className="h-3 w-3" /> },
              { id: 'media', label: 'Media', icon: <ImageIcon className="h-3 w-3" /> },
              { id: 'seo', label: 'SEO', icon: <Settings className="h-3 w-3" /> },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="w-full text-xs"
          />
        </div>
      )}

      {/* Main Panel Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {selectedSection ? (
          <SectionConfigPanel
            pageId={activePage.id}
            section={selectedSection}
            products={products}
            onProductCreated={onProductCreated}
            onBack={() => setActiveSectionId(null)}
          />
        ) : activeTab === 'sections' ? (
          <SectionsPanel />
        ) : activeTab === 'pages' ? (
          <PagesPanel />
        ) : activeTab === 'theme' ? (
          <ThemePanel />
        ) : activeTab === 'business' ? (
          <BusinessPanel />
        ) : activeTab === 'media' ? (
          <MediaPanel />
        ) : (
          <SEOPanel />
        )}
      </div>
    </aside>
  );
}
