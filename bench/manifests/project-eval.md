# Project-tool evaluation holdout

This isolated `project-eval` namespace freezes six fresh fixtures: two tables, two
feeds (one grouped native list and one recycled virtual list), and two charts. It is not part of local-v1, local-v2 development,
or the final local-v2 held-out set, and no normal suite imports it.

When explicit evaluator wiring is added, run the same frozen pages, prompts,
oracles, near misses, and graders for both arms: `baseline` and `project`.
Use three randomized repeats per arm (36 runs/model), store results only under the
`project-eval` results namespace, and retire this holdout after tuning. The public
fixture contract is exported by `bench/project-eval.ts`. Before scoring, record
the frozen fixture/prompt/seed/oracle manifest together with the tool commit and
tool configuration; neither arm may alter those inputs.
