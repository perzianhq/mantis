import path from 'node:path';

export type UploadFixtureApproach = 'mantis' | 'tree' | 'devtools' | 'browseruse' | 'screenshot';

/** Path made available to an upload-capable benchmark agent, if its task needs one. */
export function uploadFixturePath(approach: UploadFixtureApproach, dir: string, fixture: string | undefined): string | null {
  if (!fixture) return null;
  const root = approach === 'tree' ? path.join(dir, 'tree-output') : dir;
  return path.join(root, path.basename(fixture));
}
