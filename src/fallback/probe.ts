/**
 * In-page probe for visual elements (images, SVG, canvas).
 *
 * `makeProbe` is serialized (Function#toString) and executed inside the page, so it
 * must stay fully self-contained: no imports, no references outside its own body.
 * It shares the element-number registry (`window.__mantis`) with the DOM walker, so
 * numbers handed out here never collide with numbers from read().
 */

export interface ChartSeries {
  name: string;
  values: Array<number | string>;
}

export interface ChartData {
  lib: string;
  type: string;
  title: string;
  labels: string[];
  series: ChartSeries[];
  /** Extraction stopped at its caller-provided structural budget. */
  truncated?: boolean;
  /** Series intentionally hidden by the chart are not exposed as currently visible data. */
  hiddenSeries?: number;
}

export interface DataItem {
  /** e.g. `image`, `svg`, `canvas`. */
  kind: string;
  lines: string[];
  charts: ChartData[];
}

export interface MediaEntry {
  id: number;
  kind: 'image' | 'canvas' | 'svg';
  /** Pre-formatted text after `#id kind`. */
  text: string;
}

export interface MediaList {
  entries: MediaEntry[];
  more: number;
}

export interface Probe {
  list(): MediaList;
  describe(el: Element): DataItem[];
}

export function makeProbe(chartPointLimit = Number.MAX_SAFE_INTEGER): Probe {
  interface Registry {
    ids: WeakMap<Element, number>;
    next: number;
    byId: Map<number, WeakRef<Element>>;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Any = any;
  const win = window as unknown as { __mantis?: Registry } & Any;
  const chartCap = Number.isFinite(chartPointLimit) ? Math.max(1, Math.floor(chartPointLimit)) : Number.MAX_SAFE_INTEGER;
  const reg: Registry = (win.__mantis ??= { ids: new WeakMap(), next: (win.__mantisBase ?? 0) + 1, byId: new Map() });

  const MAX_LIST = 40;
  const collapse = (s: string | null | undefined): string => (s ?? '').replace(/\s+/g, ' ').trim();
  const cap = (s: string, n: number): string => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

  function idFor(el: Element): number | undefined {
    let id = reg.ids.get(el);
    const rangeStart = (win.__mantisBase ?? 0) + 1;
    const rangeEnd = rangeStart + 9_999;
    if (id !== undefined) return id >= rangeStart && id < rangeEnd ? id : undefined;
    if (reg.next < rangeStart || reg.next >= rangeEnd) return undefined;
    id = reg.next++;
    reg.ids.set(el, id);
    reg.byId.set(id, new WeakRef(el));
    return id;
  }

  function fileName(url: string): string {
    if (!url) return '';
    if (/^data:/i.test(url)) return 'inline data';
    try {
      const u = new URL(url, location.href);
      const last = u.pathname.split('/').filter(Boolean).pop() ?? u.host;
      return cap(decodeURIComponent(last), 60);
    } catch {
      return cap(url, 60);
    }
  }

  // ---- chart libraries ----------------------------------------------------

  /** One data point as a plain value; also reports its x when it has one. */
  function point(v: Any): { y: number | string; x?: string } {
    if (v === null || v === undefined) return { y: '' };
    if (typeof v === 'number' || typeof v === 'string') return { y: typeof v === 'number' ? round(v) : v };
    if (Array.isArray(v)) return { x: String(v[0]), y: v.length > 1 ? (typeof v[1] === 'number' ? round(v[1]) : String(v[1])) : '' };
    if (typeof v === 'object') {
      const y = v.y ?? v.value ?? v.r ?? '';
      const x = v.x ?? v.name;
      return { y: typeof y === 'number' ? round(y) : Array.isArray(y) ? y.join('/') : String(y), x: x === undefined ? undefined : String(x) };
    }
    return { y: String(v) };
  }
  function round(n: number): number {
    return Number.isInteger(n) ? n : Math.round(n * 1000) / 1000;
  }

  function finish(c: ChartData, xs: string[]): ChartData {
    if (!c.labels.length && xs.length) c.labels = xs;
    return c;
  }

  function chartJs(c: Element): ChartData | null {
    const C = win.Chart;
    if (!C) return null;
    let ch: Any = null;
    try { ch = C.getChart ? C.getChart(c) : null; } catch { /* old version */ }
    if (!ch && C.instances) ch = Object.values(C.instances).find((i: Any) => i && i.canvas === c) ?? null;
    if (!ch || !ch.data) return null;
    const xs: string[] = [];
    let used = 0;
    let seriesSeen = 0;
    let truncated = false;
    const series: ChartSeries[] = [];
    let hiddenSeries = 0;
    for (const [datasetIndex, d] of (ch.data.datasets ?? []).entries()) {
      // The live Chart.js visibility API reflects legend toggles and explicit
      // setDatasetVisibility() overrides; dataset.hidden is only initial configuration.
      const hidden = typeof ch.isDatasetVisible === 'function'
        ? !ch.isDatasetVisible(datasetIndex)
        : d.hidden === true;
      if (hidden) {
        hiddenSeries++;
        continue;
      }
      if (seriesSeen++ >= chartCap) { truncated = true; break; }
      const values: Array<number | string> = [];
      for (let i = 0; i < (d.data ?? []).length; i++) {
        if (used++ >= chartCap) { truncated = true; break; }
        const v = d.data[i];
        const p = point(v);
        if (p.x !== undefined && !xs[i]) xs[i] = p.x;
        values.push(p.y);
      }
      series.push({ name: String(d.label ?? ''), values });
      if (truncated) break;
    }
    const labels: string[] = [];
    for (let i = 0; i < (ch.data.labels ?? []).length; i++) {
      if (i >= chartCap) { truncated = true; break; }
      labels.push(String(ch.data.labels[i]));
    }
    const title = ch.options?.plugins?.title?.text ?? '';
    return finish(
      { lib: 'Chart.js', type: String(ch.config?.type ?? ch.config?._config?.type ?? ''), title: Array.isArray(title) ? title.join(' ') : String(title || ''), labels, series, truncated, hiddenSeries: hiddenSeries || undefined },
      xs,
    );
  }

  function eCharts(node: Element): ChartData | null {
    const E = win.echarts;
    if (!E || !E.getInstanceByDom) return null;
    let inst: Any = null;
    try { inst = E.getInstanceByDom(node); } catch { /* not an echarts node */ }
    if (!inst || !inst.getOption) return null;
    const opt: Any = inst.getOption();
    const xs: string[] = [];
    let labels: string[] = [];
    let used = 0;
    let seriesSeen = 0;
    let truncated = false;
    const axis: Any = Array.isArray(opt.xAxis) ? opt.xAxis[0] : opt.xAxis;
    if (axis && Array.isArray(axis.data)) {
      labels = [];
      for (let i = 0; i < axis.data.length; i++) {
        if (i >= chartCap) { truncated = true; break; }
        const d = axis.data[i];
        labels.push(String(d && typeof d === 'object' ? d.value ?? d.name : d));
      }
    }
    const selected = new Map<string, boolean>();
    for (const legend of (Array.isArray(opt.legend) ? opt.legend : [opt.legend])) {
      for (const [name, visible] of Object.entries(legend?.selected ?? {})) selected.set(name, visible !== false);
    }
    let hiddenSeries = 0;
    const series: ChartSeries[] = [];
    for (const s of opt.series ?? []) {
      if (s?.show === false || s?.selected === false || (s?.name && selected.get(String(s.name)) === false)) {
        hiddenSeries++;
        continue;
      }
      if (seriesSeen++ >= chartCap) { truncated = true; break; }
      const values: Array<number | string> = [];
      for (let i = 0; i < (s.data ?? []).length; i++) {
        if (used++ >= chartCap) { truncated = true; break; }
        const v = s.data[i];
        const p = point(v);
        if (p.x !== undefined && !xs[i]) xs[i] = p.x;
        values.push(p.y);
      }
      series.push({ name: String(s.name ?? ''), values });
      if (truncated) break;
    }
    const t: Any = Array.isArray(opt.title) ? opt.title[0] : opt.title;
    return finish({ lib: 'ECharts', type: String(opt.series?.[0]?.type ?? ''), title: String(t?.text ?? ''), labels, series, truncated, hiddenSeries: hiddenSeries || undefined }, xs);
  }

  function highcharts(el: Element): ChartData[] {
    const H = win.Highcharts;
    if (!H || !Array.isArray(H.charts)) return [];
    const out: ChartData[] = [];
    for (const c of H.charts as Any[]) {
      if (!c) continue;
      const inside = (n: Element | undefined | null): boolean => !!n && (n.contains(el) || el.contains(n));
      if (!inside(c.renderTo) && !inside(c.container)) continue;
      const xs: string[] = [];
      let used = 0;
      let seriesSeen = 0;
      let truncated = false;
      let hiddenSeries = 0;
      const series: ChartSeries[] = [];
      for (const s of c.series ?? []) {
        if (s.visible === false) { hiddenSeries++; continue; }
        if (seriesSeen++ >= chartCap) { truncated = true; break; }
        const pts: Any[] | null = s.points && s.points.length ? s.points : null;
        const pointCount = pts ? pts.length : (s.yData?.length ?? 0);
        const values: Array<number | string> = [];
        for (let i = 0; i < pointCount; i++) {
          if (used++ >= chartCap) { truncated = true; break; }
          const p = pts ? pts[i] : { y: s.yData[i], x: s.xData?.[i] };
          const y = typeof p.y === 'number' ? round(p.y) : p.y ?? '';
          const x = p.category ?? p.name ?? p.x;
          if (x !== undefined && x !== null && !xs[i]) xs[i] = String(x);
          values.push(y);
        }
        series.push({ name: String(s.name ?? ''), values });
        if (truncated) break;
      }
      const cats: Any = Array.isArray(c.xAxis) ? c.xAxis[0]?.categories : c.xAxis?.categories;
      const labels: string[] = [];
      if (Array.isArray(cats)) for (let i = 0; i < cats.length; i++) {
        if (i >= chartCap) { truncated = true; break; }
        labels.push(String(cats[i]));
      }
      out.push(finish({
        lib: 'Highcharts', type: String(c.options?.chart?.type ?? c.series?.[0]?.type ?? ''),
        title: String(c.title?.textStr ?? c.options?.title?.text ?? ''),
        labels, series, truncated, hiddenSeries: hiddenSeries || undefined,
      }, xs));
    }
    return out;
  }

  /** Chart-library instances attached to this element, its ancestors or its canvases. */
  function chartsFor(el: Element): ChartData[] {
    const out: ChartData[] = [];
    const seenNodes = new Set<Element>();
    const nodes: Element[] = [];
    const add = (n: Element | null): void => { if (n && !seenNodes.has(n)) { seenNodes.add(n); nodes.push(n); } };
    add(el);
    let a: Element | null = el.parentElement;
    for (let i = 0; a && i < 4; i++, a = a.parentElement) add(a);
    el.querySelectorAll('canvas').forEach((c, i) => { if (i < 5) add(c); });
    for (const n of nodes) {
      if (n.localName === 'canvas') {
        const c = chartJs(n);
        if (c) out.push(c);
      }
      const e = eCharts(n);
      if (e) out.push(e);
    }
    out.push(...highcharts(el));
    // Same chart can be reached from several nodes; keep one of each (lib + title + shape).
    const seen = new Set<string>();
    return out.filter((c) => {
      const key = `${c.lib}|${c.title}|${c.labels.join(',')}|${c.series.map((s) => s.name + s.values.join(',')).join(';')}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // ---- describe -----------------------------------------------------------

  function largestSrcset(img: Element): string {
    const sets: string[] = [];
    const own = img.getAttribute('srcset');
    if (own) sets.push(own);
    const pic = img.parentElement;
    if (pic && pic.localName === 'picture') {
      pic.querySelectorAll('source[srcset]').forEach((s) => sets.push(s.getAttribute('srcset') ?? ''));
    }
    let best = '';
    let bestScore = -1;
    for (const set of sets) {
      for (const part of set.split(',')) {
        const [url, desc] = part.trim().split(/\s+/);
        if (!url) continue;
        const m = desc ? desc.match(/^([\d.]+)([wx])$/) : null;
        const score = m ? Number(m[1]) * (m[2] === 'x' ? 1000 : 1) : 0;
        if (score > bestScore) { bestScore = score; best = desc ? `${url} (${desc})` : url; }
      }
    }
    return best ? cap(best, 140) : '';
  }

  function describeImage(img: HTMLImageElement): string[] {
    const lines: string[] = [];
    const alt = img.getAttribute('alt');
    if (alt !== null) lines.push(alt.trim() ? `alt: ${collapse(alt)}` : 'alt: (empty — marked decorative)');
    else lines.push('alt: (missing)');
    const title = collapse(img.getAttribute('title'));
    if (title) lines.push(`title: ${title}`);
    const label = collapse(img.getAttribute('aria-label'));
    if (label) lines.push(`aria-label: ${label}`);
    const fig = img.closest('figure');
    const caption = fig?.querySelector('figcaption');
    if (caption) lines.push(`caption: ${cap(collapse(caption.textContent), 300)}`);
    const longdesc = img.getAttribute('longdesc');
    if (longdesc) lines.push(`longdesc: ${longdesc}`);
    const src = img.currentSrc || img.getAttribute('src') || '';
    if (src) lines.push(`file: ${fileName(src)}`);
    const big = largestSrcset(img);
    if (big) lines.push(`largest source: ${big}`);
    if (img.naturalWidth) lines.push(`size: ${img.naturalWidth}×${img.naturalHeight}`);
    return lines;
  }

  function describeSvg(svg: Element): string[] {
    const lines: string[] = [];
    const label = collapse(svg.getAttribute('aria-label'));
    if (label) lines.push(`aria-label: ${label}`);
    const own = Array.from(svg.children).find((c) => c.localName === 'title');
    if (own) lines.push(`title: ${collapse(own.textContent)}`);
    const desc = Array.from(svg.children).find((c) => c.localName === 'desc');
    if (desc) lines.push(`desc: ${cap(collapse(desc.textContent), 300)}`);
    const texts: string[] = [];
    svg.querySelectorAll('text').forEach((t) => {
      const s = collapse(t.textContent);
      if (s) texts.push(s);
    });
    if (texts.length) lines.push(`text (${texts.length}): ${texts.join(' | ')}`);
    const tips: string[] = [];
    svg.querySelectorAll('title').forEach((t) => {
      if (t === own) return;
      const s = collapse(t.textContent);
      if (s) tips.push(s);
    });
    if (tips.length) lines.push(`tooltips (${tips.length}): ${tips.join(' | ')}`);
    return lines;
  }

  function describeCanvas(c: HTMLCanvasElement): string[] {
    const lines: string[] = [];
    const label = collapse(c.getAttribute('aria-label'));
    if (label) lines.push(`aria-label: ${label}`);
    const title = collapse(c.getAttribute('title'));
    if (title) lines.push(`title: ${title}`);
    const fallback = collapse(c.textContent);
    if (fallback) lines.push(`fallback content: ${cap(fallback, 300)}`);
    lines.push(`size: ${c.width}×${c.height}`);
    return lines;
  }

  function describeOne(el: Element): DataItem {
    const t = el.localName;
    let kind = 'element';
    let lines: string[] = [];
    if (t === 'img') { kind = 'image'; lines = describeImage(el as HTMLImageElement); }
    else if (t === 'svg') { kind = 'svg'; lines = describeSvg(el); }
    else if (t === 'canvas') { kind = 'canvas'; lines = describeCanvas(el as HTMLCanvasElement); }
    else {
      const label = collapse(el.getAttribute('aria-label'));
      if (label) lines.push(`aria-label: ${label}`);
      const title = collapse(el.getAttribute('title'));
      if (title) lines.push(`title: ${title}`);
    }
    return { kind, lines, charts: chartsFor(el) };
  }

  function describe(el: Element): DataItem[] {
    const t = el.localName;
    if (t === 'img' || t === 'svg' || t === 'canvas') return [describeOne(el)];
    // A container (link around an image, chart wrapper, figure): describe the visuals inside.
    const inner = Array.from(el.querySelectorAll('img,svg,canvas')).filter((e) => !e.parentElement?.closest('svg') || e.localName === 'svg').slice(0, 5);
    const items = inner.map(describeOne);
    const own = describeOne(el);
    if (own.charts.length && !items.some((i) => i.charts.length)) items.unshift(own);
    return items.length ? items : [own];
  }

  // ---- list ---------------------------------------------------------------

  function visible(el: Element, r: DOMRect): boolean {
    if (r.width < 24 || r.height < 24) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false;
    if (el.closest('[aria-hidden="true"]')) return false;
    const docW = Math.max(document.documentElement.scrollWidth, document.body ? document.body.scrollWidth : 0);
    const docH = Math.max(document.documentElement.scrollHeight, document.body ? document.body.scrollHeight : 0);
    return r.right + window.scrollX > 0 && r.bottom + window.scrollY > 0 && r.left + window.scrollX < docW && r.top + window.scrollY < docH;
  }

  function list(): MediaList {
    const entries: MediaEntry[] = [];
    let more = 0;
    // querySelectorAll stops at shadow boundaries. Open roots are page-visible DOM, so include
    // their media while leaving closed roots (which script cannot inspect) as a known limit.
    const all: Element[] = [];
    const seen = new Set<Element>();
    const add = (el: Element): void => { if (!seen.has(el)) { seen.add(el); all.push(el); } };
    const collect = (root: Document | ShadowRoot): void => {
      root.querySelectorAll('img,canvas,svg').forEach(add);
      root.querySelectorAll('*').forEach((host) => { if (host.shadowRoot) collect(host.shadowRoot); });
    };
    collect(document);
    for (const el of all) {
      const t = el.localName;
      if (el.parentElement?.closest('svg')) continue; // nested inside an svg
      const r = el.getBoundingClientRect();
      if (!visible(el, r)) continue;
      const w = Math.round(r.width);
      const h = Math.round(r.height);
      const inControl = !!el.closest('a,button,[role=button],[role=link]');
      let entry: Omit<MediaEntry, 'id'> | null = null;

      if (t === 'img') {
        if (inControl && (w < 48 || h < 48)) continue;
        const img = el as HTMLImageElement;
        const alt = img.getAttribute('alt');
        const name = fileName(img.currentSrc || img.getAttribute('src') || '');
        const parts = [alt === null ? 'no alt' : alt.trim() ? `alt "${cap(collapse(alt), 60)}"` : 'empty alt', `${w}×${h}`];
        entry = { kind: 'image', text: `${name ? `"${name}" ` : ''}(${parts.join(', ')})` };
      } else if (t === 'canvas') {
        const libs = chartsFor(el).map((c) => c.lib);
        const label = collapse(el.getAttribute('aria-label'));
        entry = { kind: 'canvas', text: `${w}×${h}${label ? ` "${cap(label, 60)}"` : ''}${libs.length ? ` (${Array.from(new Set(libs)).join(', ')} detected)` : ''}` };
      } else {
        if (inControl || w < 48 || h < 48) continue; // icons
        const nText = el.querySelectorAll('text').length;
        const libs = chartsFor(el).map((c) => c.lib);
        const title = collapse(el.querySelector(':scope > title')?.textContent) || collapse(el.getAttribute('aria-label'));
        if (!nText && !libs.length && !title) continue; // decorative shapes
        const notes: string[] = [];
        if (libs.length) notes.push(`${Array.from(new Set(libs)).join(', ')} detected`);
        if (nText) notes.push(`${nText} text label${nText === 1 ? '' : 's'}`);
        entry = { kind: 'svg', text: `${w}×${h}${title ? ` "${cap(title, 60)}"` : ''}${notes.length ? ` (${notes.join(', ')})` : ''}` };
      }
      if (entries.length >= MAX_LIST) { more++; continue; }
      const id = idFor(el);
      if (id === undefined) { more++; continue; }
      entries.push({ id, ...entry });
    }
    return { entries, more };
  }

  return { list, describe };
}
