import { describe, expect, it } from 'vitest';
import { selectExactRows } from '../bench/agent/row-selector.js';

const jobs = [
  { task: 'alpha', approach: 'mantis', run: 1 },
  { task: 'alpha', approach: 'tree', run: 1 },
  { task: 'alpha', approach: 'mantis', run: 2 },
  { task: 'beta', approach: 'screenshot', run: 1 },
];

describe('exact benchmark row selector', () => {
  it('selects only named logical rows in declared order', () => {
    const selected = selectExactRows(jobs, 'beta|screenshot|1,alpha|mantis|2');
    expect(selected.rows).toEqual(['beta|screenshot|1', 'alpha|mantis|2']);
    expect(selected.jobs).toEqual([
      { task: 'alpha', approach: 'mantis', run: 2 },
      { task: 'beta', approach: 'screenshot', run: 1 },
    ]);
  });

  it('keeps the normal complete plan when unset', () => {
    expect(selectExactRows(jobs, undefined)).toEqual({ rows: null, jobs });
  });

  it('rejects malformed, duplicate, and out-of-plan rows before work starts', () => {
    expect(() => selectExactRows(jobs, 'alpha|mantis')).toThrow(/expected task\|approach\|run/);
    expect(() => selectExactRows(jobs, 'alpha|mantis|1,alpha|mantis|1')).toThrow(/duplicate/);
    expect(() => selectExactRows(jobs, 'alpha|tree|2')).toThrow(/not in the selected task, approach, and run plan/);
  });
});
