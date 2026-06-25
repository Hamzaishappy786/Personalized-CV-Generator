from app.schemas.cv_schema import CVData


def export_document(cv_data: CVData, format_name: str) -> dict:
    return {"format": format_name, "status": "queued"}

