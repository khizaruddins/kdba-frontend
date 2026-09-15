import type { CSSProperties } from 'react';

export const BUTTON_VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'link'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export const CARD_VARIANTS = ['default', 'elevated', 'minimal', 'bordered'] as const;
export type CardVariant = (typeof CARD_VARIANTS)[number];

export const HERO_VARIANTS = ['centered', 'split', 'image-background', 'media'] as const;
export type HeroVariant = (typeof HERO_VARIANTS)[number];

export const HEADER_VARIANTS = ['standard', 'centered', 'minimal'] as const;
export type HeaderVariant = (typeof HEADER_VARIANTS)[number];

export function buttonVariantStyle(variant?: string): CSSProperties {
  switch (variant) {
    case 'secondary':
      return {
        backgroundColor: 'var(--kdba-surface)',
        color: 'var(--kdba-text)',
        border: '1px solid var(--kdba-border)',
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        color: 'var(--kdba-primary)',
        border: '1px solid var(--kdba-primary)',
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        color: 'var(--kdba-text)',
        border: '1px solid transparent',
      };
    case 'link':
      return {
        backgroundColor: 'transparent',
        color: 'var(--kdba-primary)',
        border: '0',
        textDecoration: 'underline',
        paddingLeft: 0,
        paddingRight: 0,
      };
    default:
      return {
        backgroundColor: 'var(--kdba-button-bg)',
        color: 'var(--kdba-button-fg)',
        border: '1px solid transparent',
      };
  }
}

export function cardVariantStyle(variant?: string): CSSProperties {
  switch (variant) {
    case 'elevated':
      return {
        backgroundColor: 'var(--kdba-surface)',
        boxShadow: 'var(--kdba-shadow)',
        borderRadius: 'var(--kdba-radius)',
        padding: '24px',
      };
    case 'minimal':
      return {
        backgroundColor: 'transparent',
        padding: '8px 0',
      };
    case 'bordered':
      return {
        backgroundColor: 'var(--kdba-surface)',
        border: '1px solid var(--kdba-border)',
        borderRadius: 'var(--kdba-radius)',
        padding: '24px',
      };
    default:
      return {
        backgroundColor: 'var(--kdba-surface)',
        borderRadius: 'var(--kdba-radius)',
        padding: '24px',
      };
  }
}
