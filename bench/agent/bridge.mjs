// stdio <-> TCP bridge: Claude Code launches this as the "MCP server"; it connects to a server
// the eval harness already started and warmed up, so connecting is instant for every tool.
import net from 'node:net';

if (process.argv[2] === '--mantis-server') {
  const { createServer } = await import('../../dist/server.js');
  const { MantisBrowser } = await import('../../dist/browser.js');
  const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js');
  const browser = new MantisBrowser();
  const server = createServer(browser);
  const { z } = await import('zod');
  server.registerTool('bench_capture', { description: 'Harness-only viewport capture; with `evaluate` (source of a function, as in browser_evaluate), also returns its result as text.', inputSchema: { evaluate: z.string().optional() } }, async ({ evaluate }) => {
    const page = browser.page;
    if (!page || page.isClosed()) return { content: [{ type: 'text', text: 'No live page to capture.' }], isError: true };
    // State is the grading evidence. Capture it before the best-effort image so a
    // compositor hang cannot discard the URL, rendered text, or form values.
    const content = [];
    if (evaluate) {
      try {
        const value = await page.evaluate(`(${evaluate})()`);
        content.push({ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value) ?? String(value) });
      } catch { /* the image may still be useful */ }
    }
    try {
      const png = await page.screenshot({ type: 'png', fullPage: false, scale: 'css', animations: 'disabled', timeout: 5_000 });
      content.unshift({ type: 'image', data: png.toString('base64'), mimeType: 'image/png' });
    } catch {
      // A text-only response is deliberate: the harness can still write final
      // deterministic evidence when Chromium cannot produce a viewport PNG.
    }
    return { content };
  });
  const close = () => { void browser.close().finally(() => process.exit(0)); };
  process.on('SIGTERM', close);
  process.stdin.on('close', close);
  await server.connect(new StdioServerTransport());
} else {

const socket = net.connect(Number(process.argv[2]), '127.0.0.1');
process.stdin.pipe(socket);
socket.pipe(process.stdout);
socket.on('close', () => process.exit(0));
socket.on('error', () => process.exit(1));
}
