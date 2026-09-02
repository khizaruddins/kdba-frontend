'use client';

import * as React from 'react';
import { ThemeConfig, BusinessInfo } from '@/types';

export interface FooterProps {
  id?: string;
  variant?: string;
  props?: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  isEditing?: boolean;
  onNavigate?: (url: string) => void;
}

export function FooterSection({
  variant = 'multi-column',
  props = {},
  theme,
  business,
  onNavigate,
}: FooterProps) {
  const brandName = business?.name || props.brandName || 'Apex Advisory';
  const tagline =
    business?.description ||
    props.tagline ||
    'Delivering uncompromised strategy, craft, and technology worldwide.';
  const copyright =
    props.copyright ||
    `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`;
  const columns = props.columns || [
    {
      title: 'Company',
      links: [
        { label: 'About Us', url: '/about' },
        { label: 'Our Work', url: '#portfolio' },
        { label: 'Capabilities', url: '#services' },
        { label: 'Contact', url: '/contact' },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'Strategic Advisory', url: '#services' },
        { label: 'Brand Architecture', url: '#services' },
        { label: 'Enterprise Systems', url: '#services' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { label: 'Schedule Consultation', url: '/contact' },
        { label: 'Client Portal', url: '/login' },
        { label: 'Support SLA', url: '/contact' },
      ],
    },
  ];

  const accentColor = theme?.accentColor || 'var(--kdba-accent, #6366f1)';
  const primaryColor = theme?.primaryColor || 'var(--kdba-primary, #0f172a)';

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    if (url.startsWith('#')) return;
    e.preventDefault();
    if (onNavigate) {
      onNavigate(url);
    }
  };

  // Minimal centered variant
  if (variant === 'minimal-centered') {
    return (
      <footer
        className="border-t border-slate-800/80 py-12 px-6 text-center text-xs text-slate-500"
        style={{ backgroundColor: `${primaryColor}fa` }}
      >
        <div className="mx-auto max-w-4xl space-y-4">
          <span className="text-sm font-bold text-white block">{brandName}</span>
          <p className="text-slate-400 max-w-md mx-auto">{tagline}</p>
          <div className="pt-2 text-slate-500">{copyright}</div>
        </div>
      </footer>
    );
  }

  // Multi-column standard footer
  return (
    <footer
      className="border-t border-slate-800/80 pt-16 pb-12 px-6 text-slate-400 text-xs"
      style={{ backgroundColor: `${primaryColor}fa` }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/60">
          {/* Brand Info Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white shadow-md text-xs"
                style={{ backgroundColor: accentColor }}
              >
                {brandName.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-base font-bold text-white">{brandName}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {tagline}
            </p>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {columns.map((col: any, idx: number) => (
              <div key={idx} className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links?.map((link: any, lIdx: number) => (
                    <li key={lIdx}>
                      <a
                        href={link.url}
                        onClick={(e) => handleLinkClick(e, link.url)}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>{copyright}</p>
          <div className="flex items-center gap-6">
            <span>Powered by KDBA Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
