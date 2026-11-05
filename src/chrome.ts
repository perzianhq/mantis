import { spawn as nodeSpawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const CHROME_HELP = `usage: mantis chrome [--port <n>] [--profile <dir>]

Starts Google Chrome with a local remote-debugging port so Mantis can drive your own tabs.
  --port <n>       debugging port, bound to 127.0.0.1 only (default 9222)
  --profile <dir>  Chrome profile directory (default ~/.cache/mantis/chrome-profile);
                   recent Chrome refuses the debug port on its default profile
  MANTIS_CHROME    path to the Chrome executable, if it is not found automatically

Then set MANTIS_CDP_URL=http://127.0.0.1:<port> in your MCP config. Sign in to your sites once
in this profile; the sign-ins persist. Anything on this machine can use the port while Chrome is open.`;

export interface FindChromeEnv {
  platform?: NodeJS.Platform;
  env?: Record<string, string | undefined>;
  exists?: (path: string) => boolean;
}

/** Candidate Chrome executables for the platform, most likely first. */
export function chromeCandidates(platform: NodeJS.Platform, env: Record<string, string | undefined>): string[] {
  if (platform === 'win32') {
    return [env.PROGRAMFILES, env['PROGRAMFILES(X86)'], env.LOCALAPPDATA]
      .filter((base): base is string => Boolean(base))
      .map((base) => join(base, 'Google', 'Chrome', 'Application', 'chrome.exe'));
  }
  if (platform === 'darwin') {
    return [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      join(env.HOME ?? homedir(), 'Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),
    ];
  }
  return ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/opt/google/chrome/chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/snap/bin/chromium'];
}

/** MANTIS_CHROME if set, else the first installed Google Chrome; undefined when none is found. */
export function findChrome({ platform = process.platform, env = process.env, exists = existsSync }: FindChromeEnv = {}): string | undefined {
  if (env.MANTIS_CHROME) return env.MANTIS_CHROME;
  return chromeCandidates(platform, env).find((path) => exists(path));
}

export interface ChromeDependencies extends FindChromeEnv {
  /** Resolves true when the debug endpoint answers. */
  probe?: (port: number) => Promise<boolean>;
  spawn?: (command: string, args: string[]) => void;
  sleep?: (ms: number) => Promise<void>;
  profileDir?: string;
  log?: (line: string) => void;
  error?: (line: string) => void;
  waitMs?: number;
}

async function defaultProbe(port: number): Promise<boolean> {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/json/version`, { signal: AbortSignal.timeout(1000) });
    return res.ok;
  } catch {
    return false;
  }
}

function defaultSpawn(command: string, args: string[]): void {
  const child = nodeSpawn(command, args, { detached: true, stdio: 'ignore' });
  child.on('error', () => undefined);
  child.unref();
}

function parseArgs(args: readonly string[]): { port: number; profile?: string; help: boolean } | undefined {
  let port = 9222;
  let profile: string | undefined;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    if (arg === '--help' || arg === '-h') return { port, help: true };
    if (arg === '--port') {
      const n = Number(args[++i]);
      if (!Number.isInteger(n) || n < 1 || n > 65535) return undefined;
      port = n;
    } else if (arg === '--profile') {
      profile = args[++i];
      if (!profile) return undefined;
    } else return undefined;
  }
  return { port, profile, help: false };
}

/** Handle `mantis chrome`, returning undefined when another command should handle the arguments. */
export async function runChromeCommand(args: readonly string[], deps: ChromeDependencies = {}): Promise<number | undefined> {
  if (args[0] !== 'chrome') return undefined;
  const log = deps.log ?? ((line) => console.log(line));
  const error = deps.error ?? ((line) => console.error(line));
  const parsed = parseArgs(args.slice(1));
  if (!parsed) {
    error(CHROME_HELP);
    return 2;
  }
  if (parsed.help) {
    log(CHROME_HELP);
    return 0;
  }
  const { port } = parsed;
  const probe = deps.probe ?? defaultProbe;
  const endpoint = `http://127.0.0.1:${port}`;
  const summary = (): void => {
    log(`Chrome debugging endpoint: ${endpoint}`);
    log(`Add to your MCP config env: MANTIS_CDP_URL=${endpoint}`);
    log('Sign in to your sites once in this Chrome profile; the sign-ins persist.');
  };
  if (await probe(port)) {
    log(`Chrome is already ready on port ${port}.`);
    summary();
    return 0;
  }
  const chrome = findChrome(deps);
  if (!chrome) {
    error('Google Chrome was not found. Install it, or set MANTIS_CHROME to its executable path.');
    return 1;
  }
  const profile = parsed.profile ?? deps.profileDir ?? join(homedir(), '.cache', 'mantis', 'chrome-profile');
  mkdirSync(profile, { recursive: true });
  try {
    (deps.spawn ?? defaultSpawn)(chrome, [
      `--remote-debugging-port=${port}`,
      '--remote-debugging-address=127.0.0.1',
      `--user-data-dir=${profile}`,
      '--no-first-run',
      '--no-default-browser-check',
    ]);
  } catch (e) {
    error(`could not start ${chrome}: ${e instanceof Error ? e.message : String(e)}`);
    return 1;
  }
  const sleep = deps.sleep ?? ((ms) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
  const deadline = Date.now() + (deps.waitMs ?? 10_000);
  while (Date.now() < deadline) {
    if (await probe(port)) {
      log(`Started Chrome (profile ${profile}).`);
      summary();
      return 0;
    }
    await sleep(250);
  }
  error(`Chrome did not open the debugging port ${port} within 10 s. If another Chrome is using profile ${profile}, close it or pass --profile <dir>.`);
  return 1;
}
