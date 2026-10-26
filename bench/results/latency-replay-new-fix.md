# Latency replay

new: 15201a2b71a0c217a2a1f674957a187b5e71766e; fix: 181ce0c3572f5a2701f112d1c61896aed6fa27cd. 30 tasks, 6 reps/build, concurrency 3; build order rotates by rep.
Common successful calls: 269; symmetric skipped call triples: 1.
MANTIS_TIMING was disabled for all builds so diagnostic timing does not skew the comparison.

| Tool | n | new median/p90 ms | fix median/p90 ms | fix/new bootstrap 95% CI | >15% |
|---|---:|---:|---:|---:|---:|
| find | 12 | 44.77/49.19 | 43.31/52.97 | 0.97 (0.87-1.14) | no |
| open | 203 | 3220.58/6690.89 | 2785.26/6611.72 | 0.86 (0.69-1.01) | no |
| read | 54 | 75.49/119.74 | 78.57/113.17 | 1.04 (0.94-1.14) | no |

CLI startup median/p90 ms: new 1089.4/1313.83, fix 1088.26/1309.9.
Capture median/p90 ms: new 137.8/349.65, fix 142.11/372.26.
Result: no per-tool median regression above 15%.
Skipped (symmetric): 1 call triples; 1 task-rep groups. Reasons: {"replay-page-invalid":1}.

| Task | paired reps | new total-wall median ms | fix total-wall median ms | fix/new |
|---|---:|---:|---:|---:|
| civic-archives-about | 6 | 7891.39 | 5766.71 | 0.73 |
| civic-census-about | 6 | 7592.84 | 7903.97 | 1.04 |
| civic-loc-about | 6 | 8031.58 | 7510.45 | 0.94 |
| civic-nasa-missions | 6 | 4599.96 | 4469.41 | 0.97 |
| civic-nist-about | 6 | 6687.67 | 5028.92 | 0.75 |
| data-eia-about | 6 | 4164.2 | 4147.52 | 1 |
| data-eurostat-database | 6 | 5787.48 | 4860.44 | 0.84 |
| data-oecd-data-explorer | 6 | 4972.95 | 5051.96 | 1.02 |
| data-ourworldindata-co2 | 6 | 5534.96 | 5398.42 | 0.98 |
| data-world-bank-population | 6 | 9749.46 | 10639.3 | 1.09 |
| docs-django-overview | 6 | 2097.26 | 2015.09 | 0.96 |
| docs-mdn-http-overview | 6 | 5638.55 | 5613.73 | 1 |
| docs-node-url | 6 | 3373.14 | 3318.98 | 0.98 |
| docs-postgresql-types | 6 | 4061.2 | 4145.26 | 1.02 |
| docs-python-json | 6 | 2217.04 | 2136.8 | 0.96 |
| interactive-arxiv-search | 6 | 3539.48 | 3518.28 | 0.99 |
| interactive-github-issues | 6 | 10369.52 | 7410.29 | 0.71 |
| interactive-openlibrary-subject | 5 | 8326.66 | 8236.27 | 0.99 |
| interactive-openstreetmap-eiffel | 6 | 3181.08 | 3260.82 | 1.03 |
| interactive-tmdb-search | 6 | 5562.61 | 5669.67 | 1.02 |
| navigation-gutenberg-search | 6 | 3457.82 | 4630.75 | 1.34 |
| navigation-merriam-serendipity | 6 | 8168.44 | 8169.71 | 1 |
| navigation-met-collection | 6 | 6251.07 | 6080.58 | 0.97 |
| navigation-smithsonian-aircraft | 6 | 6928.34 | 5342.98 | 0.77 |
| navigation-wikipedia-ada | 6 | 4082.28 | 2539 | 0.62 |
| standards-css-color-4 | 6 | 6069.6 | 4273.12 | 0.7 |
| standards-openapi-31 | 6 | 1944.76 | 1995.86 | 1.03 |
| standards-rfc-8259 | 6 | 4335.43 | 4601.04 | 1.06 |
| standards-rfc-9110 | 6 | 12061.02 | 11481.15 | 0.95 |
| standards-wcag-22 | 6 | 3775.83 | 2188 | 0.58 |
