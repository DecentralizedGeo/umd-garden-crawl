import { describe, expect, test } from 'vitest';
import { syncHomeCarousel } from './home-carousel';

class FakeEl {
  hidden = false;
  textContent: string | null = null;
  private attrs: Record<string, string> = {};

  constructor(index?: number) {
    if (index !== undefined) this.attrs['data-index'] = String(index);
  }

  getAttribute(name: string): string | null {
    return this.attrs[name] ?? null;
  }

  setAttribute(name: string, value: string): void {
    this.attrs[name] = value;
  }

  removeAttribute(name: string): void {
    delete this.attrs[name];
  }
}

function fixture(total = 3) {
  const images = Array.from({ length: total }, (_, i) => new FakeEl(i));
  const datas = Array.from({ length: total }, (_, i) => new FakeEl(i));
  const dots = Array.from({ length: total }, (_, i) => new FakeEl(i));
  const counter = new FakeEl();
  return { images, datas, dots, counter, total };
}

describe('syncHomeCarousel', () => {
  test('inactive data panels stay in layout and are aria-hidden', () => {
    const { images, datas, dots, counter, total } = fixture();

    syncHomeCarousel({ images, datas, dots, counter, index: 2, total });

    for (const data of datas) {
      expect(data.hidden).toBe(false);
    }
    expect(datas[0].getAttribute('aria-hidden')).toBe('true');
    expect(datas[1].getAttribute('aria-hidden')).toBe('true');
    expect(datas[2].getAttribute('aria-hidden')).toBe('false');
    expect(datas[2].getAttribute('aria-live')).toBe('polite');
    expect(datas[0].getAttribute('aria-live')).toBeNull();
  });

  test('images still toggle with the HTML hidden attribute', () => {
    const { images, datas, dots, counter, total } = fixture();

    syncHomeCarousel({ images, datas, dots, counter, index: 1, total });

    expect(images[0].hidden).toBe(true);
    expect(images[1].hidden).toBe(false);
    expect(images[2].hidden).toBe(true);
  });

  test('dots mark the active record and the counter matches 1-based index', () => {
    const { images, datas, dots, counter, total } = fixture();

    syncHomeCarousel({ images, datas, dots, counter, index: 0, total });

    expect(dots[0].getAttribute('aria-current')).toBe('true');
    expect(dots[1].getAttribute('aria-current')).toBeNull();
    expect(counter.textContent).toBe('1 / 3');
  });

  test('wraps a negative index through the end of the list', () => {
    const { images, datas, dots, counter, total } = fixture();

    const shown = syncHomeCarousel({ images, datas, dots, counter, index: -1, total });

    expect(shown).toBe(2);
    expect(datas[2].getAttribute('aria-hidden')).toBe('false');
    expect(images[2].hidden).toBe(false);
  });
});
