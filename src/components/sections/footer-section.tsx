'use client';

import * as React from 'react';
import { SectionProps } from './section-renderer';

export function FooterSection({
  config,
  business,
  onNavigate,
}: SectionProps) {
  const brandName = business?.name || 'KDBA';
  const copyright =
    config.copyright || `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`;
  const tagline =
    config.tagline || 'Crafted with precision and modern digital branding.';
  const links = config.links || [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about' },
    { label: 'Contact', url: '/contact' },
  ];

  return (
    <footer className="mt-auto w-full border-t border-slate-800/80 bg-slate-950 px-6 py-12 text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row text-center sm:text-left">
        <div>
          <p className="text-sm font-semibold text-white">{brandName}</p>
          <p className="mt-1 text-xs text-slate-500">{tagline}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
          {links.map((link: any, idx: number) => (
            <a
              key={idx}
              href={link.url}
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate(link.url);
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-xs text-slate-500">{copyright}</p>
      </div>
    </footer>
  );
}
