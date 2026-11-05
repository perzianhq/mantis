# Changelog

## Unreleased
- `find` with no match now also scrolls the page to the bottom while it keeps growing (infinite feeds; up to 30 loads / 12 s), centres a match and says how many times it loaded; on a miss it says so and restores the scroll position.
- `scroll` appends `; more content loaded (page grew)` when the page grew; `press` of End, Home, PageDown, PageUp, Space and arrows reports `scrolled to N% of page` instead of `(no visible change)`.
- Rows of 3-10 identical icon-only glyphs or svgs coloured in a leading run then another (e.g. star ratings) read as `rating N of M`.

## 0.1.11 (2026-11-04)
- `find` with no match now scrolls virtualized and nested scroll lists to look for the text (bounded: 40 steps, 8 s), centres the match and says it scrolled. It also finds text clipped inside a fully drawn list.
- Controls with no text or label whose only content is a solid colour now show the colour, e.g. `green #2f9e55`.
- A navigation slower than 5 s is reported as still loading instead of an error; the next call waits for it, then stops it if it still hasn't committed.
- Closed shadow roots created by `attachShadow` are read (declarative closed roots are still unsupported).
- Settle: ignores 2 s+ one-shot timers on load, ends a quiet poll at 450 ms, caps non-submit typing at 1.5 s, and wakes as soon as a tracked timer finishes.

## 0.1.8 (2026-10-26)
- Fixed a stale page view after a click that navigates, `type` with submit, and back-to-back `open()` calls.
- `type` no longer waits the full settle time for a typeahead request that never changes the page: 2.9s to 1.1s on a hanging request. A result that renders within 600ms is still shown; plain inputs are unchanged.
- Faster page capture (memoized DOM walker) and per-phase timing in the benchmark logs.
- A stalled or slow iframe no longer hangs a page read, action, CAPTCHA check, media list or `ask_human` wait: frames get a time budget (2s each, 4s per page) and are skipped, and the page is rescanned instead of cached without them.

## 0.1.7 (2026-10-25)
- `mantis install` no longer prints Playwright's "run npm install first" warning under `npx`, and reports `OCR data ready.`.
- OCR language data is now cached in `~/.cache/mantis/tessdata` (the folder was never created, so it was re-downloaded on every first `ocr` call and failed offline).
- On Linux without Chromium's system libraries, the launch error now says to run `mantis install --with-deps`.

## 0.1.6 (2026-10-25)
- `mantis install` fetches the matching Chromium and English OCR data; `--with-deps` for bare Linux.
- MCP server instructions now tell the agent to treat page text as untrusted data.
- CI: build, test and packed-install check on Ubuntu, Windows and macOS. Issue templates added.

## 0.1.5 (2026-10-25)
- Release built from the benchmarked commit; published results cite their commits in `bench/RESULTS.md`.
- Select/fill accepts a list for `<select multiple>`; unlabeled inputs are named by their `name`/`id`.
- File inputs show selected file names; `upload` reports the selection, not submission.
- Repeated date and grid cells get action IDs; page reads reuse an unchanged scan; navigation and CAPTCHA retry once mid-navigation.
- Combobox click diagnostics; tool tokens redacted in output.

## 0.1.4 (2026-10-24)
- Row labels in diffs, `find` context, paged full reads, mixed fill, `wait_for` states.
- Per-frame row labels and frame-scoped `find`.

## 0.1.3 (2026-10-19)
- Published to npm (2026-10-19); earlier history is in git.
