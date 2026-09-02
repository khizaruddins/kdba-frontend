'use client';

import * as React from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { Input } from '@/components/ui/input';

export function ThemePanel() {
  const { website, updateTheme } = useEditorStore();

  if (!website) return null;
  const theme = website.theme || {};

  return (
    <div className="space-y-6">
      {/* Brand Palette */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
          Brand Colors & Tokens
        </h3>

        <div className="space-y-4">
          {/* Accent / Brand Color */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Accent / Brand Highlight
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.accentColor || '#6366f1'}
                onChange={(e) => updateTheme({ accentColor: e.target.value })}
                className="h-9 w-12 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
              />
              <Input
                value={theme.accentColor || '#6366f1'}
                onChange={(e) => updateTheme({ accentColor: e.target.value })}
                placeholder="#6366f1"
              />
            </div>
          </div>

          {/* Primary / Deep Dark */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Primary Theme Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.primaryColor || '#0f172a'}
                onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                className="h-9 w-12 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
              />
              <Input
                value={theme.primaryColor || '#0f172a'}
                onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                placeholder="#0f172a"
              />
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Background Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.backgroundColor || '#090d16'}
                onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                className="h-9 w-12 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
              />
              <Input
                value={theme.backgroundColor || '#090d16'}
                onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                placeholder="#090d16"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="border-t border-slate-800 pt-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
          Typography System
        </h3>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Heading Font Family
          </label>
          <select
            value={theme.headingFont || 'Inter, sans-serif'}
            onChange={(e) => updateTheme({ headingFont: e.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden"
          >
            <option value="Inter, sans-serif">Inter (Modern Clean Sans)</option>
            <option value="Playfair Display, Georgia, serif">Playfair Display (Luxury Serif)</option>
            <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans (Tech / SaaS)</option>
            <option value="Roboto, sans-serif">Roboto (Corporate Sans)</option>
            <option value="Georgia, serif">Georgia (Classic Editorial)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Body Font Family
          </label>
          <select
            value={theme.bodyFont || 'Inter, sans-serif'}
            onChange={(e) => updateTheme({ bodyFont: e.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden"
          >
            <option value="Inter, sans-serif">Inter (Standard Sans)</option>
            <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans</option>
            <option value="Roboto, sans-serif">Roboto</option>
            <option value="system-ui, sans-serif">System Default</option>
          </select>
        </div>
      </div>

      {/* Component Styles */}
      <div className="border-t border-slate-800 pt-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
          Border & Corner Style
        </h3>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Card & Component Radius
          </label>
          <select
            value={theme.borderRadius || '12px'}
            onChange={(e) => updateTheme({ borderRadius: e.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden"
          >
            <option value="0px">Sharp Sharp (0px)</option>
            <option value="4px">Slight (4px)</option>
            <option value="8px">Standard (8px)</option>
            <option value="12px">Modern (12px)</option>
            <option value="16px">Rounded (16px)</option>
            <option value="24px">Extra Rounded (24px)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
