'use client';

import * as React from 'react';
import { MapPin, Sparkles, Navigation } from 'lucide-react';
import { ThemeConfig, BusinessInfo } from '@/types';

export interface MapProps {
  id?: string;
  variant?: string;
  props?: Record<string, any>;
  theme?: Partial<ThemeConfig>;
  business?: Partial<BusinessInfo> | null;
  isEditing?: boolean;
}

export function MapSection({
  variant = 'embed-card',
  props = {},
  theme,
  business,
}: MapProps) {
  const badge = props.badge || 'Location';
  const headline = props.headline || 'Visit Our Flagship Space';
  const address = business?.address || props.address || '100 Montgomery St, Financial District, San Francisco, CA';
  const phone = business?.phone || props.phone || '+1 (555) 234-5678';
  const mapEmbedUrl =
    props.mapEmbedUrl ||
    'https://maps.google.com/maps?q=San+Francisco+Financial+District&t=&z=13&ie=UTF8&iwloc=&output=embed';

  const accentColor = theme?.accentColor || 'var(--kdba-accent, #6366f1)';
  const headingFont = theme?.headingFont || 'var(--kdba-heading-font, inherit)';
  const borderRadius = theme?.borderRadius || 'var(--kdba-radius, 16px)';

  return (
    <section id="location" className="py-20 px-6 border-t border-slate-800/80 bg-slate-900/40">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
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
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl leading-tight"
            style={{ fontFamily: headingFont }}
          >
            {headline}
          </h2>

          {address && (
            <p className="mt-2 text-slate-400 text-sm">{address}</p>
          )}
        </div>

        {/* Map Container */}
        <div
          className="relative overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl h-[420px]"
          style={{ borderRadius }}
        >
          <iframe
            title="Location Map"
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
            loading="lazy"
            allowFullScreen
          />

          {/* Floating Address Card */}
          <div
            className="absolute bottom-6 left-6 p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-xl max-w-sm hidden sm:block"
          >
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
              >
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Flagship Location
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">{address}</p>
                {phone && (
                  <p className="text-[11px] text-slate-400 mt-1">{phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
