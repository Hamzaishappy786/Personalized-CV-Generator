"""
Run local inference with the fine-tuned CV adapter when available.
Falls back to a simple heuristic output if the adapter is missing.
"""

import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend.app.services.model_service import infer_cv_data


def main():
    sample_text = os.getenv("CV_SAMPLE_TEXT", "im a software engineer with 3 years of react and python experience")
    data = infer_cv_data(sample_text)
    print(json.dumps(data.model_dump(), indent=2))


if __name__ == "__main__":
    main()
