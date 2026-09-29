import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const homepage = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../pages/index.astro'),
  'utf8',
);

function mobileHeroCarouselRule(source: string): string {
  const media = source.split('@media (max-width: 900px)')[1];
  expect(media, 'homepage must keep the 900px mobile breakpoint').toBeDefined();
  const match = media.match(/\.hero-carousel\s*\{[^}]+\}/);
  expect(match, 'mobile block must still style .hero-carousel').toBeDefined();
  return match![0];
}

describe('homepage hero carousel plate (group 7)', () => {
  test('the mobile .hero-carousel rule does not clear the solid --surface plate', () => {
    const rule = mobileHeroCarouselRule(homepage);
    expect(rule).not.toMatch(/background\s*:\s*transparent/);
  });
});

describe('homepage carousel Garden-name height (group 8)', () => {
  test('car-data panels are stacked in one grid cell so inactive records still contribute height', () => {
    expect(homepage).toMatch(/class="car-data-stack"/);
    expect(homepage).toMatch(/\.car-data-stack\s*\{[^}]*display:\s*grid/);
    expect(homepage).toMatch(/\.car-data-stack\s*>\s*\.car-data\s*\{[^}]*grid-area:\s*1\s*\/\s*1/);
  });

  test('car-data markup does not use the HTML hidden attribute (it would collapse the stack)', () => {
    const openTags = homepage.match(/<div\s+class="car-data"[\s\S]*?>/g) ?? [];
    expect(openTags.length).toBeGreaterThan(0);
    for (const tag of openTags) {
      expect(tag).not.toMatch(/(?<!aria-)hidden\b/);
    }
  });
});
