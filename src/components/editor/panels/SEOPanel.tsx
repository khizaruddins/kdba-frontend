'use client';

import * as React from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Globe, Search } from 'lucide-react';

export function SEOPanel() {
  const { website, updateWebsiteMeta } = useEditorStore();

  if (!website) return null;

  const siteName = website.name || 'My Website';
  const metaTitle = website.seoTitle || `${siteName} | Official Website`;
  const metaDescription =
    website.seoDescription ||
    'Discover our official offerings, services, and company highlights.';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
          SEO & Social Metadata
        </h3>
        <p className="text-[11px] text-slate-500">
          Optimize search engine indexing and social media link shares.
        </p>
      </div>

      <div className="space-y-4 text-xs">
        <Input
          label="Website Display Name"
          value={website.name || ''}
          onChange={(e) => updateWebsiteMeta({ name: e.target.value })}
        />

        <Input
          label="Meta Title (Browser Tab & Google)"
          value={website.seoTitle || ''}
          onChange={(e) => updateWebsiteMeta({ seoTitle: e.target.value })}
          placeholder="e.g. Apex Advisory | Strategy & Growth"
        />

        <Textarea
          label="Meta Description"
          rows={3}
          value={website.seoDescription || ''}
          onChange={(e) => updateWebsiteMeta({ seoDescription: e.target.value })}
          placeholder="A brief summary for search engine snippet results..."
        />

        <Input
          label="Favicon URL"
          value={website.favicon || ''}
          onChange={(e) => updateWebsiteMeta({ favicon: e.target.value })}
          placeholder="https://.../favicon.ico"
        />
      </div>

      {/* Live Google Search Preview */}
      <div className="pt-4 border-t border-slate-800 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <Search className="h-3 w-3 text-indigo-400" />
          <span>Google Search Result Preview</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-1">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Globe className="h-3.5 w-3.5 text-slate-500" />
            <span className="truncate">https://kdba.agency/site/{website.slug || 'my-site'}</span>
          </div>
          <h4 className="text-sm font-semibold text-indigo-400 truncate">
            {metaTitle}
          </h4>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {metaDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
