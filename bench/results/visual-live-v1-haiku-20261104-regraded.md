# Deterministic visual-live-v1 regrade

Model: claude-haiku-5-5.
Successes (24 runs per approach): mantis: 8/8; screenshot: 7/8; tree: 7/8.

## Excluded tasks


## Failures under deterministic keys

| Task | Approach | Run | Model | Failing check |
| --- | --- | ---: | --- | --- |
| visuallive-books-five-star-page | screenshot | 1 | claude-haiku-5-5 | answer lacks "Tao Te Ching" |
| visuallive-quotes-delayed | tree | 1 | claude-haiku-5-5 | answer lacks "Pablo Neruda" |

## Verdict differences

| Run | Old | New | Reason |
| --- | --- | --- | --- |
