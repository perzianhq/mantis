import type { FixtureObservation } from './fixtures.js';
import type { AgentTask } from './agent/tasks.js';
import type { AnswerRequirement } from './agent/grading.js';

/**
 * A frozen fixture variant changes the agent-visible data while preserving a
 * reversible mapping to the canonical executable oracle.  Keep this mapping
 * in source and record its seed in result metadata; never generate answers at
 * grading time from an unrecorded random value.
 */
export interface FixtureVariant {
  seed: number;
  replacements: readonly (readonly [from: string, to: string])[];
  forward: (text: string) => string;
  canonical: (text: string) => string;
  html: (text: string) => string;
  canonicalObservation: (event: FixtureObservation) => FixtureObservation;
  /** The task as seen by the agent. Its answer oracle uses seeded facts. */
  task: (task: AgentTask) => AgentTask;
}

/**
 * Replace literal data without corrupting unrelated words (for example, do not
 * turn "Product" or "Profile" into "Businessduct" / "Businessfile").
 */
const apply = (text: string, replacements: readonly (readonly [string, string])[]): string =>
  replacements.reduce((result, [from, to]) => {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const word = /^[A-Za-z0-9]+$/.test(from);
    return result.replace(new RegExp(`${word ? '\\b' : ''}${escaped}${word ? '\\b' : ''}`, 'g'), to);
  }, text);

const transform = (value: unknown, replace: (text: string) => string): unknown => {
  if (typeof value === 'string') return replace(value);
  if (Array.isArray(value)) return value.map((item) => transform(item, replace));
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [replace(key), transform(item, replace)]));
};

/** A deliberately different, held-out data profile for the first seeded suite. */
const SEED_20261018: readonly (readonly [string, string])[] = [
  // One explicit replacement per local task family. Values are frozen in
  // source, so a profile can always be replayed from its recorded seed.
  ['Canada', 'Ireland'], ['Signed in', 'Welcome back'], ['agent@example.com', 'runner@example.test'], ['correct-horse-battery', 'winter-harbor-key'],
  ['Added to cart', 'Cart updated'], ['Item 150', 'Record 150'], ['Detail for item 150', 'Record 150 details'],
  ['Team plan', 'Business plan'], ['Team: $29 per month', 'Business: $39 per month'], ['$29', '$39'],
  ['Initech 3', 'Nova 3'], ['$4,218', '$5,314'], ['new@example.com', 'hello@example.test'], ['longenough123', 'strongpass456'],
  ['Ada Lovelace', 'Noor Ali'], ['Berlin', 'Dublin'], ['A1042', 'B2048'], ['27.50', '31.25'],
  ['2026-12-24', '2026-12-25'], ['19:00', '20:00'], ['1874', '1888'],
  ['Widget 30', 'Gadget 30'], ['W-1203', 'G-4096'], ['<td>113</td>', '<td>97</td>'], ['Acme 6', 'Vertex 6'], ['9,950', '9,900'],
  ['Quokka facts', 'Koala facts'], ['dana.r', 'mira.k'], ['Post #35', 'Post #36'], ['post #35', 'post #36'], ['n === 35', 'n === 36'], ['Thursday at noon', 'Friday at dusk'],
  ['PRO-77', 'BIZ-77'], ['data-plan="pro"', 'data-plan="biz"'], ['Pro', 'Business'],
  ['refund', 'reimbursement'], ['30 days', '45 days'],
  ['Old report', 'Quarterly draft'],
  ['Trail Mug', 'Summit Flask'], ['Canvas Tote', 'Harbor Satchel'], ['Beeswax Wrap', 'Cedar Wrap'], ['Linen Apron', 'Cotton Smock'],
  ['SPRING10', 'AUTUMN15'], ['Grace Hopper', 'Maya Lin'], ['12 Navy Way', '84 Cedar Lane'], ['Arlington', 'Portland'], ['22201', '97205'],
  // The two codes are derived by the fixture scripts after their seeded inputs
  // are applied.  They are explicit frozen oracle values, not runtime guesses.
  ['S-1814', 'S-5856'], ['grace hopper', 'maya lin'], ['12 navy way', '84 cedar lane'], ['arlington', 'portland'],
  ['ORD-7429', 'ORD-9186'],
  ['Northwind Labs', 'Aster Works'], ['Ada Byron', 'Nora Bell'], ['ada@northwind.test', 'nora@aster.test'], ['billing@northwind.test', 'accounts@aster.test'],
  ['lin@northwind.test', 'ravi@aster.test'], ['sam@northwind.test', 'zoe@aster.test'], ['kai@northwind.test', 'milo@aster.test'],
  ['W-3248', 'W-8780'], ['northwind labs', 'aster works'], ['ada', 'nora'], ['byron', 'bell'],
  ['ada@northwind.test', 'nora@aster.test'], ['billing@northwind.test', 'accounts@aster.test'],
  ['lin@northwind.test', 'ravi@aster.test'], ['sam@northwind.test', 'zoe@aster.test'], ['kai@northwind.test', 'milo@aster.test'],
  ['Dark', 'Midnight'], ['Mia Wong', 'Priya Shah'], ['mia@example.com', 'priya@example.test'],
  ['R-5531', 'R-8064'], ['data: [18, 25, 42,', 'data: [18, 25, 57,'],
  ['Ivy Chen', 'Inez Cruz'], ['Lena Novak', 'Lara Shah'], ['Raj Patel', 'Ravi Mehta'], ['Omar Haddad', 'Owen Reed'], ['Tom Becker', 'Theo Park'], ['Sara Lind', 'Sana Iqbal'],
  ['Nimbus 14', 'Atlas 14'], ['1.35', '1.28'],
];

const variants = new Map<number, readonly (readonly [string, string])[]>([[20261018, SEED_20261018]]);

export function fixtureVariant(seed: number): FixtureVariant {
  const replacements = variants.get(seed);
  if (!replacements) throw new Error(`Unknown AGENT_FIXTURE_SEED ${seed}; frozen seeds: ${[...variants.keys()].join(', ')}`);
  const ordered = [...replacements].sort(([left], [right]) => right.length - left.length);
  const inverse = ordered.map(([from, to]) => [to, from] as const).sort(([left], [right]) => right.length - left.length);
  const forward = (text: string): string => apply(text, ordered);
  const canonical = (text: string): string => apply(text, inverse);
  const transformRequirements = (requirements: readonly AnswerRequirement[] | undefined): AnswerRequirement[] | undefined =>
    requirements?.map((requirement) => transform(requirement, forward) as AnswerRequirement);
  const variantTask = (task: AgentTask): AgentTask => {
    if (task.site !== 'local') return task;
    const source = forward(task.expect.source);
    const seeded: AgentTask = {
      ...task,
      prompt: (base) => forward(task.prompt(base)),
      expect: new RegExp(source, task.expect.flags),
      answerRequirements: transformRequirements(task.answerRequirements),
    };
    // Numeric requirements are values, not strings, so they need explicit
    // frozen substitutions rather than the presentation-text transform.
    if (task.id === 'faq-refund') {
      seeded.expect = /\b45\b/;
      seeded.answerRequirements = [{ id: 'reimbursement-days', type: 'number', value: 45 }];
    }
    const answerOverrides: Record<string, Pick<AgentTask, 'expect' | 'answerRequirements'>> = {
      'form-subscribe': { expect: /Subscribed from Ireland \(weekly: yes\)/i, answerRequirements: [] },
      login: { expect: /(?<!not )\bWelcome back\b/i, answerRequirements: [{ id: 'heading', type: 'text', value: 'Welcome back' }] },
      'cookie-cart': { expect: /\bCart updated(?:\s*\(1 item\))?\.?\s*$/i, answerRequirements: [{ id: 'confirmation', type: 'text', value: 'Cart updated' }] },
      'longlist-item': { expect: /Record 150 details\b/i, answerRequirements: [] },
      'pricing-team': { expect: /\$39\b/, answerRequirements: [{ id: 'business-price', type: 'number', value: 39 }] },
      'dashboard-refresh': { expect: /\bjust now\b[\s\S]*\$5,314\b|\$5,314\b[\s\S]*\bjust now\b/i, answerRequirements: [{ id: 'updated', type: 'text', value: 'just now' }, { id: 'nova-amount', type: 'entity', value: 'Nova 3', with: { type: 'number', value: 5314 } }] },
      'signup-validation': { expect: /at least 8 characters[\s\S]*Welcome, hello@example\.test|Welcome, hello@example\.test[\s\S]*at least 8 characters/i, answerRequirements: [] },
      'checkout-steps': { expect: /\bB2048\b[^]*31\.25|31\.25[^]*\bB2048\b/, answerRequirements: [{ id: 'order', type: 'entity', value: 'B2048' }, { id: 'total', type: 'number', value: '31.25' }] },
      'booking-date': { expect: /Booked for 2026-12-25 at 20:00, 3 guests\b/, answerRequirements: [] },
      'article-deep-fact': { expect: /\b1888\b/, answerRequirements: [{ id: 'year', type: 'number', value: 1888 }] },
      'inventory-lookup': { expect: /\bG-4096\b[^]*\b97\b|\b97\b[^]*\bG-4096\b/, answerRequirements: [{ id: 'sku', type: 'entity', value: 'G-4096' }, { id: 'stock', type: 'number', value: 97 }] },
      'churned-max': { expect: /\bVertex 6\b[^]*\b9,?900\b|\b9,?900\b[^]*\bVertex 6\b/, answerRequirements: [{ id: 'churned-maximum', type: 'entity', value: 'Vertex 6', with: { type: 'number', value: 9900 } }] },
      'search-pagination': { expect: /\bmira\.k\b/, answerRequirements: [] },
      'feed-scroll': { expect: /\bFriday at dusk\b/i, answerRequirements: [] },
      'spa-team': { expect: /\bpriya@example\.test\b/, answerRequirements: [] },
      'chart-march': { expect: /\b57\b/, answerRequirements: [{ id: 'march-units', type: 'number', value: 57 }] },
      'long-laptops': { expect: /\bAtlas 14\b[^]*\b1\.28\b|\b1\.28\b[^]*\bAtlas 14\b/, answerRequirements: [{ id: 'laptop-weight', type: 'entity', value: 'Atlas 14', with: { type: 'number', value: '1.28' } }] },
    };
    Object.assign(seeded, answerOverrides[task.id]);
    return seeded;
  };
  return {
    seed,
    replacements: ordered,
    forward,
    canonical,
    html: forward,
    canonicalObservation: (event) => transform(event, canonical) as FixtureObservation,
    task: variantTask,
  };
}

export function fixtureVariantFromEnv(value = process.env.AGENT_FIXTURE_SEED): FixtureVariant | null {
  if (value === undefined || value === '') return null;
  if (!/^\d+$/.test(value)) throw new Error('AGENT_FIXTURE_SEED must be a frozen positive integer seed.');
  return fixtureVariant(Number(value));
}
