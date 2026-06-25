from app.schemas.cv_schema import CVData


def render_preview(cv_data: CVData, template_id: str) -> dict:
    return {"template_id": template_id, "cv": cv_data.model_dump()}

