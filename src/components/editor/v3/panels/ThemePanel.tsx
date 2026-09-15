'use client';

import * as React from 'react';
import { useV3EditorStore } from '@/stores/v3-editor-store';
import { Palette, X } from 'lucide-react';
import { ColorTokensV3 } from '@/types/v3-document';
import { getThemeLayoutTokens } from '@/lib/editor/theme-tokens';

const FONTS = [
  'Inter',
  'Sora',
  'Urbanist',
  'Plus Jakarta Sans',
  'Outfit',
  'Roboto',
  'Playfair Display',
];

export function ThemePanel() {
  const { document, updateTheme, setActiveNavTab } = useV3EditorStore();

  if (!document) return null;

  const colors: ColorTokensV3 = document.theme?.colors || {
    primary: '#4F46E5',
    secondary: '#0F172A',
    accent: '#06B6D4',
    background: '#0B0D13',
    surface: '#131620',
    text: '#FFFFFF',
    muted: '#94A3B8',
    border: '#212636',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  };

  const handleColorChange = (key: keyof ColorTokensV3, val: string) => {
    updateTheme({
      colors: {
        ...colors,
        [key]: val,
      },
    });
  };

  const handleHeadingFontChange = (font: string) => {
    if (!document.theme?.typography) return;
    updateTheme({
      headingFont: font,
      typography: {
        ...document.theme.typography,
        headingFont: font,
        h1: { ...document.theme.typography.h1, fontFamily: font },
        h2: { ...document.theme.typography.h2, fontFamily: font },
        h3: { ...document.theme.typography.h3, fontFamily: font },
      },
    });
  };

  const handleBodyFontChange = (font: string) => {
    if (!document.theme?.typography) return;
    updateTheme({
      bodyFont: font,
      typography: {
        ...document.theme.typography,
        bodyFont: font,
        body: { ...document.theme.typography.body, fontFamily: font },
      },
    });
  };

  const layoutTokens = getThemeLayoutTokens(document.theme?.tokens);

  const handleTokenChange = (key: string, val: string) => {
    updateTheme({
      tokens: {
        ...(document.theme?.tokens || {}),
        [key]: val,
      },
    });
  };

  return (
    <div className="w-80 shrink-0 border-r border-slate-800/80 bg-slate-950/95 flex flex-col h-full overflow-hidden select-none z-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-sm text-white tracking-tight">Site Design</h3>
        </div>
        <button
          type="button"
          onClick={() => setActiveNavTab(null)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
        {/* Color Palette */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Brand Color Palette</h4>
          <div className="grid grid-cols-2 gap-2">
            {([
              { id: 'primary', label: 'Primary', val: colors.primary },
              { id: 'secondary', label: 'Secondary', val: colors.secondary },
              { id: 'accent', label: 'Accent', val: colors.accent },
              { id: 'background', label: 'Background', val: colors.background },
              { id: 'surface', label: 'Surface', val: colors.surface },
              { id: 'text', label: 'Text', val: colors.text },
              { id: 'muted', label: 'Muted', val: colors.muted },
              { id: 'border', label: 'Border', val: colors.border },
            ] as Array<{ id: keyof ColorTokensV3; label: string; val: string }>).map((color) => (
              <div key={color.id} className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                  <span>{color.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color.val || '#FFFFFF'}
                    onChange={(e) => handleColorChange(color.id, e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <span className="text-[11px] font-mono text-slate-300 uppercase truncate">
                    {color.val || '#FFFFFF'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Typography Tokens */}
        <div className="space-y-3 pt-3 border-t border-slate-800/80">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Typography System</h4>

          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400">Heading Font</label>
            <select
              value={document.theme?.typography?.headingFont || document.theme?.typography?.h1?.fontFamily || 'Inter'}
              onChange={(e) => handleHeadingFontChange(e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none"
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400">Body Font</label>
            <select
              value={document.theme?.typography?.bodyFont || document.theme?.typography?.body?.fontFamily || 'Inter'}
              onChange={(e) => handleBodyFontChange(e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none"
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-800/80">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Layout & Buttons</h4>
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400">Container width</label>
            <input
              type="text"
              value={layoutTokens.containerMaxWidth}
              onChange={(e) => handleTokenChange('containerMaxWidth', e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none"
              placeholder="1200px"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400">Button radius</label>
            <input
              type="text"
              value={layoutTokens.buttonRadius}
              onChange={(e) => handleTokenChange('buttonRadius', e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none"
              placeholder="12px"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400">Button background</label>
            <select
              value={layoutTokens.buttonBackground}
              onChange={(e) => handleTokenChange('buttonBackground', e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="accent">Accent</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400">Button text</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={layoutTokens.buttonColor.startsWith('#') ? layoutTokens.buttonColor : '#FFFFFF'}
                onChange={(e) => handleTokenChange('buttonColor', e.target.value)}
                className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <span className="text-[11px] font-mono text-slate-300 uppercase truncate">{layoutTokens.buttonColor}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-800/80">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Type scale</h4>
          <label className="block space-y-1">
            <span className="text-[11px] text-slate-400">Heading scale</span>
            <input
              type="range"
              min="0.8"
              max="1.4"
              step="0.05"
              value={Number(layoutTokens.headingScale) || 1}
              onChange={(e) => handleTokenChange('headingScale', e.target.value)}
              className="w-full accent-indigo-500"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[11px] text-slate-400">Body scale</span>
            <input
              type="range"
              min="0.85"
              max="1.25"
              step="0.05"
              value={Number(layoutTokens.bodyScale) || 1}
              onChange={(e) => handleTokenChange('bodyScale', e.target.value)}
              className="w-full accent-indigo-500"
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400">Heading line height</span>
              <input
                value={layoutTokens.headingLineHeight}
                onChange={(e) => handleTokenChange('headingLineHeight', e.target.value)}
                className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400">Body line height</span>
              <input
                value={layoutTokens.bodyLineHeight}
                onChange={(e) => handleTokenChange('bodyLineHeight', e.target.value)}
                className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
              />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400">Letter spacing</span>
            <input
              value={layoutTokens.letterSpacing}
              onChange={(e) => handleTokenChange('letterSpacing', e.target.value)}
              className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
            />
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-800/80">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Radius, shadow, spacing</h4>
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400">Corner radius</span>
            <select
              value={String(document.theme?.tokens?.radius || 'md')}
              onChange={(e) => handleTokenChange('radius', e.target.value)}
              className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
            >
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="pill">Pill</option>
            </select>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400">Shadow</span>
            <select
              value={String(document.theme?.tokens?.shadow || 'subtle')}
              onChange={(e) => handleTokenChange('shadow', e.target.value)}
              className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
            >
              <option value="none">None</option>
              <option value="subtle">Subtle</option>
              <option value="medium">Medium</option>
              <option value="strong">Strong</option>
            </select>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400">Spacing scale</span>
            <input
              value={layoutTokens.spaceScale}
              onChange={(e) => handleTokenChange('spaceScale', e.target.value)}
              className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
              placeholder="8px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
