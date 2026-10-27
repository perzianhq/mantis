export interface OptionLike { label: string; value?: string }

/** Lowercase, accent-free, punctuation-free text so "São Paulo (SP)" and "sao paulo sp" compare equal. */
export const fold = (text: string): string =>
  text.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

/**
 * Indexes of the options that match `want`, from the first tier that has any:
 * value or exact label, case-insensitive label, substring, folded equal, folded substring, every word.
 * `loose` is true for the tiers where several hits mean the wording was ambiguous.
 */
export function matchOptions(opts: OptionLike[], want: string): { hits: number[]; loose: boolean } {
  const lower = want.toLowerCase();
  const folded = fold(want);
  const words = folded.split(' ').filter(Boolean);
  const tiers: ((o: OptionLike) => boolean)[] = [
    (o) => o.value === want || o.label === want,
    (o) => o.label.toLowerCase() === lower,
    (o) => o.label.toLowerCase().includes(lower),
    (o) => !!folded && fold(o.label) === folded,
    (o) => !!folded && fold(o.label).includes(folded),
    (o) => {
      if (!words.length) return false;
      const have = fold(o.label).split(' ');
      return words.every((w) => have.some((h) => h === w || h.startsWith(w)));
    },
  ];
  for (let t = 0; t < tiers.length; t++) {
    const hits = opts.flatMap((o, i) => (tiers[t]!(o) ? [i] : []));
    if (hits.length) return { hits, loose: t >= 3 };
  }
  return { hits: [], loose: false };
}

/** The `limit` options closest to `want` (shared words first, then shorter labels), for a "no such option" hint. */
export function closestOptions(labels: string[], want: string, limit = 8): string[] {
  if (labels.length <= limit) return labels;
  const words = fold(want).split(' ').filter(Boolean);
  const score = (label: string): number => {
    const have = fold(label).split(' ');
    return words.filter((w) => have.some((h) => h.startsWith(w) || w.startsWith(h) && h.length > 2)).length;
  };
  return labels
    .map((label, i) => ({ label, i, s: score(label) }))
    .sort((a, b) => b.s - a.s || a.label.length - b.label.length || a.i - b.i)
    .slice(0, limit)
    .map((x) => x.label);
}

/** "options: a | b" when all fit, else "closest of N: ..." so a long list still points at the likely match. */
export function optionHint(labels: string[], want: string, limit = 15): string {
  return labels.length <= limit
    ? `options: ${labels.join(' | ')}`
    : `closest of ${labels.length}: ${closestOptions(labels, want, limit).join(' | ')}`;
}
