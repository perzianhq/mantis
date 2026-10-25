import { spawn as nodeSpawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import type { ChildProcess } from 'node:child_process';

type SpawnedChild = Pick<ChildProcess, 'once'>;
type Spawn = (command: string, args: readonly string[], options: { stdio: 'inherit' }) => SpawnedChild;
type Resolve = (id: string) => string;

export interface InstallDependencies {
  execPath?: string;
  resolve?: Resolve;
  spawn?: Spawn;
}

const localRequire = createRequire(import.meta.url);

/** Resolve the Playwright CLI from this package's dependency tree, not the caller's npx. */
export function bundledPlaywrightCli(resolve: Resolve = localRequire.resolve): string {
  for (const packageName of ['playwright', 'playwright-core']) {
    try {
      try {
        return resolve(`${packageName}/cli.js`);
      } catch {
        // Recent Playwright versions do not export cli.js, but do export package.json.
        return join(dirname(resolve(`${packageName}/package.json`)), 'cli.js');
      }
    } catch {
      // Try the next package: playwright-core is present when consumers omit playwright.
    }
  }
  throw new Error('Unable to resolve the bundled Playwright CLI. Reinstall mantis-browser.');
}

/** Install Chromium through the Playwright version bundled with Mantis. */
export function installChromium(dependencies: InstallDependencies = {}): Promise<number> {
  const command = dependencies.execPath ?? process.execPath;
  const cli = bundledPlaywrightCli(dependencies.resolve);
  const spawn: Spawn = dependencies.spawn ?? ((file, args, options) => nodeSpawn(file, [...args], options));

  return new Promise((resolve, reject) => {
    const child = spawn(command, [cli, 'install', 'chromium'], { stdio: 'inherit' });
    child.once('error', reject);
    child.once('close', (code) => resolve(code ?? 1));
  });
}

/** Handle the install subcommand, returning undefined when another command should handle the arguments. */
export async function runInstallCommand(args: readonly string[], dependencies?: InstallDependencies): Promise<number | undefined> {
  if (args[0] !== 'install') return undefined;
  if (args.length !== 1) {
    console.error('usage: mantis install');
    return 2;
  }
  return installChromium(dependencies);
}
