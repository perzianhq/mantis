/** Exact logical-run selection for recovery diagnostics. */
export interface PlannedRow {
  task: string;
  approach: string;
  run: number;
}

export const rowKey = (task: string, approach: string, run: number): string => `${task}|${approach}|${run}`;

export interface ExactRowSelection<T extends PlannedRow> {
  /** Canonical triples, retained in metadata and the resume fingerprint. */
  rows: string[] | null;
  jobs: T[];
}

/**
 * Parse AGENT_ROWS (`task|approach|run,...`) and select only those already
 * planned logical runs. Validation against the complete plan rejects unknown
 * task, approach, and run combinations before a browser or provider starts.
 */
export function selectExactRows<T extends PlannedRow>(jobs: T[], raw: string | undefined): ExactRowSelection<T> {
  if (raw === undefined) return { rows: null, jobs };
  if (!raw.trim()) throw new Error('AGENT_ROWS must be a non-empty comma-separated list of task|approach|run triples.');

  const rows = raw.split(',').map((part) => part.trim());
  const seen = new Set<string>();
  for (const row of rows) {
    const match = /^([^|,\s]+)\|([^|,\s]+)\|([1-9]\d*)$/.exec(row);
    if (!match) throw new Error(`invalid AGENT_ROWS entry ${JSON.stringify(row)}; expected task|approach|run.`);
    if (seen.has(row)) throw new Error(`duplicate AGENT_ROWS entry ${JSON.stringify(row)}.`);
    seen.add(row);
  }

  const available = new Set(jobs.map((job) => rowKey(job.task, job.approach, job.run)));
  for (const row of rows) {
    if (!available.has(row)) {
      throw new Error(`AGENT_ROWS entry ${JSON.stringify(row)} is not in the selected task, approach, and run plan.`);
    }
  }
  const selected = new Set(rows);
  return { rows, jobs: jobs.filter((job) => selected.has(rowKey(job.task, job.approach, job.run))) };
}
