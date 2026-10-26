# Type latency A/B

Builds: new=D:\Aadit\claudez\mantis\.tmp-ab\ab-new, fix=D:\Aadit\claudez\mantis\.tmp-ab\ab-fix. 8 reps per cell, build order rotated, loopback fixtures.

| Fixture | Build | n | median ms | p90 ms | result shown |
|---|---|---:|---:|---:|---|
| hanging-request | new | 8 | 2916 | 2937 | n/a |
| hanging-request | fix | 8 | 1081 | 1131 | n/a |
| rendered-in-600ms | new | 8 | 823 | 842 | 8/8 |
| rendered-in-600ms | fix | 8 | 830 | 844 | 8/8 |
| plain-input | new | 8 | 113 | 126 | n/a |
| plain-input | fix | 8 | 111 | 130 | n/a |
