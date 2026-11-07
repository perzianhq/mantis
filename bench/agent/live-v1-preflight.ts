/**
 * Free live-v1 source collector.  It never calls an LLM and defaults to an
 * offline inventory, so an unavailable browser/network cannot be mistaken for
 * source verification.  Set LIVE_V1_PREFLIGHT_NETWORK=1 to make public GET
 * requests and refresh the candidate statuses before promoting this suite.
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { LIVE_V1_SCORED_ROWS, LIVE_V1_SOURCE_FINGERPRINTS, LIVE_V1_TASK_HASH } from './live-v1.js';
import { VISUAL_LIVE_V1_SCORED_ROWS, VISUAL_LIVE_V1_SOURCE_FINGERPRINTS, VISUAL_LIVE_V1_TASK_HASH } from './visual-live-v1.js';
import { REVISIT_LIVE_V1_SCORED_ROWS, REVISIT_LIVE_V1_SOURCE_FINGERPRINTS, REVISIT_LIVE_V1_TASK_HASH } from './revisit-live-v1.js';

export const LIVE_V1_PREFLIGHT_OUTPUT = path.join(import.meta.dirname, '..', 'live-v1-preflight.json');
export const VISUAL_LIVE_V1_PREFLIGHT_OUTPUT = path.join(import.meta.dirname, '..', 'visual-live-v1-preflight.json');
export const REVISIT_LIVE_V1_PREFLIGHT_OUTPUT = path.join(import.meta.dirname, '..', 'revisit-live-v1-preflight.json');

/** `LIVE_V1_PREFLIGHT_SUITE=visual-live-v1` probes that suite instead; the default stays live-v1. */
export type PreflightSuite = 'live-v1' | 'visual-live-v1' | 'revisit-live-v1';

export interface PreflightProbe { ok: boolean; status?: number; finalUrl?: string; detail?: string }
export interface LiveV1Preflight {
  schemaVersion: 1;
  suite: PreflightSuite;
  mode: 'offline' | 'network';
  taskHash: string;
  /** Offline means no content was fetched; it is not a failed source claim. */
  note: string;
  candidates: { taskId: string; canonicalUrl: string; sourceFingerprint: string; status: 'unverified-offline' | 'reachable' | 'blocked' | 'changed'; detail?: string; httpStatus?: number; finalUrl?: string }[];
}

export async function collectLiveV1Preflight(network = false, probe: (url: string) => Promise<PreflightProbe> = async (url) => {
  const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20_000), headers: { 'user-agent': 'mantis-live-v1-preflight/1.0 (+read-only)' } });
  return { ok: response.ok, status: response.status, finalUrl: response.url, detail: response.ok ? 'public GET completed' : `HTTP ${response.status}` };
}, suite: PreflightSuite = 'live-v1'): Promise<LiveV1Preflight> {
  const visual = suite === 'visual-live-v1';
  const revisit = suite === 'revisit-live-v1';
  const scoredRows = revisit ? REVISIT_LIVE_V1_SCORED_ROWS : visual ? VISUAL_LIVE_V1_SCORED_ROWS : LIVE_V1_SCORED_ROWS;
  const fingerprints = revisit ? REVISIT_LIVE_V1_SOURCE_FINGERPRINTS : visual ? VISUAL_LIVE_V1_SOURCE_FINGERPRINTS : LIVE_V1_SOURCE_FINGERPRINTS;
  const candidates = await Promise.all(scoredRows.map(async (row) => {
    if (!network) return { taskId: row.task_id, canonicalUrl: row.source.canonicalUrl, sourceFingerprint: fingerprints[row.task_id]!, status: 'unverified-offline' as const };
    try {
      const result = await probe(row.source.canonicalUrl);
      return { taskId: row.task_id, canonicalUrl: row.source.canonicalUrl, sourceFingerprint: fingerprints[row.task_id]!, status: result.ok ? 'reachable' as const : 'blocked' as const, detail: result.detail ?? (result.ok ? 'public GET completed' : 'request failed'), ...(result.status === undefined ? {} : { httpStatus: result.status }), ...(result.finalUrl ? { finalUrl: result.finalUrl } : {}) };
    } catch (error) {
      return { taskId: row.task_id, canonicalUrl: row.source.canonicalUrl, sourceFingerprint: fingerprints[row.task_id]!, status: 'blocked' as const, detail: `request error: ${error instanceof Error ? error.message : String(error)}`.slice(0, 200) };
    }
  }));
  return { schemaVersion: 1, suite, mode: network ? 'network' : 'offline', taskHash: revisit ? REVISIT_LIVE_V1_TASK_HASH : visual ? VISUAL_LIVE_V1_TASK_HASH : LIVE_V1_TASK_HASH,
    note: network ? 'Public GET probes only; review redirects and content changes before promoting a candidate.' : 'No external browser/network preflight was available. Every candidate remains unverified; this file is an inventory, not evidence that a site or contract was reachable.', candidates };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const requested = process.env.LIVE_V1_PREFLIGHT_SUITE ?? 'live-v1';
  if (requested !== 'live-v1' && requested !== 'visual-live-v1' && requested !== 'revisit-live-v1') throw new Error('LIVE_V1_PREFLIGHT_SUITE must be live-v1, visual-live-v1 or revisit-live-v1; received ' + JSON.stringify(requested));
  const output = requested === 'revisit-live-v1' ? REVISIT_LIVE_V1_PREFLIGHT_OUTPUT : requested === 'visual-live-v1' ? VISUAL_LIVE_V1_PREFLIGHT_OUTPUT : LIVE_V1_PREFLIGHT_OUTPUT;
  void collectLiveV1Preflight(process.env.LIVE_V1_PREFLIGHT_NETWORK === '1', undefined, requested).then((result) => {
    writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
    console.log(`[${requested}] wrote ${path.relative(process.cwd(), output)} (${result.mode}; ${result.candidates.length} candidates)`);
  });
}
