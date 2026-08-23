'use client';

import * as React from 'react';
import { SectionProps } from './section-renderer';

export function TeamSection({ config, theme }: SectionProps) {
  const badge = config.badge || 'Team';
  const headline = config.headline || 'Meet Our Experts';
  const items = config.items || [];

  const accentColor = theme?.accentColor || '#6366f1';

  return (
    <section className="py-20 px-6 border-t border-slate-800/80 bg-slate-950/40">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-4 border"
            style={{
              borderColor: `${accentColor}30`,
              backgroundColor: `${accentColor}10`,
              color: accentColor,
            }}
          >
            {badge}
          </div>

          <h2
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ fontFamily: theme?.headingFont || 'inherit' }}
          >
            {headline}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center">
          {items.map((member: any, idx: number) => (
            <div
              key={idx}
              className="text-center rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm flex flex-col items-center"
              style={{ borderRadius: theme?.borderRadius || '16px' }}
            >
              {member.avatar && (
                <div className="relative mb-5 h-28 w-28 overflow-hidden rounded-full border-2 border-slate-700 shadow-md">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-lg font-semibold text-white">{member.name}</h3>
              <p className="mt-1 text-xs font-medium" style={{ color: accentColor }}>
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
