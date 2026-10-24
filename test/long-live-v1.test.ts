import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { LONG_LIVE_V1_ROWS, LONG_LIVE_V1_SCORED_ROWS, LONG_LIVE_V1_SUITE, LONG_LIVE_V1_TASKS, assertLongLiveFreezable, loadLongLiveV1Rows, validateLongLiveV1Rows } from '../bench/agent/long-live-v1.js';
import type { LongLiveV1Row } from '../bench/agent/long-live-v1.js';

describe('long-live-v1 draft catalog', () => {
  it('loads the current draft and schedules only its non-excluded rows', () => {
    expect(loadLongLiveV1Rows()).toEqual(LONG_LIVE_V1_ROWS);
    expect(LONG_LIVE_V1_TASKS.map((task) => task.id)).toEqual(LONG_LIVE_V1_SCORED_ROWS.map((row) => row.task_id));
    expect(LONG_LIVE_V1_ROWS.every((row) => row.task_id.startsWith('longlive-'))).toBe(true);
  });

  it('rejects malformed IDs, action ranges, levels, grading, and excessive demo sites', () => {
    const corrupt = LONG_LIVE_V1_ROWS.map((row) => ({ ...row })) as LongLiveV1Row[];
    corrupt[0] = { ...corrupt[0]!, task_id: 'wrong-prefix' };
    expect(() => validateLongLiveV1Rows(corrupt)).toThrow(/start with longlive/);

    corrupt[0] = { ...LONG_LIVE_V1_ROWS[0]!, referenceActions: [19, 41] };
    expect(() => validateLongLiveV1Rows(corrupt)).toThrow(/20-40 range/);
    corrupt[0] = { ...LONG_LIVE_V1_ROWS[0]!, level: 'easy' };
    expect(() => validateLongLiveV1Rows(corrupt)).toThrow(/medium or hard/);
    corrupt[0] = { ...LONG_LIVE_V1_ROWS[0]!, grading: 'other' as LongLiveV1Row['grading'] };
    expect(() => validateLongLiveV1Rows(corrupt)).toThrow(/invalid grading/);

    const demos = LONG_LIVE_V1_ROWS.slice(0, 5).map((row, index) => ({ ...row, taskType: 'form-fill-no-submit', website: `https://demo-${index}.test/` }));
    expect(() => validateLongLiveV1Rows(demos)).toThrow(/at most four demo sites/);
  });

  it('keeps the freeze assertion separate while draft keys remain unverified', () => {
    expect(() => assertLongLiveFreezable(LONG_LIVE_V1_ROWS)).toThrow(/cannot freeze/);
  });

  it('registers the suite, output suffix, long limits, manifest path, and draft in the integrity inputs', () => {
    const run = readFileSync(fileURLToPath(new URL('../bench/agent/run.ts', import.meta.url)), 'utf8');
    expect(run).toContain("from './long-live-v1.js'");
    expect(run).toContain(LONG_LIVE_V1_SUITE);
    expect(run).toContain("'-long-live-v1'");
    expect(run).toContain('LONG_LIVE_V1_MANIFEST_FILE');
    expect(run).toContain("'bench/manifests/long-live-v1.json'");
    expect(run).toContain("'bench/agent/long-live-v1-draft.json'");
    expect(run).toMatch(/LONG_LOCAL_V1_SUITE \|\| process\.env\.AGENT_SUITE === LONG_LIVE_V1_SUITE \? 1200/);
    expect(run).toMatch(/SUITE === LONG_LOCAL_V1_SUITE \|\| SUITE === LONG_LIVE_V1_SUITE \? 100/);
  });
});
