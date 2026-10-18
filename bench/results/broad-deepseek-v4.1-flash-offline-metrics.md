# Offline agent metrics

Source: `bench\results\broad-deepseek-v4.1-flash.json` (225 logical runs; SHA-256 `f5088bdb4038f5f7615284f1b1715ad1385bac782eaeab436153c49a7ae00816`).

## Outcome and efficiency by approach

| Approach | Legacy successes/valid | Attempts | Tool steps | Repeats | Blocked-click loops | Observed INR/success | Wall-time coverage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| mantis | 73/75 | 75 | 488 | 15 | 0 | 0.160 | 75/75 |
| screenshot | 68/75 | 75 | 1494 | 93 | 0 | 1.063 | 75/75 |
| tree | 75/75 | 75 | 673 | 7 | 0 | 0.315 | 75/75 |

## Outcomes by category

| Category | Legacy successes/valid | Attempts | Tool steps | Repeats | Blocked-click loops | Observed INR/success | Wall-time coverage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| dynamic | 36/36 | 36 | 163 | 0 | 0 | 0.120 | 36/36 |
| forms | 44/45 | 45 | 594 | 33 | 0 | 0.440 | 45/45 |
| lists | 34/36 | 36 | 267 | 15 | 0 | 0.220 | 36/36 |
| long | 31/36 | 36 | 1304 | 67 | 0 | 2.227 | 36/36 |
| navigation | 18/18 | 18 | 75 | 0 | 0 | 0.085 | 18/18 |
| overlays | 26/27 | 27 | 174 | 0 | 0 | 0.129 | 27/27 |
| reading | 18/18 | 18 | 44 | 0 | 0 | 0.075 | 18/18 |
| visual | 9/9 | 9 | 34 | 0 | 0 | 0.140 | 9/9 |

## Outcomes by task

| Task | Legacy successes/valid | Attempts | Tool steps | Repeats | Blocked-click loops | Observed INR/success | Wall-time coverage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| article-deep-fact | 9/9 | 9 | 23 | 0 | 0 | 0.076 | 9/9 |
| booking-date | 8/9 | 9 | 164 | 0 | 0 | 1.218 | 9/9 |
| chart-march | 9/9 | 9 | 34 | 0 | 0 | 0.140 | 9/9 |
| checkout-steps | 9/9 | 9 | 143 | 4 | 0 | 0.498 | 9/9 |
| churned-max | 8/9 | 9 | 46 | 0 | 0 | 0.326 | 9/9 |
| cookie-cart | 8/9 | 9 | 44 | 0 | 0 | 0.107 | 9/9 |
| dashboard-refresh | 9/9 | 9 | 40 | 0 | 0 | 0.219 | 9/9 |
| faq-refund | 9/9 | 9 | 33 | 0 | 0 | 0.071 | 9/9 |
| feed-scroll | 9/9 | 9 | 90 | 15 | 0 | 0.194 | 9/9 |
| form-subscribe | 9/9 | 9 | 87 | 3 | 0 | 0.186 | 9/9 |
| iframe-pay | 9/9 | 9 | 57 | 0 | 0 | 0.119 | 9/9 |
| inventory-lookup | 9/9 | 9 | 21 | 0 | 0 | 0.075 | 9/9 |
| login | 9/9 | 9 | 71 | 0 | 0 | 0.150 | 9/9 |
| long-admin | 7/9 | 9 | 316 | 35 | 0 | 2.450 | 9/9 |
| long-laptops | 9/9 | 9 | 156 | 0 | 0 | 0.620 | 9/9 |
| long-onboard | 8/9 | 9 | 374 | 11 | 0 | 2.156 | 9/9 |
| long-shop | 7/9 | 9 | 458 | 21 | 0 | 4.149 | 9/9 |
| longlist-item | 8/9 | 9 | 48 | 0 | 0 | 0.171 | 9/9 |
| menu-settings | 9/9 | 9 | 79 | 0 | 0 | 0.170 | 9/9 |
| modal-delete | 9/9 | 9 | 51 | 0 | 0 | 0.108 | 9/9 |
| plans-pick | 9/9 | 9 | 33 | 0 | 0 | 0.071 | 9/9 |
| pricing-team | 9/9 | 9 | 30 | 0 | 0 | 0.071 | 9/9 |
| search-pagination | 9/9 | 9 | 83 | 0 | 0 | 0.195 | 9/9 |
| signup-validation | 9/9 | 9 | 129 | 26 | 0 | 0.236 | 9/9 |
| spa-team | 9/9 | 9 | 45 | 0 | 0 | 0.099 | 9/9 |

Approach×category and approach×task groups are retained in the JSON companion for paired comparisons.

## Information evidence

| Scope | Pattern available in text observation | Available but answer lacks pattern | Screenshot-only visual review unavailable | Missing traces |
| --- | ---: | ---: | ---: | ---: |
| overall | 83/144 | 0 | 4 | 0 |
| mantis | 45/48 | 0 | 0 | 0 |
| screenshot | 0/48 | 0 | 3 | 0 |
| tree | 38/48 | 0 | 1 | 0 |

## Provenance and limits

- All attempts, including retry failures, contribute to cost/time/usage totals exactly once; observed-per-success is a lower bound when coverage is incomplete.
- Tool-error recovery, repeats and blocked-click loops are deterministic trace heuristics, not causal tool-fault verdicts.
- Required-fact coverage uses declared text requirements as a pattern proxy. Screenshot-only visual evidence is unavailable without image review; text observations do not establish visual coverage.
- Historical fixtureCheck booleans and trace text do not contain authoritative fixture observations; this report makes no hardened state-verification claim.
