import { describe, expect, test } from 'vitest';
import { formatCaptureTime, formatCoordinates, truncateMiddle } from './attestation-display';

describe('truncateMiddle', () => {
  test('uid: 8 head / 6 tail, ellipsis in between', () => {
    const uid = '0x7ee98a56bf71fb1618aa69df766876a35b8948de17b010e51e500384fc5718e1';
    expect(truncateMiddle(uid, 8, 6)).toBe('0x7ee98a…5718e1');
  });

  test('proofset CID: 10 head / 6 tail', () => {
    const cid = 'bafybeidrobg72ez6vjz2x5cw3fob56dxwnr66ppgs726fcwdzc3grdiugq';
    expect(truncateMiddle(cid, 10, 6)).toBe('bafybeidro…rdiugq');
  });

  test('wallet address: 6 head / 4 tail', () => {
    const wallet = '0xbEd1e6E87bB90D4c3B84CD78e7B4D92fD949d5cE';
    expect(truncateMiddle(wallet, 6, 4)).toBe('0xbEd1…d5cE');
  });

  test('a value no longer than head + tail is returned unchanged', () => {
    expect(truncateMiddle('short', 6, 4)).toBe('short');
  });
});

describe('formatCoordinates', () => {
  test('formats latitude and longitude to five decimal places', () => {
    expect(formatCoordinates(38.9823808846995, -76.9398162793368)).toBe('38.98238, -76.93982');
  });

  test('pads to five decimals when the source has fewer', () => {
    expect(formatCoordinates(38.5, -76.1)).toBe('38.50000, -76.10000');
  });
});

describe('formatCaptureTime', () => {
  test('renders a pinned UTC instant in America/New_York (summer, EDT)', () => {
    // 2026-08-18T15:45:31.814Z -> 11:45 EDT (UTC-4)
    expect(formatCaptureTime(1787067931814)).toBe('18 Aug 2026 · 11:45 EDT');
  });

  test('renders a pinned UTC instant in America/New_York (winter, EST)', () => {
    // 2026-01-15T18:30:00.000Z -> 13:30 EST (UTC-5)
    expect(formatCaptureTime(Date.UTC(2026, 0, 15, 18, 30, 0))).toBe('15 Jan 2026 · 13:30 EST');
  });
});
