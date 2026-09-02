'use client';

import * as React from 'react';
import { Sparkles, Globe, Mail } from 'lucide-react';
import { ThemeConfig, BusinessInfo } from '@/types';

export interface TeamProps {
  id?: string;
  variant?: string;
  props?: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  isEditing?: boolean;
}

export function TeamSection({
  variant = 'grid-cards',
  props = {},
  theme,
}: TeamProps) {
  const badge = props.badge || 'Our People';
  const headline = props.headline || 'Guided by Leaders & Visionaries';
  const subheadline =
    props.subheadline ||
    'Our multidisciplinary team brings deep domain insight, relentless dedication, and unmatched craft.';
  const items = props.items || [];

  const accentColor = theme?.accentColor || 'var(--kdba-accent, #6366f1)';
  const headingFont = theme?.headingFont || 'var(--kdba-heading-font, inherit)';
  const borderRadius = theme?.borderRadius || 'var(--kdba-radius, 16px)';

  return (
    <section id="team" className="py-20 md:py-28 px-6 border-t border-slate-800/80 bg-slate-950">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          {badge && (
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider mb-4 border"
              style={{
                borderColor: `${accentColor}30`,
                backgroundColor: `${accentColor}10`,
                color: accentColor,
              }}
            >
              <Sparkles className="h-3 w-3" />
              <span>{badge}</span>
            </div>
          )}

          <h2
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight"
            style={{ fontFamily: headingFont }}
          >
            {headline}
          </h2>

          {subheadline && (
            <p className="mt-4 text-slate-400 text-base sm:text-lg leading-relaxed">
              {subheadline}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((member: any, idx: number) => (
            <div
              key={idx}
              className="group overflow-hidden border border-slate-800 bg-slate-900/60 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between"
              style={{ borderRadius }}
            >
              <div>
                <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-900 text-2xl font-bold text-slate-500">
                      {member.name?.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <span
                    className="text-xs font-bold uppercase tracking-wider block"
                    style={{ color: accentColor }}
                  >
                    {member.role}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1 group-hover:text-slate-200">
                    {member.name}
                  </h3>
                  {member.bio && (
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center gap-3 text-slate-400">
                <button
                  type="button"
                  className="p-1.5 rounded-lg border border-slate-800 hover:text-white hover:border-slate-700 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded-lg border border-slate-800 hover:text-white hover:border-slate-700 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
