# Retired project-tool experiment

On 2026-10-20, DeepSeek ran three repeats per arm on six synthetic fixtures
(18 runs each). Both baseline Mantis and Mantis with `project` available were
18/18 correct, but the latter used +41.7% input tokens, +32.5% estimated cost,
+32.6% active execution, and 16 versus 4 tool errors. Concurrent quota waiting
makes wall-clock comparisons non-attributable.

The feature was removed: it had hidden-data leaks and incorrect table handling,
and this experiment did not establish a benefit. The traces are exploratory,
DeepSeek-only, and used fixed—not randomized/interleaved—row ordering. The six
fixtures are retired as holdout evidence; any future narrower capability needs
fresh fixtures.
