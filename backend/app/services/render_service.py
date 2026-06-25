from app.schemas.cv_schema import CVData
from app.services.template_service import get_template


def render_preview(cv_data: CVData, template_id: str) -> dict:
    template = get_template(template_id)
    return {
        "template": template,
        "cv": cv_data.model_dump(),
    }
