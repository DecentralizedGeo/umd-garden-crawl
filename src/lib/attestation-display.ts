// Display helpers for the five committed Attestation records (ADR 0003).
// Pure data-in/data-out — no fetching, no DOM, no IPFS/EAS calls. The
// carousel is the only consumer today.

const CAPTURE_TIME_ZONE = 'America/New_York';

/**
 * Head/tail slice with an explicit ellipsis (never CSS `text-overflow`), so
 * the characters a visitor would check against another screen are the ones
 * they can see. Spec truncation widths: uid 8/6, proofset CID 10/6, wallet
 * address 6/4.
 */
export function truncateMiddle(value: string, headLength: number, tailLength: number): string {
  if (value.length <= headLength + tailLength) return value;
  return `${value.slice(0, headLength)}…${value.slice(-tailLength)}`;
}

/** Coordinates to five decimal places, matching how the event talks about place. */
export function formatCoordinates(latitude: number, longitude: number): string {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}

/**
 * Capture time rendered in America/New_York regardless of the viewer's own
 * timezone, e.g. "18 Aug 2026 · 11:45 EDT".
 */
export function formatCaptureTime(epochMs: number): string {
  const date = new Date(epochMs);

  const datePart = new Intl.DateTimeFormat('en-GB', {
    timeZone: CAPTURE_TIME_ZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);

  const timePart = new Intl.DateTimeFormat('en-GB', {
    timeZone: CAPTURE_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

  const zonePart =
    new Intl.DateTimeFormat('en-US', {
      timeZone: CAPTURE_TIME_ZONE,
      timeZoneName: 'short',
    })
      .formatToParts(date)
      .find((part) => part.type === 'timeZoneName')?.value ?? '';

  return `${datePart} · ${timePart} ${zonePart}`.trim();
}

/** Filebase IPFS gateway for a Proofset CID. */
export function proofsetCidUrl(cid: string): string {
  return `https://ipfs.filebase.io/ipfs/${cid}`;
}

/** EAS on Sepolia for an Attestation uid. */
export function attestationUidUrl(uid: string): string {
  return `https://sepolia.easscan.org/attestation/view/${uid}`;
}

/** ProofCheck, keyed by the Proofset CID. */
export function proofCheckUrl(cid: string): string {
  return `https://check.proofmode.org/#${cid}`;
}
