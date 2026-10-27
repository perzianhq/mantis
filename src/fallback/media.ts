import type { ElementHandle, Page } from 'playwright';
import { bounded, hasCaptureFrameRange } from '../capture/index.js';
import { makeProbe } from './probe.js';
import type { ChartData, DataItem, MediaList } from './probe.js';

/** How the agent points at a visual element: a number from read()/media(), or a CSS selector. */
export interface Target {
  id?: number;
  selector?: string;
}

/** Cap for the text `data()` returns. */
export const DATA_CHARS = 1500;

/** Format a semantic table or definition list, or return null for other elements. */
export function formatTableRows(el: Element, budget: number): string | null {
  if (el.tagName !== 'TABLE' && el.tagName !== 'DL') return null;
  const text = (node: Node) => (node.textContent ?? '').replace(/\s+/g, ' ').trim();
  const rows = el.tagName === 'TABLE'
    ? Array.from(el.querySelectorAll('tr'))
      .filter((row) => row.closest('table') === el)
      .map((row) => {
        const cells = Array.from(row.children).filter((cell) => cell.tagName === 'TH' || cell.tagName === 'TD');
        if (!cells.length) return '';
        const values = cells.map(text);
        return cells[0]!.tagName === 'TH'
          ? `${values[0]}: ${values.slice(1).join(' | ')}`.trimEnd()
          : values.join(' | ');
      })
      .filter(Boolean)
    : Array.from(el.children)
      .filter((child) => child.tagName === 'DT')
      .map((term) => {
        const values: string[] = [];
        for (let next = term.nextElementSibling; next && next.tagName !== 'DT'; next = next.nextElementSibling) {
          if (next.tagName === 'DD') values.push(text(next));
        }
        return `${text(term)}: ${values.join(' | ')}`.trimEnd();
      });
  const caption = el.tagName === 'TABLE' ? el.querySelector('caption') : null;
  const title = caption ? text(caption) : '';
  const label = title || (el.getAttribute('aria-label') ?? '').replace(/\s+/g, ' ').trim();
  let head = `table${label ? ` "${label}"` : ''} (${rows.length} rows)`;
  const shown: string[] = [];
  for (let i = 0; i < rows.length; i++) {
    const tail = i + 1 < rows.length ? `\u2026${rows.length - i - 1} more rows` : '';
    const candidate = [...shown, rows[i]!].join('\n');
    if (`${head}\n${candidate}${tail ? `\n${tail}` : ''}`.length > budget) break;
    shown.push(rows[i]!);
  }
  if (shown.length === rows.length) {
    const output = [head, ...shown].join('\n');
    return output.length <= budget ? output : output.slice(0, budget - 1).trimEnd() + '\u2026';
  }
  const tail = `\u2026${rows.length - shown.length} more rows`;
  while (shown.length && [head, ...shown, tail].join('\n').length > budget) shown.pop();
  if ([head, tail].join('\n').length > budget) head = head.slice(0, Math.max(0, budget - tail.length - 2)).trimEnd() + '\u2026';
  return [head, ...shown, tail].join('\n');
}

// Built with the Function constructor so Playwright passes the element in (string form would not).
const DESCRIBE = new Function('el', `return (${makeProbe.toString()})().describe(el)`) as (el: Element) => DataItem[];
const DESCRIBE_BOUNDED = new Function('el', 'chartPointLimit', `return (${makeProbe.toString()})(chartPointLimit).describe(el)`) as (el: Element, chartPointLimit: number) => DataItem[];
const INSTALL = `(${makeProbe.toString()})()`;
const FRAME_MEDIA_MS = 1_500;

/** Visible images / canvases / chart-like SVGs, each with a number from the shared registry. */
export async function listMedia(page: Page): Promise<string> {
  // Frames have independent DOM roots (and number ranges assigned by capture()), so probing
  // each reachable one preserves a usable id instead of pretending embedded media is absent.
  // Do not initialize an arbitrary hidden/unwalked frame here: its default registry starts at
  // #1 and would collide with the main document. capture() assigns a range only to frames it
  // actually represented, so every advertised child-frame id remains resolvable.
  const frames = page.frames().filter((frame) => frame === page.mainFrame() || hasCaptureFrameRange(frame));
  const lists = await Promise.all(frames.map((frame) =>
    bounded(frame.evaluate(`${INSTALL}.list()`).catch(() => null), FRAME_MEDIA_MS) as Promise<MediaList | null>,
  ));
  const entries = lists.flatMap((res) => res?.entries ?? []);
  const more = lists.reduce((total, res) => total + (res?.more ?? 0), 0);
  if (!entries.length) return 'no images, canvases or charts on this page';
  const lines = entries.map((e) => `#${e.id} ${e.kind} ${e.text}`);
  if (more) lines.push(`…and ${more} more`);
  lines.push('use data({id: N}) for hidden text, ocr({id: N}) for text in pixels, look({id: N}) only as a last resort');
  return lines.join('\n');
}

/** Run the in-page `describe` on one element. */
export async function describeElement(el: ElementHandle<Element>, chartPointLimit?: number): Promise<DataItem[]> {
  return (await (chartPointLimit === undefined
    ? el.evaluate(DESCRIBE)
    : el.evaluate(DESCRIBE_BOUNDED, chartPointLimit))) as DataItem[];
}

function table(c: ChartData, budget: number): string[] {
  const head = `${c.lib}${c.type ? ` ${c.type}` : ''} chart${c.title ? ` "${c.title}"` : ''}${c.hiddenSeries ? ` (${c.hiddenSeries} hidden series omitted)` : ''}`;
  const n = Math.max(c.labels.length, ...c.series.map((s) => s.values.length), 0);
  if (!n || !c.series.length) return [head, '(no data points)'];
  const cols = ['', ...c.series.map((s, i) => s.name || `series ${i + 1}`)];
  const rows: string[] = [];
  let used = head.length + cols.join(' | ').length + 2;
  let shown = 0;
  for (let i = 0; i < n; i++) {
    const row = [c.labels[i] ?? String(i + 1), ...c.series.map((s) => String(s.values[i] ?? ''))].join(' | ');
    if (used + row.length + 1 > budget && shown >= 3) break;
    rows.push(row);
    used += row.length + 1;
    shown++;
  }
  if (shown < n) rows.push(`…${n - shown} more rows`);
  if (!c.labels.length) cols[0] = '#';
  return [head, cols.join(' | '), ...rows];
}

const DESCRIPTIVE = /^(alt: (?!\()|title:|caption:|aria-label:|longdesc:|text \(|desc:|tooltips \(|fallback content:)/;

/** Compact text for `data()`; nothing found -> a pointer to the next rung of the ladder. */
export function formatData(label: string, items: DataItem[]): string {
  const found = items.some((it) => it.charts.length > 0 || it.lines.some((l) => DESCRIPTIVE.test(l)));
  if (!found) {
    const facts = items.flatMap((it) => it.lines.filter((l) => /^(file|alt|size): /.test(l)));
    return `${label}: no hidden text or chart data found${facts.length ? ` (${facts.join('; ')})` : ''}. Try ocr({id: N}) for text drawn in pixels, or look({id: N}) as a last resort.`;
  }
  const multi = items.length > 1;
  const budget = Math.max(400, Math.floor(DATA_CHARS / items.length));
  const blocks = items.map((it) => {
    const lines = multi ? [`${it.kind}:`] : [];
    lines.push(...it.lines);
    for (const c of it.charts) lines.push(...table(c, budget));
    return lines.join('\n');
  });
  const text = `${label}\n${blocks.join('\n')}`;
  return text.length > DATA_CHARS ? text.slice(0, DATA_CHARS - 1).trimEnd() + '…' : text;
}
