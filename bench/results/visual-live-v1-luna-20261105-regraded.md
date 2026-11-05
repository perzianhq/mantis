# Deterministic visual-live-v1 regrade

Model: gpt-6-luna.
Successes (24 runs per approach): mantis: 5/8; screenshot: 8/8; tree: 6/8.

## Excluded tasks


## Failures under deterministic keys

| Task | Approach | Run | Model | Failing check |
| --- | --- | ---: | --- | --- |
| visuallive-books-one-star | mantis | 1 | gpt-6-luna | answer lacks "Sugar Rush (Offensive Line #2)" |
| visuallive-books-five-star-page | mantis | 1 | gpt-6-luna | answer lacks "Inefficiency Assassin"; answer lacks "Tao Te Ching" |
| visuallive-books-five-star-page | tree | 1 | gpt-6-luna | answer contains forbidden pattern "Nameless City"; answer contains forbidden pattern "Gutsy Girl"; answer contains forbidden pattern "Electric Pencil"; answer contains forbidden pattern "Spark Joy"; answer contains forbidden pattern "Art Forger"; answer contains forbidden pattern "Soul Reader"; answer contains forbidden pattern "Bulletproof Diet" |
| visuallive-quotes-infinite-scroll | mantis | 1 | gpt-6-luna | answer lacks "bilbo"; answer lacks "journey"; answer lacks "lost"; answer lacks "quest"; answer lacks "travel"; answer lacks "wander"; final frame lacks "Not all those who wander are lost" |
| visuallive-quotes-delayed | tree | 1 | gpt-6-luna | answer lacks "Pablo Neruda" |

## Verdict differences

| Run | Old | New | Reason |
| --- | --- | --- | --- |
