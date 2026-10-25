import { describe, expect, it } from 'vitest';
import { buildAuditManifest, selectAuditPackets, summarizeAudit } from '../bench/agent/judge-audit.js';
import type { AuditPacket, AuditRun } from '../bench/agent/judge-audit.js';

const packet = (n: number, gold: 'success' | 'failure' = 'success'): AuditPacket => {
  const task = `synthetic-${n % 30}`;
  const base = { source: 'sample', task, approach: n % 2 ? 'mantis' : 'tree', model: n % 2 ? 'model-a' : 'model-b', run: n, attemptLog: `attempt-${n}.jsonl`, gold };
  return { ...base, id: `${base.source}|${task}|${base.approach}|${base.model}|${n}|${base.attemptLog}` };
};

const judged = (packets: AuditPacket[], falseSuccesses = 0): AuditRun[] => packets.map((entry, index) => ({
  ...entry,
  verdict: entry.gold === 'failure' && index < falseSuccesses ? 'success' : entry.gold,
  reason: 'synthetic verdict', completedAt: '2026-01-01T00:00:00.000Z',
}));

describe('judge calibration audit selection and gate', () => {
  it('round-robins tasks and oversamples deterministic failures into the 120-packet manifest', () => {
    const available = Array.from({ length: 240 }, (_, index) => packet(index, index < 80 ? 'failure' : 'success'));
    const selected = selectAuditPackets(available, 120, 7);
    expect(selected).toHaveLength(120);
    expect(new Set(selected.map((entry) => entry.task)).size).toBe(30);
    expect(new Set(selected.map((entry) => entry.approach))).toEqual(new Set(['mantis', 'tree']));
    expect(new Set(selected.map((entry) => entry.model))).toEqual(new Set(['model-a', 'model-b']));
    expect(selected.filter((entry) => entry.gold === 'failure')).toHaveLength(48);
  });

  it('passes a calibration meeting every gate threshold', () => {
    const packets = Array.from({ length: 100 }, (_, index) => packet(index, index < 40 ? 'failure' : 'success'));
    const manifest = buildAuditManifest(packets);
    // Five false negatives are still 95% agreement; no failure is promoted.
    const runs = judged(packets).map((run, index) => index >= 40 && index < 45 ? { ...run, verdict: 'failure' as const } : run);
    const summary = summarizeAudit({ ...manifest, selected: packets, target: 100 }, runs);
    expect(summary.agreementRate).toBe(.95);
    expect(summary.falseSuccesses).toBe(0);
    expect(summary.gate.pass).toBe(true);
  });

  it('fails the near miss when false successes exceed two percent of gold failures', () => {
    const packets = Array.from({ length: 100 }, (_, index) => packet(index, index < 50 ? 'failure' : 'success'));
    const manifest = buildAuditManifest(packets);
    const summary = summarizeAudit({ ...manifest, selected: packets, target: 100 }, judged(packets, 3));
    expect(summary.agreementRate).toBe(.97);
    expect(summary.falseSuccessOfFailures).toBe(.06);
    expect(summary.gate.falseSuccess).toBe(false);
    expect(summary.gate.pass).toBe(false);
  });
});
