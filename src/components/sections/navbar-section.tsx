'use client';

import * as React from 'react';
import { SectionProps } from './section-renderer';
import { Menu, X } from 'lucide-react';

export function NavbarSection({
  config,
  theme,
  business,
  isEditing,
  onNavigate,
}: SectionProps) {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const brandName = business?.name || config.brandName || 'KDBA Business';
  const logoText = config.logoText || brandName.slice(0, 8).toUpperCase();
  const logoUrl = business?.logoUrl || config.logoUrl;
  const links = config.links || [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about' },
    { label: 'Contact', url: '/contact' },
  ];
  const ctaText = config.ctaText || 'Get in Touch';
  const ctaUrl = config.ctaUrl || '/contact';

  const accentColor = theme?.accentColor || '#6366f1';
  const primaryColor = theme?.primaryColor || '#0f172a';

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(url);
    }
  };

  return (
    <header
      className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors"
      style={{
        backgroundColor: `${primaryColor}e6`,
        borderColor: 'rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Brand / Logo */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={brandName}
              className="h-9 w-auto max-w-[140px] rounded object-contain"
            />
          ) : (
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg font-bold text-white shadow-md text-sm"
              style={{ backgroundColor: accentColor }}
            >
              {logoText.slice(0, 2)}
            </div>
          )}
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-slate-200 transition-colors">
            {brandName}
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link: any, idx: number) => (
            <a
              key={idx}
              href={link.url}
              onClick={(e) => handleLinkClick(e, link.url)}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          {ctaText && (
            <a
              href={ctaUrl}
              onClick={(e) => handleLinkClick(e, ctaUrl)}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: accentColor,
                borderRadius: theme?.borderRadius || '8px',
              }}
            >
              {ctaText}
            </a>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileOpen && (
        <div className="border-b border-slate-800 bg-slate-900/95 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((link: any, idx: number) => (
              <a
                key={idx}
                href={link.url}
                onClick={(e) => {
                  setIsMobileOpen(false);
                  handleLinkClick(e, link.url);
                }}
                className="text-sm font-medium text-slate-300 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            {ctaText && (
              <a
                href={ctaUrl}
                onClick={(e) => {
                  setIsMobileOpen(false);
                  handleLinkClick(e, ctaUrl);
                }}
                className="mt-2 text-center rounded-lg px-4 py-2.5 text-xs font-semibold text-white"
                style={{ backgroundColor: accentColor }}
              >
                {ctaText}
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
