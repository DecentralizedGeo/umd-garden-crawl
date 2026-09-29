export interface TextSegment {
  text: string;
  provisional: boolean;
}

/**
 * Splits a string on {{double-brace}} spans so a single unresolved phrase
 * inside a sentence can be flagged, without marking the whole sentence
 * provisional. Content-data-level mechanism, decided prior to this session.
 */
export function splitProvisional(input: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const pattern = /\{\{(.+?)\}\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(input))) {
    if (match.index > lastIndex) {
      segments.push({ text: input.slice(lastIndex, match.index), provisional: false });
    }
    segments.push({ text: match[1], provisional: true });
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < input.length) {
    segments.push({ text: input.slice(lastIndex), provisional: false });
  }
  return segments;
}
