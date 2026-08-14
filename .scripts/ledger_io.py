#!/usr/bin/env python3
"""Read/write helpers for popculture/data/ledger.md.

The fetch scripts need to write values back into the markdown without disturbing
anything a human wrote. This parses the file into entries that remember which
line each field lives on, so an update is a surgical line replacement rather
than a regeneration.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LEDGER_MD = ROOT / "data" / "ledger.md"
ART_DIR = ROOT / "img" / "art"

ENTRY_RE = re.compile(r"^##\s+(.+?)\s*$")
SECTION_RE = re.compile(r"^#\s+(.*)$")
KEY_RE = re.compile(r"^([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.*)$")
DATA_START = "# CINEMA / WORLD"


class Entry:
    __slots__ = ("title", "fields", "field_lines", "last_field_line")

    def __init__(self, title: str):
        self.title = title
        self.fields: dict[str, str] = {}
        self.field_lines: dict[str, int] = {}
        self.last_field_line: int = -1

    def get(self, key: str, default: str = "") -> str:
        return self.fields.get(key, default).strip()

    @property
    def slug(self) -> str:
        from build_ledger import slugify  # local import keeps this module standalone

        return slugify(self.title, self.get("by"))

    def __repr__(self) -> str:
        return f"<Entry {self.title!r} {self.get('kind')}/{self.get('region')}>"


def load(path: Path = LEDGER_MD) -> tuple[list[str], list[Entry]]:
    lines = path.read_text(encoding="utf-8").splitlines()

    try:
        start = next(i for i, ln in enumerate(lines) if ln.strip() == DATA_START)
    except StopIteration:
        start = 0

    entries: list[Entry] = []
    current: Entry | None = None
    last_key: str | None = None

    for i in range(start, len(lines)):
        line = lines[i]
        stripped = line.strip()

        m = ENTRY_RE.match(line)
        if m:
            current = Entry(m.group(1))
            entries.append(current)
            last_key = None
            continue

        if SECTION_RE.match(line):
            current = None
            last_key = None
            continue

        if current is None:
            continue

        if not stripped:
            last_key = None
            continue

        km = KEY_RE.match(stripped)
        if km:
            key, value = km.group(1).lower(), km.group(2)
            current.fields[key] = value
            current.field_lines[key] = i
            current.last_field_line = i
            last_key = key
        elif last_key:
            current.fields[last_key] += " " + stripped
            current.last_field_line = i

    return lines, entries


def set_field(lines: list[str], entry: Entry, key: str, value: str) -> list[str]:
    """Set key on entry, replacing the existing line or inserting a new one.

    Returns the (possibly lengthened) line list. Entries parsed earlier keep
    valid line numbers only if you re-load after an insert, so callers should
    batch inserts through apply_updates below.
    """
    if key in entry.field_lines:
        idx = entry.field_lines[key]
        lines[idx] = f"{key}: {value}"
    else:
        idx = entry.last_field_line + 1
        lines.insert(idx, f"{key}: {value}")
        entry.field_lines[key] = idx
        entry.last_field_line = idx
    entry.fields[key] = value
    return lines


def apply_updates(updates: dict[str, dict[str, str]], path: Path = LEDGER_MD) -> int:
    """updates maps entry slug -> {field: value}. Re-loads between inserts so
    line offsets stay correct. Returns the number of fields written."""
    written = 0
    remaining = {k: dict(v) for k, v in updates.items() if v}

    while remaining:
        lines, entries = load(path)
        by_slug = {e.slug: e for e in entries}
        inserted = False

        for slug, fields in list(remaining.items()):
            entry = by_slug.get(slug)
            if entry is None:
                del remaining[slug]
                continue
            for key, value in list(fields.items()):
                if key in entry.field_lines:
                    lines[entry.field_lines[key]] = f"{key}: {value}"
                    del fields[key]
                    written += 1
                else:
                    set_field(lines, entry, key, value)
                    del fields[key]
                    written += 1
                    inserted = True
                    break
            if not fields:
                del remaining[slug]
            if inserted:
                break

        path.write_text("\n".join(lines) + "\n", encoding="utf-8")
        if not inserted and remaining:
            break

    return written


if __name__ == "__main__":
    _, es = load()
    print(f"{len(es)} entries")
    for e in es[:5]:
        print(" ", e.slug, "|", e)
