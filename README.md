# Pop Culture

Lives at <https://nkhola.github.io/popculture/>, served by GitHub Pages from `main` at the
repo root. Static, no framework, no build server.

## The one rule

Everything on the site comes from **`data/ledger.md`**. That is the only file you
edit by hand. After editing it, run:

```bash
python3 .scripts/build_ledger.py
```

That regenerates `data/ledger.json` (what the site actually reads) and stamps
fresh cache-busting hashes onto `app.js` and `styles.css` in `index.html`.
Commit, push to `main`, done.

If you forget to run the build, the site keeps showing the previous content.
Nothing breaks, it just does not update.

## Adding an entry

Paste this at the bottom of the right section in `ledger.md` and fill it in:

```
## Title Here
kind: film
region: indian
by: Director Name
year: 2024
status: done
must: yes
rating: essential
tags: malayalam, thriller, slow-burn
note: Two sentences in your voice. This is the whole review.
```

| field    | values                                    | notes |
|----------|-------------------------------------------|-------|
| `kind`   | `film` / `tv` / `book`                     | required |
| `region` | `indian` / `world`                         | required |
| `status` | `now` / `done` / `shelf`                   | `now` puts it in the front page panels |
| `must`   | `yes` / `no`                               | membership of the Must list |
| `rating` | `essential` / `strong` / `decent` / `unrated` | three point scale |
| `tags`   | comma separated                            | drives all browsing, grouping and the ticker |
| `note`   | free text, one line in the file            | the review |
| `flag`   | free text                                  | a note to yourself. Renders on the entry page as "needs your correction" |

Two entries can share a title (there are two `Collected Short Stories`). The build
keys on title plus author, so that is fine.

## Poster and cover art

```bash
python3 .scripts/fetch_art.py            # only entries missing art
python3 .scripts/fetch_art.py --force    # redo everything
python3 .scripts/fetch_art.py --only book
```

- **Books** come from Open Library. No key needed, works today. The lookup
  refuses any cover whose credited author does not match yours, because generic
  titles like `Collected Poems` otherwise match a random book.
- **Films and TV** come from Cinemeta and Metahub, the metadata and artwork
  services the Stremio app uses. No key, and their IMDb-derived catalogue covers
  Malayalam and Tamil releases better than TMDb does. Search is fuzzy, so the
  spellings in the ledger resolve on their own (`Irratta` finds *Iratta*,
  `Ratsasan` finds *Raatchasan*); a year match is preferred before falling back
  to the top result, and any retitle is printed so you can spot a bad match.

  These are undocumented internal endpoints rather than a supported public API.
  They can change without notice. Because art is downloaded once and committed,
  a future breakage only affects refetching, never the live site.

  TMDb remains wired up if you ever want the licensed path. Put a key in
  `.scripts/.env` and `--source auto` prefers it:

  ```
  TMDB_API_KEY=your_key_here
  OMDB_API_KEY=your_other_key_here
  ```

  That file is gitignored. Force either source with
  `--source cinemeta` or `--source tmdb`.

Cinemeta also yields an IMDb id, stored as `imdbid:` in the ledger. That makes
`fetch_scores.py` exact (`?i=tt3417422`) instead of guessing from title and
year, which matters for titles like *Drishyam* that name several films.

Downloaded images are committed into `img/art/` and referenced from the ledger,
so the live site makes **zero** API calls.

Anything with no art gets a generated cover instead: cubist geometry seeded from
the title, in one of six palettes. The grid never shows a hole.

## Scores

```bash
python3 .scripts/fetch_scores.py
```

One OMDb call per film or show returns IMDb, Rotten Tomatoes and Metacritic
together. Free key at <https://www.omdbapi.com/apikey.aspx> (1000 calls/day).

Nothing is ever invented. If OMDb has no number the field stays empty and the
site simply does not draw that chip. Books have no external scores by design.

## Full refresh, in order

```bash
python3 .scripts/fetch_art.py
python3 .scripts/fetch_scores.py
python3 .scripts/build_ledger.py
```

The two fetchers write back into `ledger.md`, so the build must come last.

## Local preview

```bash
python3 -m http.server 8322
```

Then open <http://localhost:8322/>.

## Files

```
index.html          shell, nav, footer, palette markup
app.js              router, views, search, effects
styles.css          design tokens and everything visual
data/ledger.md      >>> the source of truth, edit this <<<
data/ledger.json    generated, do not edit
img/art/            downloaded posters and covers
.scripts/
  build_ledger.py   ledger.md -> ledger.json, plus cache stamping
  fetch_art.py      TMDb + Open Library
  fetch_scores.py   OMDb
  ledger_io.py      shared markdown round-trip helper
```

## Navigation

Routes are hash based, so every view is linkable:

`#/` `#/must` `#/films` `#/films/indian` `#/tv` `#/books/world`
`#/people` `#/by/david-fincher` `#/tag/malayalam` `#/shelf` `#/ledger`
`#/e/<slug>`

Press `Cmd+K` or `/` anywhere for search across titles, directors, authors, tags
and review text.

## Design

Two themes, both first class: cinematheque dark (default) and paper light.
Toggle in the nav, remembered in localStorage. Fraunces for display, Inter for
UI, JetBrains Mono for meta. Terracotta accent, ochre and teal secondaries,
carried over from the Post-Human Engineering system so this reads as family.

All motion respects `prefers-reduced-motion`.

## Known gaps

- Films and TV have no art until you add a TMDb key.
- No scores anywhere until you add an OMDb key.
- The `TECH SHELF` section at the bottom of the ledger is an empty stub. Your
  tech reading is on khola.blog and is not catalogued locally.
- A few entries carry a `flag:` line where the source was ambiguous. Grep for
  `flag:` in `ledger.md` to find them.
