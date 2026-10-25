# Contributing

Bug reports and "task where Mantis loses" reports are the most useful contributions: use the [issue templates](.github/ISSUE_TEMPLATE).

## Set up

```bash
npm install
npx tsx src/cli.ts install   # fetches Chromium and OCR data
npm run build
npm test
```

Details: [docs/SETUP.md](docs/SETUP.md#build-and-test). Layout and design: [docs/PLAN.md](docs/PLAN.md#code-layout), [docs/APPROACH.md](docs/APPROACH.md).

## Pull requests

- Keep changes small and focused; run `npm run build && npm test` first.
- Fix the mechanism, not the case: no site names, URLs or task text in `src/`. Reproduce the pattern in a synthetic fixture and test a passing case plus a near miss.
- Every benchmark task needs a grader test in `test/fixture-verification.test.ts` with a passing case and a near-miss failing case.
- Benchmark changes: say which suite and version they touch, and never edit published rows in place. See [bench/README.md](bench/README.md).

Security issues: see [SECURITY.md](SECURITY.md), not a public issue.
