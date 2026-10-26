# Deterministic long-live-v1 regrade

Model: claude-haiku-5-5.
Successes (42 runs per approach): mantis: 42/42; tree: 41/42.

## Excluded tasks

- longlive-internet-window-frames-upload: not deterministically gradable
- longlive-selenium-window-frames-upload: not deterministically gradable

## Failures under deterministic keys

| Task | Approach | Run | Model | Failing check |
| --- | --- | ---: | --- | --- |
| longlive-gutenberg-gothic | tree | 3 | claude-haiku-5-5 | answer lacks "84 \| Frankenstein; or, The modern Prometheus \| Shelley, Mary Wollstonecraft, 1797-1851 \| 1993-10-01 \| PR"; answer lacks "345 \| Dracula \| Stoker, Bram, 1847-1912 \| 1995-10-01 \| PR"; answer lacks "174 \| The Picture of Dorian Gray \| Wilde, Oscar, 1854-1900 \| 1994-10-01 \| PR"; answer lacks "43 \| The strange case of Dr. Jekyll and Mr. Hyde \| Stevenson, Robert Louis, 1850-1894 \| 2008-06-27 \| PR"; answer lacks "696 \| The Castle of Otranto \| Walpole, Horace, 1717-1797 \| 1996-10-01 \| PR"; answer lacks "3268 \| The Mysteries of Udolpho \| Radcliffe, Ann Ward, 1764-1823 \| 2002-06-01 \| PR"; answer lacks "601 \| The Monk: A Romance \| Lewis, M. G. (Matthew Gregory), 1775-1818 \| 1996-07-01 \| PR"; answer lacks "209 \| The Turn of the Screw \| James, Henry, 1843-1916 \| 1995-02-01 \| PS" |

## Verdict differences

| Run | Old | New | Reason |
| --- | --- | --- | --- |
