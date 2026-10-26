# Latency replay

new: 15201a2b71a0c217a2a1f674957a187b5e71766e; fix: 181ce0c3572f5a2701f112d1c61896aed6fa27cd. 1 tasks, 12 reps/build, concurrency 3; build order rotates by rep.
Common successful calls: 12; symmetric skipped call triples: 0.
MANTIS_TIMING was enabled only for: new, fix. It is diagnostic and not part of the primary comparison.

| Tool | n | new median/p90 ms | fix median/p90 ms | fix/new bootstrap 95% CI | >15% |
|---|---:|---:|---:|---:|---:|
| open | 12 | 1493.93/1635.03 | 1584.2/1805.99 | null (null-null) | no |

CLI startup median/p90 ms: new 1148.42/1528.81, fix 1459.24/1515.57.
Capture median/p90 ms: new 724.21/995.51, fix 699.85/786.82.
Result: no per-tool median regression above 15%.
Skipped (symmetric): 0 call triples; 0 task-rep groups. Reasons: {}.

| Task | paired reps | new total-wall median ms | fix total-wall median ms | fix/new |
|---|---:|---:|---:|---:|
| navigation-gutenberg-search | 12 | 3438.86 | 3509.46 | 1.02 |
