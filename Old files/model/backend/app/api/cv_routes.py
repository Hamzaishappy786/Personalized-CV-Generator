from fastapi import APIRouter
from backend.app.schemas.request_schema import ParseRequest, ExportRequest
from backend.app.services.model_service import infer_cv_data
from backend.app.services.render_service import render_preview
from backend.app.services.export_service import export_document

router = APIRouter()


@router.post("/parse")
def parse_cv(payload: ParseRequest):
    cv_data = infer_cv_data(payload.text)
    return {"cv": cv_data.model_dump(), "template_id": payload.template_id}


@router.post("/preview")
def preview_cv(payload: ParseRequest):
    cv_data = infer_cv_data(payload.text)
    template_id = payload.template_id or "ats-clean"
    return render_preview(cv_data, template_id)


@router.post("/export")
def export_cv(payload: ExportRequest):
    template_id = payload.template_id or "ats-clean"
    return export_document(payload.text, template_id, payload.format)
