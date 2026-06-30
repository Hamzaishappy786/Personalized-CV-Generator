from fastapi import APIRouter
from backend.app.services.template_service import list_templates as list_template_defs
from backend.app.services.template_service import get_template as get_template_def

router = APIRouter()


@router.get("/")
def list_templates():
    return {"templates": list_template_defs()}


@router.get("/{template_id}")
def get_template(template_id: str):
    return {"template": get_template_def(template_id)}
