#!/usr/bin/env python3
"""Fill imdb / rt / mc scores for films and TV from OMDb, writing back into the ledger.

One OMDb call per title returns all three numbers. Books are skipped: OMDb has no
book data, and books carry only your own rating.

Usage:
    export OMDB_API_KEY=xxxxxxxx
    python3 .scripts/popculture/fetch_scores.py           # only entries missing scores
    python3 .scripts/popculture/fetch_scores.py --force
    python3 .scripts/popculture/fetch_scores.py --dry-run

Free key (1000 calls/day) at https://www.omdbapi.com/apikey.aspx. Put it in
.scripts/popculture/.env as OMDB_API_KEY=... . Scores are committed into the
ledger, so the live site never calls OMDb.

Nothing here invents a number. If OMDb has no value the field stays empty and
the site simply does not render that chip.
"""

from __future__ import annotations

import argparse
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
from ledger_io import apply_updates, load  # noqa: E402
from fetch_art import UA, load_env, strip_paren  # noqa: E402

OMDB = "http://www.omdbapi.com/"


def get_json(url: str, timeout: int = 20) -> dict | None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read().decode("utf-8"))
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ValueError) as e:
        print(f"    request failed: {e}")
        return None


def parse_ratings(data: dict) -> dict[str, str]:
    out: dict[str, str] = {}

    imdb = data.get("imdbRating", "")
    if re.fullmatch(r"\d+(\.\d+)?", imdb or ""):
        out["imdb"] = imdb

    meta = data.get("Metascore", "")
    if re.fullmatch(r"\d+", meta or ""):
        out["mc"] = meta

    for r in data.get("Ratings") or []:
        if r.get("Source") == "Rotten Tomatoes":
            m = re.match(r"(\d+)%", r.get("Value", ""))
            if m:
                out["rt"] = m.group(1)
        elif r.get("Source") == "Metacritic" and "mc" not in out:
            m = re.match(r"(\d+)/100", r.get("Value", ""))
            if m:
                out["mc"] = m.group(1)

    return out


def lookup(entry, api_key: str) -> dict[str, str]:
    kind = "series" if entry.get("kind") == "tv" else "movie"
    title = strip_paren(entry.title)
    year = entry.get("year")

    params = {"apikey": api_key, "t": title, "type": kind}
    if year:
        params["y"] = year

    data = get_json(f"{OMDB}?{urllib.parse.urlencode(params)}")
    if not data or data.get("Response") != "True":
        if year:
            params.pop("y")
            data = get_json(f"{OMDB}?{urllib.parse.urlencode(params)}")
        if not data or data.get("Response") != "True":
            return {}

    got_year = (data.get("Year") or "")[:4]
    if year and got_year.isdigit() and abs(int(got_year) - int(year)) > 2:
        print(f"    year mismatch: wanted {year}, OMDb returned {got_year} for "
              f"{data.get('Title')!r}, skipping")
        return {}

    return parse_ratings(data)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    load_env()
    api_key = os.environ.get("OMDB_API_KEY", "").strip()
    if not api_key:
        print("error: OMDB_API_KEY not set.")
        print("       free key at https://www.omdbapi.com/apikey.aspx")
        print("       then put OMDB_API_KEY=... in .scripts/popculture/.env")
        return 1

    _, entries = load()
    targets = [e for e in entries if e.get("kind") in {"film", "tv"}]
    if not args.force:
        targets = [e for e in targets if not e.get("imdb")]

    if not targets:
        print("nothing to fetch")
        return 0

    print(f"fetching scores for {len(targets)} titles\n")
    updates: dict[str, dict[str, str]] = {}
    ok = missing = 0

    for i, entry in enumerate(targets, 1):
        print(f"[{i}/{len(targets)}] {entry.title} ({entry.get('year')})")
        scores = lookup(entry, api_key)
        if not scores:
            print("    no scores found")
            missing += 1
        else:
            print("    " + "  ".join(f"{k}={v}" for k, v in sorted(scores.items())))
            if not args.dry_run:
                updates[entry.slug] = scores
            ok += 1
        time.sleep(0.2)

    if updates:
        written = apply_updates(updates)
        print(f"\nwrote {written} field(s) back into ledger.md")

    print(f"\ndone: {ok} found, {missing} missing")
    if updates:
        print("now run: python3 .scripts/popculture/build_ledger.py")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
