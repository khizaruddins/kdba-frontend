'use client';

import * as React from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { ThemeConfig, BusinessInfo } from '@/types';

export interface OpeningHoursProps {
  id?: string;
  variant?: string;
  props?: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  isEditing?: boolean;
}

export function OpeningHoursSection({
  variant = 'card-table',
  props = {},
  theme,
  business,
}: OpeningHoursProps) {
  const badge = props.badge || 'Hours of Operation';
  const headline = props.headline || 'Weekly Schedule & Availability';
  const note = props.note || 'Reservations recommended for evening seatings and consultations.';
  const schedule =
    business?.businessHours && Array.isArray(business.businessHours)
      ? business.businessHours
      : (props.schedule || [
          { days: 'Monday – Thursday', hours: '8:00 AM – 9:00 PM' },
          { days: 'Friday & Saturday', hours: '8:00 AM – 11:00 PM' },
          { days: 'Sunday', hours: '9:00 AM – 8:00 PM' },
        ]);

  const accentColor = theme?.accentColor || 'var(--kdba-accent, #6366f1)';
  const headingFont = theme?.headingFont || 'var(--kdba-heading-font, inherit)';
  const borderRadius = theme?.borderRadius || 'var(--kdba-radius, 16px)';

  return (
    <section id="hours" className="py-20 px-6 border-t border-slate-800/80 bg-slate-950">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-14">
          {badge && (
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider mb-4 border"
              style={{
                borderColor: `${accentColor}30`,
                backgroundColor: `${accentColor}10`,
                color: accentColor,
              }}
            >
              <Clock className="h-3 w-3" />
              <span>{badge}</span>
            </div>
          )}

          <h2
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl leading-tight"
            style={{ fontFamily: headingFont }}
          >
            {headline}
          </h2>
        </div>

        {/* Schedule Card Table */}
        <div
          className="p-8 border border-slate-800 bg-slate-900/70 shadow-2xl space-y-4"
          style={{ borderRadius }}
        >
          {schedule.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 border-b border-slate-800/80 last:border-0"
            >
              <span className="text-sm font-semibold text-white">
                {item.days}
              </span>
              <span
                className="text-xs sm:text-sm font-bold font-mono px-3 py-1 rounded-lg border border-slate-700/60 bg-slate-950/80"
                style={{ color: accentColor }}
              >
                {item.hours}
              </span>
            </div>
          ))}

          {note && (
            <p className="pt-4 text-xs text-slate-400 text-center italic border-t border-slate-800/60">
              {note}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
