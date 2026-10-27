# Deterministic long-live-v1 regrade

Model: gpt-6-luna.
Successes (42 runs per approach): tree: 34/42.

## Excluded tasks

- longlive-internet-window-frames-upload: not deterministically gradable
- longlive-selenium-window-frames-upload: not deterministically gradable

## Failures under deterministic keys

| Task | Approach | Run | Model | Failing check |
| --- | --- | ---: | --- | --- |
| longlive-wiki-probes | tree | 2 | gpt-6-luna | answer lacks "Voyager 1 \| 1977-09-05 \| 1977-084A \| 815 kg"; answer lacks "Galileo \| 1989-10-18 \| 1989-084B \| 2560 kg" |
| longlive-wiki-moons | tree | 3 | gpt-6-luna | answer lacks "Ganymede \| 2632.27 km \| 7.15455296 d \| 1610-01-07"; answer lacks "Callisto \| 2410.3 km \| 16.6890184 d \| 1610-01-07" |
| longlive-gutenberg-gothic | tree | 1 | gpt-6-luna | answer lacks "84 \| Frankenstein; or, The modern Prometheus \| Shelley, Mary Wollstonecraft, 1797-1851 \| 1993-10-01 \| PR"; answer lacks "345 \| Dracula \| Stoker, Bram, 1847-1912 \| 1995-10-01 \| PR"; answer lacks "174 \| The Picture of Dorian Gray \| Wilde, Oscar, 1854-1900 \| 1994-10-01 \| PR"; answer lacks "43 \| The strange case of Dr. Jekyll and Mr. Hyde \| Stevenson, Robert Louis, 1850-1894 \| 2008-06-27 \| PR"; answer lacks "696 \| The Castle of Otranto \| Walpole, Horace, 1717-1797 \| 1996-10-01 \| PR"; answer lacks "3268 \| The Mysteries of Udolpho \| Radcliffe, Ann Ward, 1764-1823 \| 2002-06-01 \| PR"; answer lacks "601 \| The Monk: A Romance \| Lewis, M. G. (Matthew Gregory), 1775-1818 \| 1996-07-01 \| PR"; answer lacks "209 \| The Turn of the Screw \| James, Henry, 1843-1916 \| 1995-02-01 \| PS" |
| longlive-gutenberg-gothic | tree | 2 | gpt-6-luna | answer lacks "84 \| Frankenstein; or, The modern Prometheus \| Shelley, Mary Wollstonecraft, 1797-1851 \| 1993-10-01 \| PR"; answer lacks "345 \| Dracula \| Stoker, Bram, 1847-1912 \| 1995-10-01 \| PR"; answer lacks "174 \| The Picture of Dorian Gray \| Wilde, Oscar, 1854-1900 \| 1994-10-01 \| PR"; answer lacks "43 \| The strange case of Dr. Jekyll and Mr. Hyde \| Stevenson, Robert Louis, 1850-1894 \| 2008-06-27 \| PR"; answer lacks "696 \| The Castle of Otranto \| Walpole, Horace, 1717-1797 \| 1996-10-01 \| PR"; answer lacks "3268 \| The Mysteries of Udolpho \| Radcliffe, Ann Ward, 1764-1823 \| 2002-06-01 \| PR"; answer lacks "601 \| The Monk: A Romance \| Lewis, M. G. (Matthew Gregory), 1775-1818 \| 1996-07-01 \| PR"; answer lacks "209 \| The Turn of the Screw \| James, Henry, 1843-1916 \| 1995-02-01 \| PS" |
| longlive-gutenberg-gothic | tree | 3 | gpt-6-luna | answer lacks "84 \| Frankenstein; or, The modern Prometheus \| Shelley, Mary Wollstonecraft, 1797-1851 \| 1993-10-01 \| PR"; answer lacks "345 \| Dracula \| Stoker, Bram, 1847-1912 \| 1995-10-01 \| PR"; answer lacks "174 \| The Picture of Dorian Gray \| Wilde, Oscar, 1854-1900 \| 1994-10-01 \| PR"; answer lacks "43 \| The strange case of Dr. Jekyll and Mr. Hyde \| Stevenson, Robert Louis, 1850-1894 \| 2008-06-27 \| PR"; answer lacks "696 \| The Castle of Otranto \| Walpole, Horace, 1717-1797 \| 1996-10-01 \| PR"; answer lacks "3268 \| The Mysteries of Udolpho \| Radcliffe, Ann Ward, 1764-1823 \| 2002-06-01 \| PR"; answer lacks "601 \| The Monk: A Romance \| Lewis, M. G. (Matthew Gregory), 1775-1818 \| 1996-07-01 \| PR"; answer lacks "209 \| The Turn of the Screw \| James, Henry, 1843-1916 \| 1995-02-01 \| PS" |
| longlive-met-monet-search | tree | 3 | gpt-6-luna | answer lacks "437127 \| Bridge over a Pond of Water Lilies \| 1899 \| 29.100.113 \| 92.7 x 73.7 cm"; answer lacks "437133 \| Garden at Sainte-Adresse \| 1867 \| 67.241 \| 98.1 x 129.9 cm"; answer lacks "Taller: 437133"; final URL does not match the required origin/path; final frame lacks "43-84 of"; final form lacks "On view"="unchecked"; final form lacks "Has image"="checked"; final form lacks "sort-by"="Title (a-z)" |
| longlive-met-rembrandt-search | tree | 1 | gpt-6-luna | answer lacks "437397 \| Self-Portrait \| 1660 \| 14.40.618 \| 80.3 x 67.3 cm"; answer lacks "437394 \| Aristotle with a Bust of Homer \| 1653 \| 61.198 \| 143.5 x 136.5 cm"; answer lacks "Taller: 437394"; final URL does not match the required origin/path; final frame lacks "43-84 of"; final form lacks "Has image"="checked"; final form lacks "sort-by"="Title (a-z)" |
| longlive-met-rembrandt-search | tree | 2 | gpt-6-luna | answer lacks "437397 \| Self-Portrait \| 1660 \| 14.40.618 \| 80.3 x 67.3 cm"; answer lacks "437394 \| Aristotle with a Bust of Homer \| 1653 \| 61.198 \| 143.5 x 136.5 cm"; answer lacks "Taller: 437394"; final URL does not match the required origin/path; final frame lacks "43-84 of"; final form lacks "Has image"="checked"; final form lacks "sort-by"="Title (a-z)" |

## Verdict differences

| Run | Old | New | Reason |
| --- | --- | --- | --- |
