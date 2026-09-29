export function sortCategoriesByOrder<T extends { data: { order: number } }>(
  entries: readonly T[],
): T[] {
  return [...entries].sort((a, b) => a.data.order - b.data.order);
}
