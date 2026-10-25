# Changelog

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
