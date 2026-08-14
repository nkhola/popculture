#!/usr/bin/env python3
"""Parse popculture/data/ledger.md into popculture/data/ledger.json.

The markdown ledger is the only thing a human edits. This turns it into the JSON
the site reads. Run it after every edit:

    python3 .scripts/popculture/build_ledger.py

It is deliberately forgiving: unknown keys pass through, missing keys default,
and anything malformed is reported as a warning rather than blowing up the build.
"""

from __future__ import annotations

import json
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LEDGER_MD = ROOT / "data" / "ledger.md"
LEDGER_JSON = ROOT / "data" / "ledger.json"

KINDS = {"film", "tv", "book"}
REGIONS = {"indian", "world"}
STATUSES = {"now", "done", "shelf"}
RATINGS = {"essential", "strong", "decent", "unrated"}

# Headings that are section furniture, not entries.
SECTION_RE = re.compile(r"^#\s+(.*)$")
ENTRY_RE = re.compile(r"^##\s+(.+?)\s*$")
KEY_RE = re.compile(r"^([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.*)$")

# Everything before this marker is documentation for the human, not data.
DATA_START = "# CINEMA / WORLD"


def slugify(*parts: str) -> str:
    raw = " ".join(p for p in parts if p)
    raw = unicodedata.normalize("NFKD", raw).encode("ascii", "ignore").decode()
    raw = re.sub(r"[^a-zA-Z0-9]+", "-", raw).strip("-").lower()
    return re.sub(r"-{2,}", "-", raw)


def parse(text: str) -> tuple[list[dict], list[str]]:
    warnings: list[str] = []

    if DATA_START in text:
        text = text.split(DATA_START, 1)[1]
        text = DATA_START + text
    else:
        warnings.append(f"marker {DATA_START!r} not found, parsing whole file")

    entries: list[dict] = []
    current: dict | None = None
    section = ""
    last_key: str | None = None

    for lineno, line in enumerate(text.splitlines(), start=1):
        stripped = line.strip()

        entry_match = ENTRY_RE.match(line)
        if entry_match:
            if current:
                entries.append(current)
            current = {"title": entry_match.group(1), "_section": section, "_line": lineno}
            last_key = None
            continue

        section_match = SECTION_RE.match(line)
        if section_match and not entry_match:
            section = section_match.group(1).strip()
            if current:
                entries.append(current)
                current = None
            last_key = None
            continue

        if current is None:
            continue

        if not stripped:
            last_key = None
            continue

        key_match = KEY_RE.match(stripped)
        if key_match:
            key, value = key_match.group(1).lower(), key_match.group(2).strip()
            current[key] = value
            last_key = key
        elif last_key:
            # Continuation line, e.g. a note wrapped across several lines.
            current[last_key] = (current[last_key] + " " + stripped).strip()

    if current:
        entries.append(current)

    return entries, warnings


def stamp_art(rel: str) -> str:
    """Append a content hash to an art path.

    Refetching a cover writes new bytes to the same filename, and both browsers
    and the Pages CDN will happily keep serving the old image. The ledger keeps
    the clean path; only the generated JSON carries the stamp.
    """
    if not rel:
        return rel
    import hashlib

    path = ROOT / rel
    if not path.exists():
        return rel
    digest = hashlib.sha256(path.read_bytes()).hexdigest()[:8]
    return f"{rel}?v={digest}"


def normalise(entries: list[dict]) -> tuple[list[dict], list[str]]:
    warnings: list[str] = []
    out: list[dict] = []
    seen: dict[str, int] = {}

    for e in entries:
        title = e.get("title", "").strip()
        by = e.get("by", "").strip()
        line = e.get("_line")

        kind = e.get("kind", "").strip().lower()
        region = e.get("region", "").strip().lower()
        if kind not in KINDS:
            warnings.append(f"line {line}: {title!r} has kind={kind!r}, skipping")
            continue
        if region not in REGIONS:
            warnings.append(f"line {line}: {title!r} has region={region!r}, defaulting to world")
            region = "world"

        status = e.get("status", "done").strip().lower()
        if status not in STATUSES:
            warnings.append(f"line {line}: {title!r} has status={status!r}, defaulting to done")
            status = "done"

        rating = e.get("rating", "unrated").strip().lower()
        if rating not in RATINGS:
            warnings.append(f"line {line}: {title!r} has rating={rating!r}, defaulting to unrated")
            rating = "unrated"

        must = e.get("must", "no").strip().lower() in {"yes", "y", "true", "1"}

        tags = [t.strip().lower() for t in e.get("tags", "").split(",") if t.strip()]

        year_raw = e.get("year", "").strip()
        try:
            year = int(year_raw) if year_raw else None
        except ValueError:
            warnings.append(f"line {line}: {title!r} has year={year_raw!r}, ignoring")
            year = None

        slug = slugify(title, by) or slugify(title, str(line))
        if slug in seen:
            warnings.append(f"line {line}: duplicate slug {slug!r}, suffixing")
            seen[slug] += 1
            slug = f"{slug}-{seen[slug]}"
        else:
            seen[slug] = 1

        def score(key: str):
            v = e.get(key, "").strip()
            if not v:
                return None
            try:
                return float(v) if "." in v else int(v)
            except ValueError:
                warnings.append(f"line {line}: {title!r} has {key}={v!r}, ignoring")
                return None

        record = {
            "slug": slug,
            "title": title,
            "kind": kind,
            "region": region,
            "by": by,
            "year": year,
            "status": status,
            "must": must,
            "rating": rating,
            "tags": tags,
            "note": e.get("note", "").strip(),
            "art": stamp_art(e.get("art", "").strip()),
            "imdb": score("imdb"),
            "rt": score("rt"),
            "mc": score("mc"),
        }
        if e.get("flag", "").strip():
            record["flag"] = e["flag"].strip()
        if e.get("tmdb", "").strip():
            record["tmdb"] = e["tmdb"].strip()

        out.append(record)

    return out, warnings


def build_facets(items: list[dict]) -> dict:
    """Precompute the groupings the front end needs so it does no work on load."""
    tag_counts: dict[str, int] = {}
    people: dict[str, dict] = {}

    for it in items:
        for t in it["tags"]:
            tag_counts[t] = tag_counts.get(t, 0) + 1
        if it["by"] and it["by"].lower() != "unknown":
            for name in [n.strip() for n in it["by"].split(",") if n.strip()]:
                p = people.setdefault(
                    name, {"name": name, "slug": slugify(name), "count": 0, "kinds": set()}
                )
                p["count"] += 1
                p["kinds"].add(it["kind"])

    for p in people.values():
        p["kinds"] = sorted(p["kinds"])

    return {
        "tags": sorted(
            ({"tag": t, "count": c} for t, c in tag_counts.items()),
            key=lambda x: (-x["count"], x["tag"]),
        ),
        "people": sorted(people.values(), key=lambda p: (-p["count"], p["name"])),
    }


def stamp_assets() -> list[str]:
    """Rewrite ?v= on app.js / styles.css in index.html to a hash of their contents.

    GitHub Pages serves assets with a ten minute max-age, so without this a push
    can leave visitors on the old CSS or JS. Content hashing means the URL only
    changes when the file actually changes, and never needs hand bumping.
    """
    import hashlib

    index = ROOT / "index.html"
    if not index.exists():
        return []

    html = index.read_text(encoding="utf-8")
    original = html
    touched = []

    for asset in ("app.js", "styles.css"):
        path = ROOT / asset
        if not path.exists():
            continue
        digest = hashlib.sha256(path.read_bytes()).hexdigest()[:8]
        pattern = re.compile(rf'({re.escape(asset)})(\?v=[a-f0-9]+)?(["\'])')
        new_html, n = pattern.subn(rf'\1?v={digest}\3', html)
        if n and new_html != html:
            touched.append(f"{asset}?v={digest}")
        html = new_html

    if html != original:
        index.write_text(html, encoding="utf-8")
    return touched


def main() -> int:
    if not LEDGER_MD.exists():
        print(f"error: {LEDGER_MD} not found", file=sys.stderr)
        return 1

    raw, w1 = parse(LEDGER_MD.read_text(encoding="utf-8"))
    items, w2 = normalise(raw)
    warnings = w1 + w2

    payload = {
        "generated_from": "popculture/data/ledger.md",
        "count": len(items),
        "items": items,
        "facets": build_facets(items),
    }

    LEDGER_JSON.parent.mkdir(parents=True, exist_ok=True)
    LEDGER_JSON.write_text(
        json.dumps(payload, indent=1, ensure_ascii=False) + "\n", encoding="utf-8"
    )

    by_kind: dict[str, int] = {}
    for it in items:
        key = f"{it['kind']}/{it['region']}"
        by_kind[key] = by_kind.get(key, 0) + 1

    print(f"wrote {LEDGER_JSON.relative_to(ROOT)}  ({len(items)} entries)")
    for k in sorted(by_kind):
        print(f"  {k:<14} {by_kind[k]}")
    print(f"  must-list      {sum(1 for i in items if i['must'])}")
    print(f"  with art       {sum(1 for i in items if i['art'])}")
    print(f"  with scores    {sum(1 for i in items if i['imdb'] is not None)}")

    for stamped in stamp_assets():
        print(f"  cache-stamped  {stamped}")

    if warnings:
        print(f"\n{len(warnings)} warning(s):")
        for w in warnings:
            print(f"  ! {w}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
