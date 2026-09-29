import { describe, expect, test } from 'vitest';
import { splitProvisional } from './provisional';

describe('splitProvisional', () => {
  test('splits a string with one {{...}} span into surrounding text and a provisional segment', () => {
    expect(splitProvisional('Eligible students {{subject to confirmation}} may participate.')).toEqual([
      { text: 'Eligible students ', provisional: false },
      { text: 'subject to confirmation', provisional: true },
      { text: ' may participate.', provisional: false },
    ]);
  });

  test('returns a single non-provisional segment when there are no spans', () => {
    expect(splitProvisional('The event is scheduled for October 1–31, 2026.')).toEqual([
      { text: 'The event is scheduled for October 1–31, 2026.', provisional: false },
    ]);
  });

  test('splits multiple spans into alternating provisional and non-provisional segments', () => {
    expect(
      splitProvisional('Verified against Proofmode {{not yet validated}} on {{pending walkthrough}}.'),
    ).toEqual([
      { text: 'Verified against Proofmode ', provisional: false },
      { text: 'not yet validated', provisional: true },
      { text: ' on ', provisional: false },
      { text: 'pending walkthrough', provisional: true },
      { text: '.', provisional: false },
    ]);
  });

  test('does not match a span that straddles a newline', () => {
    expect(splitProvisional('Keep {{this\nphrase}} unmarked.')).toEqual([
      { text: 'Keep {{this\nphrase}} unmarked.', provisional: false },
    ]);
  });

  test('does not match empty {{}}', () => {
    expect(splitProvisional('Contact {{}} for support.')).toEqual([
      { text: 'Contact {{}} for support.', provisional: false },
    ]);
  });
});
