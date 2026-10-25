import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const fps = 30, replaySeconds = 25, durationSeconds = 30, frames = fps * durationSeconds;
const outputMp4 = path.join(root, 'video', 'mantis-demo.mp4');
const outputGif = path.join(root, 'video', 'mantis-demo.gif');
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mantis-demo-'));

function command(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`${command} failed with ${result.status}`);
}
function usable(command) {
  const result = spawnSync(command, ['-version'], { stdio: 'ignore' });
  return !result.error && result.status === 0;
}
function resolveFfmpeg() {
  if (usable('ffmpeg')) return 'ffmpeg';
  // The local Python distribution supplies the machine's FFmpeg build when it is not on PATH.
  const lookup = spawnSync('python', ['-c', 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'], { encoding: 'utf8' });
  const bundled = lookup.status === 0 ? lookup.stdout.trim() : '';
  if (bundled && usable(bundled)) return bundled;
  throw new Error('ffmpeg is required on PATH, or via Python imageio-ffmpeg, to render the demo video.');
}
function contentType(file) {
  if (file.endsWith('.json')) return 'application/json';
  if (file.endsWith('.png')) return 'image/png';
  return 'text/html; charset=utf-8';
}
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(req.url?.split('?')[0] || '/');
  const name = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const file = path.resolve(here, name);
  if (!file.startsWith(`${here}${path.sep}`) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': contentType(file), 'cache-control': 'no-store' });
  res.end(fs.readFileSync(file));
});

try {
  const ffmpeg = resolveFfmpeg();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  for (let i = 0; i < frames; i++) {
    const t = i / fps;
    await page.evaluate((seconds) => window.setTime(seconds), t);
    await page.screenshot({ path: path.join(tempDir, `frame-${String(i).padStart(4, '0')}.png`) });
    if ((i + 1) % 90 === 0) console.log(`Rendered ${i + 1}/${frames} frames`);
  }
  await browser.close();
  // libx264 produces a browser-compatible MP4.
  command(ffmpeg, ['-y', '-framerate', String(fps), '-i', path.join(tempDir, 'frame-%04d.png'), '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', outputMp4]);
  // A 12 fps, 960px-wide GIF retains the essential motion and stays README-friendly.
  command(ffmpeg, ['-y', '-i', outputMp4, '-vf', 'fps=12,scale=960:-2:flags=lanczos,palettegen=max_colors=128', path.join(tempDir, 'palette.png')]);
  command(ffmpeg, ['-y', '-i', outputMp4, '-i', path.join(tempDir, 'palette.png'), '-lavfi', 'fps=12,scale=960:-2:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3', '-loop', '0', outputGif]);
  for (const [name, seconds] of [['preview-0.png', 0], ['preview-mid.png', 12], ['preview-end.png', 27]]) {
    command(ffmpeg, ['-y', '-ss', String(seconds), '-i', outputMp4, '-update', '1', '-frames:v', '1', path.join(here, name)]);
  }
  command(ffmpeg, ['-v', 'error', '-i', outputMp4, '-f', 'null', '-']);
  console.log('MP4 decoded successfully.');
  console.log(`GIF bytes: ${fs.statSync(outputGif).size}`);
} finally {
  server.close();
  fs.rmSync(tempDir, { recursive: true, force: true });
}
