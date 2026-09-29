import { describe, expect, test } from 'vitest';
import { sortCategoriesByOrder } from './categories';

describe('sortCategoriesByOrder', () => {
  test('sorts entries by data.order only', () => {
    const entries = [
      { id: 'explorer', data: { order: 3 } },
      { id: 'garden-crawl-challenge', data: { order: 1 } },
      { id: 'nature-in-focus', data: { order: 4 } },
      { id: 'daily-visitor', data: { order: 2 } },
    ];

    expect(sortCategoriesByOrder(entries).map((entry) => entry.id)).toEqual([
      'garden-crawl-challenge',
      'daily-visitor',
      'explorer',
      'nature-in-focus',
    ]);
  });
});
