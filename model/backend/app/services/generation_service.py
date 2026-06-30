import re

from backend.app.schemas.cv_schema import CVData


def _extract_name(raw_text: str) -> str | None:
    match = re.search(r"\b(?:i'?m|im|my name is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)", raw_text, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return None


def _split_skills(raw_text: str) -> list[str]:
    candidates = re.split(r",|/| and ", raw_text.lower())
    cleaned = []
    for item in candidates:
        token = item.strip()
        if token and len(token) > 2:
            cleaned.append(token.title())
    return cleaned[:8]


def generate_cv_data(raw_text: str) -> CVData:
    return CVData(
        name=_extract_name(raw_text),
        summary=raw_text.strip(),
        skills=_split_skills(raw_text),
    )
