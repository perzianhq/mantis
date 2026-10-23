/**
 * Outcome accounting shared by live reports and offline merged-result reports.
 * A retained merged row is not evidence of its original first attempt. Rows
 * without explicit firstPass metadata remain unknown in first-pass reporting.
 */
export interface RecoveryAttempt {
  status?: string;
  timedOut?: boolean;
  totalInputTokens?: number | null;
  usageComplete?: boolean;
}

export interface RecoveryRun {
  approach: string;
  status: string;
  ok: boolean;
  valid: boolean;
  attempts?: RecoveryAttempt[];
  /** Added by new harness rows; omitted by historical JSON. */
  firstPass?: { status: string; ok: boolean; valid: boolean };
  /** Allows a merger to retain an explicit selected/best outcome. */
  recovery?: { status: string; ok: boolean; valid: boolean };
}

export interface RecoveryCounts {
  firstPassSuccesses: number;
  firstPassValid: number;
  firstPassUnknown: number;
  recoveredSuccesses: number;
  recoveredValid: number;
  unknownUsageRows: number;
}

const attemptOutcome = (attempt: RecoveryAttempt | undefined): { status: string; ok: boolean; valid: boolean } => {
  const status = attempt?.status ?? 'unknown';
  return { status, ok: status === 'success', valid: status !== 'connection_failure' };
};

const firstPassOutcome = (run: RecoveryRun): { status: string; ok: boolean; valid: boolean } | undefined => run.firstPass;

/** Best retained attempt, with an explicit merged outcome taking precedence. */
const recoveryOutcome = (run: RecoveryRun): { status: string; ok: boolean; valid: boolean } => {
  if (run.recovery) return run.recovery;
  const attempts = run.attempts ?? [];
  const success = attempts.find((attempt) => attempt.status === 'success');
  if (success) return attemptOutcome(success);
  return { status: run.status, ok: run.ok, valid: run.valid };
};

const hasUnknownUsage = (run: RecoveryRun): boolean => {
  const attempts = run.attempts ?? [];
  return attempts.length === 0 || attempts.some((attempt) => attempt.usageComplete !== true || attempt.totalInputTokens === null || attempt.totalInputTokens === undefined);
};

export function recoveryCounts(runs: readonly RecoveryRun[]): RecoveryCounts {
  let firstPassSuccesses = 0;
  let firstPassValid = 0;
  let firstPassUnknown = 0;
  let recoveredSuccesses = 0;
  let recoveredValid = 0;
  let unknownUsageRows = 0;
  for (const run of runs) {
    const first = firstPassOutcome(run);
    const recovered = recoveryOutcome(run);
    if (first) {
      if (first.ok) firstPassSuccesses++;
      if (first.valid) firstPassValid++;
    } else firstPassUnknown++;
    if (recovered.ok) recoveredSuccesses++;
    if (recovered.valid) recoveredValid++;
    if (hasUnknownUsage(run)) unknownUsageRows++;
  }
  return { firstPassSuccesses, firstPassValid, firstPassUnknown, recoveredSuccesses, recoveredValid, unknownUsageRows };
}

export function recoveryMarkdownLines(runs: readonly RecoveryRun[]): string[] {
  const approaches = [...new Set(runs.map((run) => run.approach))].sort();
  return [
    '| Approach | First-pass (attempt 1) | After reruns / merged | Usage coverage |',
    '| --- | ---: | ---: | --- |',
    ...approaches.map((approach) => {
      const count = recoveryCounts(runs.filter((run) => run.approach === approach));
      const firstPass = `${count.firstPassSuccesses}/${count.firstPassValid}${count.firstPassUnknown ? ` (${count.firstPassUnknown} unknown)` : ''}`;
      return `| ${approach} | ${firstPass} | ${count.recoveredSuccesses}/${count.recoveredValid} | ${count.unknownUsageRows} rows have unknown usage |`;
    }),
  ];
}

function main(): void {
  const name = process.argv[2];
  if (!name) throw new Error('Pass a result JSON path.');
  // Deliberately lazy-load node modules so importing this helper stays pure.
  void import('node:fs').then(({ readFileSync }) => {
    const input = JSON.parse(readFileSync(name, 'utf8')) as { results?: RecoveryRun[] };
    if (!Array.isArray(input.results)) throw new Error('Saved result JSON must have a results array.');
    console.log(recoveryMarkdownLines(input.results).join('\n'));
  });
}

if (process.argv[1] && new URL(import.meta.url).pathname === new URL(`file://${process.argv[1].replace(/\\/g, '/')}`).pathname) main();
