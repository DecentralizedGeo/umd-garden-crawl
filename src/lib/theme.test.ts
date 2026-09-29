import { describe, expect, test } from 'vitest';
import { resolveTheme } from './theme';

describe('resolveTheme', () => {
  test('a stored "light" override wins even when the OS prefers dark', () => {
    expect(resolveTheme('light', true)).toBe('light');
  });

  test('a stored "dark" override wins even when the OS prefers light', () => {
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  test('falls back to dark when nothing is stored and the OS prefers dark', () => {
    expect(resolveTheme(null, true)).toBe('dark');
  });

  test('falls back to light when nothing is stored and the OS prefers light', () => {
    expect(resolveTheme(null, false)).toBe('light');
  });
});
