export type Theme = 'light' | 'dark';
export type StoredTheme = Theme | null;

/**
 * A stored override always wins. With no override, first paint follows the
 * OS `prefers-color-scheme`. See ADR 0004 and the spec's Theme resolution
 * shape: `stored ?? (prefersDark ? 'dark' : 'light')`.
 */
export function resolveTheme(stored: StoredTheme, prefersDark: boolean): Theme {
  return stored ?? (prefersDark ? 'dark' : 'light');
}
