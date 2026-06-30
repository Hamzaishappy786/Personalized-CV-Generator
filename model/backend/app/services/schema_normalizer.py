from __future__ import annotations

from collections.abc import Mapping
import re


def _as_list(value):
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]


def _clean_text(value):
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def _split_text_list(value):
    if value is None:
        return []
    if isinstance(value, list):
        return [item for item in (_clean_text(v) for v in value) if item]
    if isinstance(value, str):
        parts = re.split(r",|;|\n|/|\band\b", value, flags=re.IGNORECASE)
        return [item for item in (_clean_text(v) for v in parts) if item]
    return [_clean_text(value)] if _clean_text(value) else []


def normalize_cv_dict(payload) -> dict:
    if not isinstance(payload, Mapping):
        return {}

    data = {
        "name": _clean_text(payload.get("name")),
        "headline": _clean_text(payload.get("headline")),
        "summary": _clean_text(payload.get("summary")),
        "contact": None,
        "education": [],
        "experience": [],
        "projects": [],
        "skills": [],
        "certifications": [],
        "awards": [],
        "languages": [],
    }

    contact = payload.get("contact")
    if isinstance(contact, Mapping):
        contact_payload = {
            key: _clean_text(contact.get(key))
            for key in ("email", "phone", "location", "linkedin", "portfolio")
        }
        contact_payload = {k: v for k, v in contact_payload.items() if v}
        if contact_payload:
            data["contact"] = contact_payload

    education_items = payload.get("education") or []
    if isinstance(education_items, Mapping):
        education_items = [education_items]
    for item in education_items:
        if isinstance(item, Mapping):
            data["education"].append(
                {
                    "degree": _clean_text(item.get("degree") or item.get("title")) or "",
                    "institution": _clean_text(item.get("institution")),
                    "year": _clean_text(item.get("year")),
                }
            )

    if not data["education"]:
        top_degree = _clean_text(payload.get("degree"))
        top_institution = _clean_text(payload.get("institution"))
        top_year = _clean_text(payload.get("year"))
        if top_degree or top_institution or top_year:
            data["education"].append(
                {
                    "degree": top_degree or "",
                    "institution": top_institution,
                    "year": top_year,
                }
            )

    experience_items = payload.get("experience") or payload.get("work_experience") or []
    if isinstance(experience_items, Mapping):
        experience_items = [experience_items]
    for item in experience_items:
        if isinstance(item, Mapping):
            title = _clean_text(item.get("title") or item.get("position")) or ""
            company = _clean_text(item.get("company") or item.get("organization")) or ""
            skills_used = item.get("skills_used") or item.get("skills") or []
            bullets = item.get("bullets") or []
            data["experience"].append(
                {
                    "title": title,
                    "company": company,
                    "duration": _clean_text(item.get("duration")),
                    "location": _clean_text(item.get("location")),
                    "bullets": _as_list(bullets),
                    "skills_used": _as_list(skills_used),
                }
            )

    if not data["experience"]:
        work_items = payload.get("work_experience") or []
        if isinstance(work_items, Mapping):
            work_items = [work_items]
        for item in work_items:
            if isinstance(item, Mapping):
                data["experience"].append(
                    {
                        "title": _clean_text(item.get("position") or item.get("title")) or "",
                        "company": _clean_text(item.get("company") or item.get("organization")) or "",
                        "duration": _clean_text(item.get("duration")),
                        "location": _clean_text(item.get("location")),
                        "bullets": _split_text_list(item.get("bullets")),
                        "skills_used": _split_text_list(item.get("skills_used") or item.get("skills")),
                    }
                )

    project_items = payload.get("projects") or []
    if isinstance(project_items, Mapping):
        project_items = [project_items]
    for item in project_items:
        if isinstance(item, Mapping):
            data["projects"].append(
                {
                    "name": _clean_text(item.get("name") or item.get("title")) or "",
                    "description": _clean_text(item.get("description")),
                    "tech": _split_text_list(item.get("tech") or item.get("technologies")),
                    "link": _clean_text(item.get("link")),
                }
            )

    skills = payload.get("skills") or payload.get("technical_skills") or []
    data["skills"] = [skill for skill in _split_text_list(skills) if skill]

    certifications = payload.get("certifications") or payload.get("certs") or []
    data["certifications"] = [item for item in _split_text_list(certifications) if item]

    awards = payload.get("awards") or []
    data["awards"] = [item for item in _split_text_list(awards) if item]

    languages = payload.get("languages") or []
    data["languages"] = [item for item in _split_text_list(languages) if item]

    if not data["skills"] and payload.get("interests"):
        data["skills"] = [item for item in _split_text_list(payload.get("interests")) if item]

    if not data["name"] and payload.get("name"):
        data["name"] = _clean_text(payload.get("name"))

    return {key: value for key, value in data.items() if value not in (None, [], "")}
