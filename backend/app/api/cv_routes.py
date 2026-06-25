from fastapi import APIRouter

router = APIRouter()


@router.post("/parse")
def parse_cv():
    return {"message": "cv parsing endpoint"}


@router.post("/preview")
def preview_cv():
    return {"message": "cv preview endpoint"}


@router.post("/export")
def export_cv():
    return {"message": "cv export endpoint"}

