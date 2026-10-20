# Live-site candidate pool (provisional)

This is a **planning pool**, not a frozen benchmark or task file. Do not run or
report it. Every row needs live preflight before it can become a frozen task.
The target is 30 read-only slots across 18 public sites: 20 deterministic
answer-key tasks and 10 evidence-judged tasks.

| Family (5 slots) | Candidate sites | Intended task shape | Target grading |
| --- | --- | --- | --- |
| Reading / reference | Python, Rust, Kubernetes, MDN, React | locate a stable documented fact and cite its page | 4 deterministic / 1 evidence |
| Search / filter | PubMed, Europe PMC, Smithsonian, Library of Congress | query, filter, and identify a result/property | 3 deterministic / 2 evidence |
| Dense tables | FRED, Our World in Data, Eurostat, Census, IMF | retrieve/compare a visible row, column, or period | 4 deterministic / 1 evidence |
| Charts | FRED, Our World in Data, Eurostat | reveal a series value, compare dates, or select a view | 2 deterministic / 3 evidence |
| UI state | MDN, W3C APG, GOV.UK | navigate accessible controls or read resulting UI state | 3 deterministic / 2 evidence |
| Research | PubMed, Smithsonian, Library of Congress, NPS, USGS | gather a constrained fact across page(s) | 4 deterministic / 1 evidence |

Each slot has one **candidate** task and one **reserve** task on the same site
and family. A reserve is selected only after its candidate fails preflight;
neither is a benchmark row until frozen. Avoid login, writes, purchases,
personalization, CAPTCHA-dependent flows, and fragile rank-only questions.

## Required task record

`id`, family, site, entry URL, prompt, target difficulty, candidate/reserve
status, expected final URL/state, deterministic key *or* evidence rubric,
source/reference date, browser/version, preflight trace, access constraints,
and replacement history. Every answer must anchor a fixed version, date/period,
filter, sort, and target identifier as applicable; prohibit "latest" and
rank-dependent answers. Deterministic records also require explicit
answer/evidence checks; evidence-judged records require a concrete rubric and
captured evidence frames.

## Preflight and freeze gate

1. Verify the task is read-only, publicly reachable, and stable in a clean
   browser on two checks separated in time.
2. Confirm the exact same prompt works for Mantis, tree, and screenshot, with
   no site-specific code or hints.
3. Capture the final URL/state and evidence; test a passing validator and a
   near-miss where deterministic grading is possible.
4. Keep the 20/10 deterministic/evidence split and the six-family allocation.
   Replace a drifting candidate only with its documented reserve; otherwise
   add a new candidate and repeat preflight.
5. Freeze explicit task text, keys/rubrics, reference date, browser/version,
   selected rows, and manifest hash. Thereafter any replacement creates a new
   live-set version and results remain separate.

Until this gate passes, the pool is not suitable for paid agent runs, score
claims, or comparison with local-v1/local-v2.
