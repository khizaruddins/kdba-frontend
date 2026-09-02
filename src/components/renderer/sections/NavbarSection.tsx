'use client';

import * as React from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { ThemeConfig, BusinessInfo } from '@/types';

export interface NavbarProps {
  id?: string;
  variant?: string;
  props?: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  isEditing?: boolean;
  onNavigate?: (url: string) => void;
}

export function NavbarSection({
  variant = 'standard',
  props = {},
  theme,
  business,
  onNavigate,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const brandName = business?.name || props.brandName || 'KDBA Business';
  const logoUrl = business?.logoUrl || props.logoUrl;
  const links = props.links || [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about' },
    { label: 'Services', url: '#services' },
    { label: 'Contact', url: '/contact' },
  ];
  const ctaText = props.ctaText || 'Get in Touch';
  const ctaUrl = props.ctaUrl || '/contact';

  const accentColor = theme?.accentColor || 'var(--kdba-accent, #6366f1)';
  const primaryColor = theme?.primaryColor || 'var(--kdba-primary, #0f172a)';

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    if (url.startsWith('#')) return;
    e.preventDefault();
    if (onNavigate) {
      onNavigate(url);
    }
  };

  // Floating variant wrapper
  if (variant === 'floating') {
    return (
      <header className="sticky top-4 z-50 w-full px-4 sm:px-6">
        <div
          className="mx-auto max-w-5xl rounded-2xl border border-white/10 px-6 py-3.5 backdrop-blur-xl shadow-2xl transition-all"
          style={{ backgroundColor: `rgba(15, 23, 42, 0.8)` }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, '/')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {logoUrl ? (
                <img src={logoUrl} alt={brandName} className="h-8 w-auto object-contain rounded" />
              ) : (
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white shadow-md text-xs"
                  style={{ backgroundColor: accentColor }}
                >
                  {brandName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="text-base font-bold tracking-tight text-white group-hover:text-slate-200">
                {brandName}
              </span>
            </a>

            {/* Links */}
            <nav className="hidden md:flex items-center gap-6">
              {links.map((link: any, idx: number) => (
                <a
                  key={idx}
                  href={link.url}
                  onClick={(e) => handleLinkClick(e, link.url)}
                  className="text-xs font-medium text-slate-300 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              {ctaText && (
                <a
                  href={ctaUrl}
                  onClick={(e) => handleLinkClick(e, ctaUrl)}
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                  style={{ backgroundColor: accentColor }}
                >
                  <span>{ctaText}</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 text-slate-400 hover:text-white md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="pt-4 pb-2 border-t border-slate-800/80 mt-3 md:hidden space-y-2">
              {links.map((link: any, idx: number) => (
                <a
                  key={idx}
                  href={link.url}
                  onClick={(e) => {
                    setMobileOpen(false);
                    handleLinkClick(e, link.url);
                  }}
                  className="block py-1.5 text-xs font-medium text-slate-300 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              {ctaText && (
                <a
                  href={ctaUrl}
                  onClick={(e) => {
                    setMobileOpen(false);
                    handleLinkClick(e, ctaUrl);
                  }}
                  className="block text-center rounded-lg py-2 text-xs font-semibold text-white mt-2"
                  style={{ backgroundColor: accentColor }}
                >
                  {ctaText}
                </a>
              )}
            </div>
          )}
        </div>
      </header>
    );
  }

  // Centered Variant
  if (variant === 'centered') {
    const half = Math.ceil(links.length / 2);
    const leftLinks = links.slice(0, half);
    const rightLinks = links.slice(half);

    return (
      <header
        className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors"
        style={{
          backgroundColor: `${primaryColor}e6`,
          borderColor: 'rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <nav className="hidden md:flex items-center gap-6">
            {leftLinks.map((link: any, idx: number) => (
              <a
                key={idx}
                href={link.url}
                onClick={(e) => handleLinkClick(e, link.url)}
                className="text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="flex items-center gap-2.5 cursor-pointer text-center mx-auto md:mx-0"
          >
            {logoUrl ? (
              <img src={logoUrl} alt={brandName} className="h-8 w-auto object-contain rounded" />
            ) : (
              <span className="text-lg font-bold tracking-tight text-white font-serif">
                {brandName}
              </span>
            )}
          </a>

          <nav className="hidden md:flex items-center gap-6">
            {rightLinks.map((link: any, idx: number) => (
              <a
                key={idx}
                href={link.url}
                onClick={(e) => handleLinkClick(e, link.url)}
                className="text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            {ctaText && (
              <a
                href={ctaUrl}
                onClick={(e) => handleLinkClick(e, ctaUrl)}
                className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm"
                style={{ backgroundColor: accentColor }}
              >
                {ctaText}
              </a>
            )}
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-400 hover:text-white md:hidden ml-auto"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-b border-slate-800 bg-slate-900/95 px-6 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              {links.map((link: any, idx: number) => (
                <a
                  key={idx}
                  href={link.url}
                  onClick={(e) => {
                    setMobileOpen(false);
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
                    setMobileOpen(false);
                    handleLinkClick(e, ctaUrl);
                  }}
                  className="text-center rounded-lg px-4 py-2 text-xs font-semibold text-white mt-2"
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

  // Standard & Minimal Variants
  return (
    <header
      className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors"
      style={{
        backgroundColor: `${primaryColor}f0`,
        borderColor: 'rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Brand */}
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
              {brandName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-slate-200 transition-colors">
            {brandName}
          </span>
        </a>

        {/* Links */}
        {variant !== 'minimal' && (
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
          </nav>
        )}

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          {ctaText && (
            <a
              href={ctaUrl}
              onClick={(e) => handleLinkClick(e, ctaUrl)}
              className="rounded-xl px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:opacity-90 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: accentColor,
                borderRadius: theme?.borderRadius || '8px',
              }}
            >
              {ctaText}
            </a>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-b border-slate-800 bg-slate-900/95 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((link: any, idx: number) => (
              <a
                key={idx}
                href={link.url}
                onClick={(e) => {
                  setMobileOpen(false);
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
                  setMobileOpen(false);
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
