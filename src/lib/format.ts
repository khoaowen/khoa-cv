/** Formatting helpers shared by web and print layouts. */

/** Render a start–end date range, using a localized "Present" when end is empty. */
export function dateRange(
  start: string | undefined,
  end: string | undefined,
  presentLabel: string,
): string {
  const s = (start ?? '').trim();
  const e = (end ?? '').trim();
  if (!s && !e) return '';
  if (!e) return `${s} – ${presentLabel}`;
  if (!s) return e;
  return `${s} – ${e}`;
}
