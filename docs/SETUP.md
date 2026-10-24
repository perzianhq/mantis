# Setup

## Install

Requires Node 20+.

```bash
npx playwright install chromium
claude mcp add mantis -- npx -y -p mantis-browser mantis-mcp
```

On native Windows: `claude mcp add mantis -- cmd /c npx -y -p mantis-browser mantis-mcp`

Try it without an agent: `npx -y -p mantis-browser mantis read https://example.com`

## Build and test

```bash
npm install
npx playwright install chromium
npm run build
npm test             # includes a check that nothing in Chrome's accessibility tree is lost
npx tsx src/cli.ts read https://example.com
```

Benchmarks, their settings and how results are graded: [bench/README.md](../bench/README.md).

Sarvam probe, calibration and diagnostics: [bench/README.md](../bench/README.md#sarvam-judge-and-capability-probe).
Agent rules and model policy: [AGENTS.md](../AGENTS.md).

To use a local build instead of npm: `claude mcp add mantis -- node /abs/path/to/mantis/dist/server.js`.

## Configuration

| Variable | Effect |
|---|---|
| `MANTIS_HEADLESS=0` | Show the browser window |
| `MANTIS_MEMORY=0` | Turn off site memory (shortening menus already seen on a site) |
| `MANTIS_MEMORY_DIR` | Site memory folder (default `~/.cache/mantis/sites`; hashes, counts and timestamps only, never page text; 30-day expiry) |
| `MANTIS_CHROMIUM` | Path to an installed Chromium binary, for when Playwright's pinned build isn't installed (the test suite and benchmarks then use it) |
| `MANTIS_TESSDATA` | OCR language data folder (default `~/.cache/mantis/tessdata`, downloaded on first use) |

## Tool reference

| Tool | Arguments |
|---|---|
| `open` | `url` |
| `read` | `region?` (`"nav"`, `"main"`, …), `full?`, `fresh?` |
| `find` | `text` |
| `click` · `type` · `select` | `id`; `type` also `text`, `submit?`; `select` also `option` |
| `fill` | `fields: [{id, value}]`, value is text, an option, or true/false |
| `press` · `scroll` · `back` | `key`; `direction` or `id`; none |
| `media` · `data` · `ocr` · `look` | none; `id` |
| `ask_human` | `reason` |
| `upload` | `id`, exactly one of `path`, `paths`, or `files`; each must name an existing regular local file |
| `forget` | none |

## Security

Treat page text as untrusted input: it reaches the agent without sanitisation or an untrusted-content marker, so prompt injection is possible. `upload` reads the selected local file and attaches it to the current page; use it only for files you intend to disclose. `ask_human` opens a headed browser window and requires a display. CAPTCHA, 2FA, payment, and similar steps are handed to the human. OCR downloads its language data on first use (or uses `MANTIS_TESSDATA` when supplied). See [SECURITY.md](../SECURITY.md) for reporting and the full threat model.

## Limitations

Closed shadow roots can't be read. The image tools (`media`, `data`, `ocr`, `look`) don't look inside iframes
yet. Guessed names (`~`) come from a small icon vocabulary.

## Where things are

Where work stands and design: [PLAN.md](PLAN.md). How it works: [APPROACH.md](APPROACH.md).
Issues and PRs welcome; run the [build and test checks](#build-and-test) first.
