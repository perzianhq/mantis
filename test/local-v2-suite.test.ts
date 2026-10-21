import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { LOCAL_V2_CHECKS, LOCAL_V2_MANIFEST, LOCAL_V2_SUITE, LOCAL_V2_TASKS, localV2Route } from '../bench/agent/local-v2.js';

it('combines the frozen development and held-out splits into the 48-case v2 scorecard', () => {
  expect(LOCAL_V2_SUITE).toBe('local-v2');
  expect(LOCAL_V2_TASKS).toHaveLength(48);
  expect(LOCAL_V2_CHECKS).toHaveLength(48);
  expect(new Set(LOCAL_V2_TASKS.map((task) => task.id)).size).toBe(48);
  expect(LOCAL_V2_MANIFEST.filter((entry) => entry.split === 'development')).toHaveLength(32);
  expect(LOCAL_V2_MANIFEST.filter((entry) => entry.split === 'heldout')).toHaveLength(16);
  const frozen = JSON.parse(readFileSync(new URL('../bench/manifests/local-v2.json', import.meta.url), 'utf8')) as { tasks: string[]; splits: { development: number; heldout: number } };
  expect(frozen.tasks).toEqual(LOCAL_V2_TASKS.map((task) => task.id));
  expect(frozen.splits).toEqual({ development: 32, heldout: 16 });
  expect(Object.fromEntries([...new Set(LOCAL_V2_MANIFEST.map((entry) => entry.domain))].map((domain) => [domain, LOCAL_V2_MANIFEST.filter((entry) => entry.domain === domain).length]))).toEqual({
    'dense-tables': 6, 'lists-scrolling': 6, 'charts-canvas-images': 6, 'forms-embedded-controls': 6,
    'overlays-shadow-dom': 6, 'spa-navigation-recovery': 6, 'regions-reading': 6, 'long-workflows': 6,
  });
});

it('only exposes held-out routes through the explicit full-v2 selector', () => {
  expect(localV2Route('/v2-heldout/reading/recovery')?.type).toBe('text/html; charset=utf-8');
  expect(localV2Route('/v2-extra/table/grouped-total')?.type).toBe('text/html; charset=utf-8');
});
