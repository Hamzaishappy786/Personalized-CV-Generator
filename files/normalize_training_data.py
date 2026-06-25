from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend.app.services.schema_normalizer import normalize_cv_dict

INPUT_PATHS = [
    ROOT / "files" / "sample_data.jsonl",
    ROOT / "files" / "data.jsonl",
]
OUTPUT_PATH = ROOT / "files" / "data_normalized.jsonl"


def load_rows(path: Path):
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if line:
                yield json.loads(line)


def main():
    normalized = []
    for path in INPUT_PATHS:
        for row in load_rows(path):
            output = normalize_cv_dict(row.get("output", {}))
            normalized.append({"input": row["input"], "output": output})

    with OUTPUT_PATH.open("w", encoding="utf-8") as handle:
        for row in normalized:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")

    print(f"Wrote {len(normalized)} normalized examples to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
