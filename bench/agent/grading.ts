/** Deterministic answer grading shared by fixture and frozen real-site tasks. */
export type AnswerFactType = 'text' | 'number' | 'entity';

export interface AnswerRequirement {
  id: string;
  type: AnswerFactType;
  value: string | number;
  /** Require this fact and its companion in the same answer clause. */
  with?: { type: AnswerFactType; value: string | number };
}

export interface AnswerGrade {
  pass: boolean;
  failed: string[];
  requirements: AnswerRequirement[];
}

const esc = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const norm = (value: string): string => value.replace(/\s+/g, ' ').trim().toLowerCase();
const pairs: Record<string, string> = { '"': '"', '\u201c': '\u201d', '\u2018': '\u2019' };

/** Retain the whole reply (including prose before ANSWER) while removing only wrapping protocol quotes. */
export function normalizeGradedAnswer(answer: string): string {
  const trimmed = answer.trim();
  const unquote = (value: string): string => {
    const closing = pairs[value[0] ?? ''];
    return closing && value.endsWith(closing) ? value.slice(1, -1).trim() : value;
  };
  const answerLine = /(^|[\r\n])(ANSWER:\s*)([\s\S]*)$/i.exec(trimmed);
  return answerLine
    ? `${trimmed.slice(0, answerLine.index)}${answerLine[1]}${answerLine[2]}${unquote(answerLine[3].trim())}`
    : unquote(trimmed);
}

const numericPattern = (raw: string | number): string => {
  const value = String(raw).replace(/,/g, '');
  const [whole, fraction = ''] = value.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const integer = `(?:${esc(whole)}|${esc(grouped)})`;
  // Positive integer keys accept harmless decimal-zero formatting (18.0) but
  // never a signed value, a fractional suffix, or a grouped larger number.
  if (!fraction) return `(?<![\\p{L}\\p{N}.,-])${integer}(?:\\.0*)?(?![\\p{L}\\p{N}]|[.,]\\d)`;
  const significant = fraction.replace(/0+$/, '') || '0';
  return `(?<![\\p{L}\\p{N}.,-])${integer}\\.${esc(significant)}0*(?![\\p{L}\\p{N}]|[.,]\\d)`;
};

const textPattern = (value: string | number, bounded: boolean): string => {
  // Page text may use non-breaking spaces in headings. Treat every whitespace
  // run in a text contract as equivalent while preserving word boundaries.
  const body = esc(String(value).replace(/\s+/g, ' ').trim()).replace(/ /g, '\\s+');
  return bounded ? `(?<![\\p{L}\\p{N}])${body}(?![\\p{L}\\p{N}])` : body;
};

const patternFor = (requirement: Pick<AnswerRequirement, 'type' | 'value'>): RegExp =>
  new RegExp(requirement.type === 'number' ? numericPattern(requirement.value) : textPattern(requirement.value, requirement.type === 'entity'), 'giu');

const isNegated = (source: string, at: number, end = at): boolean => {
  // Only reject a negation in the same unbroken clause. This keeps valid contrasts
  // such as "not Basic; Team is $29" while rejecting "Team is not $29".
  const clause = source.slice(Math.max(0, at - 48), at);
  return /(?:\bnot|\bno|\bisn't|\bwasn't|\bdoesn't|\bdidn't)\s+(?:[\p{Sc}$€£₹]?\s*)?(?:\w+\s+){0,4}$/iu.test(clause) ||
    /\b(?:is|was|are|were|equals?)\s+not\s+(?:[\p{Sc}$€£₹]?\s*)?(?:\w+\s+){0,3}$/iu.test(clause) ||
    // A matched phrase can itself be the subject of a negative assertion.
    /^\s+(?:is|was|are|were|equals?)\s+not\b/iu.test(source.slice(end, end + 32));
};

const matches = (source: string, requirement: Pick<AnswerRequirement, 'type' | 'value'>): RegExpMatchArray[] =>
  [...source.matchAll(patternFor(requirement))];

const isConflicted = (source: string, match: RegExpMatchArray, type: AnswerFactType): boolean => {
  if (type === 'text') return false;
  const start = match.index!;
  const end = start + match[0].length;
  // A direct "X or Y" answer is an unresolved alternative, not a confident
  // claim. Do not try to infer conflict from arbitrary prose elsewhere.
  return /\s+(?:or|either)\s+(?:[\p{Sc}$€£₹]?\s*)?[\p{L}\p{N}_-]+/iu.test(source.slice(end, end + 32)) ||
    /(?:[\p{Sc}$€£₹]?\s*)?[\p{L}\p{N}_-]+\s+(?:or|either)\s*$/iu.test(source.slice(Math.max(0, start - 32), start));
};

const sameClause = (source: string, a: RegExpMatchArray, b: RegExpMatchArray): boolean => {
  const left = a.index! <= b.index! ? a : b;
  const right = left === a ? b : a;
  const between = source.slice(left.index! + left[0].length, right.index!);
  // Inspect only text *between* claims: decimal points, SKU punctuation and
  // email/domain punctuation inside a matched token must not split an answer.
  if (/[;!\n]/u.test(between)) return false;
  if (/[.?]/u.test(between)) return /^\.\s*(?:it|they|this|that)\s+(?:is|was|equals?)?\s*$/iu.test(between);
  // A comma introducing another named subject separates associations, while a
  // grouping comma is inside the numeric match and never reaches this string.
  return !/(?:,|\band)\s+(?=[A-Z][\p{L}\p{N}_ -]{1,32}\b(?:is|has|was|costs?|:))/u.test(between);
};

/** Compatibility-normalise (CO₂ vs CO2, ligatures, full-width digits) and drop markdown code/bold wrappers so formatting never decides a match. */
const canonical = (value: string): string => value.normalize('NFKC').replace(/`+/g, '').replace(/\*\*/g, '');

export function matchesAnswerRequirement(rawSource: string, rawRequirement: AnswerRequirement): boolean {
  const source = canonical(rawSource);
  const requirement: AnswerRequirement = {
    ...rawRequirement,
    value: typeof rawRequirement.value === 'string' ? canonical(rawRequirement.value) : rawRequirement.value,
    ...(rawRequirement.with ? { with: { ...rawRequirement.with, value: typeof rawRequirement.with.value === 'string' ? canonical(rawRequirement.with.value) : rawRequirement.with.value } } : {}),
  };
  const primary = matches(source, requirement).filter((match) => !isNegated(source, match.index!, match.index! + match[0].length) && !isConflicted(source, match, requirement.type));
  if (!primary.length) return false;
  if (!requirement.with) return true;
  const companion = matches(source, requirement.with).filter((match) => !isNegated(source, match.index!, match.index! + match[0].length));
  return primary.some((left) => companion.some((right) => sameClause(source, left, right)));
}

/** A legacy response-form regex is only affirmative when its matched claim is not negated. */
export function matchesAffirmedPattern(source: string, pattern: RegExp): boolean {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  const matcher = new RegExp(pattern.source, flags);
  for (const match of source.matchAll(matcher)) {
    const at = match.index ?? 0;
    if (!isNegated(source, at, at + match[0].length)) return true;
  }
  return false;
}

export function gradeRequirements(rawReply: string, requirements: AnswerRequirement[]): AnswerGrade {
  const answer = normalizeGradedAnswer(rawReply);
  const failed = requirements.filter((requirement) => !matchesAnswerRequirement(answer, requirement)).map((requirement) =>
    requirement.with ? `answer lacks associated ${String(requirement.value)} and ${String(requirement.with.value)}` : `answer lacks ${String(requirement.value)}`);
  return { pass: failed.length === 0, failed, requirements };
}
