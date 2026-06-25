from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def list_templates():
    return {
        "templates": [
            {
                "id": "ats-clean",
                "name": "ATS Clean",
                "category": "ats",
                "description": "Simple, readable, recruiter-friendly layout.",
            },
            {
                "id": "modern-professional",
                "name": "Modern Professional",
                "category": "modern",
                "description": "Balanced layout with subtle visual styling.",
            },
            {
                "id": "creative-simple",
                "name": "Creative Simple",
                "category": "creative",
                "description": "Light personality without hurting readability.",
            },
        ]
    }


@router.get("/{template_id}")
def get_template(template_id: str):
    return {"template_id": template_id, "status": "ok"}
