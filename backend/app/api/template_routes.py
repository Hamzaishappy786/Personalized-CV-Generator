from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def list_templates():
    return {"message": "template list endpoint"}


@router.get("/{template_id}")
def get_template(template_id: str):
    return {"template_id": template_id}

