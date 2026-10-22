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

export const LIVE_V1_PREFLIGHT_OUTPUT = path.join(import.meta.dirname, '..', 'live-v1-preflight.json');

export interface PreflightProbe { ok: boolean; status?: number; finalUrl?: string; detail?: string }
export interface LiveV1Preflight {
  schemaVersion: 1;
  suite: 'live-v1';
  mode: 'offline' | 'network';
  taskHash: string;
  /** Offline means no content was fetched; it is not a failed source claim. */
  note: string;
  candidates: { taskId: string; canonicalUrl: string; sourceFingerprint: string; status: 'unverified-offline' | 'reachable' | 'blocked' | 'changed'; detail?: string; httpStatus?: number; finalUrl?: string }[];
}

export async function collectLiveV1Preflight(network = false, probe: (url: string) => Promise<PreflightProbe> = async (url) => {
  const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20_000), headers: { 'user-agent': 'mantis-live-v1-preflight/1.0 (+read-only)' } });
  return { ok: response.ok, status: response.status, finalUrl: response.url, detail: response.ok ? 'public GET completed' : `HTTP ${response.status}` };
}): Promise<LiveV1Preflight> {
  const candidates = await Promise.all(LIVE_V1_SCORED_ROWS.map(async (row) => {
    if (!network) return { taskId: row.task_id, canonicalUrl: row.source.canonicalUrl, sourceFingerprint: LIVE_V1_SOURCE_FINGERPRINTS[row.task_id]!, status: 'unverified-offline' as const };
    try {
      const result = await probe(row.source.canonicalUrl);
      return { taskId: row.task_id, canonicalUrl: row.source.canonicalUrl, sourceFingerprint: LIVE_V1_SOURCE_FINGERPRINTS[row.task_id]!, status: result.ok ? 'reachable' as const : 'blocked' as const, detail: result.detail ?? (result.ok ? 'public GET completed' : 'request failed'), ...(result.status === undefined ? {} : { httpStatus: result.status }), ...(result.finalUrl ? { finalUrl: result.finalUrl } : {}) };
    } catch (error) {
      return { taskId: row.task_id, canonicalUrl: row.source.canonicalUrl, sourceFingerprint: LIVE_V1_SOURCE_FINGERPRINTS[row.task_id]!, status: 'blocked' as const, detail: `request error: ${error instanceof Error ? error.message : String(error)}`.slice(0, 200) };
    }
  }));
  return { schemaVersion: 1, suite: 'live-v1', mode: network ? 'network' : 'offline', taskHash: LIVE_V1_TASK_HASH,
    note: network ? 'Public GET probes only; review redirects and content changes before promoting a candidate.' : 'No external browser/network preflight was available. Every candidate remains unverified; this file is an inventory, not evidence that a site or contract was reachable.', candidates };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  void collectLiveV1Preflight(process.env.LIVE_V1_PREFLIGHT_NETWORK === '1').then((result) => {
    writeFileSync(LIVE_V1_PREFLIGHT_OUTPUT, `${JSON.stringify(result, null, 2)}\n`);
    console.log(`[live-v1] wrote ${path.relative(process.cwd(), LIVE_V1_PREFLIGHT_OUTPUT)} (${result.mode}; ${result.candidates.length} candidates)`);
  });
}
