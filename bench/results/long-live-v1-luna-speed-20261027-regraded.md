# Deterministic long-live-v1 regrade

Model: gpt-6-luna.
Successes (42 runs per approach): mantis: 35/42.

## Excluded tasks

- longlive-internet-window-frames-upload: not deterministically gradable
- longlive-selenium-window-frames-upload: not deterministically gradable

## Failures under deterministic keys

| Task | Approach | Run | Model | Failing check |
| --- | --- | ---: | --- | --- |
| longlive-wiki-moons | mantis | 1 | gpt-6-luna | answer lacks "Io \| 1824.2 km \| 1.769 d \| 1610-01-08" |
| longlive-wiki-moons | mantis | 2 | gpt-6-luna | answer lacks "Io \| 1824.2 km \| 1.769 d \| 1610-01-08"; answer lacks "Ganymede \| 2632.27 km \| 7.15455296 d \| 1610-01-07"; answer lacks "Titan \| 2574.765 km \| 15.945448 d \| 1655-03-25"; answer lacks "Triton \| 1353.4 km \| 5.87685407 d \| 1846-10-10"; answer lacks "Enceladus \| 252.04 km \| 1.370218 d \| 1789-08-28" |
| longlive-wiki-moons | mantis | 3 | gpt-6-luna | answer lacks "Io \| 1824.2 km \| 1.769 d \| 1610-01-08"; answer lacks "Europa \| 1560.8 km \| 3.551181 d \| 1610-01-08"; answer lacks "Ganymede \| 2632.27 km \| 7.15455296 d \| 1610-01-07"; answer lacks "Callisto \| 2410.3 km \| 16.6890184 d \| 1610-01-07"; answer lacks "Titan \| 2574.765 km \| 15.945448 d \| 1655-03-25"; answer lacks "Triton \| 1353.4 km \| 5.87685407 d \| 1846-10-10"; answer lacks "Enceladus \| 252.04 km \| 1.370218 d \| 1789-08-28"; answer lacks "Mimas \| 197.49 km \| 0.942421959 d \| 1789-09-17"; answer lacks "Triton: retrograde"; answer lacks "Order: Ganymede > Titan > Callisto > Io > Europa > Triton > Enceladus > Mimas" |
| longlive-gutenberg-gothic | mantis | 1 | gpt-6-luna | answer lacks "84 \| Frankenstein; or, The modern Prometheus \| Shelley, Mary Wollstonecraft, 1797-1851 \| 1993-10-01 \| PR"; answer lacks "345 \| Dracula \| Stoker, Bram, 1847-1912 \| 1995-10-01 \| PR"; answer lacks "174 \| The Picture of Dorian Gray \| Wilde, Oscar, 1854-1900 \| 1994-10-01 \| PR"; answer lacks "43 \| The strange case of Dr. Jekyll and Mr. Hyde \| Stevenson, Robert Louis, 1850-1894 \| 2008-06-27 \| PR"; answer lacks "696 \| The Castle of Otranto \| Walpole, Horace, 1717-1797 \| 1996-10-01 \| PR"; answer lacks "3268 \| The Mysteries of Udolpho \| Radcliffe, Ann Ward, 1764-1823 \| 2002-06-01 \| PR"; answer lacks "601 \| The Monk: A Romance \| Lewis, M. G. (Matthew Gregory), 1775-1818 \| 1996-07-01 \| PR"; answer lacks "209 \| The Turn of the Screw \| James, Henry, 1843-1916 \| 1995-02-01 \| PS" |
| longlive-gutenberg-gothic | mantis | 2 | gpt-6-luna | answer lacks "84 \| Frankenstein; or, The modern Prometheus \| Shelley, Mary Wollstonecraft, 1797-1851 \| 1993-10-01 \| PR"; answer lacks "345 \| Dracula \| Stoker, Bram, 1847-1912 \| 1995-10-01 \| PR"; answer lacks "174 \| The Picture of Dorian Gray \| Wilde, Oscar, 1854-1900 \| 1994-10-01 \| PR"; answer lacks "43 \| The strange case of Dr. Jekyll and Mr. Hyde \| Stevenson, Robert Louis, 1850-1894 \| 2008-06-27 \| PR"; answer lacks "696 \| The Castle of Otranto \| Walpole, Horace, 1717-1797 \| 1996-10-01 \| PR"; answer lacks "3268 \| The Mysteries of Udolpho \| Radcliffe, Ann Ward, 1764-1823 \| 2002-06-01 \| PR"; answer lacks "601 \| The Monk: A Romance \| Lewis, M. G. (Matthew Gregory), 1775-1818 \| 1996-07-01 \| PR"; answer lacks "209 \| The Turn of the Screw \| James, Henry, 1843-1916 \| 1995-02-01 \| PS" |
| longlive-gutenberg-gothic | mantis | 3 | gpt-6-luna | answer lacks "84 \| Frankenstein; or, The modern Prometheus \| Shelley, Mary Wollstonecraft, 1797-1851 \| 1993-10-01 \| PR"; answer lacks "345 \| Dracula \| Stoker, Bram, 1847-1912 \| 1995-10-01 \| PR"; answer lacks "174 \| The Picture of Dorian Gray \| Wilde, Oscar, 1854-1900 \| 1994-10-01 \| PR"; answer lacks "43 \| The strange case of Dr. Jekyll and Mr. Hyde \| Stevenson, Robert Louis, 1850-1894 \| 2008-06-27 \| PR"; answer lacks "696 \| The Castle of Otranto \| Walpole, Horace, 1717-1797 \| 1996-10-01 \| PR"; answer lacks "3268 \| The Mysteries of Udolpho \| Radcliffe, Ann Ward, 1764-1823 \| 2002-06-01 \| PR"; answer lacks "601 \| The Monk: A Romance \| Lewis, M. G. (Matthew Gregory), 1775-1818 \| 1996-07-01 \| PR"; answer lacks "209 \| The Turn of the Screw \| James, Henry, 1843-1916 \| 1995-02-01 \| PS" |
| longlive-gutenberg-shakespeare-search | mantis | 2 | gpt-6-luna | answer lacks "Earlier: #1524" |

## Verdict differences

| Run | Old | New | Reason |
| --- | --- | --- | --- |
