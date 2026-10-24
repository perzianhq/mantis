import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { MantisBrowser } from '../src/index.js';
import { fixture } from './helpers.js';

let browser: MantisBrowser;
let directory: string;
beforeAll(() => {
  browser = new MantisBrowser({ actionTimeoutMs: 1500 });
  directory = mkdtempSync(join(tmpdir(), 'mantis-selected-file-'));
  writeFileSync(join(directory, 'first-report.txt'), 'first');
  writeFileSync(join(directory, 'second-report.txt'), 'second');
});
afterAll(async () => { await browser.close(); rmSync(directory, { recursive: true, force: true }); });

describe('selected file names', () => {
  it('shows no file before selection and selected basenames afterwards', async () => {
    await browser.open(fixture('upload-selected-name.html'));
    const before = await browser.snapshot();
    const input = before.nodes.find((node) => node.kind === 'interactive' && node.name === 'Choose attachment');
    expect(input?.value).toBe('no file');
    expect((await browser.read())).toContain('value "no file"');

    const first = join(directory, 'first-report.txt');
    const second = join(directory, 'second-report.txt');
    expect(await browser.upload(input!.id!, [first, second])).toMatch(new RegExp(`^selected 2 files on #${input!.id} button "Choose attachment": first-report\\.txt, second-report\\.txt`));
    const view = await browser.read();
    expect(view).toContain('value "first-report.txt, second-report.txt"');
    expect(view).not.toContain(directory);
  });

  it('does not apply the file value to other input types', async () => {
    await browser.open(fixture('upload-selected-name.html'));
    const nodes = (await browser.snapshot()).nodes;
    const notes = nodes.find((node) => node.kind === 'interactive' && node.name === 'Notes');
    expect(notes?.value).toBe('files-like value');
    expect(nodes.some((node) => node.name === 'files-like hidden value')).toBe(false);
  });
});
