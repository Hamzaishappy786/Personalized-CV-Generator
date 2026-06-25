from fastapi import APIRouter
from app.schemas.request_schema import ParseRequest, ExportRequest
from app.services.generation_service import generate_cv_data
from app.services.render_service import render_preview
from app.services.export_service import export_document

router = APIRouter()


@router.post("/parse")
def parse_cv(payload: ParseRequest):
    cv_data = generate_cv_data(payload.text)
    return {"cv": cv_data.model_dump(), "template_id": payload.template_id}


@router.post("/preview")
def preview_cv(payload: ParseRequest):
    cv_data = generate_cv_data(payload.text)
    template_id = payload.template_id or "ats-clean"
    return render_preview(cv_data, template_id)


@router.post("/export")
def export_cv(payload: ExportRequest):
    return export_document(generate_cv_data(payload.cv_id or ""), payload.format)
