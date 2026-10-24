import path from 'node:path';
import { expect, it } from 'vitest';
import { uploadFixturePath } from '../bench/agent/upload-fixture.js';

it('places tree upload fixtures in the output directory while leaving other approaches unchanged', () => {
  const dir = path.join('attempts', 'one');
  expect(uploadFixturePath('tree', dir, 'fixtures/README.md')).toBe(path.join(dir, 'tree-output', 'README.md'));
  expect(uploadFixturePath('mantis', dir, 'fixtures/README.md')).toBe(path.join(dir, 'README.md'));
  expect(uploadFixturePath('screenshot', dir, 'fixtures/README.md')).toBe(path.join(dir, 'README.md'));
});

it('does not invent an upload path for tasks without a fixture', () => {
  expect(uploadFixturePath('tree', path.join('attempts', 'one'), undefined)).toBeNull();
});
