#!/usr/bin/env python3
"""Download poster and cover art into popculture/img/art/ and record it in the ledger.

  Films and TV  ->  TMDb          (needs a free key, see below)
  Books         ->  Open Library  (no key, works out of the box)

Usage:
    export TMDB_API_KEY=xxxxxxxx          # optional, only needed for film/tv
    python3 .scripts/popculture/fetch_art.py            # only entries missing art
    python3 .scripts/popculture/fetch_art.py --force    # refetch everything
    python3 .scripts/popculture/fetch_art.py --only book
    python3 .scripts/popculture/fetch_art.py --dry-run

Get a TMDb key at https://www.themoviedb.org/settings/api (free, instant).
Put it in .scripts/popculture/.env as TMDB_API_KEY=... and it will be picked up.
The key is never needed in CI. Art is committed to the repo, so the live site
makes zero API calls.
"""

from __future__ import annotations

import argparse
import http.client
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from ledger_io import ART_DIR, ROOT, apply_updates, load  # noqa: E402

TMDB = "https://api.themoviedb.org/3"
TMDB_IMG = "https://image.tmdb.org/t/p/w500"
OPENLIB_SEARCH = "https://openlibrary.org/search.json"
OPENLIB_COVER = "https://covers.openlibrary.org/b/id/{}-L.jpg"

# Cinemeta and Metahub are the metadata and artwork services the Stremio app
# uses. No key, and their IMDb-derived catalogue covers Malayalam and Tamil
# releases better than TMDb does. They are undocumented internal endpoints
# rather than a supported public API, so treat a failure here as expected
# rather than exceptional. Art is committed, so the live site never calls them.
CINEMETA = "https://v3-cinemeta.strem.io/catalog/{type}/top/search={q}.json"
METAHUB = "https://images.metahub.space/poster/{size}/{imdb}/img"

UA = "nkhola-popculture/1.0 (+https://nkhola.github.io/popculture)"


def load_env() -> None:
    env = Path(__file__).resolve().parent / ".env"
    if not env.exists():
        return
    for line in env.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


# A dropped keep-alive raises http.client.RemoteDisconnected, which is an
# HTTPException and NOT a URLError, so catching urllib's own errors is not
# enough. URLError, HTTPError and TimeoutError are all OSError subclasses,
# so this pair covers every transport failure these hosts produce.
NET_ERRORS = (OSError, http.client.HTTPException, ValueError)


def _fetch(url: str, timeout: int, accept: str | None = None, tries: int = 3) -> bytes | None:
    """GET with retries. Returns the body, or None once the retries run out."""
    headers = {"User-Agent": UA}
    if accept:
        headers["Accept"] = accept
    req = urllib.request.Request(url, headers=headers)

    for attempt in range(1, tries + 1):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            # A real answer from the server. Retrying a 404 just wastes time.
            if e.code < 500:
                print(f"    HTTP {e.code}")
                return None
            last = e
        except NET_ERRORS as e:
            last = e
        if attempt < tries:
            time.sleep(0.6 * attempt)
    print(f"    request failed after {tries} tries: {last}")
    return None


def get_json(url: str, timeout: int = 20) -> dict | None:
    body = _fetch(url, timeout, accept="application/json")
    if body is None:
        return None
    try:
        return json.loads(body.decode("utf-8"))
    except (ValueError, UnicodeDecodeError) as e:
        print(f"    bad JSON: {e}")
        return None


def download(url: str, dest: Path, timeout: int = 30) -> bool:
    data = _fetch(url, timeout)
    if data is None:
        return False
    # Open Library serves a 43 byte 1x1 gif when it has no cover.
    if len(data) < 3000:
        print(f"    rejected placeholder image ({len(data)} bytes)")
        return False
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    return True


def strip_paren(title: str) -> str:
    return re.sub(r"\s*\([^)]*\)\s*$", "", title).strip()


def tmdb_lookup(entry, api_key: str) -> tuple[str, str] | None:
    """Return (poster_url, tmdb_id) or None."""
    kind = "tv" if entry.get("kind") == "tv" else "movie"
    title = strip_paren(entry.title)
    year = entry.get("year")

    params = {"api_key": api_key, "query": title, "include_adult": "false"}
    if year:
        params["primary_release_year" if kind == "movie" else "first_air_date_year"] = year

    data = get_json(f"{TMDB}/search/{kind}?{urllib.parse.urlencode(params)}")
    results = (data or {}).get("results") or []

    if not results and year:
        params.pop("primary_release_year", None)
        params.pop("first_air_date_year", None)
        data = get_json(f"{TMDB}/search/{kind}?{urllib.parse.urlencode(params)}")
        results = (data or {}).get("results") or []

    for r in results:
        if r.get("poster_path"):
            return TMDB_IMG + r["poster_path"], str(r.get("id", ""))
    return None


def cinemeta_lookup(entry) -> tuple[str, str] | None:
    """Return (poster_url, imdb_id) via Stremio's Cinemeta, or None.

    Cinemeta search is fuzzy, which is what we want: it resolves the spellings
    actually used in the ledger (Irratta -> Iratta, Ratsasan -> Raatchasan).
    That same looseness means an unfiltered first result can be a different
    film entirely, so prefer a result whose year matches before falling back.
    """
    kind = "series" if entry.get("kind") == "tv" else "movie"
    title = strip_paren(entry.title)
    year = entry.get("year")

    url = CINEMETA.format(type=kind, q=urllib.parse.quote(title))
    data = get_json(url)
    metas = (data or {}).get("metas") or []
    if not metas:
        return None

    best = None
    if year:
        for m in metas[:8]:
            if str(m.get("releaseInfo", "")).startswith(str(year)):
                best = m
                break
        if best is None:
            # Accept a one year drift, common for festival vs general release.
            for m in metas[:8]:
                info = str(m.get("releaseInfo", ""))[:4]
                if info.isdigit() and abs(int(info) - int(year)) <= 1:
                    best = m
                    break
    if best is None:
        if year:
            print(f"    no year match for {year}, using top result")
        best = metas[0]

    imdb_id = best.get("imdb_id") or ""
    got = best.get("name", "")
    if got.lower() != title.lower():
        print(f"    matched as {got!r} ({best.get('releaseInfo')})")

    if imdb_id:
        return METAHUB.format(size="large", imdb=imdb_id), imdb_id
    if best.get("poster"):
        return best["poster"], ""
    return None


def surname(name: str) -> str:
    parts = [p for p in re.split(r"[\s.]+", name.strip()) if len(p) > 1]
    return parts[-1].lower() if parts else ""


def author_matches(doc: dict, author: str) -> bool:
    """Generic titles like 'Collected Poems' or 'The Complete Short Stories' match
    dozens of unrelated books, so a title-only hit is not good enough.

    Check the *primary* author only. Matching any credited name lets in records
    where the wanted author wrote a foreword: that is how O. Henry's collection
    picked up a Mark Twain cover.
    """
    want = surname(author)
    if not want:
        return True
    names = doc.get("author_name") or []
    if not names:
        return False
    return want in names[0].lower()


def openlibrary_lookup(entry) -> str | None:
    title = strip_paren(entry.title)
    author = entry.get("by")
    has_author = bool(author) and author.lower() != "unknown"

    attempts = []
    if has_author:
        attempts.append({"title": title, "author": author, "limit": "10"})
        attempts.append({"q": f"{title} {author}", "limit": "10"})
    attempts.append({"title": title, "limit": "10"})

    for params in attempts:
        data = get_json(f"{OPENLIB_SEARCH}?{urllib.parse.urlencode(params)}")
        for doc in (data or {}).get("docs", [])[:10]:
            if not doc.get("cover_i"):
                continue
            if has_author and not author_matches(doc, author):
                continue
            return OPENLIB_COVER.format(doc["cover_i"])
        time.sleep(0.3)

    if has_author:
        print(f"    no cover credited to {author}, leaving blank rather than guessing")
    return None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="refetch entries that already have art")
    ap.add_argument("--only", choices=["film", "tv", "book"], help="restrict to one kind")
    ap.add_argument("--title", help="only entries whose title contains this (case insensitive)")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--limit", type=int, default=0, help="stop after N successful fetches")
    ap.add_argument("--source", choices=["auto", "cinemeta", "tmdb"], default="auto",
                    help="art source for film and TV. auto prefers TMDb when a key "
                         "is present, otherwise Cinemeta. Books always use Open Library.")
    args = ap.parse_args()

    load_env()
    tmdb_key = os.environ.get("TMDB_API_KEY", "").strip()

    source = args.source
    if source == "auto":
        source = "tmdb" if tmdb_key else "cinemeta"
    if source == "tmdb" and not tmdb_key:
        print("error: --source tmdb needs TMDB_API_KEY. Use --source cinemeta instead.")
        return 1

    _, entries = load()
    targets = [e for e in entries if args.only is None or e.get("kind") == args.only]
    if args.title:
        needle = args.title.lower()
        targets = [e for e in targets if needle in e.title.lower()]
    if not args.force:
        targets = [e for e in targets if not e.get("art")]

    if not targets:
        print("nothing to fetch")
        return 0

    screen = sum(1 for e in targets if e.get("kind") in {"film", "tv"})
    print(f"fetching art for {len(targets)} entries"
          + (f"  ({screen} via {source})" if screen else "") + "\n")
    updates: dict[str, dict[str, str]] = {}
    ok = missing = 0

    def flush() -> None:
        """Write what we have so far. Called on the normal path and on the way
        out of an interrupt or crash, because a long run that dies at entry 3
        used to discard the two images it had already downloaded."""
        if updates and not args.dry_run:
            written = apply_updates(updates)
            print(f"\nwrote {written} field(s) back into ledger.md")
            updates.clear()

    try:
        run(targets, args, source, tmdb_key, updates)
    except KeyboardInterrupt:
        print("\ninterrupted")
        flush()
        return 130
    except Exception:
        flush()
        raise
    flush()
    return 0


def run(targets, args, source, tmdb_key, updates) -> None:
    ok = missing = 0

    for i, entry in enumerate(targets, 1):
        slug = entry.slug
        kind = entry.get("kind")
        print(f"[{i}/{len(targets)}] {entry.title} ({kind})")

        extra: dict[str, str] = {}
        if kind == "book":
            url = openlibrary_lookup(entry)
        elif source == "cinemeta":
            found = cinemeta_lookup(entry)
            url = found[0] if found else None
            if found and found[1]:
                extra["imdbid"] = found[1]
        else:
            found = tmdb_lookup(entry, tmdb_key)
            url = found[0] if found else None
            if found and found[1]:
                extra["tmdb"] = found[1]

        if not url:
            print("    no art found")
            missing += 1
            # On a forced refetch, a previously accepted image may have come from a
            # looser match. Clear it rather than leaving a wrong cover in place.
            if args.force and entry.get("art") and not args.dry_run:
                updates.setdefault(slug, {})["art"] = ""
                stale = ART_DIR / f"{slug}.jpg"
                if stale.exists():
                    stale.unlink()
                print("    cleared previous art")
            continue

        dest = ART_DIR / f"{slug}.jpg"
        if args.dry_run:
            print(f"    would save {url} -> {dest.relative_to(ROOT)}")
            ok += 1
        elif download(url, dest) or (
            # Metahub does not hold every size for every title. Step down before
            # giving up, and keep the IMDb id either way since scores use it.
            "/poster/large/" in url and download(url.replace("/poster/large/", "/poster/medium/"), dest)
        ):
            rel = f"img/art/{slug}.jpg"
            print(f"    saved {rel}")
            updates.setdefault(slug, {})["art"] = rel
            updates[slug].update(extra)
            ok += 1
        else:
            missing += 1

        time.sleep(0.25)
        if args.limit and ok >= args.limit:
            break

    print(f"\ndone: {ok} fetched, {missing} missing")
    if not args.dry_run and updates:
        print("then run: python3 .scripts/build_ledger.py")


if __name__ == "__main__":
    raise SystemExit(main())
