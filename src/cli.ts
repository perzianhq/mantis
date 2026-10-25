#!/usr/bin/env node
import { realpathSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { MantisBrowser } from './browser.js';
import { runInstallCommand } from './install.js';
import { estimateTokens } from './translate.js';

export async function main(args = process.argv.slice(2)): Promise<number> {
  const installCode = await runInstallCommand(args);
  if (installCode !== undefined) return installCode;
  const [cmd, url] = args;
  if (cmd !== 'read' || !url) {
    console.error('usage: mantis read <url>');
    return 2;
  }
  const browser = new MantisBrowser();
  try {
    const text = await browser.open(url);
    console.log(text);
    console.log(`~${estimateTokens(text)} tokens`);
    return text.startsWith('error:') ? 1 : 0;
  } finally {
    await browser.close();
  }
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(realpathSync(entry)).href) {
  main().then(
    (code) => process.exit(code),
    (e) => {
      console.error(e instanceof Error ? e.message : e);
      process.exit(1);
    },
  );
}
