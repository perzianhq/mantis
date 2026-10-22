/**
 * Long-task telemetry and the shared tool-call cap (`AGENT_MAX_TOOL_CALLS`).
 *
 * API summary (the runner wires these; every parameter is optional so old callers are unchanged):
 *
 *   const cap = new ToolCallCap(limit | null)        // or ToolCallCap.fromEnv(process.env)
 *     cap.tryDispatch()   -> true and counts the call, or false once `limit` calls were dispatched (counts `blocked`)
 *     cap.dispatched / cap.blocked / cap.exhausted / cap.limitKind ('tool_calls' once a call was blocked, else null)
 *     cap.onExhausted(cb) -> fires once, on the first blocked call; use it to stop the agent process
 *
 *   const lt = createLongTelemetry({ identity, path?, maxToolCalls? | cap?, requestedEntities?, ... })
 *     lt.cap / lt.hooks / lt.onToolCall(event)         // hooks = { onToolCall }; hand both to the proxy / Sarvam
 *     lt.recordCheckpoint({ name, valid, revision?, frame? })   // first attainment, later invalidation, terminal validity
 *     lt.recordMutation({ entity, operation?, callIndex? })      // business-state change; drives the silent-wrong-target proxy
 *     lt.recordHazardExposure({ kind? })                         // denominator for per-opportunity stale-ref rates
 *     lt.recordCompletion({ usage | null })                      // one model completion interval; unknown usage stays null
 *     lt.recordRecovered({ invariant, requestedOperationCompleted, ... })   // closes a recovery only when true
 *     lt.recordReview({ callIndex, attribution, confirmedWrongTarget? })    // reviewed failure attribution
 *     lt.annotate({ target?, domainOperationId?, documentId?, revision? }, callIndex?)
 *     lt.flush() -> LongSummary                                  // writes `<attempt>.long.jsonl` when `path` is set; idempotent
 *     lt.summary() -> LongSummary                                // same summary without writing
 *   summarizeLongRecords(records) / readLongRecords(path) / summarizeLongFile(path)   // offline regrading
 *
 * Wiring:  createMcpProxy(child, { cap, hooks }) or proxy.setToolControl({ cap, hooks })   (Claude, Codex, screenshot MCP)
 *          runSarvamAgent({ ..., toolCap: cap, toolHooks: hooks })                          (Sarvam's direct MCP path)
 * Harness captures, `tools/list` and initialisation never reach either path's hooks or cap, so they are never counted;
 * the same call key is also ignored if two wirings report it twice. `result.limitKind === 'tool_calls'` (Sarvam) or
 * `cap.limitKind` (all providers) is the signal the runner maps to `step_limit`.
 *
 * Token figures for observations are ESTIMATES from the pinned cl100k_base tokenizer, not provider usage. Provider usage
 * belongs to completion intervals: batched calls are never given an invented per-call share, and unknown stays null.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { tokensCl100k } from '../tokens.js';

export const LONG_TELEMETRY_VERSION = 1;
export const OBSERVATION_TOKENIZER = 'cl100k_base (js-tiktoken 1.0.21)';

export type ToolLimitKind = 'tool_calls';

/** Minimal dispatch gate the proxy and the Sarvam loop depend on. */
export interface ToolCallGate {
  /** Reserve one dispatch. False means the cap is spent and the call must not be forwarded. */
  tryDispatch(): boolean;
}

export class ToolCallCap implements ToolCallGate {
  readonly limit: number | null;
  private count = 0;
  private refused = 0;
  private listeners: (() => void)[] = [];
  constructor(limit?: number | null) {
    if (limit !== undefined && limit !== null && (!Number.isSafeInteger(limit) || limit < 1)) {
      throw new Error(`AGENT_MAX_TOOL_CALLS must be a positive integer; received ${JSON.stringify(limit)}.`);
    }
    this.limit = limit ?? null;
  }
  /** `AGENT_MAX_TOOL_CALLS` unset or empty means no cap. */
  static fromEnv(env: Record<string, string | undefined> = process.env): ToolCallCap {
    const raw = env.AGENT_MAX_TOOL_CALLS;
    if (raw === undefined || raw.trim() === '') return new ToolCallCap(null);
    if (!/^[1-9]\d*$/.test(raw.trim())) throw new Error(`AGENT_MAX_TOOL_CALLS must be a positive integer; received ${JSON.stringify(raw)}.`);
    return new ToolCallCap(Number(raw.trim()));
  }
  /** Synchronous, so concurrent or batched calls are admitted strictly in arrival order. */
  tryDispatch(): boolean {
    if (this.limit !== null && this.count >= this.limit) {
      this.refused++;
      if (this.refused === 1) for (const listener of this.listeners) { try { listener(); } catch { /* a harness hook must not break dispatch */ } }
      return false;
    }
    this.count++;
    return true;
  }
  get dispatched(): number { return this.count; }
  get blocked(): number { return this.refused; }
  /** True once a call was actually refused (merely reaching N is not a limit hit). */
  get exhausted(): boolean { return this.refused > 0; }
  get limitKind(): ToolLimitKind | null { return this.refused > 0 ? 'tool_calls' : null; }
  onExhausted(callback: () => void): void { this.listeners.push(callback); if (this.refused > 0) callback(); }
}

export interface ToolCallEvent {
  phase: 'dispatch' | 'blocked' | 'result';
  source: 'proxy' | 'sarvam';
  /** Unique per agent tool call within a source; the same key is ignored if reported twice. */
  key: string;
  name: string;
  arguments: unknown;
  /** Epoch ms. */
  at: number;
  /** Result phase only. */
  dispatchedAt?: number;
  isError?: boolean;
  error?: string | null;
  /** Observation text returned to the agent (result phase). */
  text?: string;
  images?: number;
}
export interface ToolEventHooks {
  onToolCall?(event: ToolCallEvent): void;
  /** One model completion interval (Sarvam direct path); the other providers report usage from their own streams. */
  onCompletion?(input: { usage: CompletionUsage | null; at: number }): void;
}

export interface LongIdentity {
  suite?: string; suiteHash?: string; task?: string; variant?: string; seed?: string | number;
  model?: string; provider?: string; toolVersions?: Record<string, string>;
  approach?: string; run?: number; attempt?: number;
  [key: string]: unknown;
}
export interface CompletionUsage {
  inputTokens?: number | null; cacheReadTokens?: number | null; cacheWriteTokens?: number | null; outputTokens?: number | null;
  imageTokens?: number | null; costUsd?: number | null;
}
export type FailureAttribution = 'stale_observation' | 'outdated_information' | 'wrong_target' | 'planning_error' | 'timeout_cap' | 'harness_failure';

export interface LongTelemetryOptions {
  identity?: LongIdentity;
  /** Where `flush()` writes `<attempt>.long.jsonl`. Omit to keep records in memory only. */
  path?: string;
  cap?: ToolCallCap;
  maxToolCalls?: number | null;
  /** Entity IDs the task asks to change; a successful call mutating anything else is a silent wrong-target proxy. */
  requestedEntities?: Iterable<string>;
  /** Tools the harness itself uses; their events are dropped. */
  harnessTools?: string[];
  /** Observation/no-op tools do not receive a meaningful action index. Default: name-based. */
  isObservation?: (name: string, args: unknown) => boolean;
  isRefBearing?: (name: string, args: unknown) => boolean;
  resolveTarget?: (name: string, args: unknown) => string | null;
  staleRefPattern?: RegExp;
  missingRefPattern?: RegExp;
  /** Observation tokenizer; the default is the pinned cl100k_base estimate. */
  tokenize?: (text: string) => number;
  now?: () => number;
}

const DEFAULT_OBSERVATION = /^(?:browser_)?(?:read|read_page|snapshot|screenshot|take_screenshot|find|forget|wait|wait_for|tabs|media|data|ocr|look|console_messages|network_requests|page_text|get_\w+|list_\w+|bench_capture|ask_human)$/i;
const DEFAULT_STALE = /\bstale\b|no longer (?:exists?|attached|valid|present)|detached from the dom|not attached|the page changed|\bexpired\b/i;
const DEFAULT_MISSING = /no element #?\d+|\bref\b[^.\n]{0,60}\bnot found\b|not found in the current (?:page )?snapshot|unknown (?:ref|element)|(?:element|ref)[^.\n]{0,40}(?:does not exist|is missing|is invalid)/i;
const REF_KEYS = ['ref', 'id', 'element', 'index', 'uid', 'target', 'selector'];

const isObject = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value);
const canon = (value: unknown): string => { try { return JSON.stringify(value, (_k, v) => isObject(v) ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a < b ? -1 : 1)) : v) ?? 'null'; } catch { return String(value); } };
const sumKnown = (a: number | null, b: number | null | undefined): number | null => a === null || b === null || b === undefined ? null : a + b;

export type LongRecord = { kind: string; [key: string]: any };

interface CallState {
  callIndex: number; key: string; source: string; tool: string; arguments: unknown;
  dispatchedAt: number; resultAt: number | null; pending: boolean;
  success: boolean | null; error: string | null; errorClass: 'stale_ref' | 'missing_ref' | null;
  refBearing: boolean; meaningful: boolean; actionIndex: number | null;
  target: string | null; domainOperationId: string | null; documentId: string | null; revision: string | number | null;
  mutations: { entity: string; operation: string | null; requested: boolean }[];
  silentWrongTarget: boolean;
  observation: { chars: number | null; tokensEstimate: number | null; images: number; tokenizer: string; estimate: true };
  retryOf: number | null;
  completionIndex: number | null;
}

export interface LongTelemetry {
  cap: ToolCallCap;
  hooks: ToolEventHooks;
  onToolCall(event: ToolCallEvent): void;
  recordCheckpoint(input: { name: string; valid: boolean; revision?: string | number | null; frame?: string | null; at?: number }): void;
  recordMutation(input: { entity: string; operation?: string | null; callIndex?: number; at?: number }): void;
  recordHazardExposure(input?: { kind?: string; at?: number }): void;
  recordCompletion(input: { usage?: CompletionUsage | null; at?: number }): void;
  recordRecovered(input: { invariant: string; requestedOperationCompleted: boolean; entity?: string | null; at?: number }): void;
  recordReview(input: { callIndex: number | null; attribution: FailureAttribution; confirmedWrongTarget?: boolean; note?: string }): void;
  annotate(patch: { target?: string | null; domainOperationId?: string | null; documentId?: string | null; revision?: string | number | null }, callIndex?: number): void;
  records(): LongRecord[];
  summary(): LongSummary;
  flush(): LongSummary;
}

export function createLongTelemetry(opts: LongTelemetryOptions = {}): LongTelemetry {
  const now = opts.now ?? Date.now;
  const cap = opts.cap ?? new ToolCallCap(opts.maxToolCalls ?? null);
  const tokenize = opts.tokenize ?? tokensCl100k;
  const tokenizer = opts.tokenize ? 'custom' : OBSERVATION_TOKENIZER;
  const harness = new Set(opts.harnessTools ?? ['bench_capture']);
  const requested = new Set(opts.requestedEntities ?? []);
  const stale = opts.staleRefPattern ?? DEFAULT_STALE;
  const missing = opts.missingRefPattern ?? DEFAULT_MISSING;
  const isObservation = opts.isObservation ?? ((name: string) => DEFAULT_OBSERVATION.test(name));
  const isRefBearing = opts.isRefBearing ?? ((_name: string, args: unknown) => isObject(args) && REF_KEYS.some((key) => args[key] !== undefined && args[key] !== null));
  const seen = new Set<string>();
  const calls = new Map<string, CallState>();
  const ordered: CallState[] = [];
  const extra: LongRecord[] = [];
  const openRecoveries: { id: number; reason: string; entity: string | null; openedCall: number; openedAt: number; refreshes: number; callsSince: number }[] = [];
  let recoveryId = 0, actionCount = 0, completionCount = 0, lastCompletionCall = 0, cumulativeInput: number | null = 0;
  const failedByArgs = new Map<string, number>();

  const openRecovery = (reason: string, entity: string | null, call: CallState): void => {
    openRecoveries.push({ id: ++recoveryId, reason, entity, openedCall: call.callIndex, openedAt: call.resultAt ?? call.dispatchedAt, refreshes: 0, callsSince: 0 });
    extra.push({ kind: 'recovery_opened', recoveryId, reason, entity, callIndex: call.callIndex, at: call.resultAt ?? call.dispatchedAt });
  };

  const onToolCall = (event: ToolCallEvent): void => {
    if (harness.has(event.name)) return;
    const id = `${event.source}:${event.key}`;
    if (event.phase === 'blocked') {
      const blockedKey = `${id}:blocked`;
      if (seen.has(blockedKey)) return;
      seen.add(blockedKey);
      extra.push({ kind: 'blocked', source: event.source, tool: event.name, arguments: event.arguments, at: event.at, limitKind: 'tool_calls' });
      return;
    }
    if (event.phase === 'dispatch') {
      if (seen.has(id)) return; // never count one call twice
      seen.add(id);
      const refBearing = isRefBearing(event.name, event.arguments);
      const previousFailure = failedByArgs.get(`${event.name}:${canon(event.arguments)}`);
      const state: CallState = {
        callIndex: ordered.length + 1, key: id, source: event.source, tool: event.name, arguments: event.arguments,
        dispatchedAt: event.at, resultAt: null, pending: true, success: null, error: null, errorClass: null,
        refBearing, meaningful: false, actionIndex: null,
        target: opts.resolveTarget?.(event.name, event.arguments) ?? null, domainOperationId: null, documentId: null, revision: null,
        mutations: [], silentWrongTarget: false,
        observation: { chars: null, tokensEstimate: null, images: 0, tokenizer, estimate: true },
        retryOf: previousFailure ?? null, completionIndex: null,
      };
      calls.set(id, state); ordered.push(state);
      for (const open of openRecoveries) open.callsSince++;
      return;
    }
    const state = calls.get(id);
    if (!state || !state.pending) return;
    state.pending = false;
    state.resultAt = event.at;
    state.success = event.isError !== true;
    state.error = event.isError ? (event.error ?? event.text ?? 'error') : null;
    const message = state.error ?? '';
    if (!state.success) {
      if (stale.test(message)) state.errorClass = 'stale_ref';
      else if (missing.test(message)) state.errorClass = 'missing_ref';
      failedByArgs.set(`${state.tool}:${canon(state.arguments)}`, state.callIndex);
    }
    const observing = isObservation(state.tool, state.arguments);
    if (observing) for (const open of openRecoveries) open.refreshes++;
    if (state.success && !observing) { state.meaningful = true; state.actionIndex = ++actionCount; }
    state.observation.images = event.images ?? 0;
    if (typeof event.text === 'string') {
      state.observation.chars = event.text.length;
      state.observation.tokensEstimate = tokenize(event.text);
    }
    if (!state.success && state.errorClass) openRecovery(state.errorClass, state.target, state);
    else if (!state.success && state.refBearing) openRecovery('tool_error', state.target, state);
    evaluateWrongTarget(state);
  };

  const evaluateWrongTarget = (state: CallState): void => {
    if (state.success !== true) return;
    const wrong = state.mutations.some((m) => !m.requested);
    if (wrong && !state.silentWrongTarget) {
      state.silentWrongTarget = true;
      const entity = state.mutations.find((m) => !m.requested)?.entity ?? null;
      openRecovery('silent_wrong_target', entity, state);
    }
  };

  const callAt = (at: number, explicit?: number): CallState | undefined => {
    if (explicit !== undefined) return ordered[explicit - 1];
    for (let i = ordered.length - 1; i >= 0; i--) {
      const call = ordered[i]!;
      if (call.dispatchedAt <= at && (call.resultAt === null || at <= call.resultAt)) return call;
    }
    return ordered.at(-1);
  };

  const records = (): LongRecord[] => {
    const out: LongRecord[] = [{ kind: 'identity', version: LONG_TELEMETRY_VERSION, ...(opts.identity ?? {}), maxToolCalls: cap.limit, observationTokenizer: tokenizer, observationTokensAreEstimates: true }];
    for (const call of ordered) {
      out.push({
        kind: 'call', callIndex: call.callIndex, actionIndex: call.actionIndex, meaningful: call.meaningful, source: call.source,
        tool: call.tool, arguments: call.arguments, dispatchedAt: call.dispatchedAt, resultAt: call.resultAt, pending: call.pending,
        durationMs: call.resultAt === null ? null : call.resultAt - call.dispatchedAt,
        success: call.success, error: call.error, errorClass: call.errorClass, refBearing: call.refBearing,
        target: call.target, domainOperationId: call.domainOperationId, documentId: call.documentId, revision: call.revision,
        mutations: call.mutations, silentWrongTarget: call.silentWrongTarget,
        observation: call.observation, imageCount: call.observation.images, retryOf: call.retryOf, completionIndex: call.completionIndex,
      });
    }
    out.push(...extra);
    // Close any recovery still open: attempted, unresolved.
    for (const open of openRecoveries) out.push({ kind: 'recovery', recoveryId: open.id, reason: open.reason, entity: open.entity, attempted: true, successful: false, unresolved: true, openedCall: open.openedCall, callsToRecover: null, msToRecover: null, refreshes: open.refreshes });
    return out;
  };

  const telemetry: LongTelemetry = {
    cap,
    hooks: { onToolCall, onCompletion: (input) => telemetry.recordCompletion(input) },
    onToolCall,
    recordCheckpoint({ name, valid, revision, frame, at }) {
      const call = ordered.at(-1);
      extra.push({ kind: 'checkpoint', name, valid, revision: revision ?? null, frame: frame ?? null, at: at ?? now(), callIndex: call?.callIndex ?? 0, actionIndex: actionCount });
    },
    recordMutation({ entity, operation, callIndex, at }) {
      const call = callAt(at ?? now(), callIndex);
      const isRequested = requested.size === 0 ? true : requested.has(entity);
      if (call) {
        call.mutations.push({ entity, operation: operation ?? null, requested: isRequested });
        if (!call.target) call.target = entity;
        if (!call.pending) evaluateWrongTarget(call);
      } else extra.push({ kind: 'orphan_mutation', entity, operation: operation ?? null, requested: isRequested });
    },
    recordHazardExposure(input) { extra.push({ kind: 'hazard', hazardKind: input?.kind ?? null, at: input?.at ?? now(), callIndex: ordered.at(-1)?.callIndex ?? 0 }); },
    recordCompletion({ usage, at }) {
      const index = ++completionCount;
      const first = lastCompletionCall + 1, last = ordered.length;
      for (let i = first; i <= last; i++) ordered[i - 1]!.completionIndex = index;
      lastCompletionCall = last;
      const u = usage ?? null;
      const input = u?.inputTokens ?? null;
      cumulativeInput = sumKnown(cumulativeInput, input);
      extra.push({
        kind: 'completion', completionIndex: index, at: at ?? now(), callRange: last >= first ? [first, last] : null,
        inputTokens: input, cacheReadTokens: u?.cacheReadTokens ?? null, cacheWriteTokens: u?.cacheWriteTokens ?? null,
        outputTokens: u?.outputTokens ?? null, imageTokens: u?.imageTokens ?? null, costUsd: u?.costUsd ?? null,
        cumulativeInputTokens: cumulativeInput, usageKnown: u !== null && input !== null,
      });
    },
    recordRecovered({ invariant, requestedOperationCompleted, entity, at }) {
      if (!requestedOperationCompleted) { extra.push({ kind: 'recovery_attempt', invariant, entity: entity ?? null, at: at ?? now(), callIndex: ordered.length }); return; }
      const index = openRecoveries.findIndex((open) => entity == null || open.entity === null || open.entity === entity);
      if (index < 0) return;
      const [open] = openRecoveries.splice(index, 1);
      const when = at ?? now();
      extra.push({ kind: 'recovery', recoveryId: open!.id, reason: open!.reason, entity: open!.entity, invariant, attempted: true, successful: true, unresolved: false, openedCall: open!.openedCall, callsToRecover: ordered.length - open!.openedCall, msToRecover: when - open!.openedAt, refreshes: open!.refreshes });
    },
    recordReview({ callIndex, attribution, confirmedWrongTarget, note }) {
      extra.push({ kind: 'review', callIndex, attribution, confirmedWrongTarget: confirmedWrongTarget === true, note: note ?? null });
    },
    annotate(patch, callIndex) {
      const call = callIndex !== undefined ? ordered[callIndex - 1] : ordered.at(-1);
      if (!call) return;
      if (patch.target !== undefined) call.target = patch.target;
      if (patch.domainOperationId !== undefined) call.domainOperationId = patch.domainOperationId;
      if (patch.documentId !== undefined) call.documentId = patch.documentId;
      if (patch.revision !== undefined) call.revision = patch.revision;
    },
    records,
    summary: () => summarizeLongRecords(records()),
    flush() {
      const all = records();
      const summary = summarizeLongRecords(all);
      if (opts.path) writeFileSync(opts.path, [...all, { kind: 'summary', summary }].map((record) => JSON.stringify(record)).join('\n') + '\n', 'utf8');
      return summary;
    },
  };
  return telemetry;
}

export interface LongSummary {
  version: number;
  identity: Record<string, unknown> | null;
  toolCalls: number;
  meaningfulActions: number;
  failedCalls: number;
  pendingCalls: number;
  blockedCalls: number;
  limitKind: ToolLimitKind | null;
  staleRefErrors: number;
  missingRefErrors: number;
  refBearingActions: number;
  hazardExposures: number;
  /** Stale/missing-ref errors per reference-bearing call, and per exposed hazard opportunity (null when the denominator is 0). */
  refErrorsPerRefBearingAction: number | null;
  refErrorsPerHazardExposure: number | null;
  /** Objective proxy: successful calls that mutated an unrequested entity. Not intent-reviewed. */
  silentWrongTargetCalls: number;
  /** Trace-reviewed, confirmed wrong-target cases (separate from the proxy). */
  confirmedWrongTargets: number;
  recoveries: { attempted: number; successful: number; unresolved: number; meanCallsToRecover: number | null; meanMsToRecover: number | null; refreshes: number };
  checkpoints: Record<string, { firstAttainedCall: number | null; firstAttainedAction: number | null; invalidations: number; terminalValid: boolean | null; revision: string | number | null }>;
  observationTokensEstimate: number | null;
  observationTokenizer: string | null;
  completions: number;
  usage: { inputTokens: number | null; cacheReadTokens: number | null; cacheWriteTokens: number | null; outputTokens: number | null; unknownCompletions: number };
  /** Per meaningful action index: estimated tokens of observations first returned, and how many runs-worth (1) are present. */
  tokensByAction: { actionIndex: number; callIndex: number; observationTokensEstimate: number | null; completionIndex: number | null }[];
  attributions: Partial<Record<FailureAttribution, number>>;
}

const mean = (values: number[]): number | null => values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;

/** Pure function of the raw records, so a run can be regraded offline from its `.long.jsonl`. */
export function summarizeLongRecords(records: LongRecord[]): LongSummary {
  const calls = records.filter((r) => r.kind === 'call');
  const identity = records.find((r) => r.kind === 'identity') ?? null;
  const stale = calls.filter((c) => c.errorClass === 'stale_ref').length;
  const missing = calls.filter((c) => c.errorClass === 'missing_ref').length;
  const refBearing = calls.filter((c) => c.refBearing).length;
  const hazards = records.filter((r) => r.kind === 'hazard').length;
  const recovered = records.filter((r) => r.kind === 'recovery' && r.successful);
  const openedIds = new Set(records.filter((r) => r.kind === 'recovery_opened').map((r) => r.recoveryId));
  const unresolvedIds = new Set(records.filter((r) => r.kind === 'recovery' && r.unresolved).map((r) => r.recoveryId));
  const checkpoints: LongSummary['checkpoints'] = {};
  for (const r of records.filter((x) => x.kind === 'checkpoint')) {
    const entry = checkpoints[r.name] ??= { firstAttainedCall: null, firstAttainedAction: null, invalidations: 0, terminalValid: null, revision: null };
    if (r.valid && entry.firstAttainedCall === null) { entry.firstAttainedCall = r.callIndex; entry.firstAttainedAction = r.actionIndex; }
    if (!r.valid && entry.firstAttainedCall !== null && entry.terminalValid !== false) entry.invalidations++;
    entry.terminalValid = r.valid; entry.revision = r.revision ?? entry.revision;
  }
  const tokens = calls.map((c) => c.observation?.tokensEstimate).filter((t): t is number => typeof t === 'number');
  const completions = records.filter((r) => r.kind === 'completion');
  const total = (key: string): number | null => completions.length && completions.every((c) => typeof c[key] === 'number') ? completions.reduce((a, c) => a + c[key], 0) : null;
  const attributions: LongSummary['attributions'] = {};
  for (const r of records.filter((x) => x.kind === 'review')) attributions[r.attribution as FailureAttribution] = (attributions[r.attribution as FailureAttribution] ?? 0) + 1;
  const attempted = new Set([...openedIds]).size;
  const callsToRecover = recovered.map((r) => r.callsToRecover).filter((v): v is number => typeof v === 'number');
  const msToRecover = recovered.map((r) => r.msToRecover).filter((v): v is number => typeof v === 'number');
  const refErrors = stale + missing;
  return {
    version: LONG_TELEMETRY_VERSION,
    identity,
    toolCalls: calls.length,
    meaningfulActions: calls.filter((c) => c.meaningful).length,
    failedCalls: calls.filter((c) => c.success === false).length,
    pendingCalls: calls.filter((c) => c.pending).length,
    blockedCalls: records.filter((r) => r.kind === 'blocked').length,
    limitKind: records.some((r) => r.kind === 'blocked') ? 'tool_calls' : null,
    staleRefErrors: stale, missingRefErrors: missing, refBearingActions: refBearing, hazardExposures: hazards,
    refErrorsPerRefBearingAction: refBearing ? refErrors / refBearing : null,
    refErrorsPerHazardExposure: hazards ? refErrors / hazards : null,
    silentWrongTargetCalls: calls.filter((c) => c.silentWrongTarget).length,
    confirmedWrongTargets: records.filter((r) => r.kind === 'review' && r.confirmedWrongTarget).length,
    recoveries: { attempted, successful: recovered.length, unresolved: unresolvedIds.size, meanCallsToRecover: mean(callsToRecover), meanMsToRecover: mean(msToRecover), refreshes: [...recovered, ...records.filter((r) => r.kind === 'recovery' && r.unresolved)].reduce((a, r) => a + (r.refreshes ?? 0), 0) },
    checkpoints,
    observationTokensEstimate: tokens.length ? tokens.reduce((a, b) => a + b, 0) : null,
    observationTokenizer: identity?.observationTokenizer ?? null,
    completions: completions.length,
    usage: { inputTokens: total('inputTokens'), cacheReadTokens: total('cacheReadTokens'), cacheWriteTokens: total('cacheWriteTokens'), outputTokens: total('outputTokens'), unknownCompletions: completions.filter((c) => !c.usageKnown).length },
    tokensByAction: calls.filter((c) => c.actionIndex !== null).map((c) => ({ actionIndex: c.actionIndex, callIndex: c.callIndex, observationTokensEstimate: c.observation?.tokensEstimate ?? null, completionIndex: c.completionIndex ?? null })),
    attributions,
  };
}

export function readLongRecords(path: string): LongRecord[] {
  return readFileSync(path, 'utf8').split('\n').filter((line) => line.trim()).map((line) => JSON.parse(line) as LongRecord).filter((r) => r.kind !== 'summary');
}
export const summarizeLongFile = (path: string): LongSummary => summarizeLongRecords(readLongRecords(path));
