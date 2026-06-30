from copy import deepcopy

TEMPLATES = {
    "ats-clean": {
        "id": "ats-clean",
        "name": "ATS Clean",
        "category": "ats",
        "section_order": ["summary", "experience", "projects", "education", "skills", "certifications"],
        "theme": {
            "font_family": "Helvetica",
            "accent_color": "#111111",
            "text_color": "#111111",
            "background_color": "#FFFFFF",
        },
    },
    "modern-professional": {
        "id": "modern-professional",
        "name": "Modern Professional",
        "category": "modern",
        "section_order": ["summary", "experience", "skills", "projects", "education", "certifications"],
        "theme": {
            "font_family": "Helvetica",
            "accent_color": "#1F4B99",
            "text_color": "#1A1A1A",
            "background_color": "#FFFFFF",
        },
    },
    "creative-simple": {
        "id": "creative-simple",
        "name": "Creative Simple",
        "category": "creative",
        "section_order": ["summary", "projects", "experience", "education", "skills", "certifications"],
        "theme": {
            "font_family": "Helvetica",
            "accent_color": "#5B4B8A",
            "text_color": "#1A1A1A",
            "background_color": "#FFFFFF",
        },
    },
}


def list_templates():
    return [deepcopy(template) for template in TEMPLATES.values()]


def get_template(template_id: str):
    return deepcopy(TEMPLATES.get(template_id, TEMPLATES["ats-clean"]))
