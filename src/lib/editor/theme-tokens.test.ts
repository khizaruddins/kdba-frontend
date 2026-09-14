import { describe, expect, it } from 'vitest';
import {
  isThemeColorToken,
  resolveThemeColor,
  getThemeLayoutTokens,
} from './theme-tokens';
import { resolveNodeStyles } from '@/components/renderer/v3/NodeRenderer';

describe('theme tokens', () => {
  it('keeps theme token names distinct from hex and maps them to CSS variables', () => {
    expect(isThemeColorToken('primary')).toBe(true);
    expect(isThemeColorToken('#4F46E5')).toBe(false);
    expect(resolveThemeColor('primary')).toBe('var(--kdba-primary)');
    expect(resolveThemeColor('#4F46E5')).toBe('#4F46E5');
  });

  it('falls back to default container and button layout tokens', () => {
    expect(getThemeLayoutTokens().containerMaxWidth).toBe('1200px');
    expect(getThemeLayoutTokens({ containerMaxWidth: '960px' }).containerMaxWidth).toBe('960px');
  });

  it('resolves token colors in rendered styles', () => {
    const css = resolveNodeStyles({
      typography: { color: 'primary' },
      background: { color: 'surface' },
    });
    expect(css.color).toBe('var(--kdba-primary)');
    expect(css.backgroundColor).toBe('var(--kdba-surface)');
  });
});
