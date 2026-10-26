# Deterministic long-live-v1 regrade

Model: claude-haiku-5-5.
Successes (42 runs per approach): mantis: 40/42.

## Excluded tasks

- longlive-internet-window-frames-upload: not deterministically gradable
- longlive-selenium-window-frames-upload: not deterministically gradable

## Failures under deterministic keys

| Task | Approach | Run | Model | Failing check |
| --- | --- | ---: | --- | --- |
| longlive-gutenberg-gothic | mantis | 1 | claude-haiku-5-5 | answer lacks "209 \| The Turn of the Screw \| James, Henry, 1843-1916 \| 1995-02-01 \| PS" |
| longlive-form-selenium-select | mantis | 1 | claude-haiku-5-5 | answer lacks "selectWithoutMultiple \| two"; answer lacks "selectWithMultipleEqualsMultiple \| Emmental, Cheddar"; answer lacks "selectWithEmptyStringMultiple \| one, two"; answer lacks "selectWithMultipleWithoutValue \| two"; answer lacks "selectWithRandomMultipleValue \| one"; answer lacks "selectWithMultipleLongList \| two, five, six"; answer lacks "narrow \| Avonlea Clothbound Cheddar"; final form lacks "selectWithMultipleEqualsMultiple"="Emmental, Cheddar"; final form lacks "selectWithEmptyStringMultiple"="one, two"; final form lacks "selectWithMultipleWithoutValue"="two"; final form lacks "selectWithRandomMultipleValue"="one"; final form lacks "selectWithMultipleLongList"="two, five, six"; final form lacks "narrow"="Avonlea Clothbound Cheddar" |

## Verdict differences

| Run | Old | New | Reason |
| --- | --- | --- | --- |
