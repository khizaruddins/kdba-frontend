'use client';

import * as React from 'react';
import { ThemeConfig } from '@/types';
import { buildGoogleFontsUrl, formatFontFamilyWithFallback } from '@/lib/fonts/google-fonts';

export interface ThemeProviderProps {
  theme?: Partial<ThemeConfig>;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ThemeProvider({
  theme,
  children,
  className = '',
  style = {},
}: ThemeProviderProps) {
  const primaryColor = theme?.primaryColor || '#0f172a';
  const secondaryColor = theme?.secondaryColor || '#1e293b';
  const accentColor = theme?.accentColor || '#6366f1';
  const backgroundColor = theme?.backgroundColor || primaryColor;
  const surfaceColor = theme?.surfaceColor || secondaryColor;
  const textColor = theme?.textColor || '#f8fafc';
  const mutedTextColor = theme?.mutedTextColor || '#94a3b8';
  const headingFont = formatFontFamilyWithFallback(theme?.headingFont || 'Inter');
  const bodyFont = formatFontFamilyWithFallback(theme?.bodyFont || 'Inter');
  const borderRadius = theme?.borderRadius || '8px';

  const googleFontsUrl = React.useMemo(() => {
    return buildGoogleFontsUrl([theme?.headingFont, theme?.bodyFont]);
  }, [theme?.headingFont, theme?.bodyFont]);

  // Convert theme into scoped CSS variables
  const cssVariables: React.CSSProperties = {
    '--kdba-primary': primaryColor,
    '--kdba-secondary': secondaryColor,
    '--kdba-accent': accentColor,
    '--kdba-background': backgroundColor,
    '--kdba-surface': surfaceColor,
    '--kdba-text': textColor,
    '--kdba-muted-text': mutedTextColor,
    '--kdba-heading-font': headingFont,
    '--kdba-body-font': bodyFont,
    '--kdba-radius': borderRadius,
    fontFamily: bodyFont,
    color: textColor,
    ...style,
  } as React.CSSProperties;

  return (
    <div
      className={`kdba-theme-root w-full min-h-screen text-slate-100 ${className}`}
      style={cssVariables}
      suppressHydrationWarning
    >
      {googleFontsUrl && (
        // eslint-disable-next-line @next/next/no-page-custom-font
        <link rel="stylesheet" href={googleFontsUrl} />
      )}
      {children}
    </div>
  );
}
