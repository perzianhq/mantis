import { EventEmitter } from 'node:events';
import { join } from 'node:path';
import { expect, it, vi } from 'vitest';
import { bundledPlaywrightCli, playwrightInstallArgs, runInstallCommand } from '../src/install.js';
import { missingChromiumHint } from '../src/userAgent.js';

it('installs Chromium with the bundled Playwright CLI', async () => {
  const child = new EventEmitter();
  const spawn = vi.fn(() => child);
  const result = runInstallCommand(['install'], {
    execPath: '/node',
    prefetchOcr: vi.fn().mockResolvedValue(undefined),
    resolve: (id) => id === 'playwright/package.json' ? '/package/node_modules/playwright/package.json' : (() => { throw new Error('not found'); })(),
    spawn,
  });
  child.emit('close', 0);

  await expect(result).resolves.toBe(0);
  expect(spawn).toHaveBeenCalledWith('/node', playwrightInstallArgs(join('/package/node_modules/playwright', 'cli.js'), false), { stdio: 'inherit' });
  expect(bundledPlaywrightCli((id) => id === 'playwright-core/package.json' ? '/package/node_modules/playwright-core/package.json' : (() => { throw new Error('not found'); })()))
    .toBe(join('/package/node_modules/playwright-core', 'cli.js'));
});

it('does not install for unknown or extra arguments, and the missing-browser hint names the install command', async () => {
  const spawn = vi.fn();
  await expect(runInstallCommand(['read', 'https://example.com'], { spawn })).resolves.toBeUndefined();
  await expect(runInstallCommand(['install', 'firefox'], { spawn })).resolves.toBe(2);
  expect(spawn).not.toHaveBeenCalled();
  expect(missingChromiumHint(new Error("Executable doesn't exist"))).toContain('mantis install');
});

it('passes --with-deps through for Linux system libraries and rejects other flags', async () => {
  const child = new EventEmitter();
  const spawn = vi.fn(() => child);
  const result = runInstallCommand(['install', '--with-deps'], { execPath: '/node', prefetchOcr: vi.fn().mockResolvedValue(undefined), resolve: () => '/p/playwright/cli.js', spawn });
  child.emit('close', 0);
  await expect(result).resolves.toBe(0);
  expect(spawn).toHaveBeenCalledWith('/node', playwrightInstallArgs('/p/playwright/cli.js', true), { stdio: 'inherit' });
  await expect(runInstallCommand(['install', '--force'], { spawn })).resolves.toBe(2);
  expect(spawn).toHaveBeenCalledTimes(1);
});

it('prefetches OCR language data after Chromium installs', async () => {
  const child = new EventEmitter();
  const prefetchOcr = vi.fn().mockResolvedValue(undefined);
  const result = runInstallCommand(['install'], { resolve: () => '/p/playwright/cli.js', spawn: vi.fn(() => child), prefetchOcr });
  child.emit('close', 0);

  await expect(result).resolves.toBe(0);
  expect(prefetchOcr).toHaveBeenCalledOnce();
});

it('warns but succeeds when OCR prefetch fails', async () => {
  const child = new EventEmitter();
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  const result = runInstallCommand(['install'], {
    resolve: () => '/p/playwright/cli.js', spawn: vi.fn(() => child), prefetchOcr: vi.fn().mockRejectedValue(new Error('offline\nignored')),
  });
  child.emit('close', 0);

  await expect(result).resolves.toBe(0);
  expect(warn).toHaveBeenCalledWith('OCR data not fetched (ocr will download it on first use): offline');
  warn.mockRestore();
});

it('does not prefetch OCR data when Chromium installation fails', async () => {
  const child = new EventEmitter();
  const prefetchOcr = vi.fn().mockResolvedValue(undefined);
  const result = runInstallCommand(['install'], { resolve: () => '/p/playwright/cli.js', spawn: vi.fn(() => child), prefetchOcr });
  child.emit('close', 23);

  await expect(result).resolves.toBe(23);
  expect(prefetchOcr).not.toHaveBeenCalled();
});

it('launches the Playwright CLI without `_npx` in its script name so no install-dependencies warning prints', () => {
  const args = playwrightInstallArgs('/home/u/.npm/_npx/abc/node_modules/playwright/cli.js', true);
  expect(args.slice(2)).toEqual(['install', '--with-deps', 'chromium']);
  expect(args[0]).toBe('-e');
  expect(args[1]).toContain("process.argv.splice(1, 0, 'playwright')");
});

it('hints at --with-deps when Chromium cannot load its system libraries', () => {
  const hint = missingChromiumHint(new Error('browserType.launch: Target page, context or browser has been closed\n[pid=1][err] chrome-headless-shell: error while loading shared libraries: libglib-2.0.so.0: cannot open shared object file'));
  expect(hint).toContain('mantis install --with-deps');
  expect(missingChromiumHint(new Error('net::ERR_NAME_NOT_RESOLVED'))).toBeUndefined();
});
