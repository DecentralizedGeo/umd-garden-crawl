import { afterEach, describe, expect, test, vi } from 'vitest';
import { resolveGardenReferenceMapUrl, resolveSubmissionsMapUrl, siteConfig } from './site-config';

describe('resolveSubmissionsMapUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test('returns the URL and available true when PUBLIC_SUBMISSIONS_MAP_URL is set', () => {
    vi.stubEnv('PUBLIC_SUBMISSIONS_MAP_URL', 'https://example.com/map');
    expect(resolveSubmissionsMapUrl()).toEqual({
      url: 'https://example.com/map',
      available: true,
    });
  });

  test('returns url null and available false when PUBLIC_SUBMISSIONS_MAP_URL is unset', () => {
    vi.stubEnv('PUBLIC_SUBMISSIONS_MAP_URL', undefined);
    expect(resolveSubmissionsMapUrl()).toEqual({
      url: null,
      available: false,
    });
  });

  test('returns url null and available false when PUBLIC_SUBMISSIONS_MAP_URL is empty', () => {
    vi.stubEnv('PUBLIC_SUBMISSIONS_MAP_URL', '');
    expect(resolveSubmissionsMapUrl()).toEqual({
      url: null,
      available: false,
    });
  });
});

describe('resolveGardenReferenceMapUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test('returns the URL and available true when PUBLIC_GARDEN_REFERENCE_MAP_URL is set', () => {
    vi.stubEnv('PUBLIC_GARDEN_REFERENCE_MAP_URL', 'https://example.com/garden-reference');
    expect(resolveGardenReferenceMapUrl()).toEqual({
      url: 'https://example.com/garden-reference',
      available: true,
    });
  });

  test('returns the committed default when PUBLIC_GARDEN_REFERENCE_MAP_URL is unset', () => {
    vi.stubEnv('PUBLIC_GARDEN_REFERENCE_MAP_URL', undefined);
    expect(resolveGardenReferenceMapUrl()).toEqual({
      url: siteConfig.gardenReferenceMapUrl,
      available: true,
    });
  });

  test('returns the committed default when PUBLIC_GARDEN_REFERENCE_MAP_URL is empty', () => {
    vi.stubEnv('PUBLIC_GARDEN_REFERENCE_MAP_URL', '');
    expect(resolveGardenReferenceMapUrl()).toEqual({
      url: siteConfig.gardenReferenceMapUrl,
      available: true,
    });
  });
});
